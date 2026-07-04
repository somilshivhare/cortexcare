import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of PrismaClient in development.
// In development, hot-reloading can cause multiple instances of the Prisma Client
// to be created, exhausting the database connection pool.
const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
