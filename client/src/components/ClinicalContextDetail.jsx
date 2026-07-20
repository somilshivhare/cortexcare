import React from 'react';
import { AlertCircle, CheckCircle2, Heart, Activity, BrainCircuit, User, ShieldAlert, Stethoscope } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

/**
 * Premium structured report card displaying the AI intake summary to doctors.
 */
const ClinicalContextDetail = ({ clinicalContext, consultation }) => {
  if (!clinicalContext) {
    return (
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 text-center dark:border-neutral-800/80 dark:bg-neutral-900">
        <Activity className="mx-auto h-10 w-10 text-neutral-300 animate-pulse" />
        <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">No Clinical Summary</h3>
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          The AI clinical synthesis is not yet available for this consultation.
        </p>
      </div>
    );
  }

  const {
    chiefComplaint,
    presentIllness,
    symptoms = [],
    currentMedications = [],
    allergies = [],
    pastMedicalHistory = [],
    lifestyle = {},
    timeline = [],
    riskFactors = [],
    riskLevel = 'LOW',
    recommendedSpecialist = 'General Practitioner',
    doctorSummary,
    // Legacy field support for backward compatibility
    medications,
    medicalHistory,
  } = clinicalContext;

  // Backwards compatibility: fall back to old field names if new ones are empty
  const displayMedications = currentMedications.length > 0 ? currentMedications : (medications || []);
  const displayHistory = pastMedicalHistory.length > 0 ? pastMedicalHistory : (medicalHistory || []);

  const isReviewed = consultation?.reviewStatus === 'REVIEWED' || !!consultation?.reviewedAt;
  const reviewDate = consultation?.reviewedAt 
    ? new Date(consultation.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  const getRiskStyles = (level) => {
    const l = level.toUpperCase();
    if (l === 'HIGH') return 'bg-rose-50 border-rose-100 text-rose-800 dark:bg-rose-950/10 dark:border-rose-900/35 dark:text-rose-400';
    if (l === 'MEDIUM') return 'bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-950/10 dark:border-amber-900/35 dark:text-amber-400';
    return 'bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/10 dark:border-emerald-900/35 dark:text-emerald-400';
  };

  return (
    <div className="space-y-6">
      {/* Top Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-800/80 dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400">
            <BrainCircuit className="h-5.5 w-5.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">AI Clinical Synthesis</h3>
            <p className="text-[9px] text-neutral-400 uppercase tracking-wider font-bold">Processed via Gemini</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Risk Classification</span>
            <span className={`mt-1 inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase border ${getRiskStyles(riskLevel)}`}>
              <ShieldAlert className="h-3 w-3" />
              {riskLevel}
            </span>
          </div>

          <div className="flex flex-col items-end border-l border-neutral-100 pl-4 dark:border-neutral-800">
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Review Status</span>
            <div className="mt-1">
              <StatusBadge status={consultation?.reviewStatus || 'PENDING'} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Complaint, Summary & Timeline */}
        <div className="md:col-span-2 space-y-6">
          {/* Executive Intake Summary */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider block mb-1">
              Chief Complaint: {chiefComplaint}
            </span>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-neutral-150 dark:border-neutral-800 pb-3">
              <Activity className="h-4.5 w-4.5 text-neutral-400" />
              <span>Clinical Executive Summary</span>
            </h4>
            <p className="mt-4 text-xs leading-relaxed text-neutral-700 dark:text-neutral-350 whitespace-pre-line">
              {doctorSummary || 'No clinical summary generated.'}
            </p>
          </div>

          {/* History of Present Illness */}
          {presentIllness && (
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-neutral-150 dark:border-neutral-800 pb-3 mb-4">
                <Activity className="h-4 w-4 text-neutral-400" />
                <span>History of Present Illness</span>
              </h4>
              <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-350 whitespace-pre-line">
                {presentIllness}
              </p>
            </div>
          )}

          {/* Chronological Timeline */}
          {timeline.length > 0 && (
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-neutral-150 dark:border-neutral-800 pb-3 mb-4">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                <span>Symptom Progression Timeline</span>
              </h4>
              <div className="space-y-4 relative before:absolute before:inset-y-1 before:left-2 before:w-0.5 before:bg-neutral-100 dark:before:bg-neutral-800">
                {timeline.map((step, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    <span className="h-4.5 w-4.5 rounded-full bg-indigo-50 border-2 border-indigo-500 flex items-center justify-center shrink-0 z-10 dark:bg-neutral-950" />
                    <p className="text-xs text-neutral-700 dark:text-neutral-350 pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Symptoms, Meds, Allergies, Specialist */}
        <div className="space-y-6">
          {/* Symptoms Checked */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
              <Stethoscope className="h-4 w-4 text-indigo-500" />
              <span>Symptom Profile</span>
            </h4>
            {symptoms.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">None reported.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {symptoms.map((s, idx) => (
                  <span key={idx} className="inline-flex rounded-lg bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Medications & Allergies */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs space-y-4">
            <div>
              <h5 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">Current Medications</h5>
              {displayMedications.length === 0 ? (
                <p className="text-xs text-neutral-550 italic">None reported.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {displayMedications.map((m, idx) => {
                    const med = typeof m === 'string' ? { name: m, status: 'ongoing' } : m;
                    const name = med?.name || 'Unknown Medication';
                    const dosage = med?.dosage ? ` (${med.dosage})` : '';
                    const status = med?.status || 'ongoing';

                    let badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30";
                    if (status === 'as-needed') {
                      badgeClass = "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30";
                    } else if (status === 'discontinued') {
                      badgeClass = "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-750";
                    }

                    return (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold transition-all duration-200 ${badgeClass}`}
                      >
                        <span>{name}{dosage}</span>
                        <span className="opacity-60 text-[9px] uppercase tracking-wider font-semibold">
                          • {status}
                        </span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3">
              <h5 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">Allergies</h5>
              {allergies.length === 0 ? (
                <p className="text-xs text-neutral-500 italic">None reported.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {allergies.map((a, idx) => (
                    <span key={idx} className="inline-flex rounded-lg bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 text-[10px] font-bold text-rose-650 dark:text-rose-450">
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Past History & Specialist */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs space-y-4">
            <div>
              <h5 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">Past Medical History</h5>
              {displayHistory.length === 0 ? (
                <p className="text-xs text-neutral-500 italic">None reported.</p>
              ) : (
                <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400 list-disc list-inside">
                  {displayHistory.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Risk Factors */}
            {riskFactors.length > 0 && (
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3">
                <h5 className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2">⚠ Risk Factors</h5>
                <div className="flex flex-wrap gap-1.5">
                  {riskFactors.map((r, idx) => (
                    <span key={idx} className="inline-flex rounded-lg bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 text-[10px] font-bold text-rose-650 dark:text-rose-400">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 flex items-center gap-2">
              <Stethoscope className="h-4.5 w-4.5 text-neutral-450 shrink-0" />
              <div>
                <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Recommended Specialist</span>
                <span className="text-xs font-bold text-neutral-900 dark:text-white">{recommendedSpecialist}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* therapist Audit Notes */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
        <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-neutral-150 dark:border-neutral-800 pb-3 mb-4">
          <User className="h-4.5 w-4.5 text-neutral-400" />
          <span>Therapist Audit Notes</span>
        </h4>
        
        {isReviewed ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-450">
              <span className="font-semibold">Reviewed on {reviewDate}</span>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </span>
            </div>
            <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
              <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-350 whitespace-pre-line">
                {consultation?.doctorNote?.notes || 'No review notes saved.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/30 p-6 text-center dark:border-neutral-800 dark:bg-neutral-900/30">
            <p className="text-xs text-neutral-500 dark:text-neutral-450">
              This clinical analysis has not been audited by a clinician yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalContextDetail;
