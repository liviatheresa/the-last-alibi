import React, { useState, useEffect, useRef } from 'react';
import { ScreenId, CaseData, Suspect, Team, ChatMessage, Evidence } from '../types';
import { askSuspectAI } from '../services/geminiService';
import { StorageService } from '../services/storageService';
import { sound } from '../services/soundEffects';
import { speech, VoicePersona } from '../services/speechService';
import { TextAudioPlayer } from './TextAudioPlayer';
import {
  MessageSquareWarning,
  Send,
  Archive,
  RefreshCw,
  Eye,
  Volume2,
  VolumeX,
  AlertOctagon,
} from 'lucide-react';

interface Props {
  caseData: CaseData;
  team: Team;
  selectedSuspectId: string;
  onSelectSuspect: (id: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

const TACTICS = [
  { id: 'press_alibi', label: 'Press on Alibi', desc: 'Demand minute-by-minute timeline verification' },
  { id: 'present_evidence', label: 'Confront with Evidence', desc: 'Push recovered evidence across the desk' },
  { id: 'motive_probe', label: 'Probe Motive', desc: 'Interrogate financial or career rivalry' },
  { id: 'good_cop', label: 'Sympathetic Approach', desc: 'Lower psychological defense with understanding' },
  { id: 'bad_cop', label: 'High Pressure', desc: 'Rigorous rapid-fire cross examination' },
];

export const InterrogationRoom: React.FC<Props> = ({
  caseData,
  team,
  selectedSuspectId,
  onSelectSuspect,
  onNavigate,
}) => {
  const currentSuspect =
    caseData.suspects.find((s) => s.id === selectedSuspectId) || caseData.suspects[0];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedTactic, setSelectedTactic] = useState('press_alibi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stress, setStress] = useState(25);
  const [lastReaction, setLastReaction] = useState<string | null>(null);
  const [showEvidenceDrawer, setShowEvidenceDrawer] = useState(false);
  const [selectedEvidenceToPresent, setSelectedEvidenceToPresent] = useState<Evidence | null>(null);
  const [scratchpadNote, setScratchpadNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [activeContradiction, setActiveContradiction] = useState<{ suspectName: string; text: string } | null>(null);
  const [pinnedSuccessNotice, setPinnedSuccessNotice] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [lastFailedEvidence, setLastFailedEvidence] = useState<Evidence | null>(null);
  const [thinkingIndex, setThinkingIndex] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSubmitting) {
      setThinkingIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setThinkingIndex((prev) => prev + 1);
    }, 2200);
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const thinkingCues = React.useMemo(() => {
    const name = currentSuspect.name;
    const hasEvidence = Boolean(selectedEvidenceToPresent);

    if (hasEvidence) {
      return [
        `${name} stares at the presented evidence, visibly caught off guard...`,
        `${name} hesitates, eyes darting between your notes and the table...`,
        `${name} takes a sharp, uneven breath, calculating their next words...`,
        `${name} swallows hard, struggling to formulate an explanation...`,
      ];
    }

    if (stress >= 75) {
      return [
        `${name} swallows hard, feeling the weight of the accusation...`,
        `${name} shifts anxiously in the chair, eyes darting toward the door...`,
        `${name} grips the edge of the metal table, struggling for composure...`,
        `${name} pauses with tense, strained hesitation...`,
      ];
    }

    if (stress >= 45) {
      return [
        `${name} pauses, carefully weighing every single word...`,
        `${name} folds their hands tightly, measuring their response...`,
        `${name} takes a slow, guarded breath under your scrutiny...`,
        `${name} studies your expression, considering how much to disclose...`,
      ];
    }

    return [
      `${name} pauses, considering their response...`,
      `${name} holds your gaze calmly across the table...`,
      `${name} takes a measured breath, formulating an answer...`,
      `${name} taps a finger slowly, listening to the ambient rain...`,
    ];
  }, [currentSuspect.name, stress, selectedEvidenceToPresent]);

  const activeThinkingCue = thinkingCues[thinkingIndex % thinkingCues.length];

  useEffect(() => {
    const history = StorageService.getChatHistory(team.id, caseData.id, currentSuspect.id);
    const storedStress = StorageService.getSuspectStress(team.id, caseData.id, currentSuspect.id);
    setMessages(history);
    setStress(storedStress);
    setLastReaction(null);
    setApiError(null);
    speech.stop();
  }, [team.id, caseData.id, currentSuspect.id]);

  useEffect(() => {
    const unsub = speech.subscribe((currId) => {
      setSpeakingMsgId(currId);
    });
    return () => {
      unsub();
      speech.stop();
    };
  }, []);

  const handleToggleVoice = (msgId: string, text: string) => {
    if (!speech.isSupported()) return;
    sound.playTapeClick();
    const persona: VoicePersona =
      currentSuspect.name.includes('Gray') ||
      currentSuspect.name.includes('Vance') ||
      currentSuspect.name.includes('Bennett')
        ? 'female_suspect'
        : 'male_suspect';

    speech.toggle(msgId, text, {
      voiceType: persona,
    });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSubmitting]);

  const handleSendMessage = async (customMessage?: string, evidenceToPresent?: Evidence) => {
    const textToSend = customMessage !== undefined ? customMessage : inputText;
    const ev = evidenceToPresent || selectedEvidenceToPresent;

    if (!textToSend.trim() && !ev) return;

    sound.playTypewriter();
    const detectiveMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'detective',
      text: textToSend || `Look at this recovered evidence: [${ev?.name}] - Explain how this ties to your statement.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tactic: selectedTactic,
      evidencePresented: ev?.name,
    };

    const newHistory = [...messages, detectiveMsg];
    setMessages(newHistory);
    setInputText('');
    setSelectedEvidenceToPresent(null);
    setApiError(null);
    setLastFailedMessage(null);
    setLastFailedEvidence(null);
    setIsSubmitting(true);

    try {
      const result = await askSuspectAI({
        caseId: caseData.id,
        suspectId: currentSuspect.id,
        suspectName: currentSuspect.name,
        suspectRole: currentSuspect.role,
        tactic: selectedTactic,
        message: detectiveMsg.text,
        presentedEvidence: ev || undefined,
        currentStress: stress,
        history: newHistory,
      });

      const newStress = Math.min(100, Math.max(5, stress + result.stressDelta));
      setStress(newStress);
      StorageService.setSuspectStress(team.id, caseData.id, currentSuspect.id, newStress);
      setLastReaction(result.reactionNote);

      if (result.stressDelta > 10) {
        sound.playHeartbeat();
      }

      if (result.contradictionSlip) {
        sound.playDramaticChime();
        setActiveContradiction({
          suspectName: currentSuspect.name,
          text: result.reply,
        });
      }

      const suspectMsg: ChatMessage = {
        id: `msg_suspect_${Date.now()}`,
        sender: 'suspect',
        text: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactionNote: result.reactionNote,
        stressDelta: result.stressDelta,
      };

      const finalHistory = [...newHistory, suspectMsg];
      setMessages(finalHistory);
      StorageService.saveChatHistory(team.id, caseData.id, currentSuspect.id, finalHistory);
    } catch (err: any) {
      console.error('[InterrogationRoom] Interrogation error:', err);
      sound.playTapeClick();
      setApiError(err?.message || 'Suspect AI connection failure. Please check your connection and retry.');
      setLastFailedMessage(textToSend);
      setLastFailedEvidence(ev || null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetryLastMessage = () => {
    if (lastFailedMessage || lastFailedEvidence) {
      const msg = lastFailedMessage || undefined;
      const ev = lastFailedEvidence || undefined;
      handleSendMessage(msg, ev);
    }
  };

  const handlePinContradiction = () => {
    if (!activeContradiction) return;
    sound.playTypewriter();
    const existing = StorageService.getNotes(team.id, caseData.id);
    const newNote = {
      id: `note_contra_${Date.now()}`,
      author: `${team.leadDetective} (Contradiction)`,
      content: `[BROKEN ALIBI] ${activeContradiction.suspectName}: "${activeContradiction.text}"`,
      timestamp: 'Just now',
      category: 'inconsistency' as const,
      linkedSuspectId: currentSuspect.id,
      isPinned: true,
    };
    StorageService.saveNotes(team.id, caseData.id, [newNote, ...existing]);
    setPinnedSuccessNotice(true);
    setTimeout(() => {
      setPinnedSuccessNotice(false);
      setActiveContradiction(null);
    }, 2500);
  };

  const handleResetInterview = () => {
    sound.playTapeClick();
    if (window.confirm(`Clear interview tape for ${currentSuspect.name}?`)) {
      setMessages([]);
      setStress(20);
      StorageService.saveChatHistory(team.id, caseData.id, currentSuspect.id, []);
      StorageService.setSuspectStress(team.id, caseData.id, currentSuspect.id, 20);
      setLastReaction(null);
    }
  };

  const handleSaveScratchNote = () => {
    if (!scratchpadNote.trim()) return;
    sound.playTypewriter();
    const existing = StorageService.getNotes(team.id, caseData.id);
    const newNote = {
      id: `note_${Date.now()}`,
      author: `${team.leadDetective} (Chamber Note)`,
      content: `[${currentSuspect.name}] ${scratchpadNote}`,
      timestamp: 'Just now',
      category: 'lead' as const,
      linkedSuspectId: currentSuspect.id,
    };
    StorageService.saveNotes(team.id, caseData.id, [newNote, ...existing]);
    setScratchpadNote('');
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const suggestedQuestions: string[] = [
    `Account for your whereabouts between 11:00 PM and 11:45 PM.`,
    `We have forensic anomalies matching your department's access keys. Explain that.`,
    `What was the subject of your dispute with the victim earlier that day?`,
    `Security telemetry logged your presence near the scene. How do you respond?`,
  ];

  let stressLabel = 'Composed';
  let stressColorClass = 'text-[#A9A398]';
  let stressBarClass = 'bg-[#B49A67]';
  if (stress > 35 && stress <= 65) {
    stressLabel = 'Guarded & Uneasy';
    stressColorClass = 'text-[#B49A67] font-semibold';
    stressBarClass = 'bg-[#B49A67]';
  } else if (stress > 65 && stress <= 85) {
    stressLabel = 'Agitated & Defensive';
    stressColorClass = 'text-[#702D35] font-semibold';
    stressBarClass = 'bg-[#702D35]';
  } else if (stress > 85) {
    stressLabel = 'Cracking Under Pressure';
    stressColorClass = 'text-[#702D35] font-bold';
    stressBarClass = 'bg-[#702D35]';
  }

  return (
    <div className="min-h-screen bg-[#171717] text-[#E8DFCC] p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Control Bar */}
        <div className="bg-[#22201D] border border-[#332F2A] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-widest">
              CHAMBER B · AUDIO TRANSCRIPTION ACTIVE
            </div>
            <div className="flex flex-wrap items-center gap-2.5 mt-0.5">
              <h1 className="font-editorial text-2xl font-bold text-[#E8DFCC]">
                Formal Cross-Examination: {currentSuspect.name}
              </h1>
              <TextAudioPlayer
                id={`interrogation_suspect_intro_${currentSuspect.id}`}
                text={`Interrogation subject: ${currentSuspect.name}. Role: ${currentSuspect.role}. Department: ${currentSuspect.department}. Initial deposition: ${currentSuspect.claimedAlibi}`}
                persona={
                  currentSuspect.name.includes('Gray') ||
                  currentSuspect.name.includes('Vance') ||
                  currentSuspect.name.includes('Bennett')
                    ? 'female_suspect'
                    : 'male_suspect'
                }
                label="Listen to Alibi"
                playingLabel="Speaking..."
                variant="pill"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono-archive text-[11px] text-[#A9A398] hidden md:inline">Witness:</span>
            <div className="flex items-center gap-1 overflow-x-auto">
              {caseData.suspects.map((s) => {
                const isCurrent = s.id === currentSuspect.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      sound.playTapeClick();
                      onSelectSuspect(s.id);
                    }}
                    className={`px-3 py-1 text-xs font-mono-archive cursor-pointer transition-colors ${
                      isCurrent
                        ? 'bg-[#B49A67] text-[#171717] font-bold'
                        : 'bg-[#171717] text-[#A9A398] hover:text-[#E8DFCC] border border-[#332F2A]'
                    }`}
                  >
                    {s.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleResetInterview}
              className="p-1.5 border border-[#332F2A] hover:border-[#702D35] bg-[#171717] text-[#A9A398] hover:text-[#702D35] transition-colors cursor-pointer"
              title="Reset Witness Tape"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Interrogation Chamber Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Column: Witness Spotlight & Polygraph Stress Index */}
          <div className="lg:col-span-1 space-y-4">
            <div className="manila-card p-4 space-y-3">
              <div className="relative">
                <img
                  src={currentSuspect.avatar}
                  alt={currentSuspect.name}
                  className="w-full h-48 object-cover border border-[#3A3630] filter contrast-105"
                />
                <div className="absolute top-2 left-2 bg-[#171717]/90 px-2 py-0.5 font-mono-archive text-[9px] text-[#A9A398] border border-[#332F2A]">
                  RECORDING 01
                </div>
              </div>

              <div>
                <h2 className="font-editorial text-xl font-bold text-[#E8DFCC]">
                  {currentSuspect.name}
                </h2>
                <div className="font-mono-archive text-[11px] text-[#B49A67]">
                  {currentSuspect.role}
                </div>
                <div className="font-mono-archive text-[10px] text-[#A9A398]">
                  {currentSuspect.department} · Age: {currentSuspect.age}
                </div>
              </div>

              {/* Stress / Tension Index */}
              <div className="pt-3 border-t border-[#2E2B26] font-mono-archive text-xs">
                <div className="flex items-center justify-between mb-1 text-[11px]">
                  <span className="text-[#A9A398]">Vocal Stress Index:</span>
                  <span className={stressColorClass}>{stress}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#171717] border border-[#2E2B26] overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${stressBarClass}`}
                    style={{ width: `${stress}%` }}
                  />
                </div>
                <div className="mt-1 text-[10px] text-center text-[#A9A398]">
                  Demeanor: <span className={stressColorClass}>{stressLabel}</span>
                </div>
              </div>

              {/* Behavioral Tell Note */}
              {lastReaction && (
                <div className="bg-[#171717] p-2.5 border border-[#332F2A] font-mono-archive text-[11px] text-[#E8DFCC] space-y-0.5">
                  <span className="text-[#B49A67] block text-[9px] uppercase">// BEHAVIORAL TELL:</span>
                  <p className="font-sans text-xs italic text-[#A9A398]">{lastReaction}</p>
                </div>
              )}
            </div>

            {/* Quick Whereabouts Recap */}
            <div className="manila-card p-4 space-y-2 text-xs">
              <span className="font-mono-archive text-[10px] text-[#A9A398] uppercase block">
                Official Alibi Statement:
              </span>
              <p className="font-editorial text-xs text-[#E8DFCC] italic">
                "{currentSuspect.claimedAlibi}"
              </p>
              <div className="pt-2 border-t border-[#2E2B26]">
                <span className="font-mono-archive text-[10px] text-[#702D35] uppercase block font-semibold">
                  Alibi Flaw:
                </span>
                <p className="font-mono-archive text-[11px] text-[#A9A398] mt-0.5">
                  {currentSuspect.flaw}
                </p>
              </div>
            </div>

            {/* Detective Scratchpad */}
            <div className="manila-card p-4 space-y-2">
              <div className="flex items-center justify-between font-mono-archive text-xs">
                <span className="text-[#B49A67] font-semibold">CHAMBER FIELD NOTE</span>
                {noteSaved && <span className="text-[#B49A67] text-[10px]">Pinned!</span>}
              </div>
              <textarea
                value={scratchpadNote}
                onChange={(e) => setScratchpadNote(e.target.value)}
                placeholder="Jot down witness contradictions..."
                rows={2}
                className="w-full bg-[#171717] border border-[#2E2B26] focus:border-[#B49A67] p-2 text-xs text-[#E8DFCC] font-mono-archive outline-none resize-none"
              />
              <button
                onClick={handleSaveScratchNote}
                disabled={!scratchpadNote.trim()}
                className="w-full btn-dossier py-1 text-xs font-mono-archive disabled:opacity-40 cursor-pointer"
              >
                Pin to Blackboard
              </button>
            </div>
          </div>

          {/* Center 3 Columns: Stenographer Log & Tactical Desk */}
          <div className="lg:col-span-3 manila-card flex flex-col justify-between h-[680px] overflow-hidden">
            {/* Inquiry Tactics Bar */}
            <div className="bg-[#171717] px-4 py-2 border-b border-[#2E2B26] flex items-center justify-between overflow-x-auto gap-2 scrollbar-none">
              <span className="font-mono-archive text-[10px] text-[#A9A398] uppercase shrink-0">
                TACTIC:
              </span>
              <div className="flex items-center gap-1.5 font-mono-archive text-xs">
                {TACTICS.map((tactic) => (
                  <button
                    key={tactic.id}
                    onClick={() => {
                      sound.playTypewriter();
                      setSelectedTactic(tactic.id);
                    }}
                    className={`px-2.5 py-1 transition-colors whitespace-nowrap cursor-pointer text-xs ${
                      selectedTactic === tactic.id
                        ? 'bg-[#B49A67] text-[#171717] font-bold'
                        : 'bg-[#22201D] text-[#A9A398] hover:text-[#E8DFCC] border border-[#332F2A]'
                    }`}
                  >
                    {tactic.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stenographer Log Transcript */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#A9A398]">
                  <span className="font-mono-archive text-xs text-[#B49A67] uppercase tracking-widest mb-1">
                    STENOGRAPHER PROTOCOL OPENED
                  </span>
                  <h3 className="font-editorial text-2xl text-[#E8DFCC] font-bold">
                    The Witness Awaits Your Inquest
                  </h3>
                  <p className="font-editorial text-sm italic text-[#A9A398] max-w-md mt-1">
                    Select an inquiry tactic above, formulate your question, or present forensic evidence across the table.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isDetective = msg.sender === 'detective';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isDetective ? 'items-end' : 'items-start'} max-w-3xl ${
                        isDetective ? 'ml-auto' : 'mr-auto'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1 font-mono-archive text-[10px] text-[#A9A398]">
                        <span className="font-semibold text-[#B49A67]">
                          {isDetective ? `${team.leadDetective} (Inquest)` : currentSuspect.name}
                        </span>
                        <span>·</span>
                        <span>{msg.timestamp}</span>
                        {msg.tactic && (
                          <span className="text-[#A9A398]">[{msg.tactic.replace('_', ' ')}]</span>
                        )}
                        {msg.evidencePresented && (
                          <span className="text-[#702D35] font-semibold">[{msg.evidencePresented}]</span>
                        )}
                      </div>

                      <div
                        className={`p-3.5 text-xs sm:text-sm leading-relaxed border ${
                          isDetective
                            ? 'bg-[#2A2723] border-[#3D3933] text-[#E8DFCC]'
                            : 'bg-[#171717] border-[#2E2B26] text-[#E8DFCC] font-editorial text-base italic'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Suspect Speech Deposition Voice Player & Behavioral Tells */}
                      {!isDetective ? (
                        <div className="mt-1.5 flex flex-wrap items-center justify-between w-full gap-2">
                          {msg.reactionNote ? (
                            <div className="font-mono-archive text-[10px] text-[#A9A398] italic flex items-center gap-1">
                              <Eye className="w-3 h-3 text-[#B49A67]" />
                              <span>Behavioral Tell: {msg.reactionNote}</span>
                            </div>
                          ) : (
                            <div />
                          )}

                          <button
                            onClick={() => handleToggleVoice(msg.id, msg.text)}
                            className={`px-2 py-0.5 border text-[10px] font-mono-archive flex items-center gap-1.5 cursor-pointer transition-colors ${
                              speakingMsgId === msg.id
                                ? 'bg-[#702D35] text-[#E8DFCC] border-[#702D35]'
                                : 'bg-[#22201D] hover:bg-[#2A2723] text-[#B49A67] border-[#3A3630]'
                            }`}
                            title={
                              speakingMsgId === msg.id
                                ? 'Silence Deposition Voice'
                                : 'Listen to Spoken Witness Deposition'
                            }
                          >
                            {speakingMsgId === msg.id ? (
                              <>
                                <VolumeX className="w-3 h-3 text-[#E8DFCC]" />
                                <span>Halt Audio</span>
                                <span className="flex items-center gap-0.5 ml-1">
                                  <span className="w-1 h-2 bg-[#E8DFCC] animate-bounce" />
                                  <span className="w-1 h-3 bg-[#E8DFCC] animate-bounce [animation-delay:0.15s]" />
                                  <span className="w-1 h-1.5 bg-[#E8DFCC] animate-bounce [animation-delay:0.3s]" />
                                </span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3 text-[#B49A67]" />
                                <span>Play Witness Voice</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })
              )}

              {isSubmitting && (
                <div className="bg-[#22201D] border border-[#3A3630] p-4 max-w-lg text-[#E8DFCC] shadow-lg animate-in fade-in duration-300 flex items-start gap-3">
                  <div className="w-4 h-4 mt-0.5 rounded-full border-2 border-[#B49A67] border-t-transparent animate-spin shrink-0" />
                  <div className="space-y-1 font-mono-archive text-xs">
                    <div className="text-[#B49A67] font-semibold flex items-center gap-1.5">
                      <span>{currentSuspect.name} is thinking</span>
                      <span className="flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 bg-[#B49A67] rounded-full animate-bounce [animation-delay:0s]" />
                        <span className="w-1.5 h-1.5 bg-[#B49A67] rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-[#B49A67] rounded-full animate-bounce [animation-delay:0.4s]" />
                      </span>
                    </div>
                    <p className="text-xs text-[#CFC7B7] font-editorial italic leading-relaxed transition-opacity duration-300">
                      {activeThinkingCue}
                    </p>
                  </div>
                </div>
              )}

              {apiError && (
                <div className="bg-[#2B171A] border-2 border-[#702D35] p-4 max-w-2xl text-[#E8DFCC] shadow-xl animate-in fade-in space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono-archive pb-2 border-b border-[#702D35]/50">
                    <span className="text-[#F4A8A8] font-bold flex items-center gap-1.5 uppercase tracking-wider">
                      <AlertOctagon className="w-4 h-4 text-[#F4A8A8] shrink-0" />
                      <span>Interrogation Communication Alert</span>
                    </span>
                    <button
                      onClick={() => setApiError(null)}
                      className="text-[#A9A398] hover:text-[#E8DFCC] p-1 cursor-pointer text-sm"
                      title="Dismiss Alert"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="font-sans text-xs text-[#E8DFCC] leading-relaxed">
                    {apiError}
                  </p>
                  <div className="pt-1 flex items-center gap-2 font-mono-archive text-xs">
                    <button
                      onClick={handleRetryLastMessage}
                      className="btn-gold px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Retry Inquiry</span>
                    </button>
                    <button
                      onClick={() => setApiError(null)}
                      className="px-3 py-1.5 bg-[#171717] hover:bg-[#22201D] border border-[#3A3630] text-[#A9A398] hover:text-[#E8DFCC] text-xs cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Suggested Inquest Prompts Strip */}
            <div className="px-4 py-2 bg-[#171717] border-t border-[#2E2B26] overflow-x-auto flex items-center gap-2 scrollbar-none font-mono-archive text-xs">
              <span className="text-[#B49A67] text-[10px] uppercase shrink-0">
                PROMPTS:
              </span>
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  disabled={isSubmitting}
                  className="bg-[#22201D] hover:bg-[#2A2723] border border-[#332F2A] px-2.5 py-1 text-[11px] text-[#A9A398] hover:text-[#E8DFCC] whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Real-time Contradiction Discovered Alert Banner */}
            {activeContradiction && (
              <div className="px-4 py-2.5 bg-[#2A1C1E] border-t border-[#702D35] flex items-center justify-between text-xs font-mono-archive text-[#E8DFCC] animate-fadeIn">
                <div className="flex-1 mr-3">
                  <span className="text-[#B49A67] font-bold block text-[10px] uppercase">
                    ⚠️ CRITICAL ALIBI CONTRADICTION EXPOSED
                  </span>
                  <span className="font-sans text-xs text-[#E8DFCC]">
                    {activeContradiction.suspectName} made a statement conflicting with the forensic timeline!
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePinContradiction}
                    className="btn-burgundy px-3 py-1.5 text-xs font-mono-archive cursor-pointer whitespace-nowrap"
                  >
                    {pinnedSuccessNotice ? '✓ Pinned to Board!' : 'Pin to Blackboard'}
                  </button>
                  <button
                    onClick={() => setActiveContradiction(null)}
                    className="text-[#A9A398] hover:text-[#E8DFCC] text-xs p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Evidence Presented Indicator */}
            {selectedEvidenceToPresent && (
              <div className="px-4 py-2 bg-[#22201D] border-t border-[#B49A67] flex items-center justify-between text-xs font-mono-archive text-[#B49A67]">
                <span>Ready to present: <strong>{selectedEvidenceToPresent.name}</strong></span>
                <button
                  onClick={() => setSelectedEvidenceToPresent(null)}
                  className="text-[#A9A398] hover:text-[#E8DFCC] cursor-pointer"
                >
                  [Cancel]
                </button>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-[#171717] border-t border-[#2E2B26] flex items-center gap-2 font-mono-archive text-xs">
              <button
                type="button"
                onClick={() => {
                  sound.playTapeClick();
                  setShowEvidenceDrawer(!showEvidenceDrawer);
                }}
                className={`px-3 py-2 border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  showEvidenceDrawer || selectedEvidenceToPresent
                    ? 'btn-gold'
                    : 'btn-dossier'
                }`}
                title="Select recovered physical evidence to push across the desk"
              >
                <Archive className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Present Evidence</span>
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isSubmitting}
                placeholder={`Formulate question for ${currentSuspect.name}...`}
                className="flex-1 bg-[#22201D] border border-[#332F2A] focus:border-[#B49A67] px-3 py-2 text-[#E8DFCC] placeholder-[#6B655C] outline-none"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={isSubmitting || (!inputText.trim() && !selectedEvidenceToPresent)}
                className="btn-gold px-4 py-2 cursor-pointer disabled:opacity-40 uppercase"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Evidence Selection Modal */}
        {showEvidenceDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
            <div className="bg-[#22201D] border border-[#3D3933] max-w-2xl w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#2E2B26]">
                <div>
                  <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-widest block">
                    PHYSICAL EVIDENCE LOCKER
                  </span>
                  <h3 className="font-editorial text-xl font-bold text-[#E8DFCC]">
                    Select Evidence to Confront {currentSuspect.name}
                  </h3>
                </div>
                <button
                  onClick={() => setShowEvidenceDrawer(false)}
                  className="font-mono-archive text-xs text-[#A9A398] hover:text-[#E8DFCC] cursor-pointer"
                >
                  [ESC]
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {caseData.evidence.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      sound.playTapeClick();
                      setSelectedEvidenceToPresent(item);
                      setShowEvidenceDrawer(false);
                    }}
                    className="p-3 bg-[#171717] border border-[#2E2B26] hover:border-[#B49A67] cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between font-mono-archive text-[10px] text-[#A9A398]">
                      <span>{item.tagNumber}</span>
                      <span className="text-[#B49A67]">{item.category}</span>
                    </div>
                    <div className="font-editorial text-base font-bold text-[#E8DFCC]">
                      {item.name}
                    </div>
                    <p className="font-sans text-xs text-[#A9A398] line-clamp-2">
                      {item.summary}
                    </p>
                    <div className="pt-2 text-right">
                      <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase font-semibold">
                        Push Across Desk →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
