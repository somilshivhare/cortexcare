import dotenv from "dotenv";
import app from "./app.js";
import prisma from "./config/prisma.js";
import redisConnection from "./config/redis.js";

dotenv.config();

const port = process.env.PORT || 5000;

// Start server
const server = app.listen(port, () => {
  console.log(`Cortexcare api has started running on http://localhost:${port}`);
});

/**
 * Handle server graceful shutdown.
 */
const handleShutdown = async (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);

  // 1. Stop accepting new HTTP requests
  server.close(async () => {
    console.log('Express HTTP server closed.');

    try {
      // 2. Disconnect Prisma client
      await prisma.$disconnect();
      console.log('Prisma database client disconnected.');

      // 3. Disconnect Redis connection client
      await redisConnection.quit();
      console.log('Redis client connection closed.');

      console.log('Graceful shutdown completed successfully.');
      process.exit(0);
    } catch (err) {
      console.error('Error cleaning up connections during shutdown:', err);
      process.exit(1);
    }
  });

  // Force close after 10 seconds if connections are hanging
  setTimeout(() => {
    console.error('Forced shutdown: Clean cleanup timed out.');
    process.exit(1);
  }, 10000);
};

// Listen for process signals
process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));