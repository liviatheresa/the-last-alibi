import React, { useEffect, useState } from 'react';
import { speech, VoicePersona } from '../services/speechService';
import { sound } from '../services/soundEffects';
import { Volume2, VolumeX, Play, Square, Radio } from 'lucide-react';

interface Props {
  id: string;
  text: string;
  persona?: VoicePersona;
  label?: string;
  playingLabel?: string;
  variant?: 'button' | 'icon' | 'pill' | 'banner';
  className?: string;
  onStateChange?: (isPlaying: boolean) => void;
}

export const TextAudioPlayer: React.FC<Props> = ({
  id,
  text,
  persona = 'narrator',
  label = 'Play Audio',
  playingLabel = 'Playing Audio...',
  variant = 'button',
  className = '',
  onStateChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsubscribe = speech.subscribe((currentId) => {
      const active = currentId === id;
      setIsPlaying(active);
      onStateChange?.(active);
    });
    return unsubscribe;
  }, [id, onStateChange]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTapeClick();
    speech.toggle(id, text, {
      voiceType: persona,
    });
  };

  if (!speech.isSupported()) {
    return null;
  }

  // Variant: Icon Only (compact, for list items, chat bubbles, headers)
  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        title={isPlaying ? 'Stop Audio' : label}
        className={`p-1.5 transition-all cursor-pointer rounded flex items-center justify-center ${
          isPlaying
            ? 'bg-[#702D35] text-white animate-pulse'
            : 'bg-[#22201D] hover:bg-[#2E2B26] text-[#B49A67] hover:text-[#E8DFCC] border border-[#3A3630]'
        } ${className}`}
      >
        {isPlaying ? (
          <VolumeX className="w-3.5 h-3.5" />
        ) : (
          <Volume2 className="w-3.5 h-3.5" />
        )}
      </button>
    );
  }

  // Variant: Pill (archival dossier style tag)
  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`px-2.5 py-1 text-[11px] font-mono-archive tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
          isPlaying
            ? 'bg-[#702D35] text-[#E8DFCC] border-[#A84551] animate-pulse shadow-md'
            : 'bg-[#22201D] hover:bg-[#2A2621] text-[#B49A67] hover:text-[#E8DFCC] border-[#3D3933]'
        } ${className}`}
      >
        {isPlaying ? (
          <>
            <Square className="w-2.5 h-2.5 fill-current" />
            <span>{playingLabel}</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3 h-3" />
            <span>{label}</span>
          </>
        )}
      </button>
    );
  }

  // Variant: Banner (notice strip with audio controls)
  if (variant === 'banner') {
    return (
      <div
        className={`p-3 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
          isPlaying
            ? 'bg-[#2E2122] border-[#702D35] text-[#E8DFCC]'
            : 'bg-[#1C1A17] border-[#2E2B26] text-[#A9A398]'
        } ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isPlaying ? 'bg-red-500 animate-ping' : 'bg-[#B49A67]'
            }`}
          />
          <div className="font-mono-archive text-xs">
            <span className="text-[#E8DFCC] font-bold block sm:inline mr-2">
              ARCHIVAL AUDIO TRANSCRIPTION
            </span>
            <span className="text-xs italic">
              {isPlaying ? 'Playback in progress...' : 'Text-to-speech audio narration available'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className={`btn-gold px-3.5 py-1.5 text-xs font-mono-archive flex items-center justify-center gap-2 cursor-pointer ${
            isPlaying ? 'bg-[#702D35] border-[#A84551] text-white' : ''
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="w-3 h-3 fill-current" />
              <span>Halt Audio</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>{label}</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Default: Standard Button
  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`btn-gold px-3 py-1.5 text-xs font-mono-archive flex items-center gap-1.5 cursor-pointer transition-all ${
        isPlaying ? '!bg-[#702D35] !border-[#A84551] !text-white animate-pulse' : ''
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <Square className="w-3 h-3 fill-current" />
          <span>{playingLabel}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
