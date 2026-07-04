import * as doctorService from './doctor.service.js';

/**
 * Handle GET /profile
 */
export const getProfile = async (req, res) => {
  try {
    const result = await doctorService.getDoctorProfile(req.user.id);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({ doctor: result.doctor });
  } catch (err) {
    console.error('Get doctor profile crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle PUT /profile
 */
export const updateProfile = async (req, res) => {
  try {
    const result = await doctorService.updateDoctorProfile(req.user.id, req.body);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      message: 'Profile updated successfully.',
      doctor: result.doctor,
    });
  } catch (err) {
    console.error('Update doctor profile crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle GET /dashboard
 */
export const getDashboard = async (req, res) => {
  try {
    const result = await doctorService.getDoctorDashboard(req.user.id);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({ stats: result.stats });
  } catch (err) {
    console.error('Get doctor dashboard crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle GET /consultations
 * Query params: ?status=pending OR ?status=claimed
 */
export const getConsultations = async (req, res) => {
  try {
    const { status } = req.query;

    const result = await doctorService.getConsultations(req.user.id, status);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({ consultations: result.consultations });
  } catch (err) {
    console.error('Get doctor consultations crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle POST /consultations/:consultationId/claim
 */
export const claim = async (req, res) => {
  try {
    const { consultationId } = req.params;

    const result = await doctorService.claimConsultation(req.user.id, consultationId);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      message: 'Consultation claimed successfully.',
      consultation: result.consultation,
    });
  } catch (err) {
    console.error('Claim consultation crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle POST /consultations/:consultationId/notes
 */
export const saveNotes = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { notes } = req.body;

    const result = await doctorService.saveNotes(req.user.id, consultationId, notes);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      message: 'Clinical notes saved successfully.',
      doctorNote: result.doctorNote,
    });
  } catch (err) {
    console.error('Save notes crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle POST /consultations/:consultationId/review
 */
export const review = async (req, res) => {
  try {
    const { consultationId } = req.params;

    const result = await doctorService.reviewConsultation(req.user.id, consultationId);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      message: 'Consultation marked as reviewed.',
      consultation: result.consultation,
    });
  } catch (err) {
    console.error('Mark review crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle GET /consultations/:consultationId/context
 * Retrieve the AI clinical context for a consultation.
 */
export const getContext = async (req, res) => {
  try {
    const { consultationId } = req.params;

    const result = await doctorService.getConsultationContext(req.user.id, consultationId);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      clinicalContext: result.clinicalContext,
    });
  } catch (err) {
    console.error('Get consultation context crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
