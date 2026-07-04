import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/PageContainer.jsx';
import ConfirmDialog from '../../../components/ConfirmDialog.jsx';
import { useToast } from '../../../contexts/ToastContext.jsx';
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  Settings,
  HelpCircle,
  Play,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Brain,
  MessageSquare
} from 'lucide-react';

const VoiceConsultationPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Consultation States
  const [connectionStatus, setConnectionStatus] = useState('Disconnected'); // Disconnected, Connecting, Connected, Processing
  const [isMuted, setIsMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState([]);
  
  // Device Selection States
  const [selectedMic, setSelectedMic] = useState('default-mic');
  const [selectedSpeaker, setSelectedSpeaker] = useState('default-speaker');
  
  // Dialog State
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);

  const timerRef = useRef(null);
  const transcriptEndRef = useRef(null);

  const mockDevices = {
    mics: [
      { id: 'default-mic', label: 'System Default Microphone' },
      { id: 'external-mic', label: 'Studio External USB Microphone' },
    ],
    speakers: [
      { id: 'default-speaker', label: 'System Default Speakers' },
      { id: 'headphones', label: 'Stereo Headset (Bluetooth)' },
    ],
  };

  // Timer Effect
  useEffect(() => {
    if (connectionStatus === 'Connected') {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [connectionStatus]);

  // Scroll transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Mock Dialogue flow when connected
  useEffect(() => {
    if (connectionStatus !== 'Connected') return;

    const dialogues = [
      { speaker: 'System', text: 'Secure audio stream established. Ambient listening active.', delay: 2000 },
      { speaker: 'Patient', text: 'Hello, Doctor. I have been feeling some mild shortness of breath and a dry cough over the past two days.', delay: 6000 },
      { speaker: 'Doctor', text: 'I see. Have you had any fever, chest tightness, or chills along with that dry cough?', delay: 12000 },
      { speaker: 'Patient', text: 'No fever or chills, but there is some tightness in my chest when I take deep breaths.', delay: 18000 },
      { speaker: 'Doctor', text: 'Understood. We will log this into the medical chart and run a basic respiratory assessment.', delay: 24000 },
    ];

    const timeouts = dialogues.map((dial) => {
      return setTimeout(() => {
        setTranscript((prev) => [...prev, { speaker: dial.speaker, text: dial.text, timestamp: new Date() }]);
      }, dial.delay);
    });

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [connectionStatus]);

  const handleStartSession = () => {
    setConnectionStatus('Connecting');
    setTranscript([]);
    setSeconds(0);
    
    setTimeout(() => {
      setConnectionStatus('Connected');
      addToast('Secure Voice Consultation Channel Activated.', 'success');
    }, 2000);
  };

  const handleLeaveSession = () => {
    setConfirmLeaveOpen(true);
  };

  const handleConfirmLeave = () => {
    setConfirmLeaveOpen(false);
    setConnectionStatus('Processing');
    
    addToast('Finalizing consultation. Locking transcript for AI synthesis...', 'info');

    // Simulate AI synthesis ending
    setTimeout(() => {
      setConnectionStatus('Disconnected');
      addToast('Clinical Context Summary successfully computed by Gemini.', 'success');
      navigate('/patient/clinical-context');
    }, 3000);
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'Connected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            Live Stream Connected
          </span>
        );
      case 'Connecting':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 animate-pulse">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Connecting Stream...
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-400">
            <Cpu className="h-3 w-3 animate-spin" />
            AI Processing Transcript...
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            Disconnected
          </span>
        );
    }
  };

  return (
    <PageContainer className="max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold uppercase tracking-wider">
            <span>Patient Workspace</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Ambient AI Consultation Room
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge()}
          {connectionStatus === 'Connected' && (
            <span className="text-sm font-mono font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 rounded-lg px-2.5 py-1">
              {formatTimer(seconds)}
            </span>
          )}
        </div>
      </div>

      {connectionStatus === 'Disconnected' ? (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-neutral-200 bg-white dark:border-neutral-850 dark:bg-neutral-900 rounded-2xl shadow-2xs min-h-[50vh] max-w-xl mx-auto">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
            <Mic className="h-7 w-7 animate-pulse" />
          </div>
          <h3 className="mt-5 text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            Biometric Audio Room Setup
          </h3>
          <p className="mt-2.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-xs">
            Start a secure session. Our ambient listening engine will capture, transcribe, and summarize symptom indicators for doctor review.
          </p>

          {/* Quick Configs Panel */}
          <div className="mt-6 w-full space-y-4 border-t border-neutral-100 pt-5 dark:border-neutral-800 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Microphone Input</label>
              <select
                value={selectedMic}
                onChange={(e) => setSelectedMic(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
              >
                {mockDevices.mics.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Speaker Output</label>
              <select
                value={selectedSpeaker}
                onChange={(e) => setSelectedSpeaker(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
              >
                {mockDevices.speakers.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleStartSession}
            className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors"
          >
            <Play className="h-4 w-4" />
            <span>Join Consultation Room</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch min-h-[55vh]">
          
          {/* Left Column: Waveform, Console, and Statuses (Col-span 2) */}
          <div className="lg:col-span-2 flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white dark:border-neutral-850 dark:bg-neutral-900 p-6 shadow-2xs">
            
            {/* Visualizer Wave */}
            <div className="flex flex-col items-center justify-center h-44 rounded-xl bg-neutral-50/50 dark:bg-neutral-950/50 border border-neutral-100 dark:border-neutral-800/80 relative overflow-hidden">
              {connectionStatus === 'Connected' ? (
                <div className="flex items-center gap-1">
                  {/* CSS Animated Audio Frequencies */}
                  {[...Array(12)].map((_, idx) => (
                    <span
                      key={idx}
                      className="w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400"
                      style={{
                        height: `${Math.max(10, Math.random() * 80)}px`,
                        animation: `pulse 1.2s ease-in-out infinite alternate`,
                        animationDelay: `${idx * 0.1}s`
                      }}
                    />
                  ))}
                  <span className="absolute bottom-3 text-[10px] text-neutral-400 font-bold uppercase tracking-wider animate-pulse">
                    Streaming audio chunks...
                  </span>
                </div>
              ) : (
                <div className="text-center text-xs text-neutral-400 space-y-2">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto text-neutral-400" />
                  <span>Connecting secure channel...</span>
                </div>
              )}
            </div>

            {/* Transcript Logs Console */}
            <div className="flex-1 mt-6 border border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-950/20 rounded-xl p-4 overflow-y-auto max-h-[30vh] min-h-[20vh] space-y-3.5 scrollbar-none">
              <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Live Audio Transcripts Console</span>
              </span>

              {transcript.length === 0 ? (
                <p className="text-xs text-neutral-400 dark:text-neutral-500 italic pt-6 text-center">
                  Consultation transcript chunks will render dynamically as speakers talk...
                </p>
              ) : (
                transcript.map((msg, idx) => {
                  const isPatient = msg.speaker === 'Patient';
                  const isSystem = msg.speaker === 'System';
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[85%] ${
                        isSystem 
                          ? 'mx-auto text-center' 
                          : isPatient 
                            ? 'mr-auto items-start' 
                            : 'ml-auto items-end'
                      }`}
                    >
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
                        {msg.speaker}
                      </span>
                      <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        isSystem
                          ? 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 font-semibold'
                          : isPatient
                            ? 'bg-indigo-50 border border-indigo-100/50 text-indigo-950 dark:bg-indigo-950/20 dark:border-indigo-950/40 dark:text-indigo-300'
                            : 'bg-neutral-900 border border-neutral-950 text-white dark:bg-white dark:border-white dark:text-neutral-950'
                      }`}>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={transcriptEndRef} />
            </div>

          </div>

          {/* Right Column: Connection Details, Mute Controls & Leave Trigger */}
          <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white dark:border-neutral-850 dark:bg-neutral-900 p-6 shadow-2xs">
            
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <Settings className="h-5 w-5 text-neutral-400" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Active Session Details</h3>
              </div>

              {/* Progress Tracker bar */}
              <div className="space-y-2">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Session Progress</span>
                <div className="h-1.5 w-full bg-neutral-150 rounded-full dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300 animate-pulse"
                    style={{ width: `${Math.min(100, (seconds / 60) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Mute and microphone toggle controls */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-2">Microphone</span>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-full flex items-center justify-center gap-2.5 rounded-xl py-3 border text-xs font-bold transition-all duration-200 ${
                    isMuted
                      ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100/50 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-350 dark:hover:bg-neutral-850'
                  }`}
                >
                  {isMuted ? (
                    <>
                      <MicOff className="h-4.5 w-4.5" />
                      <span>Microphone Muted</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-4.5 w-4.5" />
                      <span>Microphone Unmuted</span>
                    </>
                  )}
                </button>
              </div>

              {/* Config display values */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2 dark:border-neutral-800">
                  <span className="text-neutral-450">Input Device:</span>
                  <span className="font-bold truncate max-w-[130px]" title="Default Mic">System Default</span>
                </div>
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2 dark:border-neutral-800">
                  <span className="text-neutral-450">Output Speaker:</span>
                  <span className="font-bold truncate max-w-[130px]" title="Default Speaker">System Speaker</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLeaveSession}
              disabled={connectionStatus === 'Processing'}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 py-3 text-xs font-bold text-white transition-colors disabled:opacity-50"
            >
              <PhoneOff className="h-4.5 w-4.5" />
              <span>Leave Consultation Room</span>
            </button>

          </div>

        </div>
      )}

      {/* Leave session confirmation dialog */}
      <ConfirmDialog
        isOpen={confirmLeaveOpen}
        title="Leave Consultation Room"
        message="Are you sure you want to end this recording? This will finalize the session, lock the transcript, and initiate the Gemini AI summary synthesis."
        confirmLabel="Finalize & Leave"
        cancelLabel="Keep Recording"
        onConfirm={handleConfirmLeave}
        onCancel={() => setConfirmLeaveOpen(false)}
      />
    </PageContainer>
  );
};

export default VoiceConsultationPage;
