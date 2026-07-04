import prisma from '../../config/prisma.js';

/**
 * Fetch a clinical context by its associated consultation ID.
 * Includes patient details for ownership verification.
 * @param {string} consultationId 
 * @returns {Promise<object|null>}
 */
export const findUniqueByConsultationId = async (consultationId) => {
  return await prisma.clinicalContext.findUnique({
    where: { consultationId },
    include: {
      consultation: {
        include: {
          patient: {
            select: {
              id: true,
              userId: true,
            },
          },
        },
      },
    },
  });
};

/**
 * Fetch all clinical contexts associated with a specific patient's User ID.
 * @param {string} userId 
 * @returns {Promise<Array>}
 */
export const findAllByPatientUserId = async (userId) => {
  return await prisma.clinicalContext.findMany({
    where: {
      consultation: {
        patient: {
          userId,
        },
      },
    },
    include: {
      consultation: {
        select: {
          id: true,
          status: true,
          startedAt: true,
          endedAt: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};
