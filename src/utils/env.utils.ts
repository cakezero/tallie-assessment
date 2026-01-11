import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ quiet: true });

export const SERVER_ENV = z.object({
  ALLOWED_ORIGINS: z
    .string()
    .transform((value) => value.split(",").map((origin) => origin.trim()))
    .refine(
      (urls) =>
        urls.every((url) => {
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        }),
      { message: "One or more ALLOWED_ORIGINS are invalid URLs" },
    ),
  DB_URI: z.string(),
  EMAIL_HOST: z.string().optional(), // used for domain emails
  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string(),
  EMAIL_PORT: z.string().optional(), // also for domain emails
  ENVIRONMENT: z.enum(["development", "production"]),
  PORT: z.coerce.number().int().positive(),
}).parse(process.env);

export const SERVER_CONSTANTS = "";