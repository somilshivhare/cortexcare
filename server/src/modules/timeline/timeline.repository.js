import prisma from '../../config/prisma.js';

/**
 * Fetch the complete consultation tree containing chunks, context, and notes.
 * @param {string} id - Consultation ID
 */
export const findFullConsultationTree = async (id) => {
  return await prisma.consultation.findUnique({
    where: { id },
    include: {
      patient: {
        select: {
          id: true,
          userId: true,
          clinicId: true,
          firstName: true,
          lastName: true,
        },
      },
      doctor: {
        select: {
          id: true,
          userId: true,
          clinicId: true,
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
      clinicalContext: true,
      doctorNote: true,
    },
  });
};

/**
 * Fetch patient profile details by User ID.
 */
export const findPatientByUserId = async (userId) => {
  return await prisma.patient.findUnique({
    where: { userId },
  });
};

/**
 * Fetch doctor profile details by User ID.
 */
export const findDoctorByUserId = async (userId) => {
  return await prisma.doctor.findUnique({
    where: { userId },
  });
};
