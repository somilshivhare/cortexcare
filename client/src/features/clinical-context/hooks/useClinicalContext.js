import { useQuery } from '@tanstack/react-query';
import { getPatientContextsApi, getConsultationContextApi, getDoctorPatientContextsApi } from '../api/clinicalContext.api.js';

export const usePatientContexts = (patientId) => {
  return useQuery({
    queryKey: ['clinical-contexts', patientId || 'patient'],
    queryFn: () => patientId ? getDoctorPatientContextsApi(patientId) : getPatientContextsApi(),
  });
};

export const useConsultationContext = (consultationId) => {
  return useQuery({
    queryKey: ['clinical-context', consultationId],
    queryFn: () => getConsultationContextApi(consultationId),
    enabled: !!consultationId,
  });
};
