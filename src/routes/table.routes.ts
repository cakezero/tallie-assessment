import { createTable, getTable } from "@/controllers/tables.controller";
import { Router } from "express";

const router = Router();
 
router
  .get("/:id", getTable)
  .post("/create", createTable);

export default router;