import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LiveKitRoom } from '@livekit/components-react';
import PageContainer from '../../../components/PageContainer.jsx';
import ConfirmDialog from '../../../components/ConfirmDialog.jsx';
import { useToast } from '../../../contexts/ToastContext.jsx';
import { Mic, Play, RefreshCw } from 'lucide-react';

import { initializeConsultation, fetchLiveKitToken, finalizeConsultation } from '../api/livekitApi.js';
import { useTranscriptAccumulator } from '../hooks/useTranscriptAccumulator.js';
import LiveKitConnectionState from '../components/LiveKitConnectionState.jsx';
import LiveKitControls from '../components/LiveKitControls.jsx';
import LiveKitTranscript from '../components/LiveKitTranscript.jsx';

/**
 * Inner room component that accesses the LiveKit context hooks.
 */
const ConsultationRoomContent = ({ consultationId, onLeave }) => {
  const { transcript, persistTranscript } = useTranscriptAccumulator();
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const { addToast } = useToast();

  const handleConfirmLeave = async () => {
    setConfirmLeave(false);
    setIsEnding(true);
    addToast('Finalizing consultation. Saving transcript...', 'info');
    try {
      await persistTranscript(consultationId);
      await finalizeConsultation(consultationId);
      addToast('Intake completed and saved successfully.', 'success');
      onLeave();
    } catch (err) {
      console.error(err);
      addToast('Failed to complete finalization. Returning to dashboard.', 'error');
      onLeave();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch min-h-[55vh]">
      <div className="lg:col-span-2 flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white dark:border-neutral-855 dark:bg-neutral-900 p-6 shadow-2xs">
        <div className="flex flex-col items-center justify-center h-44 rounded-xl bg-neutral-50/50 dark:bg-neutral-950/50 border border-neutral-100 dark:border-neutral-800/80 relative overflow-hidden">
          <div className="flex items-center gap-1.5">
            {[...Array(6)].map((_, idx) => (
              <span
                key={idx}
                className="w-1.5 h-8 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse"
                style={{ animationDelay: `${idx * 0.15}s` }}
              />
            ))}
          </div>
          <span className="absolute bottom-3 text-[10px] text-neutral-450 font-bold uppercase tracking-wider">
            Streaming Realtime Audio
          </span>
        </div>
        <LiveKitTranscript transcript={transcript} />
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white dark:border-neutral-855 dark:bg-neutral-900 p-6 shadow-2xs">
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white border-b border-neutral-100 pb-4 dark:border-neutral-800">
            Active Session
          </h3>
          <LiveKitControls onLeave={() => setConfirmLeave(true)} disabled={isEnding} />
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmLeave}
        title="Leave Consultation Room"
        message="Are you sure you want to end this recording? This will finalize the session and lock the transcript."
        confirmLabel="Finalize & Leave"
        cancelLabel="Keep Recording"
        onConfirm={handleConfirmLeave}
        onCancel={() => setConfirmLeave(false)}
      />
    </div>
  );
};

/**
 * Main Consultation Page orchestrating connection configurations.
 */
const VoiceConsultationPage = () => {
  const { consultationId: urlId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [consultationId, setConsultationId] = useState(urlId || null);
  const [tokenData, setTokenData] = useState(null);
  const [status, setStatus] = useState('Disconnected'); // Disconnected, Connecting, Connected

  const handleStartSession = async () => {
    setStatus('Connecting');
    try {
      let activeId = consultationId;
      if (!activeId) {
        const initResult = await initializeConsultation();
        activeId = initResult.consultation.id;
        setConsultationId(activeId);
        navigate(`/patient/consultation/${activeId}`, { replace: true });
      }
      const data = await fetchLiveKitToken(activeId);
      setTokenData(data);
      setStatus('Connected');
      addToast('Secure consultation channel activated.', 'success');
    } catch (err) {
      console.error(err);
      setStatus('Disconnected');
      addToast(err.response?.data?.error || 'Failed to initialize consultation session.', 'error');
    }
  };

  const handleLeave = () => {
    setTokenData(null);
    setStatus('Disconnected');
    navigate('/patient/dashboard');
  };

  return (
    <PageContainer className="max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div>
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Patient Workspace</span>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            AI Voice Consultation Room
          </h1>
        </div>
        {status === 'Connected' && <LiveKitConnectionState />}
      </div>

      <div className="mt-8">
        {status !== 'Connected' ? (
          <div className="flex flex-col items-center justify-center text-center p-12 border border-neutral-200 bg-white dark:border-neutral-855 dark:bg-neutral-900 rounded-2xl shadow-2xs min-h-[45vh] max-w-xl mx-auto">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
              {status === 'Connecting' ? <RefreshCw className="h-7 w-7 animate-spin" /> : <Mic className="h-7 w-7" />}
            </div>
            <h3 className="mt-5 text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              {status === 'Connecting' ? 'Preparing Audio Room...' : 'Biometric Audio Room Setup'}
            </h3>
            <p className="mt-2.5 text-xs text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed">
              Start a secure session. Our listening engine will capture and transcribe symptom indicators for doctor review.
            </p>
            <button
              type="button"
              onClick={handleStartSession}
              disabled={status === 'Connecting'}
              className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              <span>{status === 'Connecting' ? 'Connecting Room...' : 'Join Consultation Room'}</span>
            </button>
          </div>
        ) : (
          <LiveKitRoom
            token={tokenData?.token}
            serverUrl={tokenData?.serverUrl}
            connect={true}
            audio={true}
            video={false}
            onDisconnected={handleLeave}
            className="flex-1"
          >
            <ConsultationRoomContent consultationId={consultationId} onLeave={handleLeave} />
          </LiveKitRoom>
        )}
      </div>
    </PageContainer>
  );
};

export default VoiceConsultationPage;
