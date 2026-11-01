import React, { useState, useEffect } from 'react';
import { ScreenId, CaseData, Team } from '../types';
import { sound } from '../services/soundEffects';
import { StorageService } from '../services/storageService';
import {
  FileText,
  Flame,
  ArrowRight,
  Radio,
  Compass,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Props {
  caseData: CaseData;
  team: Team;
  onNavigate: (screen: ScreenId) => void;
  onSelectSuspect: (suspectId: string) => void;
  discoveredEvidenceIds: string[];
}

const TELEGRAPH_DISPATCHES: Record<string, Array<{ time: string; origin: string; text: string }>> = {
  'case-001': [
    { time: '23:48:12', origin: 'CAMPUS PATROL 4', text: 'Head Custodian Thomas Finch reports Professor Vance slumped unresponsive over St. Jude podium.' },
    { time: '00:12:45', origin: 'CORONER TOXICOLOGY', text: 'Lethal aconitine alkaloid detected in porcelain tea sediment; reflux distillation indicates fresh laboratory extraction.' },
    { time: '00:45:19', origin: 'ARCHIVAL SECURITY', text: 'Subterranean freight lift logged keycard #044 access at 11:15 PM, bypassing main quad gates.' },
    { time: '01:10:02', origin: 'BALLISTICS & TOOLS', text: 'Pocket watch crystal cracked at 11:22 PM; microscopic inspection confirms reverse torque from external key tool.' },
    { time: '01:34:50', origin: 'CONSTABULARY POST', text: 'Muddy tactical boots impounded from suspect outside The Black Boar tavern match courtyard soil depth.' },
  ],
  'case-002': [
    { time: '03:15:22', origin: 'CAD ALARM NET', text: 'Emergency Halon 1301 dump alarm registered in Subterranean Turing Cluster 4B.' },
    { time: '03:26:00', origin: 'INCIDENT COMMAND', text: 'Victim Maya Lin discovered behind Rack 14; terminal display flashing "ZERO OVERWRITE COMPLETE".' },
    { time: '03:52:14', origin: 'SECURITY OPS', text: 'Sudo wipe execution authenticated with cryptographic token issued exclusively to the Lab Director suite.' },
    { time: '04:18:30', origin: 'FORENSIC LAB', text: 'Two-way door talkback copper wiring severed with 45-degree diagonal precision wire cutters.' },
    { time: '04:40:05', origin: 'QUAD CAMERA 7', text: 'Yellow sneakers matching Chloe Bennett captured fleeing basement exit stairway at 1:45 AM.' },
  ],
};

export const InvestigationDashboard: React.FC<Props> = ({
  caseData,
  team,
  onNavigate,
  onSelectSuspect,
  discoveredEvidenceIds,
}) => {
  const [telegraphIndex, setTelegraphIndex] = useState(0);
  const dispatches = TELEGRAPH_DISPATCHES[caseData.id] || TELEGRAPH_DISPATCHES['case-001'];

  useEffect(() => {
    const timer = setInterval(() => {
      setTelegraphIndex((prev) => (prev + 1) % dispatches.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [dispatches.length]);

  const handleNextTelegraph = () => {
    sound.playTypewriter();
    setTelegraphIndex((prev) => (prev + 1) % dispatches.length);
  };

  const handlePrevTelegraph = () => {
    sound.playTypewriter();
    setTelegraphIndex((prev) => (prev - 1 + dispatches.length) % dispatches.length);
  };
  const totalEvidence = caseData.evidence.length;
  const analyzedEvidenceCount = discoveredEvidenceIds.length;

  const suspectInterrogationStatus = caseData.suspects.map((suspect) => {
    const history = StorageService.getChatHistory(team.id, caseData.id, suspect.id);
    const stress = StorageService.getSuspectStress(team.id, caseData.id, suspect.id);
    return {
      suspect,
      interrogated: history.length > 0,
      messageCount: history.length,
      stress,
    };
  });

  const interrogatedCount = suspectInterrogationStatus.filter((s) => s.interrogated).length;
  const totalSuspects = caseData.suspects.length;
  const notes = StorageService.getNotes(team.id, caseData.id);

  const handleInterrogateSuspect = (suspectId: string) => {
    sound.playTapeClick();
    onSelectSuspect(suspectId);
    onNavigate('interrogation_room');
  };

  return (
    <div className="min-h-screen bg-[#171717] text-[#E8DFCC] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Operational Inquest Ribbon */}
        <div className="bg-[#22201D] border border-[#332F2A] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 font-mono-archive text-[11px] text-[#B49A67] uppercase tracking-widest">
              <span>INQUEST CONTROL</span>
              <span>·</span>
              <span>{caseData.code}</span>
              <span>·</span>
              <span className="text-[#A9A398]">{caseData.location}</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#E8DFCC] mt-1">
              {caseData.title}
            </h1>
            <p className="font-sans text-xs text-[#A9A398] mt-0.5">
              Presiding Inquest Officer: <strong className="text-[#E8DFCC]">{team.leadDetective}</strong> · {team.currentRole}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                sound.playTypewriter();
                onNavigate('case_briefing');
              }}
              className="btn-dossier px-4 py-2 text-xs font-mono-archive flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#B49A67]" />
              <span>Review Briefing</span>
            </button>

            <button
              onClick={() => {
                sound.playDramaticChime();
                onNavigate('final_accusation');
              }}
              className="btn-burgundy px-4 py-2 text-xs font-mono-archive uppercase flex items-center gap-2 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-[#B49A67]" />
              <span>Accusation Chamber</span>
            </button>
          </div>
        </div>

        {/* Guided Investigation Directives Banner */}
        <div className="bg-[#22201D] border border-[#332F2A] p-4 font-mono-archive text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26]">
            <span className="text-[#B49A67] font-semibold uppercase tracking-wider">
              INVESTIGATION PROTOCOL · DIRECTIVES CHECKLIST
            </span>
            <span className="text-[#A9A398] text-[11px]">
              {interrogatedCount === totalSuspects && analyzedEvidenceCount >= 4
                ? 'INDICTMENT READY'
                : 'PROCEED WITH INQUEST'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
            <div
              onClick={() => onNavigate('case_briefing')}
              className="p-2.5 bg-[#171717] border border-[#2E2B26] hover:border-[#B49A67] cursor-pointer flex items-center justify-between transition-colors"
            >
              <span>1. Autopsy & Timeline</span>
              <span className="text-[#B49A67]">✓ REVIEWED</span>
            </div>

            <div
              onClick={() => onNavigate('evidence_library')}
              className={`p-2.5 bg-[#171717] border cursor-pointer flex items-center justify-between transition-colors ${
                analyzedEvidenceCount >= 3 ? 'border-[#B49A67] text-[#E8DFCC]' : 'border-[#2E2B26] text-[#A9A398] hover:border-[#3D3933]'
              }`}
            >
              <span>2. Tag Clues ({analyzedEvidenceCount}/{totalEvidence})</span>
              <span className={analyzedEvidenceCount >= 3 ? 'text-[#B49A67]' : 'text-[#A9A398]'}>
                {analyzedEvidenceCount >= 3 ? '✓ LOGGED' : 'PENDING'}
              </span>
            </div>

            <div
              onClick={() => onNavigate('suspect_profiles')}
              className={`p-2.5 bg-[#171717] border cursor-pointer flex items-center justify-between transition-colors ${
                interrogatedCount === totalSuspects ? 'border-[#B49A67] text-[#E8DFCC]' : 'border-[#2E2B26] text-[#A9A398] hover:border-[#3D3933]'
              }`}
            >
              <span>3. Question Suspects ({interrogatedCount}/{totalSuspects})</span>
              <span className={interrogatedCount === totalSuspects ? 'text-[#B49A67]' : 'text-[#A9A398]'}>
                {interrogatedCount === totalSuspects ? '✓ COMPLETE' : 'IN PROGRESS'}
              </span>
            </div>

            <div
              onClick={() => onNavigate('final_accusation')}
              className={`p-2.5 border cursor-pointer flex items-center justify-between transition-colors ${
                interrogatedCount >= 2 && analyzedEvidenceCount >= 2
                  ? 'bg-[#2A2723] border-[#702D35] text-[#E8DFCC]'
                  : 'bg-[#171717] border-[#2E2B26] text-[#A9A398] hover:border-[#3D3933]'
              }`}
            >
              <span>4. Grand Indictment</span>
              <span className="text-[#B49A67]">
                {interrogatedCount >= 2 && analyzedEvidenceCount >= 2 ? 'SEAL WARRANT →' : 'NEEDS PROOF'}
              </span>
            </div>
          </div>
        </div>

        {/* Constabulary Live Telegraph Wiretap Ticker */}
        <div className="bg-[#1C1A17] border border-[#B49A67]/40 p-3 sm:p-4 font-mono-archive text-xs flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B49A67] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B49A67]" />
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-[#B49A67] uppercase font-bold tracking-widest">
              <Radio className="w-3.5 h-3.5 text-[#B49A67]" />
              <span>CONSTABULARY TELEGRAPH WIRE</span>
            </div>
            <span className="text-[#3A3630]">|</span>
            <span className="text-[10px] text-[#A9A398]">
              [{dispatches[telegraphIndex].time}] {dispatches[telegraphIndex].origin}
            </span>
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left px-2">
            <p className="font-editorial text-sm italic text-[#E8DFCC] truncate">
              "{dispatches[telegraphIndex].text}"
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handlePrevTelegraph}
              className="p-1 bg-[#22201D] hover:bg-[#2E2B26] text-[#A9A398] hover:text-[#E8DFCC] border border-[#332F2A] cursor-pointer"
              title="Previous Telegraph Cable"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <span className="text-[10px] text-[#A9A398] px-1.5">
              {telegraphIndex + 1}/{dispatches.length}
            </span>
            <button
              onClick={handleNextTelegraph}
              className="p-1 bg-[#22201D] hover:bg-[#2E2B26] text-[#A9A398] hover:text-[#E8DFCC] border border-[#332F2A] cursor-pointer"
              title="Next Telegraph Cable"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Archival Inquest Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono-archive">
          <div className="manila-card p-4">
            <span className="text-[#A9A398] text-[10px] uppercase block mb-1">SUSPECTS INTERROGATED</span>
            <div className="font-editorial text-2xl font-bold text-[#E8DFCC]">
              {interrogatedCount} <span className="text-sm font-sans text-[#A9A398]">/ {totalSuspects}</span>
            </div>
            <div className="text-[10px] text-[#B49A67] mt-1">
              {totalSuspects - interrogatedCount === 0 ? 'All Questioned' : `${totalSuspects - interrogatedCount} Pending Examination`}
            </div>
          </div>

          <div className="manila-card p-4">
            <span className="text-[#A9A398] text-[10px] uppercase block mb-1">EVIDENCE TAGGED</span>
            <div className="font-editorial text-2xl font-bold text-[#E8DFCC]">
              {analyzedEvidenceCount} <span className="text-sm font-sans text-[#A9A398]">/ {totalEvidence}</span>
            </div>
            <div className="text-[10px] text-[#B49A67] mt-1">
              In Custody Locker
            </div>
          </div>

          <div className="manila-card p-4">
            <span className="text-[#A9A398] text-[10px] uppercase block mb-1">SYNDICATE NOTES</span>
            <div className="font-editorial text-2xl font-bold text-[#E8DFCC]">
              {notes.length} <span className="text-sm font-sans text-[#A9A398]">Entries</span>
            </div>
            <div className="text-[10px] text-[#A9A398] mt-1">
              Pinned to Blackboard
            </div>
          </div>

          <div className="manila-card p-4">
            <span className="text-[#A9A398] text-[10px] uppercase block mb-1">INQUEST STATUS</span>
            <div className="font-editorial text-2xl font-bold text-[#702D35]">
              Active Inquest
            </div>
            <div className="text-[10px] text-[#A9A398] mt-1">
              Evidence Gathering Phase
            </div>
          </div>
        </div>

        {/* Asymmetric 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2-Column: Suspects Lineup & Personnel Cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26]">
              <span className="font-mono-archive text-xs text-[#B49A67] uppercase tracking-wider">
                PERSONS OF INTEREST · WITNESS LINEUP ({caseData.suspects.length})
              </span>
              <button
                onClick={() => {
                  sound.playTypewriter();
                  onNavigate('suspect_profiles');
                }}
                className="font-mono-archive text-xs text-[#A9A398] hover:text-[#E8DFCC] flex items-center gap-1 cursor-pointer"
              >
                <span>Full Personnel Files</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suspectInterrogationStatus.map(({ suspect, interrogated, messageCount, stress }) => {
                let stressState = 'Composed';
                let stressColor = 'text-[#A9A398]';
                if (stress > 35 && stress <= 65) {
                  stressState = 'Uneasy';
                  stressColor = 'text-[#B49A67]';
                } else if (stress > 65 && stress <= 85) {
                  stressState = 'Agitated';
                  stressColor = 'text-[#702D35] font-semibold';
                } else if (stress > 85) {
                  stressState = 'Cracking';
                  stressColor = 'text-[#702D35] font-bold';
                }

                return (
                  <div
                    key={suspect.id}
                    className="manila-card p-4 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={suspect.avatar}
                          alt={suspect.name}
                          className="w-16 h-20 object-cover border border-[#3A3630] shrink-0 filter contrast-105"
                        />
                        <div className="overflow-hidden">
                          <span className="font-mono-archive text-[10px] text-[#A9A398] uppercase block">
                            {suspect.department}
                          </span>
                          <h2 className="font-editorial text-xl font-bold text-[#E8DFCC] truncate">
                            {suspect.name}
                          </h2>
                          <div className="font-mono-archive text-[11px] text-[#B49A67] truncate">
                            {suspect.role}
                          </div>
                          <div className="font-mono-archive text-[10px] text-[#A9A398] mt-1">
                            Age: {suspect.age} · {interrogated ? `${messageCount} Queries Logged` : 'Unquestioned'}
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#171717] p-2.5 border border-[#2E2B26] text-xs">
                        <span className="font-mono-archive text-[9px] text-[#A9A398] block uppercase">
                          Claimed Whereabouts:
                        </span>
                        <p className="font-editorial text-xs text-[#E8DFCC] italic line-clamp-2 mt-0.5">
                          "{suspect.claimedAlibi}"
                        </p>
                      </div>

                      {/* Stress Index */}
                      <div className="mt-2 flex items-center justify-between text-[11px] font-mono-archive text-[#A9A398]">
                        <span>Psychological Index:</span>
                        <span className={stressColor}>{stressState} ({stress}%)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleInterrogateSuspect(suspect.id)}
                      className="w-full btn-dossier py-2 text-xs font-mono-archive flex items-center justify-center gap-2 cursor-pointer hover:border-[#B49A67]"
                    >
                      <span>Question Witness</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#B49A67]" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Evidence Index & Blackboard Notes */}
          <div className="space-y-6">
            {/* Evidence Index Ledger */}
            <div className="manila-card p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26]">
                <span className="font-mono-archive text-xs text-[#B49A67] uppercase tracking-wider">
                  EVIDENCE CUSTODY LEDGER
                </span>
                <button
                  onClick={() => {
                    sound.playTapeClick();
                    onNavigate('evidence_library');
                  }}
                  className="font-mono-archive text-[11px] text-[#A9A398] hover:text-[#E8DFCC] cursor-pointer"
                >
                  All Items →
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono-archive">
                {caseData.evidence.slice(0, 4).map((item) => {
                  const isTagged = discoveredEvidenceIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        sound.playTapeClick();
                        onNavigate('evidence_library');
                      }}
                      className="p-2.5 bg-[#171717] border border-[#2E2B26] hover:border-[#3D3933] cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[#E8DFCC] font-semibold">{item.name}</div>
                        <div className="text-[10px] text-[#A9A398]">{item.tagNumber} · {item.location}</div>
                      </div>
                      {isTagged && (
                        <span className="stamp-verified-evidence text-[8px]">TAGGED</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Blackboard Notes Summary */}
            <div className="manila-card p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26]">
                <span className="font-mono-archive text-xs text-[#B49A67] uppercase tracking-wider">
                  PINNED DEDUCTIONS ({notes.length})
                </span>
                <button
                  onClick={() => {
                    sound.playTapeClick();
                    onNavigate('investigation_notes');
                  }}
                  className="font-mono-archive text-[11px] text-[#A9A398] hover:text-[#E8DFCC] cursor-pointer"
                >
                  Open Board →
                </button>
              </div>

              <div className="space-y-2">
                {notes.slice(0, 3).map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-[#171717] border border-[#2E2B26] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-mono-archive text-[10px] text-[#A9A398]">
                      <span className="text-[#B49A67]">{note.author}</span>
                      <span>{note.timestamp}</span>
                    </div>
                    <p className="font-editorial text-sm text-[#E8DFCC] italic">
                      "{note.content}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
