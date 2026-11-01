import React, { useState, useEffect } from 'react';
import { sound } from '../services/soundEffects';
import {
  Clock,
  Radio,
  Volume2,
  VolumeX,
  Tv,
  AlertTriangle,
  Play,
  Pause,
  PlusCircle,
  Skull,
  Music,
} from 'lucide-react';

interface Props {
  onTriggerKillerThreat: () => void;
  isCrtEnabled: boolean;
  onToggleCrt: () => void;
  onTimeExpired: () => void;
}

export const GamingHUDBar: React.FC<Props> = ({
  onTriggerKillerThreat,
  isCrtEnabled,
  onToggleCrt,
  onTimeExpired,
}) => {
  // 25-minute (1500 seconds) default timer
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const saved = localStorage.getItem('last_alibi_timer');
    return saved ? Math.max(0, parseInt(saved, 10)) : 25 * 60;
  });

  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [audioMode, setAudioMode] = useState<'drone' | 'suspense' | 'dual' | 'off'>('drone');
  const [showAudioDropdown, setShowAudioDropdown] = useState(false);
  const [threatTriggeredAutomatically, setThreatTriggeredAutomatically] = useState(false);

  // Initialize and run timer
  useEffect(() => {
    localStorage.setItem('last_alibi_timer', String(secondsRemaining));

    if (secondsRemaining <= 0) {
      onTimeExpired();
      return;
    }

    if (isTimerPaused) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(timer);
          onTimeExpired();
          return 0;
        }

        // Automatic Killer Threat Letter jump event at 21:00 (after 4 minutes of gameplay)
        if (next === 21 * 60 && !threatTriggeredAutomatically) {
          setThreatTriggeredAutomatically(true);
          onTriggerKillerThreat();
        }

        // Audio clock tick warning when under 2 minutes
        if (next < 120 && next % 2 === 0) {
          sound.playClockTick(true);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, isTimerPaused, onTimeExpired, onTriggerKillerThreat, threatTriggeredAutomatically]);

  // Handle Horror Soundtrack selection
  const handleSelectAudioMode = (mode: 'drone' | 'suspense' | 'dual' | 'off') => {
    sound.playTapeClick();
    const active = sound.setHorrorTrack(mode);
    setAudioMode(active);
    setShowAudioDropdown(false);
  };

  const handleAddFiveMinutes = () => {
    sound.playDramaticChime();
    setSecondsRemaining((prev) => prev + 300);
  };

  const handleTogglePause = () => {
    sound.playTapeClick();
    setIsTimerPaused(!isTimerPaused);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isPanicTime = secondsRemaining < 300; // Under 5 minutes

  return (
    <div className="w-full bg-[#141210] border-b border-[#332F2A] px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-archive shadow-lg z-30 relative">
      {/* Left: Ominous Chilling Countdown Display */}
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2.5 px-3 py-1 border transition-all ${
            isPanicTime
              ? 'bg-[#2A1518] border-red-700 horror-chronometer-panic text-red-200'
              : 'bg-[#1C1A17] border-[#3D3933] text-[#E8DFCC]'
          }`}
        >
          <Clock
            className={`w-3.5 h-3.5 ${isPanicTime ? 'text-red-500 animate-pulse' : 'text-[#B49A67]'}`}
          />
          <div className="flex flex-col">
            <span className="text-[9px] text-[#A9A398] uppercase leading-none">
              {isPanicTime ? 'CRITICAL INQUEST COUNTDOWN' : 'TIME BEFORE INQUEST SEALS'}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-base font-bold tracking-widest ${
                  isPanicTime ? 'text-red-400 font-mono' : 'text-[#E8DFCC]'
                }`}
              >
                {formattedTime}
              </span>
              <span className="text-[10px] text-[#A9A398]">REMAINING</span>
            </div>
          </div>

          {/* Pause / Resume Controls */}
          <button
            onClick={handleTogglePause}
            className="p-1 hover:bg-[#2E2B26] text-[#A9A398] hover:text-[#E8DFCC] cursor-pointer ml-1"
            title={isTimerPaused ? 'Resume Chronometer' : 'Pause Chronometer'}
          >
            {isTimerPaused ? <Play className="w-3 h-3 text-[#B49A67]" /> : <Pause className="w-3 h-3" />}
          </button>

          {/* +5 Min Extension Button */}
          <button
            onClick={handleAddFiveMinutes}
            className="p-1 hover:bg-[#2E2B26] text-[#B49A67] hover:text-[#E8DFCC] cursor-pointer"
            title="Request 5-Minute Inquest Extension"
          >
            <PlusCircle className="w-3 h-3" />
          </button>
        </div>

        {/* Pulse ECG / Stress Rate Monitor */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#1A1816] border border-[#2E2B26]">
          <span className={`w-2 h-2 rounded-full ${isPanicTime ? 'bg-red-500 animate-ping' : 'bg-[#B49A67]'}`} />
          <span className="text-[10px] text-[#A9A398]">INQUEST STATUS:</span>
          <span className={`text-[10px] font-bold ${isPanicTime ? 'text-red-400' : 'text-[#B49A67]'}`}>
            {isPanicTime ? 'BOARD DELIBERATING' : 'SYNDICATE ACTIVE'}
          </span>
        </div>
      </div>

      {/* Right: Psychological Horror Audio Engine, CRT Filter, and Killer Threat Trigger */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Psychological Horror Music Loop Selector */}
        <div className="relative">
          <button
            onClick={() => setShowAudioDropdown(!showAudioDropdown)}
            className={`px-2.5 py-1 border flex items-center gap-1.5 cursor-pointer transition-colors ${
              audioMode !== 'off'
                ? 'bg-[#22201D] border-[#B49A67] text-[#B49A67]'
                : 'bg-[#171717] border-[#332F2A] text-[#A9A398] hover:text-[#E8DFCC]'
            }`}
            title="Psychological Horror Soundtrack Loops"
          >
            <Music className="w-3 h-3" />
            <span className="text-[11px] hidden sm:inline">
              {audioMode === 'drone'
                ? 'HORROR: DRONE'
                : audioMode === 'suspense'
                ? 'HORROR: SUSPENSE'
                : audioMode === 'dual'
                ? 'HORROR: DUAL LAYER'
                : 'HORROR: OFF'}
            </span>
          </button>

          {/* Dropdown Menu */}
          {showAudioDropdown && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-[#1A1816] border-2 border-[#B49A67] p-2 space-y-1 shadow-2xl z-50">
              <div className="text-[9px] text-[#A9A398] uppercase px-2 py-0.5 border-b border-[#2E2B26]">
                SELECT HORROR AMBIENCE LOOP:
              </div>
              <button
                onClick={() => handleSelectAudioMode('drone')}
                className={`w-full text-left px-2 py-1 text-[11px] hover:bg-[#2A2723] cursor-pointer flex items-center justify-between ${
                  audioMode === 'drone' ? 'text-[#B49A67] font-bold' : 'text-[#E8DFCC]'
                }`}
              >
                <span>1. Ominous Horror Drone</span>
                {audioMode === 'drone' && <span>●</span>}
              </button>
              <button
                onClick={() => handleSelectAudioMode('suspense')}
                className={`w-full text-left px-2 py-1 text-[11px] hover:bg-[#2A2723] cursor-pointer flex items-center justify-between ${
                  audioMode === 'suspense' ? 'text-[#B49A67] font-bold' : 'text-[#E8DFCC]'
                }`}
              >
                <span>2. Psychological Suspense</span>
                {audioMode === 'suspense' && <span>●</span>}
              </button>
              <button
                onClick={() => handleSelectAudioMode('dual')}
                className={`w-full text-left px-2 py-1 text-[11px] hover:bg-[#2A2723] cursor-pointer flex items-center justify-between ${
                  audioMode === 'dual' ? 'text-[#B49A67] font-bold' : 'text-[#E8DFCC]'
                }`}
              >
                <span>3. Dual Layer (Deep Dread)</span>
                {audioMode === 'dual' && <span>●</span>}
              </button>
              <button
                onClick={() => handleSelectAudioMode('off')}
                className={`w-full text-left px-2 py-1 text-[11px] hover:bg-[#2A2723] cursor-pointer flex items-center justify-between ${
                  audioMode === 'off' ? 'text-red-400 font-bold' : 'text-[#A9A398]'
                }`}
              >
                <span>Mute Horror Music</span>
                {audioMode === 'off' && <span>●</span>}
              </button>
            </div>
          )}
        </div>

        {/* CRT Surveillance Scanline Filter Toggle */}
        <button
          onClick={onToggleCrt}
          className={`px-2 py-1 border flex items-center gap-1 cursor-pointer transition-colors ${
            isCrtEnabled
              ? 'bg-[#22201D] border-[#B49A67] text-[#B49A67]'
              : 'bg-[#171717] border-[#332F2A] text-[#A9A398] hover:text-[#E8DFCC]'
          }`}
          title="Toggle CRT Surveillance Scanline Overlay"
        >
          <Tv className="w-3 h-3" />
          <span className="hidden sm:inline text-[10px]">CRT HUD</span>
        </button>

        {/* Killer Threat Letter Glitch Intrusion Trigger */}
        <button
          onClick={() => {
            onTriggerKillerThreat();
          }}
          className="px-2.5 py-1 bg-[#2B171A] hover:bg-[#3D1F24] text-red-400 border border-red-700/80 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shadow-sm animate-pulse"
          title="Simulate / Trigger The Killer's Anonymous Death Threat"
        >
          <Skull className="w-3 h-3 text-red-500" />
          <span>CIPHER THREAT</span>
        </button>
      </div>
    </div>
  );
};
