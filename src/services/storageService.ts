import { Team, ChatMessage, DetectiveNote, AccusationSubmission, AccusationVerdict } from '../types';

const STORAGE_KEYS = {
  CURRENT_TEAM: 'last_alibi_current_team',
  TEAMS: 'last_alibi_teams',
  CHAT_PREFIX: 'last_alibi_chat_',
  SUSPECT_STRESS_PREFIX: 'last_alibi_stress_',
  NOTES_PREFIX: 'last_alibi_notes_',
  ACCUSATION_PREFIX: 'last_alibi_accusation_',
  VERDICT_PREFIX: 'last_alibi_verdict_',
  DISCOVERED_CLUES_PREFIX: 'last_alibi_clues_',
  AUDIO_AMBIANCE: 'last_alibi_ambiance',
};

// Default syndicate team
export const DEFAULT_TEAM: Team = {
  id: 'team_blackwood_omega',
  code: 'BW-8821',
  name: 'Special Inquiries Unit (Division 4)',
  leadDetective: 'Senior Inspector Vance-Cross',
  currentRole: 'Lead Investigator',
  badgeNumber: 'SH-4091',
  createdAt: new Date().toISOString(),
  members: [
    {
      id: 'm1',
      name: 'Detective J. Miller',
      role: 'Forensic Pathologist',
      badgeNumber: 'SH-4092',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      online: true,
    },
    {
      id: 'm2',
      name: 'Investigator S. Chen',
      role: 'Cyber Forensics Analyst',
      badgeNumber: 'SH-4093',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      online: true,
    },
    {
      id: 'm3',
      name: 'Agent R. Thornton',
      role: 'Behavioral Profiler',
      badgeNumber: 'SH-4094',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      online: false,
    },
  ],
};

export class StorageService {
  public static getCurrentTeam(): Team {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_TEAM);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (_) {}
    return DEFAULT_TEAM;
  }

  public static saveCurrentTeam(team: Team): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_TEAM, JSON.stringify(team));
    } catch (_) {}
  }

  // Conversation history isolated per team, case, and suspect
  public static getChatHistory(teamId: string, caseId: string, suspectId: string): ChatMessage[] {
    const key = `${STORAGE_KEYS.CHAT_PREFIX}${teamId}_${caseId}_${suspectId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return [];
  }

  public static saveChatHistory(teamId: string, caseId: string, suspectId: string, history: ChatMessage[]): void {
    const key = `${STORAGE_KEYS.CHAT_PREFIX}${teamId}_${caseId}_${suspectId}`;
    try {
      localStorage.setItem(key, JSON.stringify(history));
    } catch (_) {}
  }

  // Suspect stress level tracking
  public static getSuspectStress(teamId: string, caseId: string, suspectId: string): number {
    const key = `${STORAGE_KEYS.SUSPECT_STRESS_PREFIX}${teamId}_${caseId}_${suspectId}`;
    try {
      const val = localStorage.getItem(key);
      if (val !== null) return parseInt(val, 10);
    } catch (_) {}
    return 15; // Initial calm baseline
  }

  public static setSuspectStress(teamId: string, caseId: string, suspectId: string, stress: number): void {
    const clamped = Math.min(100, Math.max(0, stress));
    const key = `${STORAGE_KEYS.SUSPECT_STRESS_PREFIX}${teamId}_${caseId}_${suspectId}`;
    try {
      localStorage.setItem(key, clamped.toString());
    } catch (_) {}
  }

  // Investigation notes
  public static getNotes(teamId: string, caseId: string): DetectiveNote[] {
    const key = `${STORAGE_KEYS.NOTES_PREFIX}${teamId}_${caseId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return [
      {
        id: 'initial-note-1',
        author: 'Lead Detective',
        content: 'Check the coroner autopsy logs against the suspect statements immediately.',
        timestamp: '10 mins ago',
        category: 'lead',
        isPinned: true,
      },
    ];
  }

  public static saveNotes(teamId: string, caseId: string, notes: DetectiveNote[]): void {
    const key = `${STORAGE_KEYS.NOTES_PREFIX}${teamId}_${caseId}`;
    try {
      localStorage.setItem(key, JSON.stringify(notes));
    } catch (_) {}
  }

  // Accusation & Verdict
  public static getAccusation(teamId: string, caseId: string): AccusationSubmission | null {
    const key = `${STORAGE_KEYS.ACCUSATION_PREFIX}${teamId}_${caseId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return null;
  }

  public static saveAccusation(teamId: string, caseId: string, accusation: AccusationSubmission): void {
    const key = `${STORAGE_KEYS.ACCUSATION_PREFIX}${teamId}_${caseId}`;
    try {
      localStorage.setItem(key, JSON.stringify(accusation));
    } catch (_) {}
  }

  public static getVerdict(teamId: string, caseId: string): AccusationVerdict | null {
    const key = `${STORAGE_KEYS.VERDICT_PREFIX}${teamId}_${caseId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return null;
  }

  public static saveVerdict(teamId: string, caseId: string, verdict: AccusationVerdict): void {
    const key = `${STORAGE_KEYS.VERDICT_PREFIX}${teamId}_${caseId}`;
    try {
      localStorage.setItem(key, JSON.stringify(verdict));
    } catch (_) {}
  }

  // Discovered / Key evidence tags
  public static getDiscoveredEvidence(teamId: string, caseId: string): string[] {
    const key = `${STORAGE_KEYS.DISCOVERED_CLUES_PREFIX}${teamId}_${caseId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return [];
  }

  public static toggleDiscoveredEvidence(teamId: string, caseId: string, evidenceId: string): string[] {
    const current = this.getDiscoveredEvidence(teamId, caseId);
    let updated: string[];
    if (current.includes(evidenceId)) {
      updated = current.filter(id => id !== evidenceId);
    } else {
      updated = [...current, evidenceId];
    }
    const key = `${STORAGE_KEYS.DISCOVERED_CLUES_PREFIX}${teamId}_${caseId}`;
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (_) {}
    return updated;
  }
}

/**
 * ============================================================================
 * SUPABASE INTEGRATION BLUEPRINT & SCHEMA SPECIFICATION
 * ============================================================================
 * Ready for immediate multi-tenant Supabase real-time sync when env variables
 * (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are connected:
 *
 * SQL Tables Architecture:
 * 1. `teams` (id uuid PK, code text UNIQUE, name text, lead_detective text, created_at timestamptz)
 * 2. `team_members` (id uuid PK, team_id uuid FK, user_name text, role text, badge text, online boolean)
 * 3. `interrogations` (id uuid PK, team_id uuid, case_id text, suspect_id text, stress int, updated_at timestamptz)
 * 4. `chat_messages` (id uuid PK, interrogation_id uuid FK, sender text, text text, reaction text, tactic text, created_at timestamptz)
 * 5. `investigation_notes` (id uuid PK, team_id uuid, case_id text, author text, content text, category text, is_pinned boolean)
 * 6. `accusations` (id uuid PK, team_id uuid, case_id text, suspect_id text, weapon text, contradiction text, score int)
 */
export const SUPABASE_CONFIG = {
  isConfigured: false, // Set to true when VITE_SUPABASE_URL is populated
  schemaVersion: '1.0.0',
};
