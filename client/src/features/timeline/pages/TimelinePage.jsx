import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTimeline } from '../hooks/useTimeline.js';
import { useConsultationContext } from '../../clinical-context/hooks/useClinicalContext.js';
import ClinicalContextDetail from '../../../components/ClinicalContextDetail.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import PageContainer from '../../../components/PageContainer.jsx';
import EmptyState from '../../../components/EmptyState.jsx';
import ErrorState from '../../../components/ErrorState.jsx';
import StatusBadge from '../../../components/StatusBadge.jsx';
import { SkeletonCard } from '../../../components/Skeleton.jsx';
import Spinner from '../../../components/Spinner.jsx';
import { motion } from 'framer-motion';
import {
  Calendar,
  Play,
  MessageSquare,
  Lock,
  Brain,
  User,
  CheckCircle2,
  Eye,
  PlusCircle,
  Clock,
  Activity
} from 'lucide-react';

const TimelinePage = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('timeline');

  const { data, isLoading, isError, error, refetch } = useTimeline(consultationId);
  const contextQuery = useConsultationContext(consultationId);

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Consultation Timeline" onBack={() => navigate(-1)} />
        <div className="space-y-6 max-w-2xl mx-auto">
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-44" />
          <SkeletonCard className="h-32" />
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Consultation Timeline" onBack={() => navigate(-1)} />
        <ErrorState title="Failed to Load Timeline" message={error?.message} onRetry={refetch} />
      </PageContainer>
    );
  }

  const { summary = {}, events = [] } = data || {};

  const getEventMeta = (type) => {
    switch (type) {
      case 'SESSION_CREATED':
        return {
          title: 'Consultation Initialized',
          color: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
          icon: PlusCircle,
        };
      case 'SESSION_STARTED':
        return {
          title: 'Recording Started',
          color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400',
          icon: Play,
        };
      case 'TRANSCRIPT_CHUNK':
        return {
          title: 'Transcript Generated',
          color: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-450',
          icon: MessageSquare,
        };
      case 'SESSION_FINALIZED':
        return {
          title: 'Recording Finalized',
          color: 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950',
          icon: Lock,
        };
      case 'AI_ANALYSIS_COMPLETED':
        return {
          title: 'AI Summary Generated',
          color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400',
          icon: Brain,
        };
      case 'DOCTOR_NOTES_UPDATED':
        return {
          title: 'Doctor Appended Notes',
          color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400',
          icon: User,
        };
      case 'CLINICAL_REVIEW_COMPLETED':
        return {
          title: 'Review Finalized',
          color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400',
          icon: CheckCircle2,
        };
      case 'PATIENT_VIEWED_REVIEW':
        return {
          title: 'Review Viewed by Patient',
          color: 'bg-teal-50 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400',
          icon: Eye,
        };
      default:
        return {
          title: 'Consultation Milestone',
          color: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
          icon: Clock,
        };
    }
  };

  // Enhance timeline with a future Patient Viewed Review mock milestone if review is complete
  const list = [...events];
  const hasReviewComplete = events.some((e) => e.type === 'CLINICAL_REVIEW_COMPLETED');
  if (hasReviewComplete) {
    list.push({
      type: 'PATIENT_VIEWED_REVIEW',
      timestamp: new Date().toISOString(),
      data: {
        info: 'Viewed and acknowledged by Patient. Synced in active session.',
      },
    });
  }

  // Format Duration
  const formatDuration = (secs) => {
    if (!secs) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <PageContainer className="max-w-3xl">
      <PageHeader
        title="Session Timeline"
        breadcrumbs={[
          { name: 'Workspace', path: '/patient/dashboard' },
          { name: 'Health History', path: '/patient/clinical-context' },
          { name: 'Timeline' }
        ]}
        onBack={() => navigate(-1)}
      />

      {/* Summary Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
        <div className="space-y-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Session Status</span>
          <div className="pt-0.5">
            <StatusBadge status={summary?.status} />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Review Status</span>
          <div className="pt-0.5">
            <StatusBadge status={summary?.reviewStatus} />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Duration</span>
          <p className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
            {formatDuration(summary?.duration)}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Total Messages</span>
          <p className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
            {summary?.totalMessages || 0}
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-850 mt-6 max-w-2xl mx-auto">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 pb-3 text-center text-xs font-bold transition-all duration-200 border-b-2 ${
            activeTab === 'timeline'
              ? 'border-indigo-500 text-neutral-950 dark:text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-350'
          }`}
        >
          Intake Timeline
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-1 pb-3 text-center text-xs font-bold transition-all duration-200 border-b-2 ${
            activeTab === 'summary'
              ? 'border-indigo-500 text-neutral-950 dark:text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-350'
          }`}
        >
          Clinical Summary
        </button>
      </div>

      {activeTab === 'timeline' ? (
        list.length === 0 ? (
          <EmptyState
            title="Timeline is Empty"
            description="Timeline events will build dynamically once this consultation initiates."
            icon={Calendar}
          />
        ) : (
          <div className="relative mt-8 max-w-2xl mx-auto px-4">
            {/* Vertical Connecting Line */}
            <span
              className="absolute top-8 left-[31px] -ml-px h-[calc(100%-48px)] w-0.5 bg-neutral-200 dark:bg-neutral-800"
              aria-hidden="true"
            />

            <ul className="space-y-8">
              {list.map((event, idx) => {
                const meta = getEventMeta(event.type);
                const Icon = meta.icon;
                const formattedTime = new Date(event.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const formattedDate = new Date(event.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                  >
                    <div className="relative flex items-start gap-4">
                      
                      {/* SVG Connector Node Icon */}
                      <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white dark:border-neutral-850 dark:bg-neutral-900 shadow-3xs">
                        <div className={`flex h-6.5 w-6.5 items-center justify-center rounded-lg ${meta.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      {/* Card Content Details */}
                      <div className="flex-1 min-w-0 bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs dark:bg-neutral-900 dark:border-neutral-850">
                        
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-xs font-bold text-neutral-950 dark:text-white">
                            {meta.title}
                          </h4>
                          <span className="text-[10px] text-neutral-400 font-semibold select-none">
                            {formattedDate} at {formattedTime}
                          </span>
                        </div>

                        {/* Event Specific Card Nodes */}
                        {event.type === 'TRANSCRIPT_CHUNK' && (
                          <div className="mt-2 rounded-xl border border-neutral-100 bg-neutral-50/50 p-3 text-xs leading-relaxed text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-350">
                            <span className="font-bold uppercase tracking-wider text-[9px] text-indigo-500 block mb-1">
                              {event.data?.speaker}
                            </span>
                            <p>{event.data?.text}</p>
                          </div>
                        )}

                        {event.type === 'AI_ANALYSIS_COMPLETED' && (
                          <div className="mt-2.5 space-y-2 text-xs">
                            <p className="text-neutral-600 dark:text-neutral-350 leading-relaxed italic border-l-2 border-indigo-500 pl-3">
                              "{event.data?.summary}"
                            </p>
                            {event.data?.symptoms?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1.5">
                                {event.data.symptoms.map((sym, sIdx) => (
                                  <span key={sIdx} className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                    {sym}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {event.type === 'DOCTOR_NOTES_UPDATED' && (
                          <div className="mt-2.5 text-xs">
                            <span className="text-[9px] font-bold text-amber-500 block mb-1">NOTES APPENDED</span>
                            <p className="text-neutral-700 dark:text-neutral-350 whitespace-pre-line bg-amber-50/20 border border-amber-100/50 rounded-lg p-3">
                              {event.data?.notes}
                            </p>
                          </div>
                        )}

                        {event.type === 'PATIENT_VIEWED_REVIEW' && (
                          <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                            {event.data?.info}
                          </p>
                        )}
                        
                      </div>

                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        )
      ) : (
        <div className="mt-8 max-w-2xl mx-auto">
          {contextQuery.isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : contextQuery.isError || !contextQuery.data ? (
            <EmptyState
              title="Clinical Summary Pending"
              description="Your consultation evaluation summary is currently being synthesized by the AI system."
              icon={Activity}
            />
          ) : (
            <ClinicalContextDetail
              clinicalContext={contextQuery.data}
              consultation={timeline?.summary}
            />
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default TimelinePage;
