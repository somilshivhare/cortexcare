import prisma from '../../config/prisma.js';

/**
 * Create a new consultation in the database.
 * @param {string} patientId 
 * @returns {Promise<object>}
 */
export const create = async (patientId) => {
  return await prisma.consultation.create({
    data: {
      patientId,
      status: 'SETUP',
    },
  });
};

/**
 * Find a consultation by ID, including its ordered conversation chunks.
 * @param {string} id 
 * @returns {Promise<object|null>}
 */
export const findById = async (id) => {
  return await prisma.consultation.findUnique({
    where: { id },
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      doctor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          specialty: true,
        },
      },
      chunks: {
        orderBy: {
          sequence: 'asc',
        },
      },
    },
  });
};

/**
 * Find all consultations for a specific patient.
 * @param {string} patientId 
 * @returns {Promise<Array>}
 */
export const findByPatientId = async (patientId) => {
  return await prisma.consultation.findMany({
    where: { patientId },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Update consultation status and timeline timestamps.
 * @param {string} id 
 * @param {object} params
 * @param {string} params.status 
 * @param {Date} [params.startedAt]
 * @param {Date} [params.endedAt]
 * @returns {Promise<object>}
 */
export const updateStatus = async (id, { status, startedAt, endedAt }) => {
  return await prisma.consultation.update({
    where: { id },
    data: {
      status,
      ...(startedAt !== undefined && { startedAt }),
      ...(endedAt !== undefined && { endedAt }),
    },
  });
};

/**
 * Get the next sequence index for a conversation chunk.
 * @param {string} consultationId 
 * @returns {Promise<number>}
 */
export const getNextSequence = async (consultationId) => {
  const aggregate = await prisma.conversationChunk.aggregate({
    where: { consultationId },
    _max: {
      sequence: true,
    },
  });
  
  return (aggregate._max.sequence || 0) + 1;
};

/**
 * Insert an immutable conversation chunk.
 * @param {object} params
 * @param {string} params.consultationId
 * @param {string} params.speaker
 * @param {string} params.text
 * @param {number} params.sequence
 * @returns {Promise<object>}
 */
export const createChunk = async ({ consultationId, speaker, text, sequence }) => {
  return await prisma.conversationChunk.create({
    data: {
      consultationId,
      speaker,
      text,
      sequence,
    },
  });
};
