import prisma from '../../config/prisma.js';

/**
 * Find a patient profile by the owner's User ID.
 * Includes the parent User account data (excluding credentials).
 * @param {string} userId 
 * @returns {Promise<object|null>}
 */
export const findPatientByUserId = async (userId) => {
  return await prisma.patient.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
      clinic: true,
    },
  });
};

/**
 * Update patient profile fields by the owner's User ID.
 * @param {string} userId 
 * @param {object} updateData 
 * @returns {Promise<object>}
 */
export const updatePatientByUserId = async (userId, { firstName, lastName, phoneNumber, address }) => {
  return await prisma.patient.update({
    where: { userId },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phoneNumber !== undefined && { phoneNumber }),
      ...(address !== undefined && { address }),
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

/**
 * Stub repository method for joining a clinic.
 * @param {string} userId 
 * @param {string} clinicId 
 * @returns {Promise<object>}
 */
export const joinClinicStub = async (userId, clinicId) => {
  // Returns a stub response simulating a successful association update
  return {
    userId,
    clinicId,
    joinedAt: new Date(),
    status: 'PENDING_APPROVAL',
  };
};
