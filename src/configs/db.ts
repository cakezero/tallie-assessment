import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { SERVER_ENV } from "@/utils/env.utils";

const adapter = new PrismaPg({ connectionString: SERVER_ENV.DB_URI });

export const prisma = new PrismaClient({ adapter });
