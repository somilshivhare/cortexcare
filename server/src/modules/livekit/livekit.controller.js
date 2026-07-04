import * as livekitService from './livekit.service.js';
import * as consultationRepository from '../consultation/consultation.repository.js';

/**
 * Handle POST /:consultationId/token
 * Generate a LiveKit room token for the authenticated user.
 */
export const getToken = async (req, res) => {
  try {
    const { consultationId } = req.params;

    // 1. Fetch consultation to verify existence and check ownership
    const consultation = await consultationRepository.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation session not found.' });
    }

    // 2. Validate ownership: patient must own this consultation
    if (consultation.patient.userId !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission to join this session.' });
    }

    // 3. Verify session is not already completed
    if (['COMPLETED', 'CANCELLED'].includes(consultation.status)) {
      return res.status(400).json({ error: 'This consultation session has already concluded.' });
    }

    // 4. Generate LiveKit token using consultationId as room name and userId as identity
    const token = await livekitService.generateParticipantToken(consultationId, req.user.id);

    return res.status(200).json({
      token,
      room: consultationId,
    });
  } catch (err) {
    console.error('LiveKit token generation crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
