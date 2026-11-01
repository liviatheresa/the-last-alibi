export type CaseId = 'case-001' | 'case-002';

export type ScreenId =
  | 'landing'
  | 'team_lobby'
  | 'case_selection'
  | 'case_briefing'
  | 'investigation_dashboard'
  | 'suspect_profiles'
  | 'interrogation_room'
  | 'evidence_library'
  | 'investigation_notes'
  | 'final_accusation'
  | 'case_reveal';

export interface Suspect {
  id: string;
  name: string;
  role: string;
  department: string;
  age: number;
  avatar: string;
  summary: string;
  claimedAlibi: string;
  flaw: string;
  motive: string;
  forensicTies: string[];
  personality: string;
  temperament: string;
  isSecretCulprit: boolean; // Evaluated only during accusation & reveal
}

export interface Evidence {
  id: string;
  name: string;
  category: 'Toxicology' | 'Physical' | 'Digital' | 'Documentary' | 'Audio/Document';
  tagNumber: string;
  location: string;
  summary: string;
  detailedAnalysis: string;
  contradictsSuspectId?: string;
  keyClue: boolean;
  iconName: string;
  audioSnippet?: {
    duration: string;
    transcript: string;
  };
}

export interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  verified: boolean;
  source: string;
}

export interface CaseSolution {
  culpritId: string;
  culpritName: string;
  murderWeapon: string;
  keyContradiction: string;
  trueMotive: string;
  fullReenactment: string;
  confessionTranscript: string;
  redHerringExplanations: Array<{ suspectName: string; reasonNotGuilty: string }>;
}

export interface CrimeSceneHotspot {
  id: string;
  name: string;
  roomArea: string;
  xPercent: number;
  yPercent: number;
  briefClue: string;
  forensicObservation: string;
  discoveredDetail: string;
  tiedEvidenceId?: string;
  tiedSuspectName?: string;
}

export interface CaseData {
  id: CaseId;
  code: string;
  title: string;
  subtitle: string;
  victim: {
    name: string;
    title: string;
    age: number;
    causeOfDeath: string;
    timeOfDeath: string;
    foundLocation: string;
    photo: string;
  };
  location: string;
  difficulty: 'Standard' | 'Challenging';
  estimatedTime: string;
  synopsis: string;
  autopsySummary: string;
  dispatchLog: string;
  crimeSceneDetails: string[];
  crimeSceneHotspots?: CrimeSceneHotspot[];
  suspects: Suspect[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
  solution: CaseSolution;
  weaponsList: string[];
  contradictionsList: string[];
  motivesList: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'detective' | 'suspect';
  text: string;
  timestamp: string;
  tactic?: string;
  evidencePresented?: string;
  reactionNote?: string;
  stressDelta?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  badgeNumber: string;
  avatar: string;
  online: boolean;
}

export interface Team {
  id: string;
  code: string;
  name: string;
  leadDetective: string;
  currentRole: string;
  badgeNumber: string;
  members: TeamMember[];
  createdAt: string;
}

export interface DetectiveNote {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  category: 'hypothesis' | 'inconsistency' | 'lead' | 'question';
  linkedSuspectId?: string;
  linkedEvidenceId?: string;
  isPinned?: boolean;
}

export interface AccusationSubmission {
  accusedSuspectId: string;
  selectedWeapon: string;
  selectedContradiction: string;
  selectedMotive: string;
  indictmentNotes: string;
  submittedAt: string;
}

export interface AccusationVerdict {
  isCorrectCulprit: boolean;
  isCorrectWeapon: boolean;
  isCorrectContradiction: boolean;
  isCorrectMotive: boolean;
  score: number; // 0 - 100
  rank: 'Chief Superintendent' | 'Senior Inspector' | 'Forensic Detective' | 'Mistrial / Reopened';
  feedback: string[];
}
