import type { Request, Response } from "express";
import nodemailer from "nodemailer";

declare global {
  type GlobalRequest = Request;

  type GlobalResponse = Response;

  interface reservationRequestBody {
    email: string;
    customerName;
    size: number;
    restaurant_id: number;
    tableNo: string;
    date: string;
    time: string;
    duration: number;
  }

  interface MailOptions extends nodemailer.SendMailOptions {
    template?: string;
    context?: {
      [key: string]: any;
    };
  }
}