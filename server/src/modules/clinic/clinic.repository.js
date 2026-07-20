import prisma from '../../config/prisma.js';

/**
 * Fetch a clinic by its unique invite code.
 */
export const findClinicByCode = async (code) => {
  return await prisma.clinic.findUnique({
    where: { code },
  });
};

/**
 * Fetch clinic details by ID.
 */
export const findClinicById = async (id) => {
  return await prisma.clinic.findUnique({
    where: { id },
  });
};

/**
 * Create a clinic and associate the creating doctor in a single transaction.
 */
export const createClinic = async ({ name, address, phoneNumber, timings, logoUrl }, code, doctorUserId) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Create the clinic
    const clinic = await tx.clinic.create({
      data: { name, code, address, phoneNumber, timings, logoUrl },
    });

    // 2. Assign creating doctor to the clinic
    await tx.doctor.update({
      where: { userId: doctorUserId },
      data: { clinicId: clinic.id },
    });

    return clinic;
  });
};

/**
 * Assign a patient to a clinic.
 */
export const assignPatientToClinic = async (patientId, clinicId) => {
  return await prisma.patient.update({
    where: { id: patientId },
    data: { clinicId },
  });
};

/**
 * Assign a doctor to a clinic.
 */
export const assignDoctorToClinic = async (doctorId, clinicId) => {
  return await prisma.doctor.update({
    where: { id: doctorId },
    data: { clinicId },
  });
};

/**
 * Fetch all patients and doctors assigned to a clinic.
 */
export const findClinicMembers = async (clinicId) => {
  const clinic = await prisma.clinic.findUnique({
    where: { id: clinicId },
    include: {
      doctors: {
        select: {
          id: true,
          userId: true,
          firstName: true,
          lastName: true,
          specialty: true,
          licenseNumber: true,
          qualification: true,
          experience: true,
          bio: true,
          phoneNumber: true,
          avatarUrl: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
      patients: {
        select: {
          id: true,
          userId: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          address: true,
          dob: true,
          gender: true,
          bloodGroup: true,
          height: true,
          weight: true,
          allergies: true,
          emergencyContact: true,
          avatarUrl: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  return clinic || { doctors: [], patients: [] };
};

/**
 * Count doctors and patients in a clinic.
 */
export const getClinicStats = async (clinicId) => {
  const doctorsCount = await prisma.doctor.count({
    where: { clinicId },
  });

  const patientsCount = await prisma.patient.count({
    where: { clinicId },
  });

  return {
    totalDoctors: doctorsCount,
    totalPatients: patientsCount,
  };
};

/**
 * Helper: Find patient by User ID.
 */
export const findPatientByUserId = async (userId) => {
  return await prisma.patient.findUnique({
    where: { userId },
  });
};

/**
 * Helper: Find doctor by User ID.
 */
export const findDoctorByUserId = async (userId) => {
  return await prisma.doctor.findUnique({
    where: { userId },
  });
};

/**
 * Remove a patient's clinic assignment (leave clinic).
 */
export const leaveClinic = async (patientId) => {
  return await prisma.patient.update({
    where: { id: patientId },
    data: { clinicId: null },
  });
};

/**
 * Update the unique invite code for a clinic.
 */
export const updateClinicCode = async (clinicId, code) => {
  return await prisma.clinic.update({
    where: { id: clinicId },
    data: { code },
  });
};
