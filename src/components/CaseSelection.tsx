import React from 'react';
import { ScreenId, CaseData } from '../types';
import { sound } from '../services/soundEffects';
import {
  ArrowRight,
  Clock,
  Users,
  Archive,
  Compass,
} from 'lucide-react';

interface Props {
  cases: Record<string, CaseData>;
  activeCaseId: string;
  onSelectCase: (caseId: 'case-001' | 'case-002') => void;
  onNavigate: (screen: ScreenId) => void;
}

export const CaseSelection: React.FC<Props> = ({
  cases,
  activeCaseId,
  onSelectCase,
  onNavigate,
}) => {
  const handleOpenCase = (id: 'case-001' | 'case-002') => {
    sound.playDramaticChime();
    onSelectCase(id);
    onNavigate('case_briefing');
  };

  return (
    <div className="min-h-screen bg-[#171717] text-[#E8DFCC] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Editorial Header */}
        <div className="border-b border-[#2E2B26] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono-archive text-[11px] text-[#B49A67] uppercase tracking-widest mb-1">
              ARCHIVAL VAULT · UNRESOLVED INQUEST DOSSIERS
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#E8DFCC]">
              Select Investigation Dossier
            </h1>
            <p className="font-editorial text-base text-[#A9A398] italic mt-0.5">
              Two active homicide inquiries pending before the Blackwood University Court of Inquest.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playTapeClick();
              onNavigate('team_lobby');
            }}
            className="btn-dossier px-4 py-2 text-xs font-mono-archive cursor-pointer"
          >
            ← View Syndicate Bureau
          </button>
        </div>

        {/* The Two Archival Cases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Object.values(cases).map((caseData) => {
            const isCurrentlySelected = activeCaseId === caseData.id;
            return (
              <div
                key={caseData.id}
                className={`manila-card p-6 flex flex-col justify-between transition-all duration-200 ${
                  isCurrentlySelected ? 'border-[#B49A67]' : 'border-[#332F2A]'
                }`}
              >
                <div>
                  {/* Top Case Label */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#2E2B26] mb-5 text-xs font-mono-archive">
                    <div className="flex items-center gap-2">
                      <span className="text-[#B49A67] font-bold">{caseData.code}</span>
                      <span className="text-[#3A3630]">/</span>
                      <span className="text-[#A9A398] uppercase">{caseData.difficulty} INQUEST</span>
                    </div>
                    <span className="stamp-confidential">ACTIVE INQUIRY</span>
                  </div>

                  {/* Asymmetric Dossier Layout */}
                  <div className="flex flex-col sm:flex-row items-start gap-5 mb-5">
                    {/* Archival Mounted Photograph */}
                    <div className="relative shrink-0 p-1 bg-[#22201D] border border-[#3A3630]">
                      <img
                        src={caseData.victim.photo}
                        alt={caseData.victim.name}
                        className="w-24 h-28 sm:w-28 sm:h-32 object-cover filter contrast-105"
                      />
                      <div className="mt-1 font-mono-archive text-[9px] text-center text-[#A9A398] uppercase">
                        DECEASED
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-wider block">
                        LOCATION: {caseData.location}
                      </span>
                      <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#E8DFCC]">
                        {caseData.title}
                      </h2>
                      <div className="text-xs font-sans text-[#A9A398] space-y-0.5 pt-1">
                        <div>
                          Victim: <strong className="text-[#E8DFCC]">{caseData.victim.name}</strong> ({caseData.victim.age})
                        </div>
                        <div className="text-[11px] text-[#A9A398]">
                          {caseData.victim.title}
                        </div>
                        <div className="font-mono-archive text-[11px] text-[#702D35] pt-0.5">
                          Cause: {caseData.victim.causeOfDeath}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Synopsis Text */}
                  <p className="font-editorial text-sm text-[#A9A398] italic leading-relaxed border-t border-[#2E2B26] pt-4">
                    "{caseData.synopsis}"
                  </p>

                  {/* Tabular Inquest Stats */}
                  <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-[#2E2B26] text-center text-xs font-mono-archive">
                    <div className="bg-[#171717] p-2.5 border border-[#2E2B26]">
                      <span className="text-[#A9A398] text-[10px] block">EST. INQUEST</span>
                      <span className="text-[#E8DFCC] font-semibold">{caseData.estimatedTime}</span>
                    </div>

                    <div className="bg-[#171717] p-2.5 border border-[#2E2B26]">
                      <span className="text-[#A9A398] text-[10px] block">SUSPECTS</span>
                      <span className="text-[#E8DFCC] font-semibold">{caseData.suspects.length} PERSONS</span>
                    </div>

                    <div className="bg-[#171717] p-2.5 border border-[#2E2B26]">
                      <span className="text-[#A9A398] text-[10px] block">PHYSICAL PROOF</span>
                      <span className="text-[#E8DFCC] font-semibold">{caseData.evidence.length} ITEMS</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-4 border-t border-[#2E2B26] flex items-center justify-between">
                  <span className="font-mono-archive text-xs text-[#A9A398]">
                    Classified Senate File
                  </span>

                  <button
                    onClick={() => handleOpenCase(caseData.id as 'case-001' | 'case-002')}
                    className="btn-gold px-5 py-2 text-xs font-mono-archive flex items-center gap-2 cursor-pointer"
                  >
                    <span>Unseal Case File</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
