import React, { useState, useEffect } from 'react';
import { ScreenId, CaseData, CrimeSceneHotspot, DetectiveNote } from '../types';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { TextAudioPlayer } from './TextAudioPlayer';
import { StorageService } from '../services/storageService';
import {
  Skull,
  Radio,
  Clock,
  MapPin,
  ArrowRight,
  Play,
  Pause,
  AlertOctagon,
  CheckCircle2,
  Compass,
  Search,
  Pin,
  Layers,
} from 'lucide-react';

interface Props {
  caseData: CaseData;
  onNavigate: (screen: ScreenId) => void;
}

export const CaseBriefing: React.FC<Props> = ({ caseData, onNavigate }) => {
  const [isPlayingDispatchAudio, setIsPlayingDispatchAudio] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'blueprint' | 'autopsy' | 'dispatch' | 'timeline'>(
    'overview'
  );
  const [selectedHotspot, setSelectedHotspot] = useState<CrimeSceneHotspot | null>(
    () => (caseData.crimeSceneHotspots && caseData.crimeSceneHotspots[0]) || null
  );
  const [timelineViewMode, setTimelineViewMode] = useState<'chronological' | 'matrix'>('chronological');
  const [pinnedNotice, setPinnedNotice] = useState(false);

  useEffect(() => {
    const unsub = speech.subscribe((currId) => {
      setIsPlayingDispatchAudio(currId === `dispatch_tape_${caseData.id}`);
    });
    return () => {
      unsub();
      speech.stop();
    };
  }, [caseData.id]);

  const handlePlayDispatchTape = () => {
    sound.playTapeClick();
    speech.toggle(`dispatch_tape_${caseData.id}`, caseData.dispatchLog, {
      voiceType: 'dispatch',
    });
  };

  const handlePinHotspotToBlackboard = (hotspot: CrimeSceneHotspot) => {
    sound.playTypewriter();
    const team = StorageService.getCurrentTeam();
    const existingNotes = StorageService.getNotes(team.id, caseData.id);

    const newNote: DetectiveNote = {
      id: `note_hs_${Date.now()}`,
      author: `${team.leadDetective} (Forensics)`,
      content: `[SCENE TRACE: ${hotspot.name}] ${hotspot.forensicObservation} Key finding: ${hotspot.discoveredDetail}`,
      timestamp: 'Just now',
      category: 'lead',
      linkedEvidenceId: hotspot.tiedEvidenceId,
      isPinned: true,
    };

    StorageService.saveNotes(team.id, caseData.id, [newNote, ...existingNotes]);
    setPinnedNotice(true);
    setTimeout(() => setPinnedNotice(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#171717] text-[#E8DFCC] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Binder Header Tab */}
        <div className="bg-[#22201D] border border-[#332F2A] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2E2B26]">
            <div>
              <div className="flex items-center gap-3 font-mono-archive text-[11px] text-[#B49A67] uppercase tracking-widest">
                <span>INQUEST DOSSIER</span>
                <span>·</span>
                <span>{caseData.code}</span>
                <span>·</span>
                <span className="text-[#A9A398]">{caseData.location}</span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#E8DFCC] mt-1">
                {caseData.title}
              </h1>
              <p className="font-editorial text-sm sm:text-base text-[#A9A398] italic mt-0.5">
                {caseData.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="stamp-confidential">
                CONFIDENTIAL RECORD
              </span>
              <button
                onClick={() => {
                  sound.playDramaticChime();
                  onNavigate('investigation_dashboard');
                }}
                className="btn-gold px-5 py-2 text-xs font-mono-archive uppercase flex items-center gap-2 cursor-pointer"
              >
                <span>Investigation Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Editorial Section Tabs */}
          <div className="flex items-center gap-1 sm:gap-4 pt-3 overflow-x-auto text-xs font-mono-archive scrollbar-none">
            {[
              { id: 'overview', label: '01 / VICTIM & SCENE' },
              { id: 'blueprint', label: '02 / CRIME SCENE BLUEPRINT' },
              { id: 'autopsy', label: '03 / PATHOLOGY & TOXICOLOGY' },
              { id: 'dispatch', label: '04 / 911 AUDIO LOG' },
              { id: 'timeline', label: '05 / NIGHT TIMELINE & ALIBI MATRIX' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playTypewriter();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`py-1.5 px-3 transition-colors cursor-pointer whitespace-nowrap uppercase tracking-wider ${
                  activeTab === tab.id
                    ? 'text-[#B49A67] font-semibold border-b-2 border-[#B49A67]'
                    : 'text-[#A9A398] hover:text-[#E8DFCC] border-b-2 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Victim & Scene */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mounted Victim Inquest Card */}
            <div className="manila-card p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26]">
                <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-wider">
                  DECEASED INQUEST CARD
                </span>
                <div className="flex items-center gap-2">
                  <TextAudioPlayer
                    id={`victim_profile_${caseData.id}`}
                    text={`Deceased victim dossier. Name: ${caseData.victim.name}. Title: ${caseData.victim.title}. Age at death: ${caseData.victim.age} years. Estimated time of collapse: ${caseData.victim.timeOfDeath}. Lethal cause: ${caseData.victim.causeOfDeath}. Discovered location: ${caseData.victim.foundLocation}.`}
                    persona="narrator"
                    label="Listen"
                    playingLabel="Playing..."
                    variant="pill"
                  />
                  <span className="stamp-confidential text-[9px]">CORONER CERTIFIED</span>
                </div>
              </div>

              <div className="p-1 bg-[#171717] border border-[#3A3630]">
                <img
                  src={caseData.victim.photo}
                  alt={caseData.victim.name}
                  className="w-full h-56 object-cover filter contrast-105"
                />
              </div>

              <div className="space-y-2 text-xs font-mono-archive">
                <div>
                  <span className="text-[#A9A398] text-[10px] block">NAME OF VICTIM</span>
                  <span className="font-editorial text-xl font-bold text-[#E8DFCC]">{caseData.victim.name}</span>
                </div>
                <div>
                  <span className="text-[#A9A398] text-[10px] block">CAMPUS TITLE</span>
                  <span className="text-[#E8DFCC] font-sans">{caseData.victim.title}</span>
                </div>
                <div>
                  <span className="text-[#A9A398] text-[10px] block">AGE AT DEATH</span>
                  <span className="text-[#E8DFCC]">{caseData.victim.age} Years</span>
                </div>
                <div>
                  <span className="text-[#A9A398] text-[10px] block">TIME OF COLLAPSE</span>
                  <span className="text-[#B49A67]">{caseData.victim.timeOfDeath}</span>
                </div>
                <div>
                  <span className="text-[#A9A398] text-[10px] block">LETHAL CAUSE</span>
                  <span className="text-[#702D35] font-semibold">{caseData.victim.causeOfDeath}</span>
                </div>
              </div>
            </div>

            {/* Scene Overview & Field Observations */}
            <div className="lg:col-span-2 space-y-6">
              <div className="manila-card p-6 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26]">
                  <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-wider">
                    PRIMARY INCIDENT SYNOPSIS
                  </span>
                  <div className="flex items-center gap-2">
                    <TextAudioPlayer
                      id={`synopsis_${caseData.id}`}
                      text={`${caseData.title}. ${caseData.subtitle}. Incident location: ${caseData.location}. Synopsis: ${caseData.synopsis}`}
                      persona="narrator"
                      label="Listen to Synopsis"
                      playingLabel="Playing Synopsis..."
                      variant="pill"
                    />
                    <span className="font-mono-archive text-[11px] text-[#A9A398]">
                      {caseData.location}
                    </span>
                  </div>
                </div>
                <p className="font-editorial text-lg text-[#E8DFCC] leading-relaxed italic">
                  "{caseData.synopsis}"
                </p>
              </div>

              {/* Physical Crime Scene Checklist */}
              <div className="manila-card p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26]">
                  <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-wider block">
                    PHYSICAL CRIME SCENE OBSERVATIONS
                  </span>
                  <TextAudioPlayer
                    id={`scene_obs_${caseData.id}`}
                    text={`Physical crime scene observations for ${caseData.location}. ${caseData.crimeSceneDetails.join('. ')}`}
                    persona="narrator"
                    label="Listen to Findings"
                    playingLabel="Playing..."
                    variant="pill"
                  />
                </div>

                <ul className="space-y-2.5 text-xs font-sans">
                  {caseData.crimeSceneDetails.map((detail, idx) => (
                    <li
                      key={idx}
                      className="bg-[#171717] p-3 border border-[#2E2B26] text-[#E8DFCC] flex items-start gap-3"
                    >
                      <span className="font-mono-archive text-[11px] text-[#B49A67] font-semibold shrink-0">
                        [{String(idx + 1).padStart(2, '0')}]
                      </span>
                      <span className="leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Crime Scene Blueprint */}
        {activeTab === 'blueprint' && (
          <div className="space-y-6">
            <div className="manila-card p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#2E2B26] gap-2">
                <div>
                  <div className="flex items-center gap-2 font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-widest">
                    <Compass className="w-3.5 h-3.5 text-[#B49A67]" />
                    <span>ARCHITECTURAL SITE DRAFT · 1:50 SCALE FORENSIC SCHEMATIC</span>
                  </div>
                  <h3 className="font-editorial text-2xl font-bold text-[#E8DFCC]">
                    Spatial Blueprint & Physical Trace Triggers
                  </h3>
                  <p className="font-editorial text-xs text-[#A9A398] italic">
                    Select any numbered hotspot marker on the floorplan to inspect microscopic trace findings, mechanical overrides, or broken alibi footprints.
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono-archive text-[10px] text-[#A9A398]">
                  <span className="w-2 h-2 rounded-full bg-[#B49A67] animate-pulse" />
                  <span>5 ACTIVE FORENSIC HOTSPOTS</span>
                </div>
              </div>

              {/* Architectural Canvas */}
              <div className="relative w-full h-[380px] sm:h-[440px] bg-[#121110] border-2 border-[#3A3630] overflow-hidden select-none"
                   style={{
                     backgroundImage: 'radial-gradient(circle, #2A2620 1px, transparent 1px)',
                     backgroundSize: '24px 24px',
                   }}>
                
                {/* Draft Framing Watermark */}
                <div className="absolute top-3 left-4 font-mono-archive text-[10px] text-[#B49A67]/40 tracking-widest uppercase pointer-events-none">
                  CONSTABULARY ARCHIVE REF: {caseData.code} // PLAN VIEW
                </div>
                <div className="absolute top-3 right-4 font-mono-archive text-[10px] text-[#A9A398]/40 tracking-wider pointer-events-none">
                  ORIENTATION: NORTH ▲
                </div>

                {/* Architectural Blueprint Room Outlines */}
                <div className="absolute inset-8 border border-[#3A3630]/70 pointer-events-none flex flex-col justify-between p-4">
                  <div className="flex justify-between text-[10px] font-mono-archive text-[#A9A398]/30">
                    <span>SECTOR A: CATWALK / VENTILATION</span>
                    <span>SECTOR B: SERVICE CHUTE</span>
                  </div>
                  
                  {/* Central Inquest Chamber Outline */}
                  <div className="mx-auto w-3/4 h-2/3 border border-dashed border-[#B49A67]/30 p-3 flex flex-col justify-between">
                    <span className="font-mono-archive text-[9px] text-[#B49A67]/40 uppercase tracking-widest">
                      PRIMARY PERIMETER: {caseData.victim.foundLocation}
                    </span>
                    <div className="text-center font-editorial italic text-xs text-[#E8DFCC]/20">
                      [CORDON ZONE - RESTRICTED FORENSIC ACCESS ONLY]
                    </div>
                    <span className="font-mono-archive text-[9px] text-[#A9A398]/30 text-right">
                      ELECTRICAL / SENSOR TRUNK
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px] font-mono-archive text-[#A9A398]/30">
                    <span>EXIT VESTIBULE & AIRLOCK</span>
                    <span>QUAD ACCESS GATE</span>
                  </div>
                </div>

                {/* Hotspot Markers */}
                {caseData.crimeSceneHotspots && caseData.crimeSceneHotspots.map((hs, index) => {
                  const isSelected = selectedHotspot?.id === hs.id;
                  return (
                    <div
                      key={hs.id}
                      style={{ left: `${hs.xPercent}%`, top: `${hs.yPercent}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                      onClick={() => {
                        sound.playTypewriter();
                        setSelectedHotspot(hs);
                      }}
                    >
                      {/* Pulse Ring */}
                      <span className={`absolute -inset-2 rounded-full border transition-all ${
                        isSelected
                          ? 'border-[#B49A67] animate-ping opacity-75'
                          : 'border-transparent group-hover:border-[#B49A67]/50'
                      }`} />

                      {/* Numbered Pin Badge */}
                      <div className={`w-8 h-8 rounded-none border flex items-center justify-center font-mono-archive text-xs font-bold transition-all shadow-md ${
                        isSelected
                          ? 'bg-[#B49A67] text-[#171717] border-[#E8DFCC] scale-110'
                          : 'bg-[#22201D] text-[#E8DFCC] border-[#3A3630] group-hover:border-[#B49A67]'
                      }`}>
                        {index + 1}
                      </div>

                      {/* Floating Name Label on hover / selected */}
                      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap font-mono-archive text-[10px] px-2 py-0.5 border pointer-events-none transition-all ${
                        isSelected
                          ? 'bg-[#171717] text-[#B49A67] border-[#B49A67] opacity-100'
                          : 'bg-[#22201D] text-[#A9A398] border-[#332F2A] opacity-0 group-hover:opacity-100'
                      }`}>
                        {hs.name}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hotspot Inspection Drawer / Case File Card */}
              {selectedHotspot && (
                <div className="bg-[#171717] border-2 border-[#B49A67]/60 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#2E2B26] gap-2">
                    <div>
                      <div className="flex items-center gap-2 font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-wider">
                        <span>FORENSIC NODE: {selectedHotspot.roomArea}</span>
                        <span>·</span>
                        <span className="text-[#A9A398]">{selectedHotspot.briefClue}</span>
                      </div>
                      <h4 className="font-editorial text-xl font-bold text-[#E8DFCC] mt-0.5">
                        {selectedHotspot.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePinHotspotToBlackboard(selectedHotspot)}
                        className="btn-gold px-3 py-1.5 text-xs font-mono-archive flex items-center gap-1.5 cursor-pointer"
                      >
                        <Pin className="w-3.5 h-3.5" />
                        <span>{pinnedNotice ? 'Pinned to Blackboard!' : 'Pin Lead to Notes'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-[#22201D] p-3.5 border border-[#2E2B26] space-y-1">
                      <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase block font-semibold">
                        // PHYSICAL FORENSIC EXAMINATION:
                      </span>
                      <p className="font-sans text-xs text-[#E8DFCC] leading-relaxed">
                        {selectedHotspot.forensicObservation}
                      </p>
                    </div>

                    <div className="bg-[#22201D] p-3.5 border border-[#2E2B26] space-y-1">
                      <span className="font-mono-archive text-[10px] text-[#702D35] uppercase block font-semibold">
                        // INCONSISTENCY / CRITICAL DETAIL:
                      </span>
                      <p className="font-editorial text-xs italic text-[#E8DFCC] leading-relaxed">
                        "{selectedHotspot.discoveredDetail}"
                      </p>
                    </div>
                  </div>

                  {/* Interconnected Ties Navigation */}
                  <div className="pt-2 border-t border-[#2E2B26] flex flex-wrap items-center justify-between gap-3 text-xs font-mono-archive">
                    <div className="flex items-center gap-3">
                      {selectedHotspot.tiedEvidenceId && (
                        <button
                          onClick={() => {
                            sound.playTypewriter();
                            onNavigate('evidence_library');
                          }}
                          className="px-2.5 py-1 bg-[#22201D] hover:bg-[#2E2B26] text-[#B49A67] border border-[#3A3630] cursor-pointer flex items-center gap-1.5"
                        >
                          <Search className="w-3 h-3" />
                          <span>View Associated Evidence Card ➔</span>
                        </button>
                      )}

                      {selectedHotspot.tiedSuspectName && (
                        <button
                          onClick={() => {
                            sound.playTypewriter();
                            onNavigate('suspect_profiles');
                          }}
                          className="px-2.5 py-1 bg-[#22201D] hover:bg-[#2E2B26] text-[#E8DFCC] border border-[#3A3630] cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Confront Witness ({selectedHotspot.tiedSuspectName}) ➔</span>
                        </button>
                      )}
                    </div>

                    <span className="text-[10px] text-[#A9A398]">
                      COORDINATES: {selectedHotspot.xPercent}% X, {selectedHotspot.yPercent}% Y
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Autopsy & Toxicology */}
        {activeTab === 'autopsy' && (
          <div className="manila-card p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E2B26]">
              <div>
                <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-widest block">
                  OFFICIAL CORONER INQUEST INVENTORY
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#E8DFCC]">
                  Post-Mortem Pathology & Chemical Screening
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <TextAudioPlayer
                  id={`autopsy_report_${caseData.id}`}
                  text={`Office of the Chief Coroner, Blackwood County Inquest Division. Pathology report for victim ${caseData.victim.name}. ${caseData.autopsySummary}. Lethal agent profile: deliberate concentrated chemical synthesis requiring specialized laboratory apparatus. Temporal analysis indicates physiological death does not align with the broken clock.`}
                  persona="coroner"
                  label="Listen to Autopsy"
                  playingLabel="Playing Autopsy..."
                  variant="pill"
                />
                <span className="stamp-confidential">AUTOPSY PROTOCOL</span>
              </div>
            </div>

            <div className="bg-[#171717] p-5 border border-[#2E2B26] font-mono-archive text-xs text-[#E8DFCC] space-y-3 leading-relaxed">
              <div className="text-[#B49A67] font-bold">
                OFFICE OF THE CHIEF CORONER · BLACKWOOD COUNTY INQUEST DIVISION
              </div>
              <p className="text-sm font-editorial text-[#E8DFCC] italic leading-relaxed">
                {caseData.autopsySummary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-archive">
              <div className="bg-[#171717] p-4 border border-[#2E2B26] space-y-1">
                <span className="text-[#B49A67] block font-semibold">LETHAL AGENT PROFILE</span>
                <p className="text-xs text-[#A9A398] font-sans leading-relaxed">
                  Screening confirms deliberate concentrated synthesis requiring laboratory or conservatory reflux apparatus.
                </p>
              </div>

              <div className="bg-[#171717] p-4 border border-[#2E2B26] space-y-1">
                <span className="text-[#702D35] block font-semibold">TEMPORAL INCONGRUITY</span>
                <p className="text-xs text-[#A9A398] font-sans leading-relaxed">
                  The physiological time of circulatory cessation does not match the mechanical clock face found at the scene.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 911 Audio Dispatch */}
        {activeTab === 'dispatch' && (
          <div className="manila-card p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E2B26]">
              <div>
                <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-widest block">
                  CONSTABULARY EMERGENCY DISPATCH
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#E8DFCC]">
                  First Responder Wire Recording
                </h3>
              </div>
              <button
                onClick={handlePlayDispatchTape}
                className="btn-gold px-4 py-1.5 text-xs font-mono-archive flex items-center gap-2 cursor-pointer"
              >
                {isPlayingDispatchAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingDispatchAudio ? 'Halt Wire' : 'Play Dispatch Wire'}</span>
              </button>
            </div>

            {/* Vintage Tape Simulator */}
            <div className="bg-[#171717] border border-[#2E2B26] p-5">
              <div className="flex items-center justify-between text-xs font-mono-archive text-[#A9A398] pb-3 border-b border-[#24211D]">
                <span>TAPE REEL #881 · BLACKWOOD DISPATCH</span>
                <span className="text-[#B49A67]">
                  {isPlayingDispatchAudio ? 'WIRE ACTIVE · REEL ADVANCING' : 'READY FOR PLAYBACK'}
                </span>
              </div>

              <div className="py-6 flex items-center justify-center gap-6">
                <div
                  className={`w-14 h-14 rounded-full border-2 border-[#3A3630] bg-[#22201D] flex items-center justify-center ${
                    isPlayingDispatchAudio ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '4s' }}
                >
                  <div className="w-3 h-3 rounded-full bg-[#B49A67]" />
                </div>

                <div className="h-0.5 flex-1 bg-[#2E2B26] relative overflow-hidden">
                  <div
                    className={`h-full bg-[#B49A67] transition-all ${
                      isPlayingDispatchAudio ? 'w-full duration-5000' : 'w-0'
                    }`}
                  />
                </div>

                <div
                  className={`w-14 h-14 rounded-full border-2 border-[#3A3630] bg-[#22201D] flex items-center justify-center ${
                    isPlayingDispatchAudio ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '4s' }}
                >
                  <div className="w-3 h-3 rounded-full bg-[#B49A67]" />
                </div>
              </div>
            </div>

            {/* Transcript Log */}
            <div className="bg-[#171717] p-4 border border-[#2E2B26] font-mono-archive text-xs text-[#A9A398] whitespace-pre-line leading-relaxed">
              <span className="text-[#B49A67] font-bold block mb-2">// DISPATCH TRANSCRIPT:</span>
              {caseData.dispatchLog}
            </div>
          </div>
        )}

        {/* Tab 5: Chronological Timeline & Alibi Matrix */}
        {activeTab === 'timeline' && (
          <div className="manila-card p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#2E2B26] gap-3">
              <div>
                <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-widest block">
                  CHRONOLOGICAL RECONSTRUCTION & CROSS-EXAMINATION
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#E8DFCC]">
                  Timeline of the Fatal Night
                </h3>
              </div>

              {/* View Switcher Toggle */}
              <div className="flex items-center gap-1 bg-[#171717] border border-[#3A3630] p-1 font-mono-archive text-xs">
                <button
                  onClick={() => {
                    sound.playTypewriter();
                    setTimelineViewMode('chronological');
                  }}
                  className={`px-3 py-1 cursor-pointer transition-colors ${
                    timelineViewMode === 'chronological'
                      ? 'bg-[#B49A67] text-[#171717] font-bold'
                      : 'text-[#A9A398] hover:text-[#E8DFCC]'
                  }`}
                >
                  Sequential Log
                </button>
                <button
                  onClick={() => {
                    sound.playTapeClick();
                    setTimelineViewMode('matrix');
                  }}
                  className={`px-3 py-1 cursor-pointer transition-colors ${
                    timelineViewMode === 'matrix'
                      ? 'bg-[#B49A67] text-[#171717] font-bold'
                      : 'text-[#A9A398] hover:text-[#E8DFCC]'
                  }`}
                >
                  Alibi vs. Reality Matrix
                </button>
              </div>
            </div>

            {timelineViewMode === 'chronological' ? (
              <div className="relative border-l border-[#2E2B26] ml-4 space-y-6 pl-6">
                {caseData.timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    <div
                      className={`absolute -left-[30px] top-1 w-2.5 h-2.5 rounded-full border border-[#171717] ${
                        event.verified ? 'bg-[#B49A67]' : 'bg-[#702D35]'
                      }`}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-mono-archive text-xs font-bold text-[#B49A67]">
                        {event.time}
                      </span>
                      <span className="font-mono-archive text-[10px] text-[#A9A398]">
                        SOURCE: {event.source}
                      </span>
                    </div>
                    <h4 className="font-editorial text-lg font-bold text-[#E8DFCC] mt-0.5">
                      {event.title}
                    </h4>
                    <p className="font-sans text-xs text-[#A9A398] leading-relaxed mt-1">
                      {event.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              /* Alibi Cross-Check Matrix */
              <div className="space-y-4">
                <div className="text-xs font-mono-archive text-[#A9A398] italic">
                  Compare sworn witness depositions directly against physical timecards, door access, and forensic screening:
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono-archive">
                    <thead>
                      <tr className="border-b border-[#3A3630] bg-[#171717] text-[#B49A67]">
                        <th className="p-3 uppercase text-[10px] font-bold">Witness / Suspect</th>
                        <th className="p-3 uppercase text-[10px] font-bold">Sworn Claimed Whereabouts</th>
                        <th className="p-3 uppercase text-[10px] font-bold">Forensic Reality / Contradiction</th>
                        <th className="p-3 uppercase text-[10px] font-bold text-center">Status</th>
                        <th className="p-3 uppercase text-[10px] font-bold text-right">Inquest Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2E2B26]">
                      {caseData.suspects.map((suspect) => (
                        <tr key={suspect.id} className="hover:bg-[#22201D]/80 transition-colors">
                          <td className="p-3 align-top">
                            <div className="font-editorial text-sm font-bold text-[#E8DFCC]">{suspect.name}</div>
                            <div className="text-[10px] text-[#A9A398] truncate max-w-[150px]">{suspect.role}</div>
                          </td>
                          <td className="p-3 align-top font-editorial text-xs italic text-[#E8DFCC] max-w-xs leading-relaxed">
                            "{suspect.claimedAlibi}"
                          </td>
                          <td className="p-3 align-top font-sans text-xs text-[#A9A398] max-w-sm leading-relaxed">
                            {suspect.flaw}
                          </td>
                          <td className="p-3 align-top text-center">
                            <span className="px-2 py-0.5 bg-[#702D35]/30 text-[#E8DFCC] border border-[#702D35] text-[10px] font-bold uppercase tracking-wider">
                              DISCREDITED
                            </span>
                          </td>
                          <td className="p-3 align-top text-right">
                            <button
                              onClick={() => {
                                sound.playTapeClick();
                                onNavigate('interrogation_room');
                              }}
                              className="px-2.5 py-1 bg-[#22201D] hover:bg-[#B49A67] hover:text-[#171717] text-[#B49A67] border border-[#3A3630] text-[10px] uppercase font-bold cursor-pointer transition-colors"
                            >
                              Interrogate ➔
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-[#2E2B26] flex items-center justify-between">
          <button
            onClick={() => {
              sound.playTapeClick();
              onNavigate('case_selection');
            }}
            className="text-xs font-mono-archive text-[#A9A398] hover:text-[#E8DFCC] cursor-pointer"
          >
            ← Switch Case Dossier
          </button>

          <button
            onClick={() => {
              sound.playDramaticChime();
              onNavigate('investigation_dashboard');
            }}
            className="btn-gold px-6 py-2 text-xs font-mono-archive flex items-center gap-2 cursor-pointer"
          >
            <span>Proceed to Investigation Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
