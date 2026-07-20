import prisma from '../../config/prisma.js';

/**
 * Find doctor profile by User ID.
 * @param {string} userId 
 */
export const findDoctorByUserId = async (userId) => {
  return await prisma.doctor.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
      clinic: true,
    },
  });
};

/**
 * Update doctor profile.
 */
export const updateDoctorByUserId = async (userId, { firstName, lastName, specialty, licenseNumber, bio }) => {
  return await prisma.doctor.update({
    where: { userId },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(specialty && { specialty }),
      ...(licenseNumber !== undefined && { licenseNumber }),
      ...(bio !== undefined && { bio }),
    },
  });
};

/**
 * Count unassigned consultations ready for review (status is PROCESSING or COMPLETED) within a clinic.
 */
export const countPendingUnassigned = async (clinicId) => {
  return await prisma.consultation.count({
    where: {
      doctorId: null,
      status: {
        in: ['PROCESSING', 'COMPLETED'],
      },
      patient: {
        clinicId,
      },
    },
  });
};

/**
 * Count active claimed consultations for a doctor (reviewStatus is not REVIEWED).
 */
export const countClaimedActive = async (doctorId) => {
  return await prisma.consultation.count({
    where: {
      doctorId,
      reviewStatus: {
        in: ['PENDING', 'IN_REVIEW'],
      },
    },
  });
};

/**
 * Find all unassigned consultations ready to be claimed within a clinic.
 */
export const findPending = async (clinicId) => {
  return await prisma.consultation.findMany({
    where: {
      doctorId: null,
      status: {
        in: ['PROCESSING', 'COMPLETED'],
      },
      patient: {
        clinicId,
      },
    },
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
};

/**
 * Find all consultations claimed by a doctor.
 */
export const findClaimed = async (doctorId) => {
  return await prisma.consultation.findMany({
    where: { doctorId },
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      doctorNote: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Claim a consultation (assigns doctorId and sets reviewStatus to IN_REVIEW).
 */
export const claim = async (id, doctorId) => {
  return await prisma.consultation.update({
    where: { id },
    data: {
      doctorId,
      reviewStatus: 'IN_REVIEW',
    },
  });
};

/**
 * Upsert doctor notes for a consultation (1-to-1 notes mapping).
 */
export const upsertNote = async (consultationId, doctorId, notes) => {
  return await prisma.doctorNote.upsert({
    where: { consultationId },
    update: { notes },
    create: {
      consultationId,
      doctorId,
      notes,
    },
  });
};

/**
 * Mark consultation as reviewed.
 */
export const markReviewed = async (id) => {
  return await prisma.consultation.update({
    where: { id },
    data: {
      reviewStatus: 'REVIEWED',
      reviewedAt: new Date(),
    },
  });
};

/**
 * Find all patients in a specific clinic, including their email and consultation history.
 */
export const findPatientsByClinicId = async (clinicId) => {
  return await prisma.patient.findMany({
    where: { clinicId },
    include: {
      user: {
        select: {
          email: true,
        },
      },
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
    orderBy: {
      lastName: 'asc',
    },
  });
};
