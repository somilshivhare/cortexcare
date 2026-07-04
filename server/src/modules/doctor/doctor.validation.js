/**
 * Validate doctor profile update inputs.
 */
export const validateUpdateProfile = (req, res, next) => {
  const { firstName, lastName, specialty } = req.body;

  if (firstName !== undefined && (!firstName || firstName.trim().length === 0)) {
    return res.status(400).json({ error: 'First name cannot be empty.' });
  }

  if (lastName !== undefined && (!lastName || lastName.trim().length === 0)) {
    return res.status(400).json({ error: 'Last name cannot be empty.' });
  }

  if (specialty !== undefined && (!specialty || specialty.trim().length === 0)) {
    return res.status(400).json({ error: 'Specialty cannot be empty.' });
  }

  next();
};

/**
 * Validate doctor notes input data.
 */
export const validateAddNotes = (req, res, next) => {
  const { notes } = req.body;

  if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
    return res.status(400).json({ error: 'Notes are required and cannot be empty.' });
  }

  next();
};
