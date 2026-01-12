import { prisma } from "@/configs/db";
import logger from "@/configs/logger";
import { INTERNAL_SERVER_ERROR, OK, CREATED, NOT_FOUND, BAD_REQUEST } from "@/utils/status.utils";
import { validateTableRequestData } from "@/utils/utils";

export const getTables = async (req: GlobalRequest, res: GlobalResponse) => {
  try {
    const { restaurantId } = req.query as { restaurantId: string };
    if (!restaurantId) {
      res.status(BAD_REQUEST).json({ error: "send restaurant id" });
      return;
    }

    const tables = await prisma.table.findMany({
      where: { restaurantId: Number(restaurantId) }
    });

    if (tables.length === 0) {
      res.status(NOT_FOUND).json({ error: "no tables found for desired restaurant" });
      return;
    }

    res.status(OK).json({ message: "tables fetched", tables });
  } catch (error) {
    logger.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Error fetching tables" });
  }
}

export const getTable = async (req: GlobalRequest, res: GlobalResponse) => {
  try {
    const { restaurantId } = req.query as { restaurantId: string };
    const id = req.params.id as string;

    if (!id || !restaurantId) {
      res.status(BAD_REQUEST).json({ error: "send table id and restaurant id" });
      return;
    }

    const foundTable = await prisma.table.findUnique({
      where: { id: Number(id), restaurantId: Number(restaurantId) }
    });
 
    if (!foundTable) {
      res.status(NOT_FOUND).json({ error: "table not found for restaurant or id associated with table or restaurant is invalid" });
      return;
    }

    res.status(OK).json({ message: "table found", table: foundTable });
  } catch (error) {
    logger.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Error fetching table info" });
  }
}

export const createTable = async (req: GlobalRequest, res: GlobalResponse) => {
  try {
    const { success } = validateTableRequestData(req.body);
    if (!success) {
      res.status(BAD_REQUEST).json({ error: "send the required information" });
      return;
    }

    const restaurantId = req.body.restaurantId;

    delete req.body.restaurantId;

    await prisma.table.create({
      data: {
        ...req.body,
        restaurant: { connect: { id: restaurantId } }
      }
    });

    res.status(CREATED).json({ message: "table added" });
  } catch (error) {
    logger.error(error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Error creating tables" });
  }
}
