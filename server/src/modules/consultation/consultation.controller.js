import * as consultationService from './services/consultation.service.js';
import * as attachmentService from './services/attachment.service.js';

/**
 * ConsultationController — parses HTTP input and delegates to services.
 * No business logic lives here. One handler per route.
 */

export const create = async (req, res) => {
  try {
    const result = await consultationService.startConsultation(req.user.id);
    if (!result.success) return res.status(result.status || 400).json({ error: result.error });
    return res.status(201).json({ message: 'AI Consultation session started.', consultation: result.consultation });
  } catch (err) {
    console.error('[Controller] create:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getDetails = async (req, res) => {
  try {
    const result = await consultationService.getConsultation(req.user.id, req.params.id);
    if (!result.success) return res.status(result.status || 400).json({ error: result.error });
    return res.status(200).json({ consultation: result.consultation });
  } catch (err) {
    console.error('[Controller] getDetails:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: 'Message text is required.' });

    const result = await consultationService.sendMessage(req.user.id, req.params.id, text);
    if (!result.success) return res.status(result.status || 400).json({ error: result.error });

    return res.status(201).json({
      message: 'Message processed.',
      patientMessage: result.patientMessage,
      aiMessage: result.aiMessage,
    });
  } catch (err) {
    console.error('[Controller] sendMessage:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const finalize = async (req, res) => {
  try {
    const result = await consultationService.finalizeConsultation(req.user.id, req.params.id);
    if (!result.success) return res.status(result.status || 400).json({ error: result.error });
    return res.status(200).json({ message: 'Consultation finalized. Clinical analysis enqueued.', consultation: result.consultation });
  } catch (err) {
    console.error('[Controller] finalize:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const result = await attachmentService.saveAttachment(req.user.id, req.params.id, req.file);
    if (!result.success) return res.status(result.status || 400).json({ error: result.error });

    return res.status(201).json({ message: 'File uploaded successfully.', attachment: result.attachment });
  } catch (err) {
    console.error('[Controller] uploadFile:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
