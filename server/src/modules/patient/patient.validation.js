/**
 * Validate patient profile update inputs.
 */
export const validateUpdateProfile = (req, res, next) => {
  const { firstName, lastName } = req.body;

  if (firstName !== undefined && (!firstName || firstName.trim().length === 0)) {
    return res.status(400).json({ error: 'First name cannot be empty.' });
  }

  if (lastName !== undefined && (!lastName || lastName.trim().length === 0)) {
    return res.status(400).json({ error: 'Last name cannot be empty.' });
  }

  next();
};
