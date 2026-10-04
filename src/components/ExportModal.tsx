import React, { useState } from 'react';
import { X, Copy, Check, Printer, Download, FileText } from 'lucide-react';
import { AnalysisResult, DecisionInput } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  input: DecisionInput;
  analysis: AnalysisResult;
  userNotes: Record<string, string>;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  input,
  analysis,
  userNotes,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# BlindSpot AI — Decision Reasoning Dossier\n\n`;
    md += `**Date:** ${new Date().toLocaleDateString()} | **Tool:** BlindSpot AI\n\n`;
    md += `> *Notice: BlindSpot AI does not make decisions for you. This analysis deconstructs hidden assumptions, tensions, and blind spots to help you decide with clarity.*\n\n`;
    md += `## 1. Decision Under Consideration\n${input.title}\n\n`;

    if (input.options) {
      md += `### Options Considered\n${input.options}\n\n`;
    }
    if (input.leaning) {
      md += `### Stated Leaning\n${input.leaning}\n\n`;
    }
    if (input.leaningReason) {
      md += `### Reason For Leaning\n${input.leaningReason}\n\n`;
    }
    if (input.knownFacts) {
      md += `### Stated Known Facts (User-Provided)\n${input.knownFacts}\n\n`;
    }

    md += `---\n\n`;
    md += `## 2. Visible Reasoning Driver\n${analysis.visibleReasoning.summary}\n\n`;
    md += `**Key Drivers:**\n`;
    analysis.visibleReasoning.keyDrivers.forEach((d) => {
      md += `- ${d}\n`;
    });
    md += `\n`;

    md += `## 3. Hidden Assumptions (AI-Inferred vs User Facts)\n`;
    analysis.hiddenAssumptions.forEach((a, i) => {
      md += `### Assumption ${i + 1}: ${a.assumption}\n`;
      md += `- **Why It Matters:** ${a.whyItMatters}\n`;
      md += `- **Evidence to Verify:** ${a.evidenceToVerify}\n`;
      md += `- **Inferred From:** "${a.relatedFactOrQuote}"\n\n`;
    });

    md += `## 4. Potential Blind Spots\n`;
    analysis.potentialBlindSpots.forEach((b, i) => {
      md += `### [${b.category}] ${b.title} (${b.verificationStatus})\n`;
      md += `${b.description}\n`;
      md += `- *Estimated Impact:* ${b.potentialImpact}\n\n`;
    });

    md += `## 5. Conflicting Considerations (Inherent Tensions)\n`;
    analysis.conflictingConsiderations.forEach((c) => {
      md += `### Tension: ${c.tensionTitle}\n`;
      md += `*${c.factorA}* ⚡ *${c.factorB}*\n\n`;
      md += `${c.explanation}\n\n`;
    });

    md += `## 6. Alternative Perspectives\n`;
    analysis.alternativePerspectives.forEach((p) => {
      md += `### ${p.perspectiveName}\n`;
      md += `${p.viewpoint}\n`;
      md += `*Takeaway:* ${p.keyTakeaway}\n\n`;
    });

    md += `## 7. Information Gaps\n`;
    analysis.informationGaps.forEach((g) => {
      md += `- **Missing Info:** ${g.missingInformation}\n  - *Why It Matters:* ${g.whyItMatters}\n  - *How to Obtain:* ${g.howToObtain}\n`;
    });
    md += `\n`;

    md += `## 8. Critical Questions for You to Answer\n`;
    analysis.criticalQuestions.forEach((q) => {
      md += `- **[${q.category}]** ${q.question}\n  *Purpose:* ${q.purpose}\n`;
      if (userNotes[q.id]) {
        md += `  *Your Reflection:* "${userNotes[q.id]}"\n`;
      }
      md += `\n`;
    });

    md += `## 9. Decision Profile & Reversibility\n`;
    md += `- **Classification:** ${analysis.decisionProfile.reversibility}\n`;
    md += `- **Rationale:** ${analysis.decisionProfile.reversibilityRationale}\n`;
    md += `- **Time Sensitivity:** ${analysis.decisionProfile.timeSensitivity}\n\n`;

    md += `## 10. Reflection Summary\n`;
    md += `${analysis.reflectionSummary.neutralMessage}\n\n`;
    md += `**Constructive Next Steps:**\n`;
    analysis.reflectionSummary.suggestedNextSteps.forEach((s) => {
      md += `1. ${s}\n`;
    });

    return md;
  };

  const handleCopy = () => {
    const text = generateMarkdown();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const text = generateMarkdown();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blindspot-analysis-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in no-print">
      <div className="relative w-full max-w-3xl bg-[#0e1628] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Export & Share Decision Dossier
              </h3>
              <p className="text-xs text-slate-400">
                Copy formatted Markdown or print a clean summary for offline reflection.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-6 py-3 bg-slate-900/40 border-b border-slate-800 flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Markdown!' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Download .MD</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Dossier</span>
          </button>
        </div>

        {/* Markdown Preview */}
        <div className="p-6 overflow-y-auto">
          <pre className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            {generateMarkdown()}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <span>All data remains strictly on your device.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
