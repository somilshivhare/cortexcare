import { useQuery } from '@tanstack/react-query';
import { getTimelineApi } from '../api/timeline.api.js';

export const useTimeline = (consultationId) => {
  return useQuery({
    queryKey: ['timeline', consultationId],
    queryFn: () => getTimelineApi(consultationId),
    enabled: !!consultationId,
  });
};
