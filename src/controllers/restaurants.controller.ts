import { prisma } from "@/configs/db";
import logger from "@/configs/logger";
import { restaurant } from "@/models/restaurant.models";
import { INTERNAL_SERVER_ERROR, OK, CREATED, NOT_FOUND, BAD_REQUEST } from "@/utils/status.utils";
import { validateRestaurantRequestData } from "@/utils/utils";

export const getRestaurants = async (req: GlobalRequest, res: GlobalResponse) => {
  try {
    // add filter - by time open
    const restaurants = await prisma.restaurant.findMany();
    if (restaurants.length === 0) {
      res.status(NOT_FOUND).json({ error: "no restaurants found" });
      return;
    }

    // add redis TTL caching

    res.status(OK).json({ message: "restaurants fetched!", restaurants });
  } catch (error) {
    logger.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Error fetching restaurants" });
  }
}

export const getRestaurant = async (req: GlobalRequest, res: GlobalResponse) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      res.status(BAD_REQUEST).json({ error: "send restaurant id" });
      return;
    }

    const foundRestaurant = await prisma.restaurant.findUnique({
      where: { id: Number(id) },
      include: {
        tables: true
      }
    });

    if (!foundRestaurant) {
      res.status(NOT_FOUND).json({ error: "restaurant not found or id associated with restaurant is invalid" });
      return;
    }

    // add redis TTL caching

    res.status(OK).json({ message: "restaurant found!", restaurant: foundRestaurant });
  } catch (error) {
    logger.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Error fetching restaurant info" });
  }
}

export const createRestaurant = async (req: GlobalRequest, res: GlobalResponse) => {
  try {
    const { success } = validateRestaurantRequestData(req.body);
    if (!success) {
      res.status(BAD_REQUEST).json({ error: "send the informations required to create a restaurant" });
      return;
    }

    await prisma.restaurant.create({
      data: { ...req.body }
    });

    res.status(CREATED).json({ message: "restaurant created!" });
  } catch (error) {
    logger.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Error creating restaurants" });
  }
}
