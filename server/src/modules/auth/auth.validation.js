/**
 * Regular expression to validate standard email format.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate registration input data.
 */
export const validateRegister = (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  if (!role || !['PATIENT', 'DOCTOR', 'ADMIN'].includes(role)) {
    return res.status(400).json({ error: 'Role must be PATIENT, DOCTOR, or ADMIN.' });
  }

  next();
};

/**
 * Validate login input data.
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  next();
};
