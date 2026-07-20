import React, { useState } from 'react';
import { useClinicPatients } from '../hooks/useDoctorDashboard.js';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/PageHeader.jsx';
import PageContainer from '../../../components/PageContainer.jsx';
import EmptyState from '../../../components/EmptyState.jsx';
import ErrorState from '../../../components/ErrorState.jsx';
import Spinner from '../../../components/Spinner.jsx';
import Avatar from '../../../components/Avatar.jsx';
import StatusBadge from '../../../components/StatusBadge.jsx';
import { Users, Mail, Phone, MapPin, ChevronDown, ChevronUp, Calendar, ArrowRight, Search } from 'lucide-react';

const PatientRow = ({ patient, onViewDetails }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const displayName = `${patient.firstName} ${patient.lastName}`;
  const totalVisits = patient.consultations?.length || 0;
  const avatar = patient.avatarUrl || localStorage.getItem(`avatar_PATIENT_${patient.userId}`) || '';

  return (
    <>
      <tr className="hover:bg-neutral-50/50 dark:hover:bg-neutral-805/20 transition-colors">
        <td className="whitespace-nowrap px-6 py-4 font-bold text-neutral-900 dark:text-white flex items-center gap-3">
          <Avatar src={avatar} name={displayName} size="sm" />
          <span>{displayName}</span>
        </td>
        <td className="px-6 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-350">
              <Mail className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
              <span>{patient.user?.email}</span>
            </div>
            {patient.phoneNumber && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-350">
                <Phone className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                <span>{patient.phoneNumber}</span>
              </div>
            )}
          </div>
        </td>
        <td className="px-6 py-4 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
          {patient.address ? (
            <div className="flex items-center gap-1.5 max-w-xs truncate">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
              <span>{patient.address}</span>
            </div>
          ) : (
            <span className="text-neutral-400 italic">Not provided</span>
          )}
        </td>
        <td className="whitespace-nowrap px-6 py-4 text-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
            {totalVisits} {totalVisits === 1 ? 'Evaluation' : 'Evaluations'}
          </span>
        </td>
        <td className="whitespace-nowrap px-6 py-4 text-right space-x-3.5">
          <button
            onClick={() => onViewDetails(patient)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            Info
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            disabled={totalVisits === 0}
            className="inline-flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-neutral-900 dark:text-neutral-350 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span>History</span>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </td>
      </tr>

      {/* Expanded Evaluation History Row */}
      {expanded && totalVisits > 0 && (
        <tr className="bg-neutral-50/30 dark:bg-neutral-950/20">
          <td colSpan={5} className="px-8 py-4 border-t border-neutral-100 dark:border-neutral-850">
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-neutral-455 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                <span>Longitudinal Evaluation History</span>
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patient.consultations.map((consult) => {
                  const dateObj = new Date(consult.createdAt);
                  const formattedDate = dateObj.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={consult.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-150 bg-white dark:border-neutral-800 dark:bg-neutral-900 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-neutral-50 block">
                          {formattedDate}
                        </span>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={consult.status} />
                          {consult.reviewStatus === 'REVIEWED' && (
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                              Reviewed
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/doctor/consultation/${consult.id}`)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 bg-neutral-50 text-[10px] font-bold text-neutral-700 hover:bg-neutral-100 hover:text-neutral-955 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-750 dark:hover:text-white transition-colors"
                      >
                        <span>Open Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const DoctorPatientsPage = () => {
  const { data, isLoading, isError, error, refetch } = useClinicPatients();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Patient Directory" breadcrumbs={[{ name: 'Doctor' }, { name: 'Patients' }]} />
        <div className="flex justify-center py-20"><Spinner /></div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Patient Directory" breadcrumbs={[{ name: 'Doctor' }, { name: 'Patients' }]} />
        <ErrorState
          title="Patient Directory Load Failed"
          message={error?.response?.data?.error || 'Could not retrieve registered patients list.'}
          onRetry={refetch}
        />
      </PageContainer>
    );
  }

  const patientsList = data?.patients || [];

  // Filter patients by name, email, or phone
  const filteredPatients = patientsList.filter((pat) => {
    const fullName = `${pat.firstName} ${pat.lastName}`.toLowerCase();
    const email = (pat.user?.email || '').toLowerCase();
    const phone = (pat.phoneNumber || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query) || phone.includes(query);
  });

  return (
    <PageContainer>
      <PageHeader 
        title="Patient Directory" 
        breadcrumbs={[
          { name: 'Workspace', path: '/doctor/dashboard' }, 
          { name: 'Patient Directory' }
        ]} 
      />

      {patientsList.length === 0 ? (
        <EmptyState
          title="No Patients Registered"
          description="There are currently no patients enrolled in your clinic directory."
          icon={Users}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-450" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 w-full rounded-md border border-neutral-250 bg-white text-xs text-neutral-900 outline-none focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-neutral-500 dark:text-neutral-400">
                <thead className="bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-450 dark:bg-neutral-800/40">
                  <tr>
                    <th scope="col" className="px-6 py-3">Patient Name</th>
                    <th scope="col" className="px-6 py-3">Contact Details</th>
                    <th scope="col" className="px-6 py-3">Address</th>
                    <th scope="col" className="px-6 py-3 text-center">Evaluations</th>
                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
                  {filteredPatients.map((patient) => (
                    <PatientRow key={patient.id} patient={patient} onViewDetails={setSelectedPatient} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar
                src={selectedPatient.avatarUrl || localStorage.getItem(`avatar_PATIENT_${selectedPatient.userId}`) || ''}
                name={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
                size="lg"
              />
              
              <div>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Patient Details</h3>
                <h4 className="text-base font-bold text-neutral-950 dark:text-white mt-1">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </h4>
                <p className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400 px-2 py-0.5 rounded-full inline-block mt-1 uppercase tracking-wider">
                  Clinic Patient
                </p>
              </div>

              <div className="w-full text-left space-y-3.5 border-t border-neutral-100 pt-4 dark:border-neutral-800 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Email Address</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{selectedPatient.user?.email}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Phone Number</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{selectedPatient.phoneNumber || 'Not provided'}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Home Address</span>
                  <span className="text-neutral-900 dark:text-white font-medium leading-relaxed">{selectedPatient.address || 'Not provided'}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Total Evaluations</span>
                  <span className="text-neutral-900 dark:text-white font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                    {selectedPatient.consultations?.length || 0}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="w-full rounded-lg bg-neutral-950 py-2 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default DoctorPatientsPage;
