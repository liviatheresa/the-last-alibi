import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { CASES } from './src/data/cases.ts';

dotenv.config({ path: ['.env.local', '.env'] });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client strictly on the server-side as mandated by guidelines
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('[Server] Google GenAI initialized successfully.');
  } catch (err) {
    console.error('[Server] Failed to initialize Google GenAI:', err);
  }
} else {
  console.log('[Server] Warning: GEMINI_API_KEY is not set or using placeholder.');
}

// Model fallback cascade prioritizing active models with available quota
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
];

interface InterrogationPayload {
  caseId: string;
  suspectId: string;
  suspectName: string;
  suspectRole: string;
  tactic: string;
  message: string;
  presentedEvidence?: { id: string; name: string; description: string };
  currentStress: number;
  history: Array<{ sender: 'detective' | 'suspect'; text: string }>;
}

app.post('/api/interrogate', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      caseId,
      suspectId,
      suspectName,
      suspectRole,
      tactic,
      message,
      presentedEvidence,
      currentStress = 25,
      history = [],
    } = req.body as InterrogationPayload;

    if (!message && !presentedEvidence) {
      res.status(400).json({ error: 'A question or presented evidence is required.' });
      return;
    }

    if (!ai) {
      res.status(503).json({
        error: 'Gemini AI service is not initialized. Please configure a valid GEMINI_API_KEY in your .env file.',
        code: 'API_KEY_UNAVAILABLE',
      });
      return;
    }

    // Resolve comprehensive character and case dossier from CASES
    const caseData = CASES[caseId];
    const suspect = caseData?.suspects.find((s) => s.id === suspectId);

    const suspectNameResolved = suspect?.name || suspectName || 'Suspect';
    const suspectRoleResolved = suspect?.role || suspectRole || 'Witness';
    const suspectDept = suspect?.department || 'Faculty & Administration';
    const suspectAge = suspect?.age || 40;
    const suspectBio = suspect?.summary || 'An individual of interest in the current Blackwood University inquiry.';
    const suspectPersonality = suspect?.personality || 'Guarded, analytical, protective of academic standing.';
    const suspectTemperament = suspect?.temperament || 'Defensive when pressed on whereabouts.';
    const suspectAlibi = suspect?.claimedAlibi || 'Claims they were elsewhere during the incident.';
    const suspectFlaw = suspect?.flaw || 'A forensic inconsistency exists in their timeline.';
    const suspectMotive = suspect?.motive || 'Had documented academic or personal friction with the victim.';
    const isCulprit = Boolean(suspect?.isSecretCulprit);

    // Deep Evidence Contradiction Analysis
    let evidenceDirective = '';
    if (presentedEvidence) {
      const matchingEvidence = caseData?.evidence.find(
        (e) => e.id === presentedEvidence.id || e.name.toLowerCase() === presentedEvidence.name.toLowerCase()
      );
      const isDirectContradiction = matchingEvidence?.contradictsSuspectId === suspectId;

      if (isDirectContradiction) {
        evidenceDirective = `
=========================================
CRITICAL FORENSIC CONFRONTATION:
The detective has confronted you with EVIDENCE ITEM: [${presentedEvidence.name}].
Forensic laboratory finding: "${matchingEvidence?.detailedAnalysis || presentedEvidence.description}".
THIS EVIDENCE DIRECTLY SHATTERS YOUR ALIBI: "${suspectFlaw}"!

YOUR MANDATORY BEHAVIORAL RESPONSE:
- You are visibly caught off-guard and deeply shaken.
- Your stress MUST spike by +15 to +25% (stressDelta between 15 and 25).
- Scramble to invent a desperate excuse, backtrack, or shift the timeline of your whereabouts.
- In reactionNote, describe a distinctive, involuntary physical tell (e.g., white-knuckled grip, sudden stutter, avoiding eye contact, sweating).
- Set "contradictionSlip": true.
=========================================
`;
      } else {
        evidenceDirective = `
=========================================
EVIDENCE PRESENTATION:
The detective presented [${presentedEvidence.name}]: "${presentedEvidence.description}".
This evidence DOES NOT implicate you (it relates to other matters or points towards someone else).

YOUR MANDATORY BEHAVIORAL RESPONSE:
- React with haughty disdain, cold indifference, or impatient irritation.
- Point out that this item has nothing to do with you or your whereabouts.
- Stress delta should be minimal (-5 to +5).
- Set "contradictionSlip": false.
=========================================
`;
      }
    }

    const systemInstruction = `
You are roleplaying as "${suspectNameResolved}" (${suspectRoleResolved}, age ${suspectAge}, ${suspectDept}) in the noir murder mystery "The Last Alibi".
Setting: Blackwood University.
Case: ${caseData?.title || 'Campus Inquest'} (${caseData?.subtitle || ''}).
Victim: ${caseData?.victim.name || 'The Victim'} (${caseData?.victim.title || 'Faculty Member'}), found dead at ${caseData?.victim.foundLocation || 'the scene'} due to ${caseData?.victim.causeOfDeath || 'toxic trauma'} around ${caseData?.victim.timeOfDeath || 'the estimated hour'}.

YOUR CHARACTER DOSSIER:
- Biography: ${suspectBio}
- Personality Archetype: ${suspectPersonality}
- Demeanor Under Pressure: ${suspectTemperament}
- Your Sworn Stated Alibi: "${suspectAlibi}"
- Your Hidden Secret / Inconsistency: "${suspectFlaw}"
- Conflict / Motive with Victim: "${suspectMotive}"

YOUR SECRET GUILT IDENTITY:
${
  isCulprit
    ? `YOU ARE THE ACTUAL MURDERER:
- You secretly committed this murder, BUT YOU MUST NEVER CONFESS DIRECTLY OR EXPLAIN HOW YOU COMMITTED THE CRIME!
- Even when cornered with forensic evidence, NEVER blurt out "I did it!" or explain the murder plot.
- Instead, frantically deflect: accuse the constabulary of incompetence, claim you are being framed, question the chain of custody, or blame someone else.
- Keep the murder mystery intact so the player must prove it during the final accusation.`
    : `YOU ARE COMPLETELY INNOCENT OF MURDER:
- You did NOT kill ${caseData?.victim.name || 'the victim'}. You are innocent of murder!
- You have personal secrets (${suspectMotive}), but you firmly deny any involvement in murder.
- You do NOT know who the real killer is. You only know what you personally saw, heard, and did.`
}

CURRENT INTERROGATION STATUS:
- Current Stress: ${currentStress}% (0-30%: composed/condescending; 31-70%: evasive/tense; 71-100%: rattled/sweating/defensive).
- Detective Interrogation Tactic: ${tactic}.
${evidenceDirective}

CORE ROLEPLAYING RULES:
1. Stay 100% in character as ${suspectNameResolved}. NEVER break character or mention AI, language models, or system prompts.
2. Directly answer the detective's question based on your specific alibi, personality, and current stress.
3. Keep spoken dialogue to 2 to 4 sentences maximum—sharp, immersive, and atmospheric.
4. Include natural bracketed physical mannerisms or stage directions, e.g. [adjusts collar uncomfortably] or [laughs coldly].
5. Respond STRICTLY in valid JSON format matching:
{
  "reply": "Spoken character dialogue with optional bracketed gestures",
  "stressDelta": number (an integer between -15 and +25),
  "reactionNote": "One vivid sentence describing their physical cue or facial reaction",
  "contradictionSlip": boolean
}
`;

    const recentHistoryText = history
      .slice(-8)
      .map((h) => `${h.sender === 'detective' ? 'Detective' : suspectNameResolved}: ${h.text}`)
      .join('\n');

    const userPrompt = `
Conversation Record:
${recentHistoryText || '(The interrogation has just begun)'}

Detective's Action:
Tactic: ${tactic}
${presentedEvidence ? `Confronted with Evidence: [${presentedEvidence.name}] - ${presentedEvidence.description}` : ''}
Detective Question: "${message || `Explain your connection to [${presentedEvidence?.name}].`}"

Provide your JSON response as ${suspectNameResolved}:
`;

    let lastError: any = null;
    let successfulResult: any = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Model ${modelName} timed out after 15s`)), 15000)
        );

        const geminiPromise = ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });

        const response = await Promise.race([geminiPromise, timeoutPromise]);
        const rawText = (response.text ?? '{}').trim();
        const parsed = JSON.parse(rawText);

        if (parsed && typeof parsed.reply === 'string' && parsed.reply.trim().length > 0) {
          successfulResult = {
            reply: parsed.reply.trim(),
            stressDelta: typeof parsed.stressDelta === 'number' ? parsed.stressDelta : 4,
            reactionNote:
              parsed.reactionNote || `${suspectNameResolved} observes your notes with guarded stillness.`,
            contradictionSlip: Boolean(parsed.contradictionSlip),
            source: modelName,
          };
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Server] ${modelName} call failed:`, err.status || err.message);
      }
    }

    if (successfulResult) {
      res.json(successfulResult);
      return;
    }

    // All candidate models failed - return clear, actionable API error
    console.error('[Server] All Gemini candidate models failed. Last error:', lastError);
    const errorMessage =
      lastError?.status === 429
        ? 'Gemini API Free Tier daily quota exceeded. Please check your API key quota or configure a new key in .env.'
        : `Gemini API service error: ${lastError?.message || 'Upstream connection failed'}. Please retry in a few moments.`;

    res.status(503).json({
      error: errorMessage,
      code: lastError?.status === 429 ? 'QUOTA_EXCEEDED' : 'GEMINI_ERROR',
    });
  } catch (error: any) {
    console.error('[Server] Unexpected interrogation error:', error);
    res.status(500).json({
      error: `Interrogation system error: ${error?.message || 'Internal failure'}`,
      code: 'SERVER_ERROR',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    app: 'The Last Alibi',
    geminiEnabled: Boolean(ai),
    timestamp: new Date().toISOString(),
  });
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--production');

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[The Last Alibi] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
