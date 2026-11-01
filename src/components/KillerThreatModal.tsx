import React, { useEffect, useState } from 'react';
import { CaseData, Team, DetectiveNote } from '../types';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { StorageService } from '../services/storageService';
import { TextAudioPlayer } from './TextAudioPlayer';
import {
  Skull,
  AlertTriangle,
  Flame,
  FileWarning,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  caseData: CaseData;
  team: Team;
  isOpen: boolean;
  onClose: () => void;
}

export const KillerThreatModal: React.FC<Props> = ({ caseData, team, isOpen, onClose }) => {
  const [isGlitching, setIsGlitching] = useState(true);
  const [filedEvidence, setFiledEvidence] = useState(false);

  useEffect(() => {
    if (isOpen) {
      sound.playGlitchStatic();
      sound.playHorrorSting();
      setIsGlitching(true);
      const timer = setTimeout(() => {
        setIsGlitching(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileAsEvidence = () => {
    sound.playTypewriter();
    const existingNotes = StorageService.getNotes(team.id, caseData.id);

    const threatNote: DetectiveNote = {
      id: `threat_letter_${Date.now()}`,
      author: 'THE KILLER (INTERCEPTED CABLE)',
      content: `[CONFIDENTIAL THREAT NOTE TO ${team.leadDetective}]: The killer intercepted our communication and issued a death threat ordering us to drop the inquest before the chronometer expires.`,
      timestamp: 'Just now',
      category: 'inconsistency',
      isPinned: true,
    };

    StorageService.saveNotes(team.id, caseData.id, [threatNote, ...existingNotes]);
    setFiledEvidence(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleBurnLetter = () => {
    sound.playTapeClick();
    speech.stop();
    onClose();
  };

  const threatMessage =
    caseData.id === 'case-001'
      ? `Detective ${team.leadDetective},\n\nYou are treading on cold ashes in St. Jude Hall. Vance was arrogant enough to believe his antique folios and Victorian deadbolt made him untouchable. He died choking on his own pride while the clock froze at 11:22.\n\nYou and your syndicate believe you are clever. But you are merely visitors. Drop this inquiry before the chronometer runs dry, or the next cup of tea poured in this Quad will be served to you.\n\nI am watching your syndicate from the shadows of the catwalk. Walk away before your name is filed as inquest victim #002.`
      : `Detective ${team.leadDetective},\n\nYou think digital overwrites can be pieced together in time? In Server Room 4B, the oxygen evacuated in eighteen seconds. Maya Lin hammered on the reinforced polycarbonate panel until her fingernails splintered. She screamed through severed intercom cables. Nobody answered.\n\nDo you believe your syndicate badge protects you from inert gas? The countdown on your screen is not for the university tribunal. It is the timer before the ventilation dampers lock your team inside the basement.\n\nTurn around and shred your case notes. Before the server doors seal behind you.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      {/* Glitch & Static Scanline Overlay */}
      <div className={`absolute inset-0 pointer-events-none crt-overlay ${isGlitching ? 'glitch-screen-active' : ''}`} />

      {/* Threat Letter Modal Box */}
      <div className="relative max-w-2xl w-full threat-letter-dossier p-6 sm:p-8 text-[#E8DFCC] border-2 border-[#702D35] space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Sinister Red Banner */}
        <div className="flex items-center justify-between pb-3 border-b border-[#702D35]">
          <div className="flex items-center gap-2 font-mono-archive text-xs text-red-500 font-bold uppercase tracking-widest">
            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
            <span>UNAUTHORIZED FREQUENCY INTRUSION // SIGNAL CIPHER DECRYPTED</span>
          </div>
          <span className="stamp-confidential text-red-400 border-red-600 bg-red-950/60">
            DEATH THREAT
          </span>
        </div>

        {/* Threat Note Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="font-mono-archive text-[11px] text-[#B49A67] uppercase tracking-wider">
              ADDRESSED TO: LEAD DETECTIVE {team.leadDetective.toUpperCase()} · SYNDICATE [{team.name.toUpperCase()}]
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-red-100 flex items-center gap-2">
              <Skull className="w-6 h-6 text-[#702D35]" />
              <span>A Message From The Culprit</span>
            </h2>
          </div>

          <TextAudioPlayer
            id={`threat_transmission_${caseData.id}`}
            text={threatMessage}
            persona="killer"
            label="Play Intercepted Voice Wire"
            playingLabel="Halt Transmission"
            variant="button"
            className="!bg-[#702D35] hover:!bg-[#873640] !border-[#A84551] !text-white self-start sm:self-auto shrink-0"
          />
        </div>

        {/* Letter Body Parchment */}
        <div className="p-5 bg-[#12100E] border border-[#702D35]/60 font-editorial text-base sm:text-lg text-[#E8DFCC] italic leading-relaxed whitespace-pre-line relative overflow-hidden">
          {/* Subtle bloody fingerprint stamp watermark */}
          <div className="absolute right-4 bottom-2 text-7xl font-mono text-red-900/10 pointer-events-none select-none font-bold">
            VOID
          </div>
          {threatMessage}
        </div>

        {/* Sinister Warning Footer */}
        <div className="font-mono-archive text-[11px] text-[#A9A398] flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-red-400" />
          <span>ORIGIN: LOCAL CAMPUS FREQUENCY · SIGNAL UNTRACEABLE</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#702D35]">
          <button
            onClick={handleFileAsEvidence}
            disabled={filedEvidence}
            className="w-full sm:w-auto btn-gold px-4 py-2 text-xs font-mono-archive flex items-center justify-center gap-2 cursor-pointer"
          >
            {filedEvidence ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#171717]" />
                <span>Filed to Evidence Locker!</span>
              </>
            ) : (
              <>
                <FileWarning className="w-3.5 h-3.5" />
                <span>Log Threat as Evidence #00</span>
              </>
            )}
          </button>

          <button
            onClick={handleBurnLetter}
            className="w-full sm:w-auto btn-burgundy px-4 py-2 text-xs font-mono-archive flex items-center justify-center gap-2 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Defiantly Dismiss & Continue Inquest</span>
          </button>
        </div>
      </div>
    </div>
  );
};
