import React, { useState } from 'react';
import { ScreenId, CaseData, Suspect, Team } from '../types';
import { sound } from '../services/soundEffects';
import { StorageService } from '../services/storageService';
import { TextAudioPlayer } from './TextAudioPlayer';
import {
  MessageSquareWarning,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  caseData: CaseData;
  team: Team;
  onSelectSuspect: (suspectId: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const SuspectProfiles: React.FC<Props> = ({
  caseData,
  team,
  onSelectSuspect,
  onNavigate,
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>(
    caseData.suspects[0]?.id || ''
  );

  const activeSuspect =
    caseData.suspects.find((s) => s.id === selectedSuspectId) || caseData.suspects[0];

  const suspectStress = StorageService.getSuspectStress(team.id, caseData.id, activeSuspect.id);
  const chatHistory = StorageService.getChatHistory(team.id, caseData.id, activeSuspect.id);

  const handleTakeToInterrogation = (suspectId: string) => {
    sound.playTapeClick();
    onSelectSuspect(suspectId);
    onNavigate('interrogation_room');
  };

  return (
    <div className="min-h-screen bg-[#171717] text-[#E8DFCC] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Editorial Header */}
        <div className="border-b border-[#2E2B26] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono-archive text-[11px] text-[#B49A67] uppercase tracking-widest mb-1">
              BLACKWOOD SENATE INQUEST · CONFIDENTIAL PERSONNEL FILES
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#E8DFCC]">
              Witness & Suspect Records
            </h1>
            <p className="font-editorial text-sm sm:text-base text-[#A9A398] italic mt-0.5">
              Four individuals with documented presence, conflicting alibis, and forensic ties to the scene.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playDramaticChime();
              handleTakeToInterrogation(activeSuspect.id);
            }}
            className="btn-gold px-5 py-2 text-xs font-mono-archive uppercase flex items-center gap-2 cursor-pointer shrink-0"
          >
            <MessageSquareWarning className="w-3.5 h-3.5" />
            <span>Question {activeSuspect.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Archival Personnel File Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {caseData.suspects.map((suspect, idx) => {
            const isSelected = suspect.id === activeSuspect.id;
            const history = StorageService.getChatHistory(team.id, caseData.id, suspect.id);
            const stress = StorageService.getSuspectStress(team.id, caseData.id, suspect.id);

            return (
              <button
                key={suspect.id}
                onClick={() => {
                  sound.playTypewriter();
                  setSelectedSuspectId(suspect.id);
                }}
                className={`p-3 text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#22201D] border-[#B49A67] text-[#E8DFCC]'
                    : 'bg-[#171717] border-[#2E2B26] text-[#A9A398] hover:border-[#3D3933]'
                }`}
              >
                <div className="flex items-center justify-between font-mono-archive text-[10px] text-[#A9A398] mb-1">
                  <span>RECORD #{String(idx + 1).padStart(2, '0')}</span>
                  <span>{history.length > 0 ? `${history.length} Qs` : 'Unquestioned'}</span>
                </div>
                <div className="font-editorial text-base font-bold text-[#E8DFCC] truncate">
                  {suspect.name}
                </div>
                <div className="font-mono-archive text-[10px] text-[#B49A67] truncate">
                  {suspect.role}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Personnel Docket */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Personnel Photograph & Institutional Profile */}
          <div className="manila-card p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#2E2B26]">
                <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-wider">
                  CONFIDENTIAL PERSONNEL RECORD
                </span>
                <span className="stamp-confidential text-[9px]">INQUEST SCRUTINY</span>
              </div>

              {/* Mounted Archival Photograph */}
              <div className="p-1 bg-[#171717] border border-[#3A3630]">
                <img
                  src={activeSuspect.avatar}
                  alt={activeSuspect.name}
                  className="w-full h-64 object-cover filter contrast-105"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-archive text-[10px] text-[#A9A398] uppercase block">
                    APPOINTMENT & AFFILIATION
                  </span>
                  <TextAudioPlayer
                    id={`suspect_bio_${activeSuspect.id}`}
                    text={`Personnel profile for ${activeSuspect.name}. ${activeSuspect.role}, ${activeSuspect.department}. Age ${activeSuspect.age}. Summary: ${activeSuspect.summary}`}
                    persona="narrator"
                    label="Listen"
                    playingLabel="Playing..."
                    variant="pill"
                  />
                </div>
                <h2 className="font-editorial text-2xl font-bold text-[#E8DFCC]">
                  {activeSuspect.name}
                </h2>
                <div className="font-mono-archive text-xs text-[#B49A67] mt-0.5">
                  {activeSuspect.role}
                </div>
                <div className="font-mono-archive text-[11px] text-[#A9A398] mt-1">
                  {activeSuspect.department} · Age: {activeSuspect.age}
                </div>
              </div>

              <p className="font-sans text-xs text-[#A9A398] leading-relaxed border-t border-[#2E2B26] pt-3">
                {activeSuspect.summary}
              </p>

              {/* Behavioral Assessment */}
              <div className="bg-[#171717] p-3.5 border border-[#2E2B26] text-xs font-mono-archive space-y-2">
                <div>
                  <span className="text-[#A9A398] text-[10px] block uppercase">Psychological Archetype</span>
                  <span className="text-[#E8DFCC] font-sans">{activeSuspect.personality}</span>
                </div>
                <div>
                  <span className="text-[#A9A398] text-[10px] block uppercase">Demeanor Under Pressure</span>
                  <span className="text-[#B49A67] font-sans">{activeSuspect.temperament}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleTakeToInterrogation(activeSuspect.id)}
              className="w-full btn-gold py-2.5 text-xs font-mono-archive uppercase flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquareWarning className="w-3.5 h-3.5" />
              <span>Summon to Interrogation Chamber</span>
            </button>
          </div>

          {/* Right 2 Columns: Sworn Testimony, Critical Flaw, Motives & Prior Wire Excerpts */}
          <div className="lg:col-span-2 space-y-5">
            {/* Sworn Alibi Testimony Sheet */}
            <div className="manila-card p-6 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26]">
                <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-wider">
                  SWORN OFFICIAL STATEMENT OF WHEREABOUTS
                </span>
                <div className="flex items-center gap-2">
                  <TextAudioPlayer
                    id={`suspect_alibi_${activeSuspect.id}`}
                    text={`Sworn official statement of ${activeSuspect.name}. ${activeSuspect.claimedAlibi}`}
                    persona={
                      activeSuspect.name.includes('Gray') || activeSuspect.name.includes('Vance')
                        ? 'female_suspect'
                        : 'male_suspect'
                    }
                    label="Listen to Statement"
                    playingLabel="Playing Statement..."
                    variant="pill"
                  />
                  <span className="font-mono-archive text-[10px] text-[#A9A398]">DEPOSITION RECORD</span>
                </div>
              </div>
              <p className="font-editorial text-lg text-[#E8DFCC] italic leading-relaxed">
                "{activeSuspect.claimedAlibi}"
              </p>
            </div>

            {/* Critical Flaw & Inconsistency Sheet */}
            <div className="manila-card p-6 space-y-3 border-l-2 border-l-[#702D35]">
              <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26]">
                <span className="font-mono-archive text-[10px] text-[#702D35] font-semibold uppercase tracking-wider">
                  DISCLOSED INCONSISTENCY · FORENSIC CONTRADICTION
                </span>
                <div className="flex items-center gap-2">
                  <TextAudioPlayer
                    id={`suspect_flaw_${activeSuspect.id}`}
                    text={`Forensic flaw in ${activeSuspect.name}'s deposition: ${activeSuspect.flaw}`}
                    persona="detective"
                    label="Listen to Flaw"
                    playingLabel="Playing..."
                    variant="pill"
                  />
                  <span className="stamp-confidential text-[9px]">UNVERIFIED ALIBI</span>
                </div>
              </div>
              <p className="font-mono-archive text-xs text-[#E8DFCC] leading-relaxed">
                {activeSuspect.flaw}
              </p>
            </div>

            {/* Motive & Forensic Ties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Documented Motive */}
              <div className="manila-card p-5 space-y-2">
                <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-wider block pb-1 border-b border-[#2E2B26]">
                  DOCUMENTED MOTIVE
                </span>
                <p className="font-sans text-xs text-[#A9A398] leading-relaxed">
                  {activeSuspect.motive}
                </p>
              </div>

              {/* Physical & Telemetry Ties */}
              <div className="manila-card p-5 space-y-2">
                <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-wider block pb-1 border-b border-[#2E2B26]">
                  FORENSIC & PHYSICAL LINKS
                </span>
                <ul className="space-y-1.5 text-xs font-mono-archive">
                  {activeSuspect.forensicTies.map((tie, idx) => (
                    <li key={idx} className="text-[#A9A398] flex items-start gap-2">
                      <span className="text-[#B49A67] font-bold">·</span>
                      <span className="text-[#E8DFCC]">{tie}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prior Interrogation Records */}
            <div className="manila-card p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26]">
                <span className="font-mono-archive text-xs text-[#B49A67] uppercase tracking-wider">
                  STENOGRAPHER INTERROGATION EXCERPTS ({chatHistory.length} QUERIES)
                </span>
                <span className="font-mono-archive text-xs text-[#A9A398]">
                  Current Stress: <strong className="text-[#B49A67]">{suspectStress}%</strong>
                </span>
              </div>

              {chatHistory.length === 0 ? (
                <p className="text-xs font-mono-archive text-[#A9A398] py-3 text-center">
                  Witness has not yet been subjected to formal interrogation.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {chatHistory.slice(-3).map((msg) => (
                    <div
                      key={msg.id}
                      className="p-2.5 bg-[#171717] border border-[#2E2B26] text-xs font-mono-archive"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#A9A398] mb-1">
                        <span className="text-[#B49A67]">
                          {msg.sender === 'detective' ? 'Inquest Officer' : activeSuspect.name}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="font-editorial text-sm text-[#E8DFCC] italic">
                        "{msg.text}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
