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
              firstName: true,
              lastName: true,
              phoneNumber: true,
              address: true,
              consultations: {
                select: {
                  id: true,
                  status: true,
                  reviewStatus: true,
                  createdAt: true,
                },
                orderBy: {
                  createdAt: 'desc',
                },
              },
            },
          },
          attachments: {
            orderBy: {
              uploadedAt: 'asc',
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

/**
 * Save a newly synthesized clinical context document.
 * @param {object} data - The clinical context payload
 * @returns {Promise<object>}
 */
export const create = async (data) => {
  return await prisma.clinicalContext.create({
    data,
  });
};

/**
 * Retrieve past clinical history summaries for a specific patient, excluding the current session.
 * @param {string} patientId 
 * @param {string} excludeConsultationId 
 * @returns {Promise<Array>}
 */
export const findPastHistory = async (patientId, excludeConsultationId) => {
  return await prisma.clinicalContext.findMany({
    where: {
      consultation: {
        patientId,
        id: { not: excludeConsultationId },
        status: 'COMPLETED',
      },
    },
    select: {
      chiefComplaint: true,
      presentIllness: true,
      doctorSummary: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};
