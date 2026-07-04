/**
 * Regular expression to validate standard email format.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate registration input data.
 */
export const validateRegister = (req, res, next) => {
  const { email, password, role, firstName, lastName, specialty } = req.body;

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  if (!role || !['PATIENT', 'DOCTOR'].includes(role)) {
    return res.status(400).json({ error: 'Role must be either PATIENT or DOCTOR.' });
  }

  if (!firstName || firstName.trim().length === 0) {
    return res.status(400).json({ error: 'First name is required.' });
  }

  if (!lastName || lastName.trim().length === 0) {
    return res.status(400).json({ error: 'Last name is required.' });
  }

  if (role === 'DOCTOR' && (!specialty || specialty.trim().length === 0)) {
    return res.status(400).json({ error: 'Specialty is required for DOCTOR registration.' });
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
