import * as patientService from './patient.service.js';

/**
 * Handle GET /profile
 */
export const getProfile = async (req, res) => {
  try {
    const result = await patientService.getPatientProfile(req.user.id);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      patient: result.patient,
    });
  } catch (err) {
    console.error('Get patient profile crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle PUT /profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, address } = req.body;

    const result = await patientService.updatePatientProfile(req.user.id, {
      firstName,
      lastName,
      phoneNumber,
      address,
    });

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      message: 'Profile updated successfully.',
      patient: result.patient,
    });
  } catch (err) {
    console.error('Update patient profile crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle POST /join-clinic (Stub)
 */
export const joinClinic = async (req, res) => {
  try {
    const { clinicId } = req.body;

    const result = await patientService.joinClinic(req.user.id, clinicId);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      message: 'Successfully applied to join clinic.',
      registration: result.registration,
    });
  } catch (err) {
    console.error('Join clinic stub crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
