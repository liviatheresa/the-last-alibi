import React, { useEffect, useState } from 'react';
import { ScreenId, CaseData, Team, AccusationVerdict } from '../types';
import { StorageService } from '../services/storageService';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { TextAudioPlayer } from './TextAudioPlayer';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  Radio,
  Clock,
  ArrowRight,
  HelpCircle,
  Play,
  Pause,
} from 'lucide-react';

interface Props {
  caseData: CaseData;
  team: Team;
  verdict: AccusationVerdict | null;
  onNavigate: (screen: ScreenId) => void;
  onSelectCase: (caseId: 'case-001' | 'case-002') => void;
}

export const CaseReveal: React.FC<Props> = ({
  caseData,
  team,
  verdict,
  onNavigate,
  onSelectCase,
}) => {
  const currentVerdict =
    verdict || StorageService.getVerdict(team.id, caseData.id) || {
      isCorrectCulprit: true,
      isCorrectWeapon: true,
      isCorrectContradiction: true,
      isCorrectMotive: true,
      score: 100,
      rank: 'Chief Superintendent' as const,
      feedback: ['Masterful deduction. Culprit successfully apprehended.'],
    };

  const [isPlayingConfession, setIsPlayingConfession] = useState(false);
  const [activeTab, setActiveTab] = useState<'reenactment' | 'confession' | 'redherrings'>('reenactment');

  useEffect(() => {
    const unsub = speech.subscribe((currId) => {
      setIsPlayingConfession(currId === `confession_wire_${caseData.id}`);
    });
    return () => {
      unsub();
      speech.stop();
    };
  }, [caseData.id]);

  useEffect(() => {
    if (currentVerdict.isCorrectCulprit) {
      sound.playDramaticChime();
      try {
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#B49A67', '#E8DFCC', '#702D35', '#A9A398'],
        });
      } catch (_) {}
    } else {
      sound.playHeartbeat();
    }
  }, [currentVerdict.isCorrectCulprit]);

  const handlePlayConfession = () => {
    sound.playTapeClick();
    speech.toggle(`confession_wire_${caseData.id}`, caseData.solution.confessionTranscript, {
      voiceType: 'confession',
    });
  };

  const handleSwitchToOtherCase = () => {
    sound.playDramaticChime();
    const otherCaseId = caseData.id === 'case-001' ? 'case-002' : 'case-001';
    onSelectCase(otherCaseId);
    onNavigate('case_briefing');
  };

  return (
    <div className="min-h-screen bg-[#171717] text-[#E8DFCC] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Editorial Court of Inquest Verdict Banner */}
        <div className="bg-[#22201D] border-2 border-[#3D3933] p-8 text-center space-y-4 shadow-2xl relative">
          <div className="flex items-center justify-center gap-2">
            <span
              className={
                currentVerdict.isCorrectCulprit ? 'stamp-verified-evidence text-xs' : 'stamp-confidential text-xs'
              }
            >
              {currentVerdict.isCorrectCulprit
                ? 'INQUEST CONVICTION SECURED · GRAND JURY RATIFIED'
                : 'MISTRIAL · INQUEST PROCEEDINGS REOPENED'}
            </span>
          </div>

          <div>
            <span className="font-mono-archive text-[10px] text-[#A9A398] uppercase tracking-widest block mb-1">
              OFFICIAL INVESTIGATIVE EVALUATION
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl font-bold text-[#E8DFCC]">
              {currentVerdict.rank}
            </h1>
            <div className="font-mono-archive text-base text-[#B49A67] font-semibold mt-1">
              Deduction Accuracy Score: {currentVerdict.score}%
            </div>
          </div>

          <p className="font-editorial text-base sm:text-lg text-[#A9A398] italic max-w-xl mx-auto leading-relaxed">
            {currentVerdict.isCorrectCulprit
              ? `The Blackwood Constabulary has ratified the indictment in full. The true perpetrator, ${caseData.solution.culpritName}, has been placed in maximum judicial custody.`
              : `Your warrant was rejected due to evidential discrepancies. The true perpetrator escaped through unaddressed alibi layers.`}
          </p>

          {/* 4 Score Breakdown Items */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-4 border-t border-[#2E2B26] font-mono-archive text-xs">
            <div className="bg-[#171717] p-2.5 border border-[#2E2B26] flex items-center justify-center gap-2">
              {currentVerdict.isCorrectCulprit ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A67]" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-[#702D35]" />
              )}
              <span>Culprit Identified</span>
            </div>

            <div className="bg-[#171717] p-2.5 border border-[#2E2B26] flex items-center justify-center gap-2">
              {currentVerdict.isCorrectWeapon ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A67]" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-[#702D35]" />
              )}
              <span>Lethal Mechanism</span>
            </div>

            <div className="bg-[#171717] p-2.5 border border-[#2E2B26] flex items-center justify-center gap-2">
              {currentVerdict.isCorrectContradiction ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A67]" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-[#702D35]" />
              )}
              <span>Alibi Broken</span>
            </div>

            <div className="bg-[#171717] p-2.5 border border-[#2E2B26] flex items-center justify-center gap-2">
              {currentVerdict.isCorrectMotive ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A67]" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-[#702D35]" />
              )}
              <span>True Motive</span>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center justify-center gap-2 border-b border-[#2E2B26] pb-2 font-mono-archive text-xs">
          <button
            onClick={() => {
              sound.playTypewriter();
              setActiveTab('reenactment');
            }}
            className={`px-4 py-2 uppercase transition-colors cursor-pointer ${
              activeTab === 'reenactment'
                ? 'bg-[#B49A67] text-[#171717] font-bold'
                : 'text-[#A9A398] hover:text-[#E8DFCC]'
            }`}
          >
            01 / True Sequence of Events
          </button>

          <button
            onClick={() => {
              sound.playTypewriter();
              setActiveTab('confession');
            }}
            className={`px-4 py-2 uppercase transition-colors cursor-pointer ${
              activeTab === 'confession'
                ? 'bg-[#B49A67] text-[#171717] font-bold'
                : 'text-[#A9A398] hover:text-[#E8DFCC]'
            }`}
          >
            02 / Chamber Confession Wire
          </button>

          <button
            onClick={() => {
              sound.playTypewriter();
              setActiveTab('redherrings');
            }}
            className={`px-4 py-2 uppercase transition-colors cursor-pointer ${
              activeTab === 'redherrings'
                ? 'bg-[#B49A67] text-[#171717] font-bold'
                : 'text-[#A9A398] hover:text-[#E8DFCC]'
            }`}
          >
            03 / Red Herrings Explained
          </button>
        </div>

        {/* Tab 1: Full Chronological Reenactment */}
        {activeTab === 'reenactment' && (
          <div className="manila-card p-6 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26]">
              <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-wider">
                COURT OF INQUEST · UNSEALED RECONSTRUCTION
              </span>
              <div className="flex items-center gap-2">
                <TextAudioPlayer
                  id={`solution_reenactment_${caseData.id}`}
                  text={`Court of Inquest unsealed reconstruction. Perpetrator: ${caseData.solution.culpritName}. Lethal agent: ${caseData.solution.murderWeapon}. Key contradiction: ${caseData.solution.keyContradiction}. Reenactment: ${caseData.solution.fullReenactment}`}
                  persona="narrator"
                  label="Listen to Reconstruction"
                  playingLabel="Playing Reconstruction..."
                  variant="pill"
                />
                <span className="stamp-verified-evidence text-[9px]">TRUTH RATIFIED</span>
              </div>
            </div>

            <div className="bg-[#171717] p-5 border border-[#2E2B26] font-editorial text-base sm:text-lg text-[#E8DFCC] leading-relaxed italic">
              "{caseData.solution.fullReenactment}"
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-archive text-xs">
              <div className="bg-[#171717] p-3.5 border border-[#2E2B26]">
                <span className="text-[#A9A398] block text-[10px]">CONVICTED PERPETRATOR</span>
                <span className="text-[#B49A67] font-bold text-sm">{caseData.solution.culpritName}</span>
              </div>
              <div className="bg-[#171717] p-3.5 border border-[#2E2B26]">
                <span className="text-[#A9A398] block text-[10px]">LETHAL AGENT</span>
                <span className="text-[#702D35] font-semibold">{caseData.solution.murderWeapon}</span>
              </div>
              <div className="bg-[#171717] p-3.5 border border-[#2E2B26]">
                <span className="text-[#A9A398] block text-[10px]">FATAL CONTRADICTION</span>
                <span className="text-[#E8DFCC]">{caseData.solution.keyContradiction}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Culprit Confession Wire */}
        {activeTab === 'confession' && (
          <div className="manila-card p-6 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26]">
              <span className="font-mono-archive text-[10px] text-[#702D35] uppercase font-bold tracking-wider">
                CONFIDENTIAL WIRE RECORDING · {caseData.solution.culpritName}
              </span>
              <button
                onClick={handlePlayConfession}
                className="btn-gold px-4 py-1.5 text-xs font-mono-archive flex items-center gap-1.5 cursor-pointer"
              >
                {isPlayingConfession ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingConfession ? 'Halt Wire' : 'Play Confession Wire'}</span>
              </button>
            </div>

            <div className="bg-[#171717] p-5 border-l-2 border-l-[#702D35] font-editorial text-lg text-[#E8DFCC] leading-relaxed italic">
              {caseData.solution.confessionTranscript}
            </div>
          </div>
        )}

        {/* Tab 3: Red Herrings Explained */}
        {activeTab === 'redherrings' && (
          <div className="manila-card p-6 space-y-4">
            <span className="font-mono-archive text-[10px] text-[#B49A67] uppercase tracking-wider block pb-2 border-b border-[#2E2B26]">
              HOW INNOCENT WITNESSES OBSTRUCTED THE INQUEST
            </span>

            <div className="space-y-3">
              {caseData.solution.redHerringExplanations.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#171717] p-4 border border-[#2E2B26] space-y-1"
                >
                  <h4 className="font-editorial text-lg font-bold text-[#E8DFCC]">
                    {item.suspectName}
                  </h4>
                  <p className="font-sans text-xs text-[#A9A398] leading-relaxed">
                    {item.reasonNotGuilty}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alternate Case Launch */}
        <div className="pt-4 border-t border-[#2E2B26] flex flex-wrap items-center justify-between gap-4 font-mono-archive text-xs">
          <button
            onClick={() => {
              sound.playTapeClick();
              onNavigate('investigation_notes');
            }}
            className="btn-dossier px-4 py-2 cursor-pointer"
          >
            ← Review Blackboard Notes
          </button>

          <button
            onClick={handleSwitchToOtherCase}
            className="btn-gold px-6 py-2.5 uppercase flex items-center gap-2 cursor-pointer text-xs font-semibold"
          >
            <span>
              Unseal Alternate Case ({caseData.id === 'case-001' ? 'Case 002: The Last Submission' : 'Case 001: The Midnight Lecture'})
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
