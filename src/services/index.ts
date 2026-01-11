import nodemailer from "nodemailer";
import hbs, {
  type NodemailerExpressHandlebarsOptions,
} from "nodemailer-express-handlebars";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import logger from "@/configs/logger";
import { SERVER_ENV } from "../utils/env.utils";

const __dirname = dirname(fileURLToPath(import.meta.url));

const templatesDir = path.resolve(__dirname, "../services/templates");

export const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: SERVER_ENV.EMAIL_USER,
    pass: SERVER_ENV.EMAIL_PASSWORD,
  },
});

const options: NodemailerExpressHandlebarsOptions = {
  viewEngine: {
    partialsDir: templatesDir,
    defaultLayout: false,
  },
  viewPath: templatesDir,
};

transporter.use("compile", hbs(options));