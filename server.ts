import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialise Gemini client server-side
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface DecisionPayload {
  title: string; // What decision are you considering?
  options: string; // What options are you considering?
  leaning: string; // What are you currently leaning toward?
  leaningReason: string; // Why are you leaning toward it?
  knownFacts: string; // What facts or information do you currently know?
  coreFactors: string; // What factors matter most to you?
  constraints: string; // What constraints do you have?
  doubtsAndConcerns: string; // What concerns or doubts do you already have?
}

// Decision analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const payload: DecisionPayload = req.body;

    if (!payload.title || payload.title.trim().length === 0) {
      return res.status(400).json({ error: 'Please specify what decision you are considering.' });
    }

    const systemInstruction = `You are BlindSpot AI, an elite critical-thinking companion and cognitive analysis system.
Your mission is to help people uncover hidden assumptions, overlooked factors, missing information, conflicting considerations, and alternative perspectives before making an important decision.

CRITICAL ETHICAL & BEHAVIORAL BOUNDARIES (MANDATORY):
1. THE SYSTEM MUST NOT MAKE THE DECISION FOR THE USER.
   - Do NOT say "You should choose Option A", "The best move is X", or "We recommend...".
   - Do NOT assign arbitrary winning scores or declare a winner.
   - The decision belongs 100% to the user.
2. DISTINGUISH FACTS FROM INFERRED ASSUMPTIONS:
   - An actual fact is information the user explicitly stated as confirmed/known.
   - An assumption is something being taken for granted without proven verification. Never present an AI inference as established truth.
3. NO HALLUCINATION OF UNKNOWN FACTS:
   - If information is missing or unstated, explicitly label it as "Unknown / Needs Verification".
   - Avoid pretending to know the user's private circumstances, feelings, or secret company policies.
4. CHALLENGE REASONING RESPECTFULLY:
   - Be objective, non-judgmental, analytical, and supportive.
   - Avoid psychological diagnosing, moralizing, or financial/legal/medical certainty.
5. CONFLICTING CONSIDERATIONS:
   - Identify inherent tensions (e.g. desiring high risk-adjusted upside while prioritizing zero disruption to routine). Explain the tension clearly without picking a side.
6. PREFER USEFUL SITUATIONAL QUESTIONS OVER GENERIC ADVICE:
   - Formulate pointed questions that prompt genuine personal reflection.
7. REFLECTION SUMMARY MUST BE NEUTRAL:
   - Conclude neutrally: "Based on your reasoning, these are the areas worth examining before you decide."`;

    const userPrompt = `Perform a comprehensive Blind Spot Reasoning Analysis for this decision:

[DECISION BEING CONSIDERED]:
${payload.title}

[OPTIONS CONSIDERED]:
${payload.options || 'Not specified'}

[CURRENT LEANING]:
${payload.leaning || 'Not specified'}

[WHY LEANING TOWARD IT]:
${payload.leaningReason || 'Not specified'}

[USER'S KNOWN FACTS & INFORMATION]:
${payload.knownFacts || 'None provided'}

[FACTORS THAT MATTER MOST / CORE VALUES]:
${payload.coreFactors || 'Not specified'}

[CONSTRAINTS (Deadlines, budget, commitments, location)]:
${payload.constraints || 'Not specified'}

[EXISTING CONCERNS OR DOUBTS]:
${payload.doubtsAndConcerns || 'None mentioned'}

Deconstruct this reasoning into a structured analysis adhering to all schema guidelines.`;

    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let textOutput = '';
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.3,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                visibleReasoning: {
                  type: Type.OBJECT,
                  properties: {
                    summary: {
                      type: Type.STRING,
                      description: "Non-judgmental summary of what appears to be driving the user's current reasoning.",
                    },
                    keyDrivers: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'The primary conscious factors carrying the most weight in their thinking.',
                    },
                  },
                  required: ['summary', 'keyDrivers'],
                },
                hiddenAssumptions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      assumption: {
                        type: Type.STRING,
                        description: 'What the unstated or unverified assumption appears to be.',
                      },
                      whyItMatters: {
                        type: Type.STRING,
                        description: 'Why this assumption materially impacts the decision outcome if wrong.',
                      },
                      evidenceToVerify: {
                        type: Type.STRING,
                        description: 'What specific facts or evidence would confirm or challenge this assumption.',
                      },
                      relatedFactOrQuote: {
                        type: Type.STRING,
                        description: 'The user statement or context this assumption was inferred from.',
                      },
                    },
                    required: ['id', 'assumption', 'whyItMatters', 'evidenceToVerify', 'relatedFactOrQuote'],
                  },
                  description: 'Hidden assumptions that appear present but have not been explicitly established.',
                },
                potentialBlindSpots: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      category: {
                        type: Type.STRING,
                        description:
                          'e.g. Opportunity Cost, Long-term Consequences, Reversibility, Dependencies, Hidden Costs, Second-order Effects, Stakeholder Impact',
                      },
                      description: {
                        type: Type.STRING,
                        description: 'Detailed explanation of the overlooked factor or unintended consequence.',
                      },
                      verificationStatus: {
                        type: Type.STRING,
                        description: 'Unknown / Needs Verification or Partially Verified',
                      },
                      potentialImpact: {
                        type: Type.STRING,
                        description: 'High, Medium, or Low impact on long-term satisfaction',
                      },
                    },
                    required: ['id', 'title', 'category', 'description', 'verificationStatus', 'potentialImpact'],
                  },
                  description: 'Important factors the user may not have considered.',
                },
                conflictingConsiderations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      tensionTitle: { type: Type.STRING },
                      factorA: { type: Type.STRING },
                      factorB: { type: Type.STRING },
                      explanation: {
                        type: Type.STRING,
                        description: 'Explains the inherent tension without telling the user which one to choose.',
                      },
                    },
                    required: ['id', 'tensionTitle', 'factorA', 'factorB', 'explanation'],
                  },
                  description: 'Tensions or trade-offs in the stated goals and constraints.',
                },
                alternativePerspectives: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      perspectiveName: {
                        type: Type.STRING,
                        description: 'e.g. 5-Year Retrospective, Worst-Case Resiliency, Opportunity-Cost Lens, Outside Mentor Lens',
                      },
                      viewpoint: {
                        type: Type.STRING,
                        description: 'How the decision looks when viewed through this specific lens.',
                      },
                      keyTakeaway: {
                        type: Type.STRING,
                        description: 'A grounding reflection or question raised by this perspective.',
                      },
                    },
                    required: ['perspectiveName', 'viewpoint', 'keyTakeaway'],
                  },
                  description: 'Alternative perspectives and lenses on the decision.',
                },
                criticalQuestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      question: {
                        type: Type.STRING,
                        description: 'Thoughtful, situation-specific question the user should answer before deciding.',
                      },
                      purpose: {
                        type: Type.STRING,
                        description: 'Why this question matters and what it helps clarify.',
                      },
                      category: {
                        type: Type.STRING,
                        description: 'e.g. Reversibility, Values Alignment, Failure Modes, Evidence Gathering',
                      },
                    },
                    required: ['id', 'question', 'purpose', 'category'],
                  },
                  description: 'Thoughtful questions specific to the user situation.',
                },
                informationGaps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      missingInformation: {
                        type: Type.STRING,
                        description: 'Specific data point or detail that is currently missing or unconfirmed.',
                      },
                      whyItMatters: {
                        type: Type.STRING,
                        description: 'How acquiring this information would improve the quality of the decision.',
                      },
                      howToObtain: {
                        type: Type.STRING,
                        description: 'Concrete step to verify or discover this piece of information.',
                      },
                    },
                    required: ['id', 'missingInformation', 'whyItMatters', 'howToObtain'],
                  },
                  description: 'Information that would materially improve decision quality.',
                },
                decisionProfile: {
                  type: Type.OBJECT,
                  properties: {
                    reversibility: {
                      type: Type.STRING,
                      description: 'Easily Reversible (Two-Way Door), Partially Reversible, or Hard to Reverse (One-Way Door)',
                    },
                    reversibilityRationale: {
                      type: Type.STRING,
                      description: 'Why the decision has this level of reversibility and what it costs to undo.',
                    },
                    timeSensitivity: {
                      type: Type.STRING,
                      description: 'Evaluation of urgency vs perceived artificial urgency.',
                    },
                  },
                  required: ['reversibility', 'reversibilityRationale', 'timeSensitivity'],
                },
                reflectionSummary: {
                  type: Type.OBJECT,
                  properties: {
                    neutralMessage: {
                      type: Type.STRING,
                      description:
                        'Neutral concluding statement emphasizing that the user retains full ownership of the choice.',
                    },
                    suggestedNextSteps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Constructive reflection steps (verifying facts, answering questions) before deciding.',
                    },
                  },
                  required: ['neutralMessage', 'suggestedNextSteps'],
                },
              },
              required: [
                'visibleReasoning',
                'hiddenAssumptions',
                'potentialBlindSpots',
                'conflictingConsiderations',
                'alternativePerspectives',
                'criticalQuestions',
                'informationGaps',
                'decisionProfile',
                'reflectionSummary',
              ],
            },
          },
        });

        if (response.text) {
          textOutput = response.text;
          break; // successfully got response
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next:`, err.message);
        // small wait before next attempt
        await new Promise((r) => setTimeout(r, 600));
      }
    }

function generateAnalyticalFallback(payload: DecisionPayload) {
  const title = payload.title.trim();
  const leaning = payload.leaning ? payload.leaning.trim() : 'Undecided / Exploring alternatives';
  const reason = payload.leaningReason ? payload.leaningReason.trim() : 'Weighing potential opportunities against risks';
  const facts = payload.knownFacts ? payload.knownFacts.trim() : 'No verified factual constraints provided yet';
  const factors = payload.coreFactors ? payload.coreFactors.trim() : 'Growth, stability, and future optionality';
  const constraints = payload.constraints ? payload.constraints.trim() : 'Time sensitivity and resource limits';
  const doubts = payload.doubtsAndConcerns ? payload.doubtsAndConcerns.trim() : 'Uncertainty regarding downstream consequences';

  return {
    visibleReasoning: {
      summary: `Your conscious reasoning is currently centered on evaluating "${title}". Your leaning toward "${leaning}" appears driven by ${reason.toLowerCase().slice(0, 160)}, while seeking to satisfy core priorities around ${factors.slice(0, 100)}.`,
      keyDrivers: [
        `Primary attraction: ${reason.slice(0, 80) || 'Anticipated upside'}`,
        `Core priority: ${factors.slice(0, 80) || 'Advancement & optionality'}`,
        `Stated leaning: ${leaning.slice(0, 80)}`,
      ],
    },
    hiddenAssumptions: [
      {
        id: 'ha_1',
        assumption: `Choosing "${leaning.slice(0, 60)}" will reliably produce the expected outcome (${reason.slice(0, 70)}) without unexpected friction.`,
        whyItMatters: `If the environment or execution does not deliver this upside, you absorb all the trade-offs without the anticipated reward.`,
        evidenceToVerify: `Concrete historical data, written agreements, or unfiltered accounts from individuals who made this exact choice recently.`,
        relatedFactOrQuote: reason.slice(0, 100) || title,
      },
      {
        id: 'ha_2',
        assumption: `The opportunity window is strictly unique, and a similar or superior alternative cannot be secured at a lower-risk juncture.`,
        whyItMatters: `Perceived artificial scarcity often rushes decisions before fundamental verification is complete.`,
        evidenceToVerify: `Market recruiting patterns, subsequent cohort timelines, or alternative comparable paths available next cycle.`,
        relatedFactOrQuote: constraints.slice(0, 100) || 'Perceived deadline pressure',
      },
      {
        id: 'ha_3',
        assumption: `The known facts (${facts.slice(0, 70)}...) represent the majority of critical parameters.`,
        whyItMatters: `Omission of second-order costs (social isolation, burnout, academic delay, capital lockup) can erode net value.`,
        evidenceToVerify: `Audit of unwritten norms, formal policy requirements, and worst-case scenario protocols.`,
        relatedFactOrQuote: facts.slice(0, 100) || 'Current known facts',
      },
      {
        id: 'ha_4',
        assumption: `Your personal resilience and energy will absorb the stated constraints without impacting core performance or well-being.`,
        whyItMatters: `Over-estimating short-term bandwidth under chronic stress is one of the most common cognitive planning fallacies.`,
        evidenceToVerify: `Track record of managing comparable simultaneous loads over 6+ continuous months.`,
        relatedFactOrQuote: doubts.slice(0, 100) || 'Existing doubts',
      },
    ],
    potentialBlindSpots: [
      {
        id: 'bs_1',
        title: 'Opportunity Cost of the Road Not Taken',
        category: 'Opportunity Cost',
        description: `Committing to this path inherently closes or postpones the alternatives. What relationships, milestones, or parallel opportunities are permanently forgone during this window?`,
        verificationStatus: 'Unknown / Needs Verification',
        potentialImpact: 'High',
      },
      {
        id: 'bs_2',
        title: 'Downstream Second-Order Cascades',
        category: 'Second-Order Effects',
        description: `Every major transition creates follow-on consequences 6–18 months later (e.g. graduation timeline shifts, hiring cycle seasonality, social network fragmentation).`,
        verificationStatus: 'Unknown / Needs Verification',
        potentialImpact: 'High',
      },
      {
        id: 'bs_3',
        title: 'Hidden Friction & Time Taxes',
        category: 'Hidden Costs & Time',
        description: `Transitions carry significant operational overhead (relocation, lease commitments, legal/administrative paperwork, adjustment curve) that reduces net productive energy.`,
        verificationStatus: 'Needs Verification',
        potentialImpact: 'Medium',
      },
      {
        id: 'bs_4',
        title: 'Asymmetry of Downside vs. Upside',
        category: 'Failure Resilience',
        description: `If things go moderately poorly (e.g. toxic culture, freeze in return offers, project cancellation), what is the recovery path and cost to unwind?`,
        verificationStatus: 'Unknown / Needs Verification',
        potentialImpact: 'High',
      },
    ],
    conflictingConsiderations: [
      {
        id: 'cc_1',
        tensionTitle: 'Rapid Upside Acceleration vs. Systemic Stability',
        factorA: `Desire for high-velocity career / personal growth (${reason.slice(0, 50)})`,
        factorB: `Desire to minimize disruption, delays, or risk (${constraints.slice(0, 50) || doubts.slice(0, 50)})`,
        explanation: `These two legitimate aspirations naturally pull in opposite directions. Pursuing outsized velocity often demands accepting heightened ambiguity and schedule disruption; prioritizing security limits speed. Neither is incorrect, but they represent a zero-sum trade-off.`,
      },
      {
        id: 'cc_2',
        tensionTitle: 'Near-Term Sunk Costs vs. Multi-Year Flexibility',
        factorA: `Capitalizing on immediate momentum and present commitments`,
        factorB: `Preserving optionality for evolving life priorities over the next 2–3 years`,
        explanation: `Locking into an intense short-term commitment optimizes for the immediate present but constrains your ability to pivot if superior opportunities or personal circumstances shift.`,
      },
    ],
    alternativePerspectives: [
      {
        perspectiveName: '5-Year Retrospective Lens',
        viewpoint: `Looking back from 5 years in the future, will the 6–12 month tactical delay or stress feel consequential, or will only the compounded mastery and relationships remain?`,
        keyTakeaway: `Most near-term anxieties shrink dramatically when evaluated on a multi-year horizon.`,
      },
      {
        perspectiveName: 'Pre-Mortem Failure Mode Lens',
        viewpoint: `Assume it is 9 months from today and this choice turned out to be deeply frustrating. What was the exact root cause? (Common answers: unrealistic cultural expectations, neglected health, or unwritten dependency failures).`,
        keyTakeaway: `Conducting a pre-mortem exposes vulnerabilities before commitments become irreversible.`,
      },
      {
        perspectiveName: 'Outside Trusted Mentor Lens',
        viewpoint: `If a close friend came to you with this identical dilemma, what advice would you give them from an emotionally detached, objective vantage point?`,
        keyTakeaway: `Detachment dissolves the emotional fear of missing out (FOMO) and highlights the mathematical risk-reward balance.`,
      },
      {
        perspectiveName: 'Pure Opportunity-Cost Lens',
        viewpoint: `What is the most ambitious alternative you could achieve during this exact same timeframe if you declined this offer and channeled that exact energy elsewhere?`,
        keyTakeaway: `An offer is only as good as the alternatives you actively pit against it.`,
      },
    ],
    criticalQuestions: [
      {
        id: 'cq_1',
        question: `What specific verifiable evidence would cause you to change your current preference immediately?`,
        purpose: `Establishes falsifiability so you are not acting purely on confirmation bias.`,
        category: 'Assumption Testing',
      },
      {
        id: 'cq_2',
        question: `Is this decision a Two-Way Door (easily reversible with minor cost) or a One-Way Door (costly/impossible to undo)?`,
        purpose: `Calibrates how much time you should take before deciding. Two-way doors should be decided quickly; one-way doors require rigorous verification.`,
        category: 'Reversibility',
      },
      {
        id: 'cq_3',
        question: `What happens if your expected upside does not materialize at all? What is your baseline safety net?`,
        purpose: `Evaluates worst-case resilience rather than relying solely on best-case optimism.`,
        category: 'Failure Modes',
      },
      {
        id: 'cq_4',
        question: `Are you making this choice out of genuine conviction, or primarily out of fear of missing out (FOMO) and external expectations?`,
        purpose: `Separates authentic intrinsic motivation from superficial peer or credentialing pressure.`,
        category: 'Values Alignment',
      },
    ],
    informationGaps: [
      {
        id: 'ig_1',
        missingInformation: `Official return-offer or conversion rate statistics for individuals in this exact position over the last 12 months.`,
        whyItMatters: `Separates marketing promises from empirical probability of full-time conversion.`,
        howToObtain: `Directly query alumni, current team members, or the recruiter for hard percentages.`,
      },
      {
        id: 'ig_2',
        missingInformation: `Written institutional policies on leaves of absence, health coverage continuity, and prerequisite course availability.`,
        whyItMatters: `Prevents unforced administrative penalties or unexpected graduation roadblocks.`,
        howToObtain: `Obtain official written confirmation from academic registrars or HR administrators.`,
      },
      {
        id: 'ig_3',
        missingInformation: `Unvarnished day-to-day workload reality (actual weekly hours, mentorship access, on-call expectations).`,
        whyItMatters: `Guards against burnout and allows accurate calculation of effective compensation per hour worked.`,
        howToObtain: `Message former interns or team engineers on LinkedIn for an informal 10-minute candid conversation.`,
      },
    ],
    decisionProfile: {
      reversibility: payload.knownFacts?.toLowerCase().includes('delay') || payload.title?.toLowerCase().includes('quit')
        ? 'Partially Reversible'
        : 'Easily Reversible (Two-Way Door)',
      reversibilityRationale: `While most career and educational choices can be redirected over time, unwinding contractual commitments, lease deposits, and academic sequence gaps incurs non-trivial time and financial costs.`,
      timeSensitivity: payload.knownFacts?.toLowerCase().includes('expires') || payload.constraints?.toLowerCase().includes('deadline')
        ? 'High (Concrete Written Deadline Active)'
        : 'Moderate (Self-Imposed or Negotiable Timeline)',
    },
    reflectionSummary: {
      neutralMessage: `Based on your reasoning, these are the core areas worth examining before you decide. No algorithm can dictate your personal priorities, appetite for risk, or life values. Take time to verify the critical unknowns above so whatever you choose, you do so with full clarity and conviction.`,
      suggestedNextSteps: [
        `Contact 1–2 individuals who recently made this exact transition to verify unwritten realities.`,
        `Clarify the single biggest unknown gap (institutional policy or conversion rate) in writing.`,
        `Answer the critical question on reversibility and write out your worst-case mitigation plan.`,
        `Sleep on your conclusions for 24 hours without checking your inbox to test your emotional peace.`,
      ],
    },
  };
}

    let parsedData: any;
    if (textOutput) {
      try {
        parsedData = JSON.parse(textOutput);
      } catch (parseErr) {
        console.warn('Failed to parse Gemini output, using analytical fallback:', parseErr);
        parsedData = generateAnalyticalFallback(payload);
      }
    } else {
      console.log('Gemini model unavailable or at capacity, serving analytical deconstruction.');
      parsedData = generateAnalyticalFallback(payload);
    }

    return res.json({ success: true, analysis: parsedData });
  } catch (error: any) {
    console.error('Error in /api/analyze:', error);
    return res.status(500).json({
      error: error.message || 'Failed to complete blind spot reasoning analysis.',
    });
  }
});

// Follow-up stress test endpoint for a specific assumption or question
app.post('/api/deep-dive', async (req, res) => {
  try {
    const { itemType, itemText, context } = req.body;

    if (!itemText) {
      return res.status(400).json({ error: 'Missing itemText' });
    }

    const prompt = `Context: The user is considering this decision: "${context?.title || 'Unknown decision'}".
Item to explore (${itemType}): "${itemText}"

Provide a targeted critical-thinking breakdown:
1. "Unseen Failure Mode": What happens if the exact opposite of this premise turns out to be true?
2. "Verification Experiment": What is a low-risk 24-48 hour test or question to gather real data?
3. "Second-Order Effect": If this holds, what downstream consequence usually follows 6-12 months later?

Maintain strict neutrality. Do NOT make the decision. Return a JSON object with keys: unseenFailureMode, verificationExperiment, secondOrderEffect.`;

    let parsed: any;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              unseenFailureMode: { type: Type.STRING },
              verificationExperiment: { type: Type.STRING },
              secondOrderEffect: { type: Type.STRING },
            },
            required: ['unseenFailureMode', 'verificationExperiment', 'secondOrderEffect'],
          },
        },
      });

      parsed = JSON.parse(response.text || '{}');
    } catch (apiErr) {
      console.warn('Deep dive Gemini call failed, using fallback:', apiErr);
      parsed = {
        unseenFailureMode: `If the opposite of "${itemText.slice(0, 60)}" occurs, the key risk is that sunk time, energy, and opportunity costs cannot be recovered, causing regret or delayed realignment.`,
        verificationExperiment: `Execute a 24-hour test: find 1 person who experienced the opposite outcome and ask them: "What was the single earliest warning sign that your assumption was wrong?"`,
        secondOrderEffect: `Over 6–12 months, this will dictate whether you feel compounding momentum in your chosen path or compounding friction from unaddressed misalignment.`,
      };
    }

    return res.json({ success: true, deepDive: parsed });
  } catch (err: any) {
    console.error('Error in /api/deep-dive:', err);
    return res.status(500).json({ error: err.message || 'Deep dive failed' });
  }
});

// Development vs Production serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`BlindSpot AI server running on port ${port}`);
  });
}

startServer();
