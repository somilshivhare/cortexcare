import * as clinicalContextService from './clinicalContext.service.js';

/**
 * Handle GET /:consultationId
 * Retrieve a specific clinical context by Consultation ID.
 */
export const getDetails = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { id: userId, role } = req.user;

    const result = await clinicalContextService.getClinicalContext(userId, role, consultationId);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      clinicalContext: result.clinicalContext,
    });
  } catch (err) {
    console.error('Fetch clinical context details crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle GET /patient
 * Retrieve all clinical context summaries belonging to the logged-in patient.
 */
export const getPatientContexts = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const result = await clinicalContextService.getPatientClinicalContexts(userId);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      clinicalContexts: result.clinicalContexts,
    });
  } catch (err) {
    console.error('Fetch patient clinical contexts crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
