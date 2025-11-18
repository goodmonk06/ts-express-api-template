import { PrismaClient } from '@prisma/client';
import { logger } from './logger.config';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

prisma.$connect().catch((error: unknown) => {
  logger.error(`Failed to connect to database: ${error}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
