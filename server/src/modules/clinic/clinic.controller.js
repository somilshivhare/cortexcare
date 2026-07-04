import * as clinicService from './clinic.service.js';

/**
 * Handle POST /
 * Create a new clinic (Doctors only).
 */
export const create = async (req, res) => {
  try {
    const { name } = req.body;
    const { id: userId } = req.user;

    const result = await clinicService.createClinic(userId, name);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(201).json({
      message: 'Clinic created successfully.',
      clinic: result.clinic,
    });
  } catch (err) {
    console.error('Create clinic crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle POST /join
 * Enrolls a Patient or Doctor to a clinic via invite code.
 */
export const join = async (req, res) => {
  try {
    const { code } = req.body;
    const { id: userId, role } = req.user;

    const result = await clinicService.joinClinic(userId, role, code);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      message: 'Joined clinic successfully.',
    });
  } catch (err) {
    console.error('Join clinic crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle GET /
 * Retrieve clinic metadata and stats for the authenticated patient or doctor.
 */
export const getClinic = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    const result = await clinicService.getUserClinic(userId, role);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      clinic: result.clinic,
    });
  } catch (err) {
    console.error('Get clinic details crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle GET /members
 * Retrieve all clinic doctors and patients (Doctors only).
 */
export const getMembers = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const result = await clinicService.getMembersList(userId);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      members: result.members,
    });
  } catch (err) {
    console.error('Get members list crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
