export interface DecisionInput {
  title: string;
  options: string;
  leaning: string;
  leaningReason: string;
  knownFacts: string;
  coreFactors: string;
  constraints: string;
  doubtsAndConcerns: string;
}

export interface HiddenAssumption {
  id: string;
  assumption: string;
  whyItMatters: string;
  evidenceToVerify: string;
  relatedFactOrQuote: string;
}

export interface PotentialBlindSpot {
  id: string;
  title: string;
  category: string;
  description: string;
  verificationStatus: string;
  potentialImpact: 'High' | 'Medium' | 'Low' | string;
}

export interface ConflictingConsideration {
  id: string;
  tensionTitle: string;
  factorA: string;
  factorB: string;
  explanation: string;
}

export interface AlternativePerspective {
  perspectiveName: string;
  viewpoint: string;
  keyTakeaway: string;
}

export interface CriticalQuestion {
  id: string;
  question: string;
  purpose: string;
  category: string;
}

export interface InformationGap {
  id: string;
  missingInformation: string;
  whyItMatters: string;
  howToObtain: string;
}

export interface DecisionProfile {
  reversibility: string;
  reversibilityRationale: string;
  timeSensitivity: string;
}

export interface ReflectionSummary {
  neutralMessage: string;
  suggestedNextSteps: string[];
}

export interface AnalysisResult {
  visibleReasoning: {
    summary: string;
    keyDrivers: string[];
  };
  hiddenAssumptions: HiddenAssumption[];
  potentialBlindSpots: PotentialBlindSpot[];
  conflictingConsiderations: ConflictingConsideration[];
  alternativePerspectives: AlternativePerspective[];
  criticalQuestions: CriticalQuestion[];
  informationGaps: InformationGap[];
  decisionProfile: DecisionProfile;
  reflectionSummary: ReflectionSummary;
}

export type AssumptionStatus = 'unexamined' | 'confirmed' | 'uncertain' | 'challenged';

export interface SavedSession {
  id: string;
  title: string;
  createdAt: string;
  input: DecisionInput;
  analysis: AnalysisResult;
  userNotes: Record<string, string>;
  assumptionStatuses: Record<string, AssumptionStatus>;
}
