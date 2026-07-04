import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTimeline } from '../../timeline/hooks/useTimeline.js';
import { useConsultationContext } from '../../clinical-context/hooks/useClinicalContext.js';
import { useSaveNotes, useReviewConsultation } from '../hooks/useDoctorDashboard.js';
import { useToast } from '../../../contexts/ToastContext.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import PageContainer from '../../../components/PageContainer.jsx';
import ErrorState from '../../../components/ErrorState.jsx';
import StatusBadge from '../../../components/StatusBadge.jsx';
import ClinicalContextDetail from '../../../components/ClinicalContextDetail.jsx';
import { SkeletonCard } from '../../../components/Skeleton.jsx';
import { FileText, Save, CheckCircle, Activity, MessageSquare } from 'lucide-react';

const DoctorConsultationDetailPage = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Queries
  const timelineQuery = useTimeline(consultationId);
  const contextQuery = useConsultationContext(consultationId);

  // Mutations
  const saveNotesMutation = useSaveNotes();
  const reviewMutation = useReviewConsultation();

  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('context'); // context, transcript

  const isLoading = timelineQuery.isLoading || contextQuery.isLoading;
  const isError = timelineQuery.isError || contextQuery.isError;

  // Sync notes from query once loaded
  useEffect(() => {
    if (timelineQuery.data?.summary?.reviewStatus === 'REVIEWED') {
      const notesEvent = timelineQuery.data.events.find((e) => e.type === 'DOCTOR_NOTES_UPDATED');
      if (notesEvent) {
        setNotes(notesEvent.data.notes || '');
      }
    } else {
      // Look for any unsaved notes loaded from context
      const noteData = contextQuery.data?.clinicalContext?.consultation?.doctorNote?.notes;
      if (noteData) setNotes(noteData);
    }
  }, [timelineQuery.data, contextQuery.data]);

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Patient Evaluation" onBack={() => navigate(-1)} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonCard className="h-96 lg:col-span-2" />
          <SkeletonCard className="h-96" />
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Patient Evaluation" onBack={() => navigate(-1)} />
        <ErrorState
          title="Patient Audit Load Failed"
          message="Could not load medical context summaries or transcription history."
          onRetry={() => {
            timelineQuery.refetch();
            contextQuery.refetch();
          }}
        />
      </PageContainer>
    );
  }

  const { summary: timelineSummary = {}, events = [] } = timelineQuery.data || {};
  const clinicalContext = contextQuery.data?.clinicalContext;

  const handleSaveNotes = async () => {
    if (!notes.trim()) {
      addToast('Notes cannot be blank.', 'error');
      return;
    }
    try {
      await saveNotesMutation.mutateAsync({ consultationId, notes });
      addToast('Clinical evaluation notes saved.', 'success');
      timelineQuery.refetch();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to save notes.', 'error');
    }
  };

  const handleFinalizeReview = async () => {
    if (!notes.trim()) {
      addToast('Please complete and save your notes before finalizing the audit.', 'error');
      return;
    }
    try {
      await reviewMutation.mutateAsync(consultationId);
      addToast('Clinical review completed and locked.', 'success');
      navigate('/doctor/dashboard');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to finalize review.', 'error');
    }
  };

  const transcriptEvents = events.filter((e) => e.type === 'TRANSCRIPT_CHUNK');
  const isReviewed = timelineSummary.reviewStatus === 'REVIEWED';

  return (
    <PageContainer>
      <PageHeader
        title="Patient Evaluation Audit"
        breadcrumbs={[
          { name: 'Workspace', path: '/doctor/dashboard' },
          { name: 'Evaluation Details' }
        ]}
        onBack={() => navigate(-1)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Context Details / Transcript Toggle (Col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex border-b border-neutral-200/80 dark:border-neutral-800/80 gap-6">
            <button
              onClick={() => setActiveTab('context')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 relative whitespace-nowrap ${
                activeTab === 'context'
                  ? 'text-neutral-950 dark:text-white'
                  : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
              }`}
            >
              <span>Clinical Analysis</span>
              {activeTab === 'context' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 relative whitespace-nowrap ${
                activeTab === 'transcript'
                  ? 'text-neutral-950 dark:text-white'
                  : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
              }`}
            >
              <span>Intake Transcript</span>
              {activeTab === 'transcript' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
              )}
            </button>
          </div>

          {activeTab === 'context' ? (
            <ClinicalContextDetail
              clinicalContext={clinicalContext}
              consultation={clinicalContext?.consultation}
            />
          ) : (
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-none">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Transcript Records</span>
              </h4>
              
              {transcriptEvents.length === 0 ? (
                <p className="text-xs text-neutral-500">No transcripts recorded for this session.</p>
              ) : (
                <div className="space-y-4">
                  {transcriptEvents.map((event, idx) => (
                    <div key={idx} className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-3 text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
                      <span className="font-bold uppercase tracking-wider text-[9px] text-indigo-500 block mb-1">
                        {event.data?.speaker}
                      </span>
                      <p className="text-neutral-700 dark:text-neutral-300">{event.data?.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Note Editor & Finalize Action Card */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <FileText className="h-5 w-5 text-neutral-400" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Clinical Note Entry</h3>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Evaluation Notes
            </label>
            <textarea
              id="notes"
              rows={12}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isReviewed || saveNotesMutation.isPending || reviewMutation.isPending}
              placeholder="Type clinical diagnosis, medications, patient treatment recommendations..."
              className="w-full rounded-xl border border-neutral-200 p-4 text-xs leading-relaxed text-neutral-900 outline-none focus:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:focus:border-white transition-colors"
            />
          </div>

          {!isReviewed ? (
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleSaveNotes}
                disabled={saveNotesMutation.isPending || reviewMutation.isPending}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-350 dark:hover:bg-neutral-800/50 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saveNotesMutation.isPending ? 'Saving...' : 'Save Draft Notes'}</span>
              </button>
              
              <button
                onClick={handleFinalizeReview}
                disabled={reviewMutation.isPending}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                <span>{reviewMutation.isPending ? 'Finalizing...' : 'Finalize Audit & Lock'}</span>
              </button>
            </div>
          ) : (
            <div className="rounded-xl bg-emerald-50/50 border border-emerald-100/50 p-4 text-center dark:bg-emerald-950/10 dark:border-emerald-950/20">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                Evaluation Complete & Locked
              </span>
            </div>
          )}
        </div>

      </div>
    </PageContainer>
  );
};

export default DoctorConsultationDetailPage;
