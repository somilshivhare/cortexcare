/**
 * Allowed speaker roles defined in our schema.
 */
const ALLOWED_SPEAKERS = ['PATIENT', 'DOCTOR', 'AI', 'SYSTEM'];

/**
 * Validate adding a new conversation chunk.
 */
export const validateAddChunk = (req, res, next) => {
  const { speaker, text } = req.body;

  if (!speaker || !ALLOWED_SPEAKERS.includes(speaker)) {
    return res.status(400).json({
      error: `Speaker must be one of: ${ALLOWED_SPEAKERS.join(', ')}`,
    });
  }

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text content is required and cannot be empty.' });
  }

  next();
};
