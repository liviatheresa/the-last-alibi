import React, { useState, useEffect } from 'react';
import { ScreenId, CaseId, Team, AccusationVerdict } from './types';
import { CASES } from './data/cases';
import { StorageService } from './services/storageService';
import { sound } from './services/soundEffects';
import { NavigationHeader } from './components/NavigationHeader';
import { GamingHUDBar } from './components/GamingHUDBar';
import { KillerThreatModal } from './components/KillerThreatModal';
import { LandingPage } from './components/LandingPage';
import { TeamLobby } from './components/TeamLobby';
import { CaseSelection } from './components/CaseSelection';
import { CaseBriefing } from './components/CaseBriefing';
import { InvestigationDashboard } from './components/InvestigationDashboard';
import { SuspectProfiles } from './components/SuspectProfiles';
import { InterrogationRoom } from './components/InterrogationRoom';
import { EvidenceLibrary } from './components/EvidenceLibrary';
import { InvestigationNotes } from './components/InvestigationNotes';
import { FinalAccusation } from './components/FinalAccusation';
import { CaseReveal } from './components/CaseReveal';
import { AlertTriangle, Flame, Clock } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('landing');
  const [activeCaseId, setActiveCaseId] = useState<CaseId>('case-001');
  const [team, setTeam] = useState<Team>(() => StorageService.getCurrentTeam());
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>(() => CASES['case-001'].suspects[0].id);
  const [discoveredEvidenceIds, setDiscoveredEvidenceIds] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<AccusationVerdict | null>(null);

  // Gaming HUD & Horror State
  const [isCrtEnabled, setIsCrtEnabled] = useState(false);
  const [showKillerThreatModal, setShowKillerThreatModal] = useState(false);
  const [showTimeExpiredModal, setShowTimeExpiredModal] = useState(false);

  const activeCase = CASES[activeCaseId] || CASES['case-001'];

  // Sync discovered evidence & suspect selection when activeCaseId changes
  useEffect(() => {
    const existingClues = StorageService.getDiscoveredEvidence(team.id, activeCase.id);
    setDiscoveredEvidenceIds(existingClues);
    setSelectedSuspectId(activeCase.suspects[0].id);
    const existingVerdict = StorageService.getVerdict(team.id, activeCase.id);
    setVerdict(existingVerdict);
  }, [activeCase.id, team.id]);

  const handleSelectCase = (caseId: CaseId) => {
    setActiveCaseId(caseId);
    setSelectedSuspectId(CASES[caseId].suspects[0].id);
  };

  const handleToggleEvidence = (evidenceId: string) => {
    const updated = StorageService.toggleDiscoveredEvidence(team.id, activeCase.id, evidenceId);
    setDiscoveredEvidenceIds(updated);
  };

  const handleUpdateTeam = (newTeam: Team) => {
    setTeam(newTeam);
    StorageService.saveCurrentTeam(newTeam);
  };

  const handleSelectSuspect = (suspectId: string) => {
    setSelectedSuspectId(suspectId);
  };

  const handleAccusationSubmitted = (newVerdict: AccusationVerdict) => {
    setVerdict(newVerdict);
  };

  const handleTriggerKillerThreat = () => {
    setShowKillerThreatModal(true);
  };

  const handleTimeExpired = () => {
    sound.playHorrorSting();
    setShowTimeExpiredModal(true);
  };

  return (
    <div className="min-h-screen bg-[#171717] text-[#E8DFCC] flex flex-col font-sans selection:bg-[#B49A67]/30 selection:text-[#F4EFE6]">
      {/* Persistent Navigation Header (Shown on all active case screens) */}
      {currentScreen !== 'landing' && (
        <>
          <NavigationHeader
            currentScreen={currentScreen}
            onNavigate={setCurrentScreen}
            activeCase={activeCase}
            team={team}
            selectedSuspectId={selectedSuspectId}
          />

          {/* Ominous Chronometer, Psychological Horror Audio & Gaming HUD */}
          <GamingHUDBar
            onTriggerKillerThreat={handleTriggerKillerThreat}
            isCrtEnabled={isCrtEnabled}
            onToggleCrt={() => setIsCrtEnabled(!isCrtEnabled)}
            onTimeExpired={handleTimeExpired}
          />
        </>
      )}

      {/* Screen Routing */}
      <main className="flex-1">
        {currentScreen === 'landing' && (
          <LandingPage
            onNavigate={setCurrentScreen}
            cases={CASES}
            onSelectCase={handleSelectCase}
            team={team}
          />
        )}

        {currentScreen === 'team_lobby' && (
          <TeamLobby
            currentTeam={team}
            onUpdateTeam={handleUpdateTeam}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'case_selection' && (
          <CaseSelection
            cases={CASES}
            activeCaseId={activeCaseId}
            onSelectCase={handleSelectCase}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'case_briefing' && (
          <CaseBriefing
            caseData={activeCase}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'investigation_dashboard' && (
          <InvestigationDashboard
            caseData={activeCase}
            team={team}
            onNavigate={setCurrentScreen}
            onSelectSuspect={handleSelectSuspect}
            discoveredEvidenceIds={discoveredEvidenceIds}
          />
        )}

        {currentScreen === 'suspect_profiles' && (
          <SuspectProfiles
            caseData={activeCase}
            team={team}
            onSelectSuspect={handleSelectSuspect}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'interrogation_room' && (
          <InterrogationRoom
            caseData={activeCase}
            team={team}
            selectedSuspectId={selectedSuspectId}
            onSelectSuspect={handleSelectSuspect}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'evidence_library' && (
          <EvidenceLibrary
            caseData={activeCase}
            team={team}
            discoveredEvidenceIds={discoveredEvidenceIds}
            onToggleEvidence={handleToggleEvidence}
            onNavigate={setCurrentScreen}
            onSelectSuspect={handleSelectSuspect}
          />
        )}

        {currentScreen === 'investigation_notes' && (
          <InvestigationNotes
            caseData={activeCase}
            team={team}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'final_accusation' && (
          <FinalAccusation
            caseData={activeCase}
            team={team}
            onNavigate={setCurrentScreen}
            onAccusationSubmitted={handleAccusationSubmitted}
          />
        )}

        {currentScreen === 'case_reveal' && (
          <CaseReveal
            caseData={activeCase}
            team={team}
            verdict={verdict}
            onNavigate={setCurrentScreen}
            onSelectCase={handleSelectCase}
          />
        )}
      </main>

      {/* Killer Threat Intrusion Modal with Violent Glitch & Psychological Horror */}
      <KillerThreatModal
        caseData={activeCase}
        team={team}
        isOpen={showKillerThreatModal}
        onClose={() => setShowKillerThreatModal(false)}
      />

      {/* Full-Screen CRT Surveillance Scanline Overlay (When Active) */}
      {isCrtEnabled && (
        <div className="fixed inset-0 crt-overlay pointer-events-none z-40 opacity-70" />
      )}

      {/* Time Expired Inquest Lockdown Alert */}
      {showTimeExpiredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#1C1717] border-2 border-red-700 max-w-lg w-full p-6 text-[#E8DFCC] space-y-5 shadow-2xl font-mono-archive">
            <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs pb-3 border-b border-red-900/60">
              <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
              <span>TIME LIMIT EXPIRED · INQUEST CORDON SEALED</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-editorial text-2xl font-bold text-red-100">
                The University Board Has Convened
              </h3>
              <p className="font-sans text-xs text-[#A9A398] leading-relaxed">
                The 25-minute investigative warrant has officially lapsed. The coroner’s transport is departing St. Jude Hall. You must either present your final formal charges immediately or request an emergency 5-minute continuance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playDramaticChime();
                  setShowTimeExpiredModal(false);
                  setCurrentScreen('final_accusation');
                }}
                className="w-full btn-gold py-2.5 text-xs uppercase flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Convene Final Accusation ➔</span>
              </button>

              <button
                onClick={() => {
                  sound.playTapeClick();
                  setShowTimeExpiredModal(false);
                }}
                className="w-full btn-dossier py-2.5 text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-[#B49A67]" />
                <span>Grant Emergency Reprieve</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
