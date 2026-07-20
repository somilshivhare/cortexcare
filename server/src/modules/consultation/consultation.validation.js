/**
 * Validate sending a patient chat message.
 */
export const validateSendMessage = (req, res, next) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Message text is required and cannot be empty.' });
  }

  next();
};
