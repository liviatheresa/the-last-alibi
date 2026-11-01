import React, { useState } from 'react';
import {
  ScreenId,
  CaseData,
  Team,
  AccusationSubmission,
  AccusationVerdict,
} from '../types';
import { StorageService } from '../services/storageService';
import { sound } from '../services/soundEffects';
import {
  Gavel,
  ArrowRight,
} from 'lucide-react';

interface Props {
  caseData: CaseData;
  team: Team;
  onNavigate: (screen: ScreenId) => void;
  onAccusationSubmitted: (verdict: AccusationVerdict) => void;
}

export const FinalAccusation: React.FC<Props> = ({
  caseData,
  team,
  onNavigate,
  onAccusationSubmitted,
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>('');
  const [selectedWeapon, setSelectedWeapon] = useState<string>('');
  const [selectedContradiction, setSelectedContradiction] = useState<string>('');
  const [selectedMotive, setSelectedMotive] = useState<string>('');
  const [indictmentNotes, setIndictmentNotes] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isFormComplete =
    Boolean(selectedSuspectId) &&
    Boolean(selectedWeapon) &&
    Boolean(selectedContradiction) &&
    Boolean(selectedMotive);

  const handleSubmitAccusation = () => {
    sound.playGavel();

    const isCorrectCulprit = selectedSuspectId === caseData.solution.culpritId;
    const isCorrectWeapon = selectedWeapon === caseData.solution.murderWeapon;
    const isCorrectContradiction = selectedContradiction === caseData.solution.keyContradiction;
    const isCorrectMotive = selectedMotive === caseData.solution.trueMotive;

    let score = 0;
    const feedback: string[] = [];

    if (isCorrectCulprit) {
      score += 40;
      feedback.push('Correctly identified the primary perpetrator.');
    } else {
      feedback.push('Incorrect suspect named in the indictment.');
    }

    if (isCorrectWeapon) {
      score += 20;
      feedback.push('Accurately identified the lethal mechanism / weapon.');
    } else {
      feedback.push('Incorrect murder weapon specified.');
    }

    if (isCorrectContradiction) {
      score += 20;
      feedback.push('Properly pinpointed the fatal alibi contradiction.');
    } else {
      feedback.push('Flawed contradiction cited in warrant.');
    }

    if (isCorrectMotive) {
      score += 20;
      feedback.push('Unveiled the true underlying financial/personal motive.');
    } else {
      feedback.push('Misunderstood the core psychological motive.');
    }

    let rank: AccusationVerdict['rank'] = 'Mistrial / Reopened';
    if (score === 100) {
      rank = 'Chief Superintendent';
    } else if (score >= 80) {
      rank = 'Senior Inspector';
    } else if (score >= 40) {
      rank = 'Forensic Detective';
    }

    const verdict: AccusationVerdict = {
      isCorrectCulprit,
      isCorrectWeapon,
      isCorrectContradiction,
      isCorrectMotive,
      score,
      rank,
      feedback,
    };

    const submission: AccusationSubmission = {
      accusedSuspectId: selectedSuspectId,
      selectedWeapon,
      selectedContradiction,
      selectedMotive,
      indictmentNotes,
      submittedAt: new Date().toISOString(),
    };

    StorageService.saveAccusation(team.id, caseData.id, submission);
    StorageService.saveVerdict(team.id, caseData.id, verdict);

    setShowConfirmModal(false);
    onAccusationSubmitted(verdict);
    onNavigate('case_reveal');
  };

  return (
    <div className="min-h-screen bg-[#171717] text-[#E8DFCC] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Editorial Court of Inquest Masthead */}
        <div className="bg-[#22201D] border-2 border-[#702D35] p-6 relative">
          <div className="flex items-center justify-between pb-3 border-b border-[#2E2B26] mb-4">
            <span className="font-mono-archive text-[11px] text-[#B49A67] uppercase tracking-widest">
              BLACKWOOD UNIVERSITY COURT OF INQUEST · FORMAL ARRAIGNMENT
            </span>
            <span className="stamp-confidential">WARRANT OF ARREST</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#E8DFCC]">
            The Accusation Chamber
          </h1>
          <p className="font-editorial text-base text-[#A9A398] italic mt-1 max-w-2xl leading-relaxed">
            You are about to seal a formal Grand Warrant of Arrest on behalf of <strong className="text-[#E8DFCC] font-normal not-italic">{team.name}</strong>. Cross-examine your physical proof: an unsubstantiated indictment will result in an immediate mistrial.
          </p>
        </div>

        {/* Step 1: Accused Perpetrator */}
        <div className="manila-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26] font-mono-archive text-xs">
            <span className="text-[#B49A67] font-semibold">
              STEP 01 / SELECT THE ACCUSED PERPETRATOR
            </span>
            <span className="text-[#A9A398]">NAME EXACT SUSPECT</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {caseData.suspects.map((suspect) => {
              const isSelected = selectedSuspectId === suspect.id;
              return (
                <div
                  key={suspect.id}
                  onClick={() => {
                    sound.playTapeClick();
                    setSelectedSuspectId(suspect.id);
                  }}
                  className={`p-4 border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#2A2723] border-[#702D35]'
                      : 'bg-[#171717] border-[#2E2B26] hover:border-[#3A3630]'
                  }`}
                >
                  <div>
                    <img
                      src={suspect.avatar}
                      alt={suspect.name}
                      className="w-full h-36 object-cover border border-[#3A3630] mb-3 filter contrast-105"
                    />
                    <h2 className="font-editorial text-lg font-bold text-[#E8DFCC]">
                      {suspect.name}
                    </h2>
                    <div className="font-mono-archive text-[10px] text-[#B49A67] mt-0.5">
                      {suspect.role}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#2E2B26] font-mono-archive text-[11px]">
                    <span className={isSelected ? 'text-[#702D35] font-bold' : 'text-[#A9A398]'}>
                      {isSelected ? '[ACCUSED IN WARRANT]' : 'Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Murder Weapon / Lethal Mechanism */}
        <div className="manila-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26] font-mono-archive text-xs">
            <span className="text-[#B49A67] font-semibold">
              STEP 02 / IDENTIFY LETHAL INSTRUMENT OR MECHANISM
            </span>
            <span className="text-[#A9A398]">SPECIFY TOXIN OR WEAPON</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {caseData.weaponsList.map((weapon, idx) => {
              const isSelected = selectedWeapon === weapon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    sound.playTypewriter();
                    setSelectedWeapon(weapon);
                  }}
                  className={`p-3.5 border cursor-pointer transition-all flex items-center justify-between font-mono-archive text-xs ${
                    isSelected
                      ? 'bg-[#2A2723] border-[#B49A67] text-[#E8DFCC] font-semibold'
                      : 'bg-[#171717] border-[#2E2B26] text-[#A9A398] hover:border-[#3A3630]'
                  }`}
                >
                  <span>{weapon}</span>
                  {isSelected && <span className="text-[#B49A67]">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Critical Broken Alibi Contradiction */}
        <div className="manila-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26] font-mono-archive text-xs">
            <span className="text-[#B49A67] font-semibold">
              STEP 03 / CITE THE IRREFUTABLE ALIBI CONTRADICTION
            </span>
            <span className="text-[#A9A398]">DISPROVE FALSE TIMELINE</span>
          </div>

          <div className="space-y-2.5">
            {caseData.contradictionsList.map((contradiction, idx) => {
              const isSelected = selectedContradiction === contradiction;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    sound.playTypewriter();
                    setSelectedContradiction(contradiction);
                  }}
                  className={`p-3.5 border cursor-pointer transition-all flex items-start gap-3 font-mono-archive text-xs ${
                    isSelected
                      ? 'bg-[#2A2723] border-[#B49A67] text-[#E8DFCC]'
                      : 'bg-[#171717] border-[#2E2B26] text-[#A9A398] hover:border-[#3A3630]'
                  }`}
                >
                  <span className="text-[#B49A67] font-bold">[{idx + 1}]</span>
                  <span className="flex-1 leading-relaxed">{contradiction}</span>
                  {isSelected && <span className="text-[#B49A67] font-bold">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 4: True Underlying Motive */}
        <div className="manila-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2E2B26] font-mono-archive text-xs">
            <span className="text-[#B49A67] font-semibold">
              STEP 04 / UNVEIL THE UNDERLYING MOTIVE
            </span>
            <span className="text-[#A9A398]">FINANCIAL OR PERSONAL GRUDGE</span>
          </div>

          <div className="space-y-2.5">
            {caseData.motivesList.map((motive, idx) => {
              const isSelected = selectedMotive === motive;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    sound.playTypewriter();
                    setSelectedMotive(motive);
                  }}
                  className={`p-3.5 border cursor-pointer transition-all flex items-start gap-3 font-sans text-xs ${
                    isSelected
                      ? 'bg-[#2A2723] border-[#B49A67] text-[#E8DFCC]'
                      : 'bg-[#171717] border-[#2E2B26] text-[#A9A398] hover:border-[#3A3630]'
                  }`}
                >
                  <span className="font-mono-archive text-[#B49A67] font-bold">[{idx + 1}]</span>
                  <span className="flex-1 leading-relaxed text-sm font-editorial italic">{motive}</span>
                  {isSelected && <span className="font-mono-archive text-[#B49A67] font-bold">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 5: Formal Indictment Statement */}
        <div className="manila-card p-6 space-y-3">
          <span className="font-mono-archive text-xs text-[#B49A67] uppercase tracking-wider block pb-2 border-b border-[#2E2B26]">
            STEP 05 / PROSECUTOR'S CLOSING INDICTMENT DEPOSITION
          </span>
          <textarea
            value={indictmentNotes}
            onChange={(e) => setIndictmentNotes(e.target.value)}
            placeholder="Synthesize the physical evidence, the locked room mechanism, and how the accused's false alibi was shattered..."
            rows={3}
            className="w-full bg-[#171717] border border-[#332F2A] focus:border-[#B49A67] p-3 text-xs sm:text-sm text-[#E8DFCC] font-editorial outline-none resize-none"
          />
        </div>

        {/* Execution Action */}
        <div className="pt-4 border-t border-[#2E2B26] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-archive text-xs">
          <button
            onClick={() => {
              sound.playTapeClick();
              onNavigate('investigation_dashboard');
            }}
            className="text-[#A9A398] hover:text-[#E8DFCC] cursor-pointer"
          >
            ← Return to Investigation Hub
          </button>

          <button
            onClick={() => {
              sound.playHeartbeat();
              setShowConfirmModal(true);
            }}
            disabled={!isFormComplete}
            className="btn-burgundy px-8 py-3 uppercase flex items-center gap-2 cursor-pointer disabled:opacity-40 text-sm font-semibold tracking-wider"
          >
            <Gavel className="w-4 h-4 text-[#B49A67]" />
            <span>Issue Grand Warrant of Arrest</span>
          </button>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
            <div className="bg-[#22201D] border-2 border-[#702D35] max-w-lg w-full p-6 shadow-2xl space-y-5 text-center">
              <span className="stamp-confidential">LEGAL INDICTMENT WARNING</span>

              <div>
                <h3 className="font-editorial text-3xl font-bold text-[#E8DFCC]">
                  Seal Arrest Warrant
                </h3>
                <p className="font-editorial text-base text-[#A9A398] italic mt-2">
                  Are you prepared to formalize criminal charges against{' '}
                  <strong className="text-[#E8DFCC] not-italic">
                    {caseData.suspects.find((s) => s.id === selectedSuspectId)?.name}
                  </strong>
                  ? Once the seal is set, the case file will close and the true sequence of events will be unsealed.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3 font-mono-archive text-xs">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="btn-dossier px-4 py-2 cursor-pointer"
                >
                  Review Proof
                </button>

                <button
                  onClick={handleSubmitAccusation}
                  className="btn-burgundy px-6 py-2 uppercase flex items-center gap-2 cursor-pointer"
                >
                  <span>Ratify Warrant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
