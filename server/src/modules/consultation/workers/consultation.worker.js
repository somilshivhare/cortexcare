import { Worker } from 'bullmq';
import { redisConfig } from '../../../config/redis.js';
import * as consultationService from '../services/consultation.service.js';

let worker = null;

/**
 * Start the BullMQ worker.
 */
export const startWorker = () => {
  if (worker) return worker;

  console.log('[Worker] Starting AI Clinical Intake BullMQ worker...');
  worker = new Worker(
    'consultation-processing',
    async (job) => {
      console.log(`[Worker] Processing job ${job.id} for consultation ${job.data.consultationId}`);
      try {
        await consultationService.processJob(job.data);
      } catch (err) {
        console.error(`[Worker] Job ${job.id} processing failed:`, err.message);
        throw err; // Rethrow to register failure in BullMQ
      }
    },
    { connection: redisConfig, concurrency: 2 }
  );

  worker.on('completed', (job) => console.log(`[Worker] Job ${job.id} completed.`));
  worker.on('failed', (job, err) => console.error(`[Worker] Job ${job?.id} failed:`, err.message));

  return worker;
};

/**
 * Stop the BullMQ worker gracefully.
 */
export const stopWorker = async () => {
  if (!worker) return;
  console.log('[Worker] Closing active worker connection...');
  try {
    await worker.close();
    console.log('[Worker] Worker connection closed successfully.');
  } catch (err) {
    console.error('[Worker] Error closing worker:', err.message);
  } finally {
    worker = null;
  }
};
