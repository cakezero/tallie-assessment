import { Router } from "express";
import v1AppRoutes from "./app.routes";

const router = Router();

router
  .use("/v1", v1AppRoutes)

export default router;