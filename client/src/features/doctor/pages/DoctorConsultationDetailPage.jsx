import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTimeline } from '../../timeline/hooks/useTimeline.js';
import { useConsultationContext } from '../../clinical-context/hooks/useClinicalContext.js';
import { useSaveNotes, useReviewConsultation, useUploadDoctorAttachment } from '../hooks/useDoctorDashboard.js';
import { useToast } from '../../../contexts/ToastContext.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import PageContainer from '../../../components/PageContainer.jsx';
import ErrorState from '../../../components/ErrorState.jsx';
import StatusBadge from '../../../components/StatusBadge.jsx';
import ClinicalContextDetail from '../../../components/ClinicalContextDetail.jsx';
import { SkeletonCard } from '../../../components/Skeleton.jsx';
import { FileText, Save, CheckCircle, Activity, MessageSquare, Paperclip, Upload, ExternalLink } from 'lucide-react';

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
  const uploadAttachmentMutation = useUploadDoctorAttachment();
  const fileInputRef = React.useRef(null);

  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('context'); // context, transcript

  const handleUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadAttachmentMutation.mutateAsync({ consultationId, file });
      addToast('Attachment uploaded successfully!', 'success');
      contextQuery.refetch();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to upload attachment.', 'error');
    }
  };

  const isLoading = timelineQuery.isLoading || contextQuery.isLoading;
  const isError = timelineQuery.isError || (contextQuery.isError && contextQuery.error?.response?.status !== 404);

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
            <div className="space-y-6">
              {/* Patient Identity Information */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold text-neutral-450 uppercase tracking-wider">
                  Patient Identity Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Full Name</span>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5 block">
                      {clinicalContext?.consultation?.patient 
                        ? `${clinicalContext.consultation.patient.firstName} ${clinicalContext.consultation.patient.lastName}` 
                        : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Phone Number</span>
                    <span className="text-xs text-neutral-700 dark:text-neutral-300 mt-0.5 block font-semibold">
                      {clinicalContext?.consultation?.patient?.phoneNumber || 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Home Address</span>
                    <span className="text-xs text-neutral-700 dark:text-neutral-300 mt-0.5 block font-semibold">
                      {clinicalContext?.consultation?.patient?.address || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Longitudinal History */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold text-neutral-450 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-4 w-4 text-indigo-500" />
                  <span>Longitudinal Medical History</span>
                </h4>
                
                {(() => {
                  const historyList = clinicalContext?.consultation?.patient?.consultations?.filter(
                    (c) => c.id !== consultationId
                  ) || [];

                  if (historyList.length === 0) {
                    return (
                      <p className="text-xs text-neutral-400 italic">
                        No previous consultations recorded for this patient.
                      </p>
                    );
                  }

                  return (
                    <div className="space-y-3 pt-2">
                      {historyList.map((prev) => {
                        const dateObj = new Date(prev.createdAt);
                        const formattedDate = dateObj.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        return (
                          <div
                            key={prev.id}
                            className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-150 bg-neutral-50/20 dark:border-neutral-800 dark:bg-neutral-900/20 hover:border-neutral-350 dark:hover:border-neutral-700 transition-all duration-200"
                          >
                            <div className="space-y-1">
                              <span className="text-[10px] font-semibold text-neutral-550 block">
                                {formattedDate}
                              </span>
                              <div className="flex items-center gap-2">
                                <StatusBadge status={prev.status} />
                                {prev.reviewStatus === 'REVIEWED' && (
                                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                                    Reviewed
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <button
                              onClick={() => {
                                navigate(`/doctor/consultation/${prev.id}`);
                                window.scrollTo(0, 0);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-350 dark:hover:bg-neutral-805 transition-colors"
                            >
                              <span>Open Review</span>
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Consultation Attachments */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-450 uppercase tracking-wider flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-indigo-500" />
                    <span>Consultation Attachments</span>
                  </h4>
                  
                  {!isReviewed && (
                    <div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadAttachmentMutation.isPending}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-350 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>{uploadAttachmentMutation.isPending ? 'Uploading...' : 'Upload File'}</span>
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUploadFile}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Attachments List */}
                {(!clinicalContext?.consultation?.attachments || clinicalContext.consultation.attachments.length === 0) ? (
                  <p className="text-xs text-neutral-400 italic">No attachments uploaded for this consultation.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {clinicalContext.consultation.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-neutral-150 bg-neutral-50/30 dark:border-neutral-800 dark:bg-neutral-900/30"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white truncate block" title={att.fileName}>
                            {att.fileName}
                          </span>
                          <span className="text-[10px] text-neutral-455 block font-medium">
                            {att.fileType || 'Unknown type'}
                          </span>
                        </div>
                        
                        <a
                          href={att.cloudinaryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 whitespace-nowrap shrink-0 animate-fadeIn"
                        >
                          <span>View File</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <ClinicalContextDetail
                clinicalContext={clinicalContext}
                consultation={clinicalContext?.consultation}
              />
            </div>
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
