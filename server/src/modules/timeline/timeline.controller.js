import * as timelineService from './timeline.service.js';

/**
 * Handle GET /:consultationId
 * Retrieve unified timeline history for a consultation session.
 */
export const getTimeline = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { id: userId, role } = req.user;

    const result = await timelineService.getConsultationTimeline(userId, role, consultationId);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(200).json({
      summary: result.summary,
      events: result.events,
    });
  } catch (err) {
    console.error('Fetch consultation timeline crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
