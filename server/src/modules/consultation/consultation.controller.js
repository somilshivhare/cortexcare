import * as consultationService from './consultation.service.js';

/**
 * Handle POST /
 * Create a new consultation session.
 */
export const create = async (req, res) => {
  try {
    const result = await consultationService.startConsultation(req.user.id);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(201).json({
      message: 'Consultation session initialized successfully.',
      consultation: result.consultation,
    });
  } catch (err) {
    console.error('Create consultation crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle GET /:id
 * Fetch details and chunks of a specific consultation session.
 */
export const getDetails = async (req, res) => {
  try {
    const result = await consultationService.getConsultation(req.user.id, req.params.id);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      consultation: result.consultation,
    });
  } catch (err) {
    console.error('Fetch consultation details crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle POST /:id/chunks
 * Add a conversation transcript segment during the active session.
 */
export const addChunk = async (req, res) => {
  try {
    const { speaker, text } = req.body;

    const result = await consultationService.addChunk(req.user.id, req.params.id, {
      speaker,
      text,
    });

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(201).json({
      message: 'Conversation chunk appended.',
      chunk: result.chunk,
    });
  } catch (err) {
    console.error('Add conversation chunk crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle POST /:id/finalize
 * Conclude the intake conversation, locking the transcript for processing.
 */
export const finalize = async (req, res) => {
  try {
    const result = await consultationService.finalizeConsultation(req.user.id, req.params.id);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      message: 'Consultation concluded and locked for processing.',
      consultation: result.consultation,
    });
  } catch (err) {
    console.error('Finalize consultation crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
