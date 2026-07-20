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
 * Find a consultation by ID, including its ordered messages and attachments.
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
          userId: true,
          clinicId: true,
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
      messages: {
        orderBy: {
          sequence: 'asc',
        },
      },
      attachments: {
        orderBy: {
          uploadedAt: 'asc',
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
 * Update consultation status and timestamps.
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
 * Get the next sequence index for a message.
 * @param {string} consultationId 
 * @returns {Promise<number>}
 */
export const getNextSequence = async (consultationId) => {
  const aggregate = await prisma.message.aggregate({
    where: { consultationId },
    _max: {
      sequence: true,
    },
  });
  
  return (aggregate._max.sequence || 0) + 1;
};

/**
 * Insert a message.
 * @param {object} params
 * @param {string} params.consultationId
 * @param {string} params.speaker
 * @param {string} params.text
 * @param {number} params.sequence
 * @returns {Promise<object>}
 */
export const createMessage = async ({ consultationId, speaker, text, sequence }) => {
  return await prisma.message.create({
    data: {
      consultationId,
      speaker,
      text,
      sequence,
    },
  });
};

/**
 * Insert an attachment record.
 * @param {object} params
 * @returns {Promise<object>}
 */
export const createAttachment = async ({ consultationId, fileName, fileType, cloudinaryUrl, publicId, extractedText }) => {
  return await prisma.attachment.create({
    data: {
      consultationId,
      fileName,
      fileType,
      cloudinaryUrl,
      publicId,
      extractedText: extractedText || null,
    },
  });
};
