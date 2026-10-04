import { AnalysisResult, DecisionInput } from '../types';

export async function analyzeDecision(input: DecisionInput): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok || !data.success || !data.analysis) {
    throw new Error(data.error || 'Failed to analyze decision. Please try again.');
  }

  return data.analysis as AnalysisResult;
}

export async function runDeepDive(
  itemType: 'assumption' | 'blind_spot' | 'critical_question',
  itemText: string,
  context: DecisionInput
): Promise<{ unseenFailureMode: string; verificationExperiment: string; secondOrderEffect: string }> {
  const response = await fetch('/api/deep-dive', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ itemType, itemText, context }),
  });

  const data = await response.json();
  if (!response.ok || !data.success || !data.deepDive) {
    throw new Error(data.error || 'Failed to generate deep dive analysis.');
  }

  return data.deepDive;
}
