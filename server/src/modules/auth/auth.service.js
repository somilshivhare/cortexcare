import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as authRepository from './auth.repository.js';

// Number of hashing rounds for bcrypt. 10 is the industry standard.
const SALT_ROUNDS = 10;

/**
 * Generate a short-lived Access Token JWT.
 * @param {object} user 
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'fallback_secret_key',
    { expiresIn: '15m' } // 15 minutes access life
  );
};

/**
 * Generate a long-lived Refresh Token JWT.
 * @param {object} user 
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret_key',
    { expiresIn: '7d' } // 7 days refresh life
  );
};

/**
 * Verify a refresh token signature.
 * @param {string} token 
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret_key');
};

/**
 * Register a new user (patient or doctor).
 */
export const registerUser = async ({ email, password, role, firstName, lastName, specialty }) => {
  // 1. Check if email is already taken
  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    return {
      success: false,
      status: 409,
      error: 'Email is already registered.',
    };
  }

  // 2. Hash the password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Save user and profile to DB
  const user = await authRepository.createUser({
    email,
    passwordHash,
    role,
    firstName,
    lastName,
    specialty,
  });

  // 4. Exclude passwordHash from returned user object for safety
  const { passwordHash: _, ...safeUser } = user;

  // 5. Generate both authentication tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    success: true,
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

/**
 * Authenticate a user with email and password.
 */
export const loginUser = async ({ email, password }) => {
  // 1. Find user in database
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    return {
      success: false,
      status: 401,
      error: 'Invalid email or password.',
    };
  }

  // 2. Compare password hashes
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return {
      success: false,
      status: 401,
      error: 'Invalid email or password.',
    };
  }

  // 3. Exclude passwordHash from returned user object
  const { passwordHash: _, ...safeUser } = user;

  // 4. Generate both authentication tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    success: true,
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

/**
 * Get profile details of a user by ID.
 */
export const getUserProfile = async (id) => {
  const user = await authRepository.findUserById(id);
  if (!user) {
    return {
      success: false,
      status: 404,
      error: 'User not found.',
    };
  }

  const { passwordHash: _, ...safeUser } = user;
  return {
    success: true,
    user: safeUser,
  };
};
