import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/PageContainer.jsx';
import ConfirmDialog from '../../../components/ConfirmDialog.jsx';
import { useToast } from '../../../contexts/ToastContext.jsx';
import { RefreshCw, Play, Brain, CheckCircle2 } from 'lucide-react';

import {
  createConsultation,
  getConsultationDetail,
  sendPatientMessage,
  uploadAttachment,
  finalizeConsultation,
} from '../api/consultationApi.js';

import AIConsultationWindow from '../components/AIConsultationWindow.jsx';
import AIConsultationInput from '../components/AIConsultationInput.jsx';
import SessionAttachments from '../components/SessionAttachments.jsx';

/**
 * AIConsultationPage — the primary patient-facing AI Clinical Intake workspace.
 * Manages session lifecycle: start → converse → upload → finalize.
 */
const AIConsultationPage = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [activeId, setActiveId] = useState(consultationId || null);
  const [messages, setMessages] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [status, setStatus] = useState('Disconnected');
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [confirmFinalize, setConfirmFinalize] = useState(false);

  useEffect(() => {
    if (activeId) loadHistory(activeId);
  }, [activeId]);

  const loadHistory = async (id) => {
    setStatus('Loading');
    try {
      const data = await getConsultationDetail(id);
      setMessages(data.consultation.messages || []);
      setAttachments(data.consultation.attachments || []);
      setStatus('Active');
    } catch (err) {
      console.error('[AIConsultationPage] loadHistory:', err);
      addToast('Failed to load consultation history.', 'error');
      setStatus('Disconnected');
    }
  };

  const handleStartSession = async () => {
    setStatus('Loading');
    try {
      const data = await createConsultation();
      const newId = data.consultation.id;
      setActiveId(newId);
      navigate(`/patient/consultation/${newId}`, { replace: true });
    } catch (err) {
      console.error('[AIConsultationPage] handleStartSession:', err);
      addToast('Failed to start AI consultation session.', 'error');
      setStatus('Disconnected');
    }
  };

  const handleSendMessage = async (text) => {
    // Optimistic UI: show patient message immediately
    const tempMsg = { id: `temp-${Date.now()}`, speaker: 'PATIENT', text, createdAt: new Date() };
    setMessages((prev) => [...prev, tempMsg]);
    setIsTyping(true);

    try {
      const data = await sendPatientMessage(activeId, text);
      // Reconcile: replace temp with confirmed messages from backend
      setMessages((prev) =>
        prev.filter((m) => m.id !== tempMsg.id).concat([data.patientMessage, data.aiMessage])
      );
    } catch (err) {
      console.error('[AIConsultationPage] handleSendMessage:', err);
      addToast('Failed to send message. Please try again.', 'error');
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    addToast(`Uploading ${file.name}...`, 'info');
    try {
      const data = await uploadAttachment(activeId, file);
      setAttachments((prev) => [...prev, data.attachment]);
      addToast(`${file.name} uploaded successfully.`, 'success');
      setMessages((prev) => [
        ...prev,
        { id: `sys-${Date.now()}`, speaker: 'SYSTEM', text: `📎 Document attached: ${file.name}`, createdAt: new Date() },
      ]);
    } catch (err) {
      console.error('[AIConsultationPage] handleFileUpload:', err);
      addToast('File upload failed. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinalize = async () => {
    setConfirmFinalize(false);
    setStatus('Processing');
    addToast('Finalizing consultation and submitting for AI analysis...', 'info');
    try {
      await finalizeConsultation(activeId);
      addToast('Consultation finalized. Clinical analysis is being generated.', 'success');
      navigate('/patient/dashboard');
    } catch (err) {
      console.error('[AIConsultationPage] handleFinalize:', err);
      addToast('Failed to finalize consultation.', 'error');
      setStatus('Active');
    }
  };

  const getStatusBadge = () => {
    if (status === 'Active') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          Active AI Consultation
        </span>
      );
    }
    if (status === 'Processing') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 animate-pulse">
          <RefreshCw className="h-3 w-3 animate-spin" />
          Finalizing...
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
        Offline
      </span>
    );
  };

  return (
    <PageContainer className="max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div>
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
            Patient Intake Workspace
          </span>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            AI Clinical Intake
          </h1>
        </div>
        {getStatusBadge()}
      </div>

      {/* Main Content */}
      <div className="mt-8">
        {status === 'Disconnected' ? (
          /* Start Screen */
          <div className="flex flex-col items-center justify-center text-center p-12 border border-neutral-200 bg-white dark:border-neutral-855 dark:bg-neutral-900 rounded-2xl shadow-2xs min-h-[45vh] max-w-xl mx-auto">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
              <Brain className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Begin Your Intake Session
            </h3>
            <p className="mt-2.5 text-xs text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed">
              Start a secure AI-assisted conversation to describe your symptoms, medications, and medical history before your doctor consultation.
            </p>
            <button
              id="start-ai-consultation-btn"
              onClick={handleStartSession}
              className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>Start AI Consultation</span>
            </button>
          </div>
        ) : status === 'Loading' ? (
          /* Loading State */
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
            <RefreshCw className="h-8 w-8 animate-spin text-neutral-500" />
            <p className="text-sm font-medium text-neutral-500">Loading consultation workspace...</p>
          </div>
        ) : (
          /* Active Consultation Workspace */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Consultation Area */}
            <div className="lg:col-span-2 flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white dark:border-neutral-855 dark:bg-neutral-900 shadow-2xs">
              <AIConsultationWindow messages={messages} isTyping={isTyping} />
              <AIConsultationInput
                onSend={handleSendMessage}
                onFileSelect={handleFileUpload}
                isUploadingFile={isUploading}
                disabled={status === 'Processing'}
              />
            </div>

            {/* Sidebar */}
            <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white dark:border-neutral-855 dark:bg-neutral-900 p-6 shadow-2xs">
              <SessionAttachments attachments={attachments} />
              <button
                id="finish-consultation-btn"
                onClick={() => setConfirmFinalize(true)}
                disabled={status === 'Processing'}
                className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-rose-650 hover:bg-rose-700 py-3 text-xs font-bold text-white transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="h-4.5 w-4.5" />
                <span>Finish AI Consultation</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Finalize Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmFinalize}
        title="Finish AI Consultation"
        message="Are you sure you have described all symptoms and are ready to finalize? This will lock the conversation and start the AI clinical context generation for your doctor."
        confirmLabel="Finalize & Submit"
        cancelLabel="Continue Intake"
        onConfirm={handleFinalize}
        onCancel={() => setConfirmFinalize(false)}
      />
    </PageContainer>
  );
};

export default AIConsultationPage;
