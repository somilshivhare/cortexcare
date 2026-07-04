import { useQuery } from '@tanstack/react-query';
import { getPatientContextsApi, getConsultationContextApi } from '../api/clinicalContext.api.js';

export const usePatientContexts = () => {
  return useQuery({
    queryKey: ['clinical-contexts', 'patient'],
    queryFn: getPatientContextsApi,
  });
};

export const useConsultationContext = (consultationId) => {
  return useQuery({
    queryKey: ['clinical-context', consultationId],
    queryFn: () => getConsultationContextApi(consultationId),
    enabled: !!consultationId,
  });
};
