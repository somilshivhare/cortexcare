const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validate that the consultationId parameter is a valid UUID.
 */
export const validateConsultationId = (req, res, next) => {
  const { consultationId } = req.params;

  if (!consultationId || !UUID_REGEX.test(consultationId)) {
    return res.status(400).json({ error: 'Invalid consultation ID format. Must be a valid UUID.' });
  }

  next();
};
