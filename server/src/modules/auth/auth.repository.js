import crypto from 'crypto';
import prisma from '../../config/prisma.js';

/**
 * Generate a random 6-character alphanumeric invite code.
 */
const generateCode = () => {
  return 'CC-' + crypto.randomBytes(3).toString('hex').toUpperCase();
};

/**
 * Find a user by email, including their profile details.
 * @param {string} email 
 * @returns {Promise<object|null>}
 */
export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      patient: true,
      doctor: true,
    },
  });
};

/**
 * Find a user by ID, including their profile details.
 * @param {string} id 
 * @returns {Promise<object|null>}
 */
export const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: true,
    },
  });
};

/**
 * Create a new user and their corresponding profile in a database transaction.
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.passwordHash
 * @param {string} params.role
 * @param {string} params.firstName
 * @param {string} params.lastName
 * @param {string} [params.specialty]
 * @param {string} [params.clinicCode]
 * @param {string} [params.clinicName]
 * @returns {Promise<object>}
 */
export const createUser = async ({ email, passwordHash, role, firstName, lastName, specialty, clinicCode, clinicName }) => {
  // Ensure the database connection is active before starting the transaction timer (prevents cold start timeouts)
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    console.warn('Database warmup query failed:', err.message);
  }

  // Use a transaction to ensure both User, Profile, and Clinic are created atomically
  return await prisma.$transaction(async (tx) => {
    let clinicId = null;

    // 1. Handle clinic join via code
    if (clinicCode) {
      const clinic = await tx.clinic.findUnique({
        where: { code: clinicCode.trim().toUpperCase() },
      });
      if (!clinic) {
        throw new Error('Clinic not found. Please verify the invite code.');
      }
      clinicId = clinic.id;
    }

    // 2. Handle clinic creation for Doctor
    if (role === 'DOCTOR' && clinicName) {
      let code = generateCode();
      let existingClinic = await tx.clinic.findUnique({ where: { code } });
      while (existingClinic) {
        code = generateCode();
        existingClinic = await tx.clinic.findUnique({ where: { code } });
      }

      const newClinic = await tx.clinic.create({
        data: {
          name: clinicName.trim(),
          code,
        },
      });
      clinicId = newClinic.id;
    }

    // 3. Create User record
    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        role,
      },
    });

    // 4. Create Role-specific Profile record
    if (role === 'PATIENT') {
      await tx.patient.create({
        data: {
          userId: user.id,
          firstName: firstName || '',
          lastName: lastName || '',
          clinicId,
        },
      });
    } else if (role === 'DOCTOR') {
      await tx.doctor.create({
        data: {
          userId: user.id,
          firstName: firstName || '',
          lastName: lastName || '',
          specialty: specialty || '',
          clinicId,
        },
      });
    }

    // Return the created user with their newly created profile loaded
    return await tx.user.findUnique({
      where: { id: user.id },
      include: {
        patient: true,
        doctor: true,
      },
    });
  }, {
    maxWait: 5000,
    timeout: 20000,
  });
};

/**
 * Delete user by ID.
 */
export const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id },
  });
};
