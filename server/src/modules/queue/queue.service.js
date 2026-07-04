import { Queue } from 'bullmq';
import { redisConfig } from '../../config/redis.js';

// Instantiate the BullMQ Queue connected to Redis
const consultationQueue = new Queue('consultation-processing', {
  connection: redisConfig,
});

/**
 * Add a consultation processing job to the background queue.
 * @param {string} consultationId 
 * @returns {Promise<object>} The added BullMQ Job instance
 */
export const addConsultationJob = async (consultationId) => {
  return await consultationQueue.add(
    'process-consultation',
    { consultationId },
    {
      attempts: 3, // Retry up to 3 times on failure
      backoff: {
        type: 'exponential',
        delay: 5000, // Wait 5s, then 10s, then 20s before retrying
      },
      removeOnComplete: true, // Auto-clean completed jobs to save Redis memory
      removeOnFail: false,    // Keep failed jobs for inspection and debugging
    }
  );
};
