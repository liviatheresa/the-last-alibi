import React, { useState } from 'react';
import { ScreenId, Team, TeamMember } from '../types';
import { StorageService } from '../services/storageService';
import { sound } from '../services/soundEffects';
import {
  Shield,
  Copy,
  CheckCircle2,
  ArrowRight,
  Plus,
  RefreshCw,
  BadgeCheck,
} from 'lucide-react';

interface Props {
  currentTeam: Team;
  onUpdateTeam: (team: Team) => void;
  onNavigate: (screen: ScreenId) => void;
}

const AVAILABLE_ROLES = [
  'Lead Investigator',
  'Forensic Pathologist',
  'Cyber Telemetry Analyst',
  'Behavioral Profiler',
  'Evidence Custodian',
];

export const TeamLobby: React.FC<Props> = ({ currentTeam, onUpdateTeam, onNavigate }) => {
  const [teamName, setTeamName] = useState(currentTeam.name);
  const [leadDetective, setLeadDetective] = useState(currentTeam.leadDetective);
  const [selectedRole, setSelectedRole] = useState(currentTeam.currentRole);
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleRegenerateCode = () => {
    sound.playTapeClick();
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'BW-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const updated: Team = {
      ...currentTeam,
      code,
    };
    onUpdateTeam(updated);
    StorageService.saveCurrentTeam(updated);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentTeam.code);
    setCopiedCode(true);
    sound.playTypewriter();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playDramaticChime();
    const updated: Team = {
      ...currentTeam,
      name: teamName.trim() || 'Blackwood Inquiries Unit',
      leadDetective: leadDetective.trim() || 'Detective Inspector',
      currentRole: selectedRole,
    };
    onUpdateTeam(updated);
    StorageService.saveCurrentTeam(updated);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) return;
    sound.playTapeClick();
    const code = roomCodeInput.trim().toUpperCase();
    const updated: Team = {
      ...currentTeam,
      code: code.startsWith('BW-') ? code : `BW-${code}`,
    };
    onUpdateTeam(updated);
    StorageService.saveCurrentTeam(updated);
    setRoomCodeInput('');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleAddTeammate = () => {
    sound.playTypewriter();
    const roles = ['Forensic Specialist', 'Audio Wiretap Analyst', 'Toxicologist', 'Field Investigator'];
    const names = ['Detective K. Morgan', 'Officer T. Wu', 'Inspector A. Laurent', 'Dr. P. Dubois'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const newMember: TeamMember = {
      id: `member_${Date.now()}`,
      name: randomName,
      role: randomRole,
      badgeNumber: `BW-${Math.floor(1000 + Math.random() * 9000)}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      online: true,
    };
    const updated: Team = {
      ...currentTeam,
      members: [...currentTeam.members, newMember],
    };
    onUpdateTeam(updated);
    StorageService.saveCurrentTeam(updated);
  };

  return (
    <div className="min-h-screen bg-[#171717] text-[#E8DFCC] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Editorial Header */}
        <div className="border-b border-[#2E2B26] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono-archive text-[11px] text-[#B49A67] uppercase tracking-widest mb-1">
              CONSTABULARY SPECIAL INQUIRIES · REGISTRY BUREAU
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#E8DFCC]">
              Syndicate Bureau Credentials
            </h1>
            <p className="font-editorial text-sm text-[#A9A398] italic mt-0.5">
              Configure investigator credentials, calibrate specializations, and distribute the syndicate key.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playDramaticChime();
              onNavigate('case_selection');
            }}
            className="btn-gold px-5 py-2 text-xs font-mono-archive uppercase tracking-wider flex items-center gap-2 cursor-pointer"
          >
            <span>Proceed to Case Selection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isSavedNotice && (
          <div className="bg-[#22201D] border border-[#B49A67] p-3 text-xs font-mono-archive text-[#B49A67] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Credentials ratified in the Blackwood Constabulary archival registry.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Credentials Docket Form */}
          <div className="lg:col-span-2 manila-card p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E2B26]">
              <span className="font-mono-archive text-xs text-[#B49A67] uppercase tracking-wider">
                INVESTIGATOR REGISTRATION DOCKET
              </span>
              <span className="stamp-archived text-[10px]">VERIFIED APPOINTMENT</span>
            </div>

            <form onSubmit={handleSaveTeam} className="space-y-5 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-archive text-[11px] text-[#A9A398] mb-1.5 uppercase">
                    Syndicate Unit Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Special Inquiries Unit (Division 4)"
                    className="w-full bg-[#171717] border border-[#332F2A] focus:border-[#B49A67] px-3 py-2 text-[#E8DFCC] font-mono-archive outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-mono-archive text-[11px] text-[#A9A398] mb-1.5 uppercase">
                    Lead Inquest Officer
                  </label>
                  <input
                    type="text"
                    value={leadDetective}
                    onChange={(e) => setLeadDetective(e.target.value)}
                    placeholder="e.g. Senior Inspector Vance-Cross"
                    className="w-full bg-[#171717] border border-[#332F2A] focus:border-[#B49A67] px-3 py-2 text-[#E8DFCC] font-mono-archive outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono-archive text-[11px] text-[#A9A398] mb-2 uppercase">
                  Investigative Specialization Discipline
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {AVAILABLE_ROLES.map((role) => {
                    const isSelected = selectedRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          sound.playTypewriter();
                          setSelectedRole(role);
                        }}
                        className={`p-3 text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2A2723] border-[#B49A67] text-[#E8DFCC]'
                            : 'bg-[#171717] border-[#332F2A] text-[#A9A398] hover:border-[#3D3933]'
                        }`}
                      >
                        <div className="font-mono-archive text-xs font-semibold">{role}</div>
                        <div className="text-[10px] text-[#A9A398] mt-1 font-sans">
                          {role === 'Lead Investigator' && 'Cross-examines alibi timelines'}
                          {role === 'Forensic Pathologist' && 'Decodes toxicological kinetics'}
                          {role === 'Cyber Telemetry Analyst' && 'Scrutinizes server audit logs'}
                          {role === 'Behavioral Profiler' && 'Monitors polygraph stress tells'}
                          {role === 'Evidence Custodian' && 'Audits physical custody tags'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#2E2B26] flex items-center justify-between">
                <span className="font-mono-archive text-[11px] text-[#A9A398]">
                  OFFICIAL BADGE NO: <strong className="text-[#E8DFCC]">{currentTeam.badgeNumber}</strong>
                </span>
                <button
                  type="submit"
                  className="btn-gold px-4 py-2 text-xs font-mono-archive uppercase cursor-pointer"
                >
                  Ratify Credentials
                </button>
              </div>
            </form>

            {/* Sync to Existing Syndicate */}
            <div className="pt-6 border-t border-[#2E2B26]">
              <span className="font-mono-archive text-xs text-[#B49A67] uppercase tracking-wider block mb-1">
                ATTACH TO EXISTING SYNDICATE
              </span>
              <p className="font-sans text-xs text-[#A9A398] mb-3">
                Joining a colleague's investigation? Enter their syndicate key to link your terminal.
              </p>
              <form onSubmit={handleJoinByCode} className="flex gap-2">
                <input
                  type="text"
                  placeholder="E.G. BW-8821"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  className="bg-[#171717] border border-[#332F2A] focus:border-[#B49A67] px-3 py-2 text-xs font-mono-archive text-[#E8DFCC] flex-1 uppercase tracking-widest outline-none"
                />
                <button
                  type="submit"
                  className="btn-dossier px-4 py-2 text-xs font-mono-archive cursor-pointer"
                >
                  Link Key
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Leatherette Badge & Roster */}
          <div className="space-y-6">
            {/* Constabulary Clothbound Identification Card */}
            <div className="bg-[#22201D] border-2 border-[#3D3933] p-5 relative shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#332F2A] mb-4">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-[#B49A67]" />
                  <span className="font-mono-archive text-xs text-[#E8DFCC] font-semibold tracking-wider">
                    CONSTABULARY ID
                  </span>
                </div>
                <span className="stamp-verified-evidence text-[9px]">ACTIVE INQUEST</span>
              </div>

              <div className="space-y-1">
                <span className="font-mono-archive text-[10px] text-[#A9A398] block uppercase">
                  NAME OF APPOINTEE
                </span>
                <div className="font-editorial text-2xl font-bold text-[#E8DFCC]">
                  {currentTeam.leadDetective}
                </div>
                <div className="font-mono-archive text-xs text-[#B49A67]">
                  {currentTeam.currentRole}
                </div>
                <div className="font-mono-archive text-[10px] text-[#A9A398] pt-1">
                  CREDENTIAL #{currentTeam.badgeNumber} · BLACKWOOD SPECIAL COMMISSION
                </div>
              </div>

              {/* Room Syndicate Key */}
              <div className="mt-5 pt-4 border-t border-[#2E2B26] bg-[#171717] p-3 border border-[#2E2B26]">
                <div className="flex items-center justify-between font-mono-archive text-[10px] text-[#A9A398] mb-1">
                  <span>ROOM ACCESS KEY:</span>
                  <button
                    onClick={handleRegenerateCode}
                    className="text-[#A9A398] hover:text-[#B49A67] flex items-center gap-1 cursor-pointer"
                    title="Generate New Access Key"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regen</span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-archive text-xl font-bold text-[#B49A67] tracking-widest">
                    {currentTeam.code}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="text-xs font-mono-archive text-[#A9A398] hover:text-[#E8DFCC] border border-[#332F2A] px-2 py-1 cursor-pointer"
                  >
                    {copiedCode ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>
            </div>

            {/* Bureau Roster */}
            <div className="manila-card p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26]">
                <span className="font-mono-archive text-xs text-[#B49A67] uppercase tracking-wider">
                  SYNDICATE ROSTER ({currentTeam.members.length + 1})
                </span>
                <button
                  onClick={handleAddTeammate}
                  className="font-mono-archive text-[11px] text-[#A9A398] hover:text-[#B49A67] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Enlist Field Officer</span>
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono-archive">
                {/* Self */}
                <div className="p-2.5 bg-[#171717] border border-[#2E2B26] flex items-center justify-between">
                  <div>
                    <div className="text-[#E8DFCC] font-semibold">{currentTeam.leadDetective} (You)</div>
                    <div className="text-[10px] text-[#B49A67]">{currentTeam.currentRole}</div>
                  </div>
                  <span className="text-[10px] text-[#A9A398]">ACTIVE</span>
                </div>

                {/* Simulated co-detectives */}
                {currentTeam.members.map((member) => (
                  <div
                    key={member.id}
                    className="p-2.5 bg-[#171717] border border-[#2E2B26] flex items-center justify-between text-[#A9A398]"
                  >
                    <div>
                      <div className="text-[#E8DFCC]">{member.name}</div>
                      <div className="text-[10px] text-[#A9A398]">{member.role}</div>
                    </div>
                    <span className="text-[10px]">{member.badgeNumber}</span>
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
