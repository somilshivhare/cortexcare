import crypto from 'crypto';
import * as clinicRepository from './clinic.repository.js';

/**
 * Generate a random 6-character alphanumeric invite code.
 */
const generateCode = () => {
  return 'CC-' + crypto.randomBytes(3).toString('hex').toUpperCase();
};

/**
 * Create a new clinic.
 */
export const createClinic = async (userId, clinicDetails) => {
  const { name } = clinicDetails;
  // 1. Verify creator doctor profile
  const doctor = await clinicRepository.findDoctorByUserId(userId);
  if (!doctor) {
    return {
      success: false,
      status: 404,
      error: 'Doctor profile not found.',
    };
  }

  // 2. Prevent joining/creating multiple clinics
  if (doctor.clinicId) {
    return {
      success: false,
      status: 409,
      error: 'You already belong to a clinic. Cannot create another.',
    };
  }

  // 3. Generate unique code
  let code = generateCode();
  let existing = await clinicRepository.findClinicByCode(code);
  while (existing) {
    code = generateCode();
    existing = await clinicRepository.findClinicByCode(code);
  }

  // 4. Create clinic and assign doctor in a transaction
  const clinic = await clinicRepository.createClinic(clinicDetails, code, userId);

  return {
    success: true,
    clinic,
  };
};

/**
 * Join a clinic using a code.
 */
export const joinClinic = async (userId, role, code) => {
  // 1. Fetch clinic
  const clinic = await clinicRepository.findClinicByCode(code.trim().toUpperCase());
  if (!clinic) {
    return {
      success: false,
      status: 404,
      error: 'Clinic not found. Check invite code.',
    };
  }

  // 2. Perform role-based profile checks
  if (role === 'PATIENT') {
    const patient = await clinicRepository.findPatientByUserId(userId);
    if (!patient) {
      return { success: false, status: 404, error: 'Patient profile not found.' };
    }
    if (patient.clinicId === clinic.id) {
      return { success: false, status: 400, error: 'You are already enrolled in this clinic.' };
    }

    await clinicRepository.assignPatientToClinic(patient.id, clinic.id);
  } else if (role === 'DOCTOR') {
    const doctor = await clinicRepository.findDoctorByUserId(userId);
    if (!doctor) {
      return { success: false, status: 404, error: 'Doctor profile not found.' };
    }
    if (doctor.clinicId) {
      return { success: false, status: 409, error: 'You already belong to a clinic.' };
    }

    await clinicRepository.assignDoctorToClinic(doctor.id, clinic.id);
  } else {
    return { success: false, status: 400, error: 'Invalid user role.' };
  }

  return {
    success: true,
  };
};

/**
 * Fetch clinic details and stats for the logged-in user.
 * Omit code parameter for patients.
 */
export const getUserClinic = async (userId, role) => {
  let clinicId = null;

  if (role === 'PATIENT') {
    const patient = await clinicRepository.findPatientByUserId(userId);
    if (patient) clinicId = patient.clinicId;
  } else {
    const doctor = await clinicRepository.findDoctorByUserId(userId);
    if (doctor) clinicId = doctor.clinicId;
  }

  if (!clinicId) {
    return {
      success: false,
      status: 404,
      error: 'You do not belong to any clinic.',
    };
  }

  const clinic = await clinicRepository.findClinicById(clinicId);
  const stats = await clinicRepository.getClinicStats(clinicId);

  // Strip code parameter if requester is a Patient
  const responseData = {
    id: clinic.id,
    name: clinic.name,
    logoUrl: clinic.logoUrl,
    address: clinic.address,
    phoneNumber: clinic.phoneNumber,
    timings: clinic.timings,
    ...(role === 'DOCTOR' && { code: clinic.code }),
    totalDoctors: stats.totalDoctors,
    totalPatients: stats.totalPatients,
  };

  return {
    success: true,
    clinic: responseData,
  };
};

/**
 * Retrieve members list for doctor's clinic.
 */
export const getMembersList = async (userId, role) => {
  let clinicId;

  if (role === 'DOCTOR') {
    const doctor = await clinicRepository.findDoctorByUserId(userId);
    if (!doctor || !doctor.clinicId) {
      return {
        success: false,
        status: 404,
        error: 'Doctor does not belong to any clinic.',
      };
    }
    clinicId = doctor.clinicId;
  } else {
    const patient = await clinicRepository.findPatientByUserId(userId);
    if (!patient || !patient.clinicId) {
      return {
        success: false,
        status: 404,
        error: 'Patient does not belong to any clinic.',
      };
    }
    clinicId = patient.clinicId;
  }

  const members = await clinicRepository.findClinicMembers(clinicId);

  // For patients, do not leak other patients in the clinic due to privacy
  if (role === 'PATIENT') {
    return {
      success: true,
      members: {
        doctors: members.doctors,
        patients: [],
      },
    };
  }

  return {
    success: true,
    members,
  };
};

/**
 * Remove patient enrollment from a clinic.
 */
export const leaveClinic = async (userId, role) => {
  if (role !== 'PATIENT') {
    return {
      success: false,
      status: 400,
      error: 'Only patients can leave a clinic.',
    };
  }

  const patient = await clinicRepository.findPatientByUserId(userId);
  if (!patient) {
    return {
      success: false,
      status: 404,
      error: 'Patient profile not found.',
    };
  }

  if (!patient.clinicId) {
    return {
      success: false,
      status: 400,
      error: 'You are not enrolled in any clinic.',
    };
  }

  await clinicRepository.leaveClinic(patient.id);

  return {
    success: true,
  };
};

/**
 * Regenerate the unique invite code for a clinic.
 */
export const regenerateClinicCode = async (userId) => {
  const doctor = await clinicRepository.findDoctorByUserId(userId);
  if (!doctor || !doctor.clinicId) {
    return {
      success: false,
      status: 404,
      error: 'Doctor profile or associated clinic not found.',
    };
  }

  // Generate new code
  let code = generateCode();
  let existing = await clinicRepository.findClinicByCode(code);
  while (existing) {
    code = generateCode();
    existing = await clinicRepository.findClinicByCode(code);
  }

  const updatedClinic = await clinicRepository.updateClinicCode(doctor.clinicId, code);

  return {
    success: true,
    code: updatedClinic.code,
  };
};
