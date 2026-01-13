import logger from "@/configs/logger";
import { prisma } from "@/configs/db";
import { INTERNAL_SERVER_ERROR, OK, CREATED, NOT_FOUND, BAD_REQUEST } from "@/utils/status.utils";
import { validateReservationRequestData, timeOverlaps, generateTimeSlots } from "@/utils/utils";
import { sendReservationEmail } from "@/services/reserve";
import { SERVER_ENV } from "@/utils/env.utils";
import type { ReservationCreateInput } from "../../generated/prisma/models";

export const makeReservation = async (req: GlobalRequest, res: GlobalResponse) => {
  try {
    const { success } = validateReservationRequestData(req.body);
    if (!success) {
      res.status(BAD_REQUEST).json({ error: "send the required information" });
      return;
    }

    const { date, time, duration, tableNo, email, customerName, size, restaurantId }: reservationRequestBody = req.body;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });

    if (!restaurant) {
      res.status(NOT_FOUND).json({ error: "restaurant not found or restaurantId is invalid" });
      return;
    }

    const reservationStarts = new Date(`${date}T${time}`);
    const reservationEnds = new Date(reservationStarts.getTime() + duration * 60 * 60 * 1000); // this is the total duration the user is going to stay for. i.e 7pm + 2hrs = 9pm.

    const now = time.split(":")[0];

    const restaurantOpen = Number(now) < Number(restaurant.closingTime.split(" ")[0]);
    if (!restaurantOpen) {
      res.status(BAD_REQUEST).json({ error: "select a time when the restaurant is open" });
      return;
    }

    const peakTime = {
      start: new Date(`${date}T12:00:00`),
      end: new Date(`${date}T14:00:00`) // 24hr format used here
    };

    // limit reservations during peak times
    if (timeOverlaps(reservationStarts, reservationEnds, peakTime.start, peakTime.end)) {
      res.status(BAD_REQUEST).json({ error: "reservations cannot be booked during peak times (12pm - 2pm), kindly select another time" });
      return;
    }

    const tableExists = await prisma.table.findFirst({
      where: { tableNo, restaurantId }
    });

    if (!tableExists) {
      res.status(BAD_REQUEST).json({ error: "table no does not exist on the requested restaurant" });
      return
    }

    if (size > tableExists.capacity) {
      const tables = await prisma.table.findMany({
        where: { capacity: { lte: size } }
      });

      if (tables.length === 0) {
        res.status(BAD_REQUEST).json({ message: "capacity is too much for the table requested" });
        return
      };

      res.status(OK).json({ message: "capacity is too much for the table requested, check the recommended tables for your party size", tables });
      return
    }
    
    delete req.body.time;
    delete req.body.restaurantId;

    const newReservation: ReservationCreateInput = { ...req.body };

    newReservation.reservationStarts = reservationStarts;
    newReservation.reservationEnds = reservationEnds;

    const reservationExists = await prisma.reservation.findFirst({
      where: { tableNo, restaurantId }
    });

    if (!reservationExists) {
      await prisma.reservation.create({
        data: {
          ...newReservation,
          table: { connect: { id: tableExists.id } },
          restaurant: { connect: { id: restaurant.id } }
        }
      });

      await prisma.table.update({
        where: { id: tableExists.id, restaurantId: restaurant.id },
        data: {
          status: "reserved"
        }
      });

      res.status(CREATED).json({ message: "table reserved" });
      return;
    }

    if (timeOverlaps(reservationStarts, reservationEnds, reservationExists.reservationStarts, reservationExists.reservationEnds)) {
      res.status(BAD_REQUEST).json({ error: "time slot for requested table is occupied, kindly select another time" });
      return;
    }

    await prisma.reservation.create({
      data: {
        ...newReservation,
        table: { connect: { id: tableExists.id } },
        restaurant: { connect: { id: restaurant.id } }
      }
    });

    await prisma.table.update({
      where: { id: tableExists.id, restaurantId: restaurant.id },
      data: {
        status: "reserved"
      }
    });

    if (SERVER_ENV.ENVIRONMENT === "production") {
      await sendReservationEmail({ email, tableNo, restaurantName: restaurant.name, customerName });
    } else {
      logger.info(`✅ Email sent, Table ${tableNo} reserved, horray!`);
    }

    res.status(CREATED).json({ message: "table reserved" });
  } catch (error) {
    logger.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Error making reservations" });
  }
}

export const cancelReservation = async (req: GlobalRequest, res: GlobalResponse) => {
  try {
    const { customerName, restaurantId } = req.query as unknown as { restaurantId: number; tableNo: string; customerName: string };
    if (!customerName || !restaurantId) {
      res.status(BAD_REQUEST).json({ error: "send reserved customer name and restaurant id" });
      return;
    }

    const reservation = await prisma.reservation.findFirst({
      where: {
        customerName,
        restaurantId,
        status: "confirmed"
      }
    });

    if (!reservation) {
      res.status(NOT_FOUND).json({ error: `customer with name "${customerName}" does not have any confirmed reservations with the desired restaurant` });
      return;
    }

    await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        status: "cancelled"
      }
    });

    res.status(OK).json({ message: "reservation cancelled" });
  } catch (error) {
    logger.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Error cancelling reservation" });
  }
}

export const editReservation = async (req: GlobalRequest, res: GlobalResponse) => {
  try {

    const { reservationId }: { reservationId: number } = req.body;
    if (!reservationId) {
      res.status(BAD_REQUEST).json({ error: "send reservation id" });
      return;
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId, status: "confirmed" }
    });

    if (!reservation) {
      res.status(NOT_FOUND).json({ error: "no confirmed reservation found" });
      return;
    }

    await prisma.reservation.update({
      where: { id: reservationId },
      data: { ...req.body }
    });

    res.status(OK).json({ message: "reservation updated" });
  } catch (error) {
    logger.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Error fetching restaurants" });
  }
}

export const getReservations = async (req: GlobalRequest, res: GlobalResponse) => {
  try {
    const { date, restaurantId } = req.query as { date: string; restaurantId: string };

    if (!date || !restaurantId) {
      res.status(BAD_REQUEST).json({ error: "send date and restaurant id" });
      return;
    }

    const reservations = await prisma.reservation.findMany({
      where: { date, restaurantId: Number(restaurantId) }
    });

    if (reservations.length === 0) {
      res.status(NOT_FOUND).json({ error: "no reservations for restaurant on specific date" });
      return;
    }

    res.status(OK).json({ message: "reservations fetched", reservations });
  } catch (error) {
    logger.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "error fetching reservations for specific date" });
  }
}

export const getAvailableTimeSlots = async (req: GlobalRequest, res: GlobalResponse) => {
  try {
    const { size, date, restaurantId }: { size: number; date: string; restaurantId: number } = req.body;

    if (!size || !date || !restaurantId) {
      res.status(BAD_REQUEST).json({ error: "send the required values" });
      return;
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });

    if (!restaurant) {
      res.status(NOT_FOUND).json({ error: "no restaurant found" });
      return;
    }

    const availableTables = await prisma.table.findMany({
      where: {
        restaurantId,
        status: "available",
        capacity: { lte: size }
      }
    });

    if (availableTables.length === 0) {
      res.status(NOT_FOUND).json({ error: "no available tables" });
      return;
    }

    const availableTimeSlots = generateTimeSlots(date, Number(restaurant.openingTime), Number(restaurant.closingTime));

    if (availableTimeSlots.length === 0) {
      res.status(NOT_FOUND).json({ error: "no available time slots for desired restaurant" });
      return;
    }

    res.status(OK).json({ message: "available time slots fetched", timeSlots: availableTimeSlots });
  } catch (error) {
    logger.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "error getting available time slot for party size" })
  }
}

export const addWaitlist = async (req: GlobalRequest, res: GlobalResponse) => {
  try {
    const { success } = validateReservationRequestData(req.body);
    if (!success) {
      res.status(BAD_REQUEST).json({ error: "send the required information" });
      return;
    }

    const { date, time, duration, restaurantId }: reservationRequestBody = req.body;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });

    if (!restaurant) {
      res.status(NOT_FOUND).json({ error: "restaurant not found or restaurantId is invalid" });
      return;
    }

    const reservationStarts = new Date(`${date}T${time}`);
    const reservationEnds = new Date(reservationStarts.getTime() + duration * 60 * 60 * 1000); // this is the total duration the user is going to stay for. i.e 7pm + 2hrs = 9pm.

    const now = (reservationStarts).toLocaleTimeString().split(":")[0];

    const restaurantOpen = Number(now) < Number(restaurant.closingTime.split(" ")[0]);
    if (!restaurantOpen) {
      res.status(BAD_REQUEST).json({ error: "select a time when the restaurant is open" });
      return;
    }

    const availableTables = await prisma.table.findMany({
      where: { restaurantId, status: "available" }
    });

    if (availableTables.length !== 0) {
      res.status(BAD_REQUEST).json({ error: "table(s) are available to be reserved" });
      return;
    }

    await prisma.reservation.create({
      data: {
        ...req.body,
        reservationEnds,
        reservationStarts,
        restaurant: { connect: { id: restaurantId } },
        status: "pending"
      }
    });

    res.status(OK).json({ message: "added to the waitlist" });
  } catch (error) {
    logger.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Error adding user to waitlist" });
  }
}
