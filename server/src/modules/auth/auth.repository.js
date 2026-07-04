import prisma from '../../config/prisma.js';

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
 * @returns {Promise<object>}
 */
export const createUser = async ({ email, passwordHash, role, firstName, lastName, specialty }) => {
  // Use a transaction to ensure both User and Profile are created atomically
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        role,
      },
    });

    if (role === 'PATIENT') {
      await tx.patient.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
        },
      });
    } else if (role === 'DOCTOR') {
      await tx.doctor.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          specialty,
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
  });
};
