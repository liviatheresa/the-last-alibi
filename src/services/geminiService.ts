import { Evidence, ChatMessage } from '../types';

export interface InterrogationResult {
  reply: string;
  stressDelta: number;
  reactionNote: string;
  contradictionSlip?: boolean;
  source?: string;
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
      history: params.history.map(h => ({
        sender: h.sender,
        text: h.text,
      })),
    };

    const response = await fetch('/api/interrogate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

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
