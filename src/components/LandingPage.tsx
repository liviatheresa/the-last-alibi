import React, { useState } from 'react';
import { ScreenId, CaseData, Team } from '../types';
import { sound } from '../services/soundEffects';
import {
  ArrowRight,
  Shield,
  Search,
  Users,
  Compass,
  FileText,
  Clock,
  Archive,
} from 'lucide-react';

interface Props {
  onNavigate: (screen: ScreenId) => void;
  cases: Record<string, CaseData>;
  onSelectCase: (caseId: 'case-001' | 'case-002') => void;
  team: Team;
}

export const LandingPage: React.FC<Props> = ({ onNavigate, cases, onSelectCase, team }) => {
  const [joinCodeInput, setJoinCodeInput] = useState('');

  const handleStartInvestigation = (caseId: 'case-001' | 'case-002') => {
    sound.playTapeClick();
    onSelectCase(caseId);
    onNavigate('case_briefing');
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    sound.playTapeClick();
    onNavigate('team_lobby');
  };

  return (
    <div className="min-h-screen bg-[#171717] text-[#E8DFCC] flex flex-col justify-between selection:bg-[#B49A67]/30 selection:text-[#F4EFE6]">
      {/* Editorial Top Inquest Docket Bar */}
      <header className="border-b border-[#2E2B26] px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs font-mono-archive">
        <div className="flex items-center gap-3">
          <span className="text-[#B49A67] font-semibold tracking-wider">
            BLACKWOOD CONSTABULARY
          </span>
          <span className="text-[#3A3630]">|</span>
          <span className="text-[#A9A398] tracking-widest uppercase hidden sm:inline">
            CRIMINAL INQUEST BUREAU · SPECIAL COMMISSION
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="stamp-confidential">
            CLASSIFIED DOSSIER
          </span>
          <button
            onClick={() => {
              sound.playTapeClick();
              onNavigate('team_lobby');
            }}
            className="border border-[#3A3630] hover:border-[#B49A67] bg-[#22201D] text-[#E8DFCC] px-2.5 py-1 text-[11px] transition-colors cursor-pointer hidden md:flex items-center gap-1.5"
          >
            <Shield className="w-3 h-3 text-[#B49A67]" />
            <span>Syndicate: {team.name}</span>
          </button>
        </div>
      </header>

      {/* Main Cinematic Editorial Canvas */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 lg:py-14 flex-1 flex flex-col justify-center">
        {/* Title Frontispiece */}
        <div className="border-b border-[#2E2B26] pb-10 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="font-mono-archive text-[11px] uppercase tracking-widest text-[#B49A67] mb-3">
                ARCHIVE RECORD // INQUEST NO. 1884–2026
              </div>
              <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#E8DFCC] leading-[1.05]">
                THE LAST ALIBI
              </h1>
              <p className="mt-4 font-editorial text-lg sm:text-2xl text-[#A9A398] italic max-w-2xl leading-relaxed">
                "Behind the leaded glass and Gothic spires of Blackwood University, truth is a calculated equation of alibis, poisons, and telemetry."
              </p>
            </div>

            {/* Quick Launch & Syndicate Key Form */}
            <div className="bg-[#22201D] border border-[#332F2A] p-5 lg:w-80 shrink-0">
              <span className="font-mono-archive text-[10px] text-[#A9A398] uppercase tracking-widest block mb-2">
                SYNDICATE ACCESS KEY
              </span>
              <form onSubmit={handleJoinByCode} className="space-y-2.5">
                <input
                  type="text"
                  placeholder="ENTER ROOM KEY (E.G. BW-8821)"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  className="w-full bg-[#171717] border border-[#332F2A] focus:border-[#B49A67] text-xs font-mono-archive text-center py-2 px-3 text-[#E8DFCC] outline-none tracking-widest uppercase"
                />
                <button
                  type="submit"
                  className="w-full btn-gold py-2 text-xs font-mono-archive uppercase tracking-wider cursor-pointer"
                >
                  Join Case Room
                </button>
              </form>

              <div className="mt-3 pt-3 border-t border-[#2E2B26] flex items-center justify-between text-[11px] font-mono-archive text-[#A9A398]">
                <span>Active Syndicate:</span>
                <span className="text-[#B49A67]">{team.code}</span>
              </div>
            </div>
          </div>
        </div>

        {/* The Two Archival Cases — Bound Manila Dossier Presentation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono-archive text-xs text-[#B49A67] uppercase tracking-widest">
              ACTIVE CASE FILES (02 UNRESOLVED INQUESTS)
            </span>
            <span className="font-mono-archive text-xs text-[#A9A398]">
              BLACKWOOD SENATE JURISDICTION
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Case 001 Card */}
            <div className="manila-card p-6 flex flex-col justify-between transition-all duration-200 group">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#2E2B26] mb-4 text-xs font-mono-archive">
                  <span className="text-[#B49A67] font-semibold">{cases['case-001'].code}</span>
                  <span className="stamp-confidential">HOMICIDE INQUEST</span>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={cases['case-001'].victim.photo}
                    alt={cases['case-001'].victim.name}
                    className="w-20 h-24 object-cover border border-[#3A3630] shrink-0 filter contrast-105"
                  />
                  <div>
                    <span className="font-mono-archive text-[10px] text-[#A9A398] uppercase block">
                      DEPT. OF CLASSICAL ANTIQUITIES
                    </span>
                    <h2 className="font-editorial text-2xl font-bold text-[#E8DFCC] mt-0.5 group-hover:text-[#B49A67] transition-colors">
                      The Midnight Lecture
                    </h2>
                    <p className="font-sans text-xs text-[#A9A398] mt-1 line-clamp-2">
                      Dean Alistair Vance found poisoned behind a locked oak door with a stopped brass pocket watch and aconite residue.
                    </p>
                  </div>
                </div>

                <div className="bg-[#171717] p-3 border border-[#2E2B26] text-xs font-mono-archive space-y-1 text-[#A9A398]">
                  <div className="flex justify-between">
                    <span>VICTIM:</span>
                    <span className="text-[#E8DFCC]">{cases['case-001'].victim.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ESTIMATED TIME:</span>
                    <span className="text-[#E8DFCC]">{cases['case-001'].victim.timeOfDeath}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PRIMARY ANOMALY:</span>
                    <span className="text-[#702D35] font-semibold">11:22 PM Stopped Watch Escapement</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#2E2B26] flex items-center justify-between">
                <span className="font-mono-archive text-xs text-[#A9A398]">
                  4 Suspects · 7 Forensic Items
                </span>
                <button
                  onClick={() => handleStartInvestigation('case-001')}
                  className="btn-dossier px-4 py-1.5 text-xs font-mono-archive flex items-center gap-2 cursor-pointer group-hover:border-[#B49A67]"
                >
                  <span>Examine Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B49A67]" />
                </button>
              </div>
            </div>

            {/* Case 002 Card */}
            <div className="manila-card p-6 flex flex-col justify-between transition-all duration-200 group">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#2E2B26] mb-4 text-xs font-mono-archive">
                  <span className="text-[#B49A67] font-semibold">{cases['case-002'].code}</span>
                  <span className="stamp-confidential">HOMICIDE INQUEST</span>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={cases['case-002'].victim.photo}
                    alt={cases['case-002'].victim.name}
                    className="w-20 h-24 object-cover border border-[#3A3630] shrink-0 filter contrast-105"
                  />
                  <div>
                    <span className="font-mono-archive text-[10px] text-[#A9A398] uppercase block">
                      TURING COMPUTING ANNEX
                    </span>
                    <h2 className="font-editorial text-2xl font-bold text-[#E8DFCC] mt-0.5 group-hover:text-[#B49A67] transition-colors">
                      The Last Submission
                    </h2>
                    <p className="font-sans text-xs text-[#A9A398] mt-1 line-clamp-2">
                      Postgraduate fellow Maya Lin asphyxiated inside the hermetically sealed Server Room 4B with a software maglock override.
                    </p>
                  </div>
                </div>

                <div className="bg-[#171717] p-3 border border-[#2E2B26] text-xs font-mono-archive space-y-1 text-[#A9A398]">
                  <div className="flex justify-between">
                    <span>VICTIM:</span>
                    <span className="text-[#E8DFCC]">{cases['case-002'].victim.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ESTIMATED TIME:</span>
                    <span className="text-[#E8DFCC]">{cases['case-002'].victim.timeOfDeath}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PRIMARY ANOMALY:</span>
                    <span className="text-[#702D35] font-semibold">Halon Override via Admin Terminal</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#2E2B26] flex items-center justify-between">
                <span className="font-mono-archive text-xs text-[#A9A398]">
                  4 Suspects · 7 Forensic Items
                </span>
                <button
                  onClick={() => handleStartInvestigation('case-002')}
                  className="btn-dossier px-4 py-1.5 text-xs font-mono-archive flex items-center gap-2 cursor-pointer group-hover:border-[#B49A67]"
                >
                  <span>Examine Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B49A67]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Methodology Strip */}
        <div className="mt-12 pt-8 border-t border-[#2E2B26] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div>
            <span className="font-mono-archive text-[10px] text-[#B49A67] block mb-1">
              01 / GENERATIVE INTERROGATIONS
            </span>
            <h3 className="font-editorial text-base font-bold text-[#E8DFCC] mb-1">
              Psychological Boundaries
            </h3>
            <p className="text-[#A9A398] font-sans leading-relaxed">
              Suspects only speak from their vantage point, defending their alibis without omniscient reveals.
            </p>
          </div>

          <div>
            <span className="font-mono-archive text-[10px] text-[#B49A67] block mb-1">
              02 / FORENSIC TELEMETRY
            </span>
            <h3 className="font-editorial text-base font-bold text-[#E8DFCC] mb-1">
              Scientific Verification
            </h3>
            <p className="text-[#A9A398] font-sans leading-relaxed">
              Examine aconitine toxicology, mechanical escapement teeth, and server console overrides.
            </p>
          </div>

          <div>
            <span className="font-mono-archive text-[10px] text-[#B49A67] block mb-1">
              03 / INVESTIGATIVE SYNDICATE
            </span>
            <h3 className="font-editorial text-base font-bold text-[#E8DFCC] mb-1">
              Multiplayer Dossier
            </h3>
            <p className="text-[#A9A398] font-sans leading-relaxed">
              Collaborate using a shared room key while maintaining individual interrogation records.
            </p>
          </div>

          <div>
            <span className="font-mono-archive text-[10px] text-[#B49A67] block mb-1">
              04 / FORMAL COURT INDICTMENT
            </span>
            <h3 className="font-editorial text-base font-bold text-[#E8DFCC] mb-1">
              Judicial Resolution
            </h3>
            <p className="text-[#A9A398] font-sans leading-relaxed">
              Pinpoint the culprit, weapon, broken contradiction, and motive before the unsealed reveal.
            </p>
          </div>
        </div>
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#2E2B26] px-4 sm:px-8 py-4 text-xs font-mono-archive text-[#A9A398] flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>BLACKWOOD UNIVERSITY CONSTABULARY · ARCHIVAL RECORD 1884–2026</span>
        <span>CONFIDENTIAL INQUEST JURISDICTION · ALL PROCEEDINGS RECORDED</span>
      </footer>
    </div>
  );
};
