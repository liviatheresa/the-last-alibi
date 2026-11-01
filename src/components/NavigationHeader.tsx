import React, { useState } from 'react';
import { ScreenId, CaseData, Team } from '../types';
import { sound } from '../services/soundEffects';
import {
  Volume2,
  VolumeX,
  CloudRain,
  Shield,
  Copy,
  CheckCircle2,
  Database,
} from 'lucide-react';

interface Props {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  activeCase: CaseData;
  team: Team;
  selectedSuspectId: string | null;
}

export const NavigationHeader: React.FC<Props> = ({
  currentScreen,
  onNavigate,
  activeCase,
  team,
  selectedSuspectId,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [rainActive, setRainActive] = useState(sound.isRainActive());
  const [copiedCode, setCopiedCode] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleMuteToggle = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleRainToggle = () => {
    const active = sound.toggleRainAmbiance();
    setRainActive(active);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(team.code);
    setCopiedCode(true);
    sound.playTypewriter();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const navItems: Array<{ id: ScreenId; label: string; index: string }> = [
    { id: 'investigation_dashboard', label: 'Dashboard', index: '01' },
    { id: 'case_briefing', label: 'Briefing', index: '02' },
    { id: 'suspect_profiles', label: `Suspects (${activeCase.suspects.length})`, index: '03' },
    { id: 'interrogation_room', label: 'Interrogation', index: '04' },
    { id: 'evidence_library', label: `Evidence (${activeCase.evidence.length})`, index: '05' },
    { id: 'investigation_notes', label: 'Blackboard', index: '06' },
    { id: 'final_accusation', label: 'Indictment', index: '07' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#171717] border-b border-[#2E2B26] text-[#E8DFCC]">
        {/* Top Zone: Archival Masthead Ribbon */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between border-b border-[#24211D]">
          {/* Zone 1: Wordmark & Accession Kicker */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                sound.playTapeClick();
                onNavigate('case_selection');
              }}
              className="group text-left cursor-pointer flex items-baseline gap-3"
              title="Return to Classified Case Registry"
            >
              <span className="font-monumental text-base sm:text-lg font-bold tracking-widest text-[#E8DFCC] group-hover:text-[#B49A67] transition-colors">
                THE LAST ALIBI
              </span>
              <span className="hidden sm:inline font-mono-archive text-[11px] text-[#A9A398] uppercase tracking-widest">
                Blackwood Constabulary · Archival Division
              </span>
            </button>

            <span className="hidden lg:inline text-[#3A3630]">/</span>

            {/* Current Active Case Reference */}
            <div className="hidden lg:flex items-center gap-2 font-mono-archive text-[11px] text-[#A9A398]">
              <span className="text-[#B49A67]">{activeCase.code}</span>
              <span>—</span>
              <span className="text-[#E8DFCC] truncate max-w-[220px] font-editorial italic text-xs">
                {activeCase.title}
              </span>
            </div>
          </div>

          {/* Zone 3: Functional Syndicate Registry & Quiet Ambience Controls */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            {/* Syndicate Room Key */}
            <div className="flex items-center border border-[#332F2A] bg-[#22201D] px-2.5 py-1">
              <span className="font-mono-archive text-[11px] text-[#A9A398] mr-2 hidden sm:inline">
                SYNDICATE:
              </span>
              <span className="font-mono-archive text-[11px] text-[#B49A67] font-semibold tracking-wider">
                {team.code}
              </span>
              <button
                onClick={handleCopyCode}
                className="ml-2 text-[#A9A398] hover:text-[#E8DFCC] transition-colors cursor-pointer"
                title="Copy syndicate room key for co-investigators"
              >
                {copiedCode ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A67]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Syndicate Bureau Drawer Button */}
            <button
              onClick={() => {
                sound.playTapeClick();
                onNavigate('team_lobby');
              }}
              className="hidden md:flex items-center gap-1.5 border border-[#332F2A] hover:border-[#B49A67] bg-[#22201D] text-[#E8DFCC] px-2.5 py-1 font-mono-archive text-[11px] transition-colors cursor-pointer"
              title="Inspect Detective Credentials & Roster"
            >
              <Shield className="w-3 h-3 text-[#B49A67]" />
              <span className="truncate max-w-[130px]">{team.name}</span>
            </button>

            {/* Ambiance Rain */}
            <button
              onClick={handleRainToggle}
              className={`p-1.5 border transition-colors cursor-pointer ${
                rainActive
                  ? 'border-[#B49A67] bg-[#22201D] text-[#B49A67]'
                  : 'border-[#332F2A] bg-[#171717] text-[#A9A398] hover:text-[#E8DFCC]'
              }`}
              title={rainActive ? 'Silence Quad Rain Audio' : 'Play Atmospheric Quad Rain Audio'}
            >
              <CloudRain className="w-3.5 h-3.5" />
            </button>

            {/* Master SFX Audio */}
            <button
              onClick={handleMuteToggle}
              className={`p-1.5 border transition-colors cursor-pointer ${
                isMuted
                  ? 'border-[#702D35] bg-[#22201D] text-[#702D35]'
                  : 'border-[#332F2A] bg-[#171717] text-[#A9A398] hover:text-[#E8DFCC]'
              }`}
              title={isMuted ? 'Unmute Forensic Audio Effects' : 'Mute Forensic Audio Effects'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Field Manual Help Button */}
            <button
              onClick={() => {
                sound.playTapeClick();
                setShowHelpModal(true);
              }}
              className="px-2.5 py-1 border border-[#B49A67]/60 hover:border-[#B49A67] bg-[#22201D] text-[#B49A67] font-mono-archive text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
              title="Open Investigator's Field Manual & Rules"
            >
              <span>[?] MANUAL</span>
            </button>

            {/* Backend / Architecture Blueprint Modal */}
            <button
              onClick={() => {
                sound.playTapeClick();
                setShowSyncModal(true);
              }}
              className="p-1.5 border border-[#332F2A] hover:border-[#B49A67] bg-[#171717] text-[#A9A398] hover:text-[#E8DFCC] transition-colors cursor-pointer"
              title="View Multi-Detective Architecture"
            >
              <Database className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Zone 2: Editorial Navigation Rail */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center overflow-x-auto gap-1 sm:gap-6 py-2 scrollbar-none text-xs">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playTypewriter();
                  onNavigate(item.id);
                }}
                className={`py-1.5 px-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 font-sans tracking-wide text-xs ${
                  isActive
                    ? 'text-[#B49A67] font-semibold border-b-2 border-[#B49A67]'
                    : 'text-[#A9A398] hover:text-[#E8DFCC] border-b-2 border-transparent'
                }`}
              >
                <span className="font-mono-archive text-[10px] opacity-60">
                  {item.index}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Investigator's Field Manual Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="bg-[#22201D] border border-[#3D3933] max-w-2xl w-full p-6 shadow-2xl relative text-[#E8DFCC]">
            <div className="flex items-center justify-between pb-3 border-b border-[#332F2A]">
              <div>
                <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-widest block">
                  CONSTABULARY SPECIAL INQUEST PROTOCOL
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#E8DFCC]">
                  Investigator's Field Manual & Game Guide
                </h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-[#A9A398] hover:text-[#E8DFCC] p-1 cursor-pointer font-mono-archive text-sm"
              >
                [ESC]
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs font-sans max-h-[70vh] overflow-y-auto pr-2">
              <div className="bg-[#171717] p-4 border border-[#2E2B26] space-y-2">
                <span className="font-mono-archive text-[11px] text-[#B49A67] uppercase font-bold block">
                  01. THE INVESTIGATION CYCLE
                </span>
                <ol className="list-decimal list-inside space-y-1 text-[#A9A398] leading-relaxed">
                  <li><strong className="text-[#E8DFCC]">Case Briefing:</strong> Review the victim's cause of death, autopsy screen, crime scene clues, and timeline.</li>
                  <li><strong className="text-[#E8DFCC]">Evidence Locker:</strong> Inspect laboratory chemical analyses and digital logs. Note which pieces contradict specific statements.</li>
                  <li><strong className="text-[#E8DFCC]">Interrogation Room:</strong> Question each suspect. Use tactics like "Press on Alibi" or push physical evidence across the desk to raise their stress and catch them in a lie.</li>
                  <li><strong className="text-[#E8DFCC]">Blackboard Notes:</strong> Pin your deductions, calibrate suspect guilt ratings (1-5 stars), and formulate your case hypothesis.</li>
                  <li><strong className="text-[#E8DFCC]">Grand Indictment:</strong> Accuse the Culprit, specify the Weapon, broken Contradiction, and true Motive to unseal the verdict.</li>
                </ol>
              </div>

              <div className="bg-[#171717] p-4 border border-[#2E2B26] space-y-2">
                <span className="font-mono-archive text-[11px] text-[#B49A67] uppercase font-bold block">
                  02. SUSPECT PSYCHOLOGY & STRESS GAUGE
                </span>
                <div className="space-y-1.5 text-[#A9A398] font-mono-archive text-[11px]">
                  <div><strong className="text-[#A9A398]">0% — 35% (Composed):</strong> The witness will maintain polished academic poise and deny involvement.</div>
                  <div><strong className="text-[#B49A67]">36% — 65% (Uneasy):</strong> Speech begins to tighten; subtle behavioral tells appear in the transcript.</div>
                  <div><strong className="text-[#702D35]">66% — 85% (Agitated):</strong> Defensive hostility or panic; partial admissions of secondary secrets.</div>
                  <div><strong className="text-[#702D35] font-bold">86%+ (Cracking):</strong> When presented with undeniable physical forensic proof, their alibi facade shatters.</div>
                </div>
              </div>

              <div className="bg-[#171717] p-4 border border-[#2E2B26] space-y-2">
                <span className="font-mono-archive text-[11px] text-[#B49A67] uppercase font-bold block">
                  03. INDICTMENT SCORING (MAX 100%)
                </span>
                <p className="text-[#A9A398] leading-relaxed">
                  Your final score is calculated across four essential pillars: Culprit ID (40%), Weapon/Lethal Agent (20%), Broken Alibi Contradiction (20%), and Underlying Motive (20%). Securing 100% awards the rank of <em>Chief Superintendent</em>.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#332F2A] flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="btn-gold px-5 py-2 text-xs font-mono-archive cursor-pointer uppercase"
              >
                Return to Inquest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backend & Supabase Blueprint Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="bg-[#22201D] border border-[#3D3933] max-w-lg w-full p-6 shadow-2xl relative text-[#E8DFCC]">
            <div className="flex items-center justify-between pb-3 border-b border-[#332F2A]">
              <div>
                <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-widest block">
                  SYSTEM ARCHITECTURE
                </span>
                <h3 className="font-editorial text-xl font-bold text-[#E8DFCC]">
                  Gemini & Supabase Technical Schema
                </h3>
              </div>
              <button
                onClick={() => setShowSyncModal(false)}
                className="text-[#A9A398] hover:text-[#E8DFCC] p-1 cursor-pointer font-mono-archive text-sm"
              >
                [ESC]
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-[#A9A398] font-sans leading-relaxed">
              <p>
                <strong className="text-[#E8DFCC]">AI Interrogation Engine:</strong> Mounted server-side on Express (<code className="font-mono-archive text-[#B49A67]">/api/interrogate</code>) with Google GenAI SDK using <code className="font-mono-archive text-[#B49A67]">gemini-3.8-flash</code>. Each suspect receives isolated psychological boundaries to preserve mystery integrity without omniscient reveals.
              </p>

              <div className="bg-[#171717] p-3.5 border border-[#332F2A] font-mono-archive text-[11px] space-y-1">
                <div className="text-[#B49A67] font-semibold">// Supabase Database Architecture:</div>
                <div className="text-[#A9A398]">• teams (id uuid, code text, name text, lead_detective text)</div>
                <div className="text-[#A9A398]">• interrogations (id, team_id, case_id, suspect_id, stress)</div>
                <div className="text-[#A9A398]">• chat_messages (id, interrogation_id, sender, text, reaction)</div>
                <div className="text-[#A9A398]">• investigation_notes (id, team_id, case_id, author, content)</div>
              </div>

              <p className="text-[11px]">
                Currently persistent across all tabs via team-isolated storage. Plug in your Supabase credentials anytime for live multi-detective synchronization.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#332F2A] flex justify-end">
              <button
                onClick={() => setShowSyncModal(false)}
                className="btn-gold px-4 py-1.5 text-xs font-mono-archive cursor-pointer"
              >
                Close Docket
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
