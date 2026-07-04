import prisma from '../../config/prisma.js';
import redisConnection from '../../config/redis.js';

/**
 * Handle GET /health
 * Exposes system health checking parameters.
 */
export const checkHealth = async (req, res) => {
  let databaseStatus = 'disconnected';
  let redisStatus = 'disconnected';
  let isHealthy = true;

  // 1. Verify PostgreSQL Database Connection via Prisma
  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseStatus = 'connected';
  } catch (err) {
    console.error('Health Check - Database error:', err.message);
    isHealthy = false;
  }

  // 2. Verify Redis Client Connection
  try {
    if (redisConnection.status === 'ready') {
      redisStatus = 'connected';
    } else {
      isHealthy = false;
    }
  } catch (err) {
    console.error('Health Check - Redis error:', err.message);
    isHealthy = false;
  }

  // 3. Assemble response payload
  const healthResponse = {
    status: isHealthy ? 'ok' : 'error',
    services: {
      database: databaseStatus,
      redis: redisStatus,
    },
    uptime: Math.round(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  };

  // 4. Return appropriate status code
  if (isHealthy) {
    return res.status(200).json(healthResponse);
  } else {
    return res.status(503).json(healthResponse);
  }
};
