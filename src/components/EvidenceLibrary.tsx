import React, { useState, useEffect } from 'react';
import { ScreenId, CaseData, Evidence, Team } from '../types';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { TextAudioPlayer } from './TextAudioPlayer';
import { DigitalProofViewer } from './DigitalProofViewer';
import {
  Search,
  Tag,
  ArrowRight,
  Play,
  Pause,
  MessageSquareWarning,
  Video,
} from 'lucide-react';

interface Props {
  caseData: CaseData;
  team: Team;
  discoveredEvidenceIds: string[];
  onToggleEvidence: (id: string) => void;
  onNavigate: (screen: ScreenId) => void;
  onSelectSuspect: (suspectId: string) => void;
}

export const EvidenceLibrary: React.FC<Props> = ({
  caseData,
  team,
  discoveredEvidenceIds,
  onToggleEvidence,
  onNavigate,
  onSelectSuspect,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEvidenceModal, setActiveEvidenceModal] = useState<Evidence | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const unsub = speech.subscribe((currId) => {
      setIsPlayingAudio(
        Boolean(activeEvidenceModal?.id && currId === `evidence_audio_${activeEvidenceModal.id}`)
      );
    });
    return () => {
      unsub();
      speech.stop();
    };
  }, [activeEvidenceModal?.id]);

  const categories = ['ALL', 'Toxicology', 'Physical', 'Digital', 'Audio/Document'];

  const filteredEvidence = caseData.evidence.filter((item) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenModal = (item: Evidence) => {
    sound.playTapeClick();
    setActiveEvidenceModal(item);
    setIsPlayingAudio(false);
  };

  const handleToggleTag = (id: string) => {
    sound.playTypewriter();
    onToggleEvidence(id);
  };

  const handleTakeToInterrogation = (contradictingSuspectId?: string) => {
    sound.playDramaticChime();
    if (contradictingSuspectId) {
      onSelectSuspect(contradictingSuspectId);
    }
    setActiveEvidenceModal(null);
    onNavigate('interrogation_room');
  };

  const handlePlayAudio = () => {
    if (!activeEvidenceModal?.audioSnippet) return;
    sound.playTapeClick();
    speech.toggle(
      `evidence_audio_${activeEvidenceModal.id}`,
      activeEvidenceModal.audioSnippet.transcript,
      {
        voiceType: 'dispatch',
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#171717] text-[#E8DFCC] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Editorial Header */}
        <div className="border-b border-[#2E2B26] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono-archive text-[11px] text-[#B49A67] uppercase tracking-widest mb-1">
              BLACKWOOD CONSTABULARY · FORENSIC EVIDENCE VAULT
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#E8DFCC]">
              Forensic Evidence Locker
            </h1>
            <p className="font-editorial text-sm sm:text-base text-[#A9A398] italic mt-0.5">
              Recovered physical articles, chemical toxicology screenings, and telemetry audit records.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono-archive text-xs">
            <span className="text-[#A9A398]">Tagged in Dossier:</span>
            <span className="text-[#B49A67] font-bold">
              {discoveredEvidenceIds.length} / {caseData.evidence.length} Items
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#22201D] border border-[#332F2A] p-3 font-mono-archive text-xs">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playTypewriter();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 transition-colors cursor-pointer uppercase ${
                  selectedCategory === cat
                    ? 'bg-[#B49A67] text-[#171717] font-bold'
                    : 'bg-[#171717] text-[#A9A398] hover:text-[#E8DFCC] border border-[#332F2A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#A9A398] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search evidence or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#171717] border border-[#332F2A] focus:border-[#B49A67] pl-8 pr-3 py-1.5 text-xs text-[#E8DFCC] placeholder-[#6B655C] outline-none"
            />
          </div>
        </div>

        {/* Evidence Grid Styled as Authentic Evidence Envelopes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvidence.map((item) => {
            const isTagged = discoveredEvidenceIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`manila-card p-5 flex flex-col justify-between transition-all duration-200 ${
                  isTagged ? 'border-[#B49A67]' : 'border-[#332F2A]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#2E2B26] mb-3 font-mono-archive text-xs">
                    <div>
                      <span className="text-[#B49A67] font-bold block">{item.tagNumber}</span>
                      <span className="text-[10px] text-[#A9A398] uppercase">{item.category}</span>
                    </div>

                    <button
                      onClick={() => handleToggleTag(item.id)}
                      className={`px-2 py-0.5 border text-[10px] font-mono-archive transition-colors cursor-pointer ${
                        isTagged
                          ? 'border-[#B49A67] bg-[#B49A67] text-[#171717] font-bold'
                          : 'border-[#332F2A] bg-[#171717] text-[#A9A398] hover:text-[#E8DFCC]'
                      }`}
                      title={isTagged ? 'Untag evidence' : 'Tag as primary proof'}
                    >
                      {isTagged ? 'TAGGED' : '+ TAG PROOF'}
                    </button>
                  </div>

                  <h2 className="font-editorial text-xl font-bold text-[#E8DFCC] mb-2">
                    {item.name}
                  </h2>

                  {/* CCTV / Digital Proof Badge */}
                  {item.category === 'Digital' && (
                    <div className="flex items-center gap-1.5 text-[10px] text-red-400 bg-[#2A1518] border border-red-900/60 px-2 py-0.5 w-fit mb-2 font-mono-archive">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <Video className="w-3 h-3 text-red-400" />
                      <span>CCTV / DIGITAL PROOF</span>
                    </div>
                  )}

                  <p className="font-sans text-xs text-[#A9A398] leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#2E2B26] text-[10px] font-mono-archive text-[#A9A398]">
                    <span>RECOVERY LOCATION:</span> <span className="text-[#E8DFCC]">{item.location}</span>
                  </div>

                  {/* Direct Clue Connector to Interrogation */}
                  {item.contradictsSuspectId && (
                    <button
                      onClick={() => handleTakeToInterrogation(item.contradictsSuspectId)}
                      className="mt-3 w-full bg-[#171717] hover:bg-[#2A2723] border border-[#332F2A] hover:border-[#B49A67] p-2 flex items-center justify-between text-[11px] font-mono-archive text-[#B49A67] transition-colors cursor-pointer"
                      title="Directly confront suspect with this evidence in the chamber"
                    >
                      <span>
                        Confront: <strong>{caseData.suspects.find(s => s.id === item.contradictsSuspectId)?.name}</strong>
                      </span>
                      <span>➔</span>
                    </button>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#2E2B26] flex items-center justify-between font-mono-archive text-xs">
                  <span className="text-[10px] text-[#A9A398]">
                    {item.keyClue ? 'CRITICAL LEAD' : 'CORROBORATING'}
                  </span>
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="text-[#B49A67] hover:text-[#E8DFCC] flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <span>Inspect Laboratory Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Evidence Laboratory Analysis Modal */}
        {activeEvidenceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 overflow-y-auto">
            <div className="bg-[#22201D] border border-[#3D3933] max-w-2xl w-full p-6 shadow-2xl space-y-5 relative my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-3 border-b border-[#2E2B26]">
                <div>
                  <div className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-widest">
                    FORENSIC LABORATORY DOCKET // {activeEvidenceModal.tagNumber}
                  </div>
                  <h3 className="font-editorial text-2xl font-bold text-[#E8DFCC] mt-0.5">
                    {activeEvidenceModal.name}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveEvidenceModal(null)}
                  className="font-mono-archive text-xs text-[#A9A398] hover:text-[#E8DFCC] p-1 cursor-pointer"
                >
                  [ESC]
                </button>
              </div>

              {/* Custody Information */}
              <div className="bg-[#171717] p-3 border border-[#2E2B26] text-xs font-mono-archive flex items-center justify-between">
                <span>RECOVERY SITE: <strong className="text-[#E8DFCC]">{activeEvidenceModal.location}</strong></span>
                <span className="stamp-verified-evidence text-[9px]">CUSTODY LOGGED</span>
              </div>

              {/* Digital CCTV & Surveillance Proof Player (If Digital Evidence) */}
              {(activeEvidenceModal.category === 'Digital' ||
                activeEvidenceModal.id.includes('log') ||
                activeEvidenceModal.id.includes('override') ||
                activeEvidenceModal.id.includes('turing') ||
                activeEvidenceModal.id.includes('keycard')) && (
                <div className="space-y-2">
                  <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-wider block">
                    RECOVERED DIGITAL RECONSTRUCTION & CCTV SURVEILLANCE
                  </span>
                  <DigitalProofViewer
                    caseId={caseData.id}
                    evidenceName={activeEvidenceModal.name}
                    tagNumber={activeEvidenceModal.tagNumber}
                  />
                </div>
              )}

              {/* Forensic Laboratory Deep Analysis Sheet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-wider block">
                    PHYSICAL & CHEMICAL MICROSCOPIC FINDINGS
                  </span>
                  <TextAudioPlayer
                    id={`evidence_analysis_${activeEvidenceModal.id}`}
                    text={`Laboratory analysis for evidence item: ${activeEvidenceModal.name}. ${activeEvidenceModal.detailedAnalysis}`}
                    persona="coroner"
                    label="Listen to Findings"
                    playingLabel="Playing..."
                    variant="pill"
                  />
                </div>
                <div className="bg-[#171717] p-4 border border-[#2E2B26] font-editorial text-sm sm:text-base text-[#E8DFCC] leading-relaxed italic">
                  "{activeEvidenceModal.detailedAnalysis}"
                </div>
              </div>

              {/* Audio Tape Snippet (If Present) */}
              {activeEvidenceModal.audioSnippet && (
                <div className="bg-[#171717] p-4 border border-[#2E2B26] space-y-2 font-mono-archive text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#B49A67]">
                      AUDIO RECORDING ({activeEvidenceModal.audioSnippet.duration})
                    </span>
                    <button
                      onClick={handlePlayAudio}
                      className="btn-gold px-3 py-1 text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{isPlayingAudio ? 'Stop' : 'Play Wire'}</span>
                    </button>
                  </div>
                  <div className="bg-[#22201D] p-3 border border-[#332F2A] text-[#A9A398] italic text-xs font-sans">
                    {activeEvidenceModal.audioSnippet.transcript}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#2E2B26] flex flex-wrap items-center justify-between gap-3 font-mono-archive text-xs">
                <button
                  onClick={() => handleToggleTag(activeEvidenceModal.id)}
                  className={`px-4 py-2 border transition-colors cursor-pointer ${
                    discoveredEvidenceIds.includes(activeEvidenceModal.id)
                      ? 'btn-gold'
                      : 'btn-dossier'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5 inline mr-1.5" />
                  <span>
                    {discoveredEvidenceIds.includes(activeEvidenceModal.id)
                      ? 'Tagged in Case File'
                      : 'Tag as Primary Proof'}
                  </span>
                </button>

                <button
                  onClick={() => handleTakeToInterrogation(activeEvidenceModal.contradictsSuspectId)}
                  className="btn-burgundy px-5 py-2 uppercase flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquareWarning className="w-3.5 h-3.5" />
                  <span>Confront Suspect with Evidence</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
