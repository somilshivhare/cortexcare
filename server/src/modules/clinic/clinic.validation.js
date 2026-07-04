/**
 * Validate clinic creation inputs.
 */
export const validateCreateClinic = (req, res, next) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Clinic name is required and cannot be empty.' });
  }

  next();
};

/**
 * Validate clinic join inputs.
 */
export const validateJoinClinic = (req, res, next) => {
  const { code } = req.body;

  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    return res.status(400).json({ error: 'Clinic invite code is required.' });
  }

  next();
};
