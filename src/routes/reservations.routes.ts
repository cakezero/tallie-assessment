import { addWaitlist, cancelReservation, editReservation, makeReservation } from "@/controllers/app.controller";
import { Router } from "express";

const router = Router();

router
  .post("/waitlist", addWaitlist)
  .post("/create", makeReservation)
  .put("/:id", editReservation)
  .patch("/:id", cancelReservation);

export default router;