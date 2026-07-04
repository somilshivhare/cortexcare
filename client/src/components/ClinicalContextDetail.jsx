import React from 'react';
import { AlertCircle, Award, CheckCircle2, Heart, HelpCircle, Activity, BrainCircuit, User } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

const ClinicalContextDetail = ({ clinicalContext, consultation }) => {
  if (!clinicalContext) {
    return (
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 text-center dark:border-neutral-800/80 dark:bg-neutral-900">
        <HelpCircle className="mx-auto h-10 w-10 text-neutral-350" />
        <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">
          No Clinical Summary
        </h3>
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          The AI clinical synthesis is not yet available for this consultation.
        </p>
      </div>
    );
  }

  const {
    summary,
    symptoms = [],
    riskFlags = [],
    recommendations = [],
    mood = {},
    confidenceScore = 0.95,
  } = clinicalContext;

  // Review Details
  const isReviewed = consultation?.reviewStatus === 'REVIEWED' || !!consultation?.reviewedAt;
  const reviewDate = consultation?.reviewedAt 
    ? new Date(consultation.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  // Format symptoms list
  const symptomList = Array.isArray(symptoms) ? symptoms : Object.values(symptoms);
  // Format risk flags list
  const riskList = Array.isArray(riskFlags) ? riskFlags : Object.values(riskFlags);
  // Format recommendations
  const recommendationList = Array.isArray(recommendations) ? recommendations : Object.values(recommendations);

  return (
    <div className="space-y-6">
      {/* Top Meta Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-800/80 dark:bg-neutral-900">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
            <BrainCircuit className="h-5.5 w-5.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Clinical AI Engine</h3>
            <p className="text-[10px] text-neutral-450 uppercase tracking-wider font-semibold">Gemini Synthesis</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Confidence Badge */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">AI Confidence</span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-bold ${
                confidenceScore >= 0.90 
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
              }`}>
                {Math.round(confidenceScore * 100)}%
              </span>
            </div>
          </div>

          {/* Review Status */}
          <div className="flex flex-col items-end border-l border-neutral-100 pl-4 dark:border-neutral-800">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Audit Status</span>
            <div className="mt-1">
              <StatusBadge status={consultation?.reviewStatus || 'PENDING'} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Summary & Recommendations (Col-span 2) */}
        <div className="md:col-span-2 space-y-6">
          {/* Executive Summary */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-neutral-400" />
              <span>Consultation Summary</span>
            </h4>
            <p className="mt-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-350">
              {summary || 'No summary text available.'}
            </p>
          </div>

          {/* Clinical Recommendations */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
              <span>Recommendations & Next Steps</span>
            </h4>
            {recommendationList.length === 0 ? (
              <p className="mt-4 text-xs text-neutral-500">No specific recommendations computed.</p>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {recommendationList.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-xs leading-relaxed text-neutral-700 dark:text-neutral-350">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-550 dark:bg-neutral-800">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Symptoms, Risks & Mood */}
        <div className="space-y-6">
          {/* Extracted Symptoms */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="h-4.5 w-4.5 text-indigo-500" />
              <span>Symptoms Checked</span>
            </h4>
            {symptomList.length === 0 ? (
              <p className="mt-4 text-xs text-neutral-500">No symptoms identified.</p>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {symptomList.map((symptom, idx) => (
                  <span
                    key={idx}
                    className="inline-flex rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Risk Flags */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="h-4.5 w-4.5 text-rose-500" />
              <span>Clinical Risk Warnings</span>
            </h4>
            {riskList.length === 0 ? (
              <p className="mt-4 text-xs text-neutral-500">No critical risk flags highlighted.</p>
            ) : (
              <div className="mt-4 space-y-2">
                {riskList.map((risk, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-lg bg-rose-50/50 border border-rose-100/50 px-3 py-2 text-xs font-semibold text-rose-800 dark:bg-rose-950/10 dark:border-rose-950/20 dark:text-rose-400"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mood Sentiment */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Heart className="h-4.5 w-4.5 text-emerald-500 animate-pulse" />
              <span>Mood & Affect</span>
            </h4>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-neutral-500 dark:text-neutral-450">Primary Sentiment:</span>
              <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase">
                {mood?.primary || mood?.sentiment || 'Neutral'}
              </span>
            </div>
            {mood?.explanation && (
              <p className="mt-2 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                {mood.explanation}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Clinician Review Notes Segment */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
        <h4 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <User className="h-4.5 w-4.5 text-neutral-400" />
          <span>Therapist Audit Notes</span>
        </h4>
        
        {isReviewed ? (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-450">
              <span className="font-semibold">Reviewed on {reviewDate}</span>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </span>
            </div>
            <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
              <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                {consultation?.doctorNote?.notes || 'No review notes saved.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-neutral-250 bg-neutral-50/30 p-6 text-center dark:border-neutral-800 dark:bg-neutral-900/30">
            <p className="text-xs text-neutral-500 dark:text-neutral-450">
              This clinical analysis has not been audited by a clinician yet.
            </p>
          </div>
        )}
        
        {/* Placeholder for future comments/replies section to prevent redesign */}
        <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800 hidden">
          <h5 className="text-xs font-bold text-neutral-450">Consultation Comments Feed</h5>
        </div>
      </div>
    </div>
  );
};

export default ClinicalContextDetail;
