import { transporter } from ".";
import logger from "@/configs/logger";
import { SERVER_ENV } from "../utils/env.utils";

export const sendReservationEmail = async ({
  email,
  restaurantName,
  tableNo,
  customerName
}: {
  email: string;
  tableNo: string;
  restaurantName: string;
  customerName: string;
}) => {
  try {
    await transporter.sendMail({
      from: SERVER_ENV.EMAIL_USER,
      to: email,
      subject: "Reservation Created 🎉",
      template: "reservation",
      context: {
        restaurantName,
        tableNo,
        customerName
      },
    } as MailOptions);
  } catch (error) {
    logger.error(error);
    throw new Error("Error sending reservation mail");
  }
};
