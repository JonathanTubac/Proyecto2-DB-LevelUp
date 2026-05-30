import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Mismo fallback que db.js: si DATABASE_URL está vacío usa las variables individuales
const databaseUrl = process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
});

export default prisma;
