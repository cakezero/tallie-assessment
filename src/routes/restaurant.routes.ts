import { getAvailableTimeSlots } from "@/controllers/app.controller";
import { createRestaurant, getRestaurant } from "@/controllers/restaurants.controller";
import { Router } from "express";

const router = Router();

router
  .get("/:id", getRestaurant)
  .post("/create", createRestaurant)
  .get("/time-slot", getAvailableTimeSlots);

export default router;