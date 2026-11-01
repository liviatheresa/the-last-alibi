import { Evidence, ChatMessage } from '../types';
import { CASES } from '../data/cases';

export interface InterrogationResult {
  reply: string;
  stressDelta: number;
  reactionNote: string;
  contradictionSlip?: boolean;
  source?: string;
}

function getProceduralFallback(params: {
  caseId: string;
  suspectId: string;
  suspectName: string;
  suspectRole: string;
  tactic: string;
  message: string;
  presentedEvidence?: Evidence;
  currentStress: number;
}): InterrogationResult {
  const caseData = CASES[params.caseId];
  const suspect = caseData?.suspects.find((s) => s.id === params.suspectId);
  const evidence = params.presentedEvidence;

  if (evidence) {
    const isContradiction = evidence.contradictsSuspectId === params.suspectId;
    if (isContradiction) {
      return {
        reply: `[${suspect?.name || 'Witness'} pales, eyes darting to your notes] That... that evidence is being misconstrued! ${suspect?.flaw || 'There may be an irregularity'}, but I assure you I had nothing to do with their demise!`,
        stressDelta: 18,
        reactionNote: `${suspect?.name || 'The witness'} grips the table edge tightly, voice shaking as they scramble to explain.`,
        contradictionSlip: true,
        source: 'procedural-fallback',
      };
    } else {
      return {
        reply: `[folds arms dismissively] What has [${evidence.name}] got to do with me? You're chasing shadows while the true culprit walks free. Check the official record.`,
        stressDelta: 2,
        reactionNote: `${suspect?.name || 'The witness'} glances at the clock, visibly impatient with this line of questioning.`,
        contradictionSlip: false,
        source: 'procedural-fallback',
      };
    }
  }

  // Contextual natural queries
  const query = (params.message || '').toLowerCase();
  if (
    query.includes('where') ||
    query.includes('time') ||
    query.includes('alibi') ||
    query.includes('night') ||
    query.includes('11')
  ) {
    return {
      reply: `[maintains composure] I have stated this repeatedly: ${suspect?.claimedAlibi || 'I was nowhere near the scene during the relevant timeframe'}. If you verify the security logs, you'll see my statement holds up.`,
      stressDelta: 5,
      reactionNote: `${suspect?.name || 'The witness'} taps their knuckles against the table with measured confidence.`,
      contradictionSlip: false,
      source: 'procedural-fallback',
    };
  }

  if (
    query.includes('victim') ||
    query.includes('kill') ||
    query.includes('death') ||
    query.includes('murder') ||
    query.includes('hate') ||
    query.includes('argue') ||
    query.includes('dispute')
  ) {
    return {
      reply: `[frowns with guarded restraint] We had professional friction—as many in our department did. But taking a life? That is a slanderous and unfounded accusation.`,
      stressDelta: 8,
      reactionNote: `${suspect?.name || 'The witness'} shifts back in their chair, guarded and calculating.`,
      contradictionSlip: false,
      source: 'procedural-fallback',
    };
  }

  return {
    reply: `[speaks in a measured tone] As ${suspect?.role || 'a member of this faculty'}, my record stands for itself. If you have tangible forensic proof, lay it on the table. Otherwise, do not waste our time.`,
    stressDelta: 4,
    reactionNote: `${suspect?.name || 'The witness'} holds your stare with unwavering focus.`,
    contradictionSlip: false,
    source: 'procedural-fallback',
  };
}

export async function askSuspectAI(params: {
  caseId: string;
  suspectId: string;
  suspectName: string;
  suspectRole: string;
  tactic: string;
  message: string;
  presentedEvidence?: Evidence;
  currentStress: number;
  history: ChatMessage[];
}): Promise<InterrogationResult> {
  try {
    const payload = {
      caseId: params.caseId,
      suspectId: params.suspectId,
      suspectName: params.suspectName,
      suspectRole: params.suspectRole,
      tactic: params.tactic,
      message: params.message,
      presentedEvidence: params.presentedEvidence
        ? {
            id: params.presentedEvidence.id,
            name: params.presentedEvidence.name,
            description: params.presentedEvidence.summary,
          }
        : undefined,
      currentStress: params.currentStress,
      history: params.history.map((h) => ({
        sender: h.sender,
        text: h.text,
      })),
    };

    let response: Response;
    try {
      response = await fetch('/api/interrogate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (networkErr: any) {
      console.warn('[Gemini Client] Network fetch failed, falling back to standalone procedural response:', networkErr);
      return getProceduralFallback(params);
    }

    // If serverless endpoint is not hosted or 404s (e.g. static CDN deployment), fall back gracefully
    if (response.status === 404) {
      console.info('[Gemini Client] /api/interrogate returned 404 (static preview/deployment mode). Using procedural response fallback.');
      return getProceduralFallback(params);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg =
        data.error ||
        `Interrogation API request failed (HTTP ${response.status}). Please check server logs.`;
      throw new Error(errorMsg);
    }

    if (!data.reply) {
      throw new Error('Received empty response from suspect AI.');
    }

    return {
      reply: data.reply,
      stressDelta: typeof data.stressDelta === 'number' ? data.stressDelta : 5,
      reactionNote: data.reactionNote || `Suspect observes your notes closely.`,
      contradictionSlip: Boolean(data.contradictionSlip),
      source: data.source,
    };
  } catch (error: any) {
    console.error('[Gemini Client] Interrogation error:', error);
    throw error;
  }
}
