import { Router } from "express";
import restaurantRoutes from "./restaurant.routes";
import reservationRoutes from "./reservations.routes";
import tableRoutes from "./table.routes";
import { getRestaurants } from "@/controllers/restaurants.controller";
import { getTables } from "@/controllers/tables.controller";
import { getReservations } from "@/controllers/app.controller";

const router = Router();

router
  .use("/restaurant", restaurantRoutes)
  .use("/reservation", reservationRoutes)
  .use("/table", tableRoutes)

  .get("/restaurants", getRestaurants)
  .get("/reservations", getReservations)
  .get("/tables", getTables);

export default router;