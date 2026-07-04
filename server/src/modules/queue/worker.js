import { Worker } from 'bullmq';
import { redisConfig } from '../../config/redis.js';
import prisma from '../../config/prisma.js';
import * as aiService from '../ai/ai.service.js';
import * as consultationRepository from '../consultation/consultation.repository.js';

console.log('Background Worker is starting up...');

// Create a worker that processes jobs from the 'consultation-processing' queue
const worker = new Worker(
  'consultation-processing',
  async (job) => {
    const { consultationId } = job.data;
    console.log(`Processing consultation job: ${job.id} for ID: ${consultationId}`);

    try {
      // 1. Fetch consultation with ordered chunks
      const consultation = await consultationRepository.findById(consultationId);
      if (!consultation) {
        throw new Error(`Consultation ${consultationId} not found in database.`);
      }

      // If there are no chunks, we can write a placeholder or throw. Let's make a safe fallback.
      const chunks = consultation.chunks || [];
      if (chunks.length === 0) {
        console.warn(`No conversation chunks found for consultation: ${consultationId}`);
        // Create an empty clinical context
        await prisma.clinicalContext.create({
          data: {
            consultationId,
            summary: 'No conversation transcript available.',
            symptoms: [],
            riskFlags: [],
            recommendations: [],
            mood: [],
            confidenceScore: 0.0,
          },
        });
        
        await consultationRepository.updateStatus(consultationId, { status: 'COMPLETED' });
        return;
      }

      // 2. Compile chunks into a readable transcript
      const transcript = aiService.compileTranscript(chunks);

      // 3. Generate structured clinical output using Gemini
      console.log(`Sending transcript for consultation ${consultationId} to Gemini...`);
      const aiResult = await aiService.generateClinicalContext(transcript);
      console.log(`Received clinical summary from Gemini for ${consultationId}.`);

      // 4. Save the generated AI output into the ClinicalContext table
      await prisma.clinicalContext.create({
        data: {
          consultationId,
          summary: aiResult.summary,
          symptoms: aiResult.symptoms,
          riskFlags: aiResult.riskFlags,
          recommendations: aiResult.recommendations,
          mood: aiResult.mood,
          confidenceScore: aiResult.confidenceScore,
        },
      });

      // 5. Transition consultation status to COMPLETED
      await consultationRepository.updateStatus(consultationId, {
        status: 'COMPLETED',
      });

      console.log(`Consultation ${consultationId} successfully completed and saved.`);
    } catch (err) {
      console.error(`Error processing consultation job ${job.id}:`, err.message);

      // Set the session status to FAILED so the UI can notify the user
      try {
        await consultationRepository.updateStatus(consultationId, {
          status: 'FAILED',
        });
      } catch (dbErr) {
        console.error('Failed to set consultation status to FAILED:', dbErr.message);
      }

      // Re-throw so BullMQ registers the job failure and initiates retries
      throw err;
    }
  },
  {
    connection: redisConfig,
    concurrency: 2, // Process up to 2 jobs concurrently per worker process
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully.`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error:`, err.message);
});

/**
 * Handle worker graceful shutdown.
 */
const handleWorkerShutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down worker process...`);
  try {
    // 1. Close BullMQ worker (completes active jobs, stops pulling new ones)
    await worker.close();
    console.log('BullMQ worker connection closed.');

    // 2. Disconnect database client
    await prisma.$disconnect();
    console.log('Prisma database client disconnected.');

    process.exit(0);
  } catch (err) {
    console.error('Error during worker shutdown cleanup:', err.message);
    process.exit(1);
  }
};

process.on('SIGINT', () => handleWorkerShutdown('SIGINT'));
process.on('SIGTERM', () => handleWorkerShutdown('SIGTERM'));
