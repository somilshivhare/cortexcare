import 'dotenv/config';
import Redis from 'ioredis';


let redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let redisConfig;
try {
  const parsed = new URL(redisUrl);
  redisConfig = {
    host: parsed.hostname,
    port: parsed.port ? parseInt(parsed.port, 10) : 6379,
    username: parsed.username || undefined,
    password: parsed.password || undefined,
    maxRetriesPerRequest: null, // Required by BullMQ
  };

  if (parsed.protocol === 'rediss:') {
    redisConfig.tls = { rejectUnauthorized: false };
  }
} catch (err) {
  console.warn('Failed to parse REDIS_URL, falling back to localhost Redis:', err.message);
  redisUrl = 'redis://127.0.0.1:6379';
  redisConfig = {
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null,
  };
}

// Instantiate the Redis client
const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null, 
});

redisConnection.on('connect', () => {
  console.log('Successfully connected to Redis.');
});

redisConnection.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export { redisConfig, redisConnection as default };
