import { z } from "zod";

export const validateReservationRequestData = (reqData: any) => {
	const reserveSchema = z.object({
		time: z.string().trim(),
		date: z.string().trim(),
		duration: z.number(),
		tableNo: z.string().trim(),
		customerName: z.string().trim(),
		size: z.number(),
		email: z.email(),
		phoneNumber: z.string().trim(),
		restaurantId: z.number(),
	});

	const parseData = reserveSchema.safeParse(reqData);

	return parseData;
};

export const timeOverlaps = (reservationStarts: Date, reservationEnds: Date, startTime: Date, endTime: Date): boolean => {
	return reservationStarts < endTime && startTime < reservationEnds;
}

export const generateTimeSlots = (
	date: string,          // "2026-01-10"
	openTime: number,
	closeTime: number,
	intervalMinutes = 30 // allocation intervals: users can only reserve tables at a 30 mins mark
): Date[] => {
	const timeSlots: Date[] = [];

	const [year, month, day] = date.split("-").map(Number);

	let current = new Date(year!, month! - 1, day, openTime, 0, 0, 0);
	const end = new Date(year!, month! - 1, day, closeTime, 0, 0, 0); // when the restaurant closes

	while (current < end) {
		timeSlots.push(new Date(current));
		current = new Date(current.getTime() + intervalMinutes * 60000);
	}

	return timeSlots; // [10:00, 10:30, 11:00, 11:30, etc...]
} 

export const validateRestaurantRequestData = (reqData: any) => {
	const restaurantSchema = z.object({
		name: z.string().trim(),
		openingTime: z.string().trim(),
		closingTime: z.string().trim(),
		noOfTables: z.number(),
	});

	const parseData = restaurantSchema.safeParse(reqData);

	return parseData;
};

export const validateTableRequestData = (reqData: any) => {
	const tableSchema = z.object({
		tableNo: z.string().trim(),
		capacity: z.number(),
		restaurantId: z.number(),
	});

	const parseData = tableSchema.safeParse(reqData);

	return parseData;
};
