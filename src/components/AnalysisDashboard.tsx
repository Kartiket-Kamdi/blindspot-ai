import React, { useState } from 'react';
import {
  Eye,
  AlertTriangle,
  HelpCircle,
  Scale,
  Compass,
  ArrowLeft,
  RotateCcw,
  Share2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  GitPullRequest,
  Clock,
  Layers,
  ShieldCheck,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { 
  AnalysisResult, 
  DecisionInput, 
  AssumptionStatus,
  HiddenAssumption,
  PotentialBlindSpot 
} from '../types';
import { DeepDiveModal } from './DeepDiveModal';

interface AnalysisDashboardProps {
  input: DecisionInput;
  analysis: AnalysisResult;
  onBackToEdit: () => void;
  onAnalyzeAgain: () => void;
  onStartNew: () => void;
  onOpenExport: () => void;
  userNotes: Record<string, string>;
  onUpdateNote: (questionId: string, note: string) => void;
  assumptionStatuses: Record<string, AssumptionStatus>;
  onUpdateAssumptionStatus: (id: string, status: AssumptionStatus) => void;
  isCloudSynced?: boolean;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  input,
  analysis,
  onBackToEdit,
  onAnalyzeAgain,
  onStartNew,
  onOpenExport,
  userNotes,
  onUpdateNote,
  assumptionStatuses,
  onUpdateAssumptionStatus,
  isCloudSynced,
}) => {
  const [activeSection, setActiveSection] = useState<string>('all');
  const [deepDiveTarget, setDeepDiveTarget] = useState<{
    itemType: 'assumption' | 'blind_spot' | 'critical_question';
    title: string;
    text: string;
  } | null>(null);

  const getReversibilityBadge = (type: string) => {
    if (type?.toLowerCase().includes('two-way') || type?.toLowerCase().includes('easy')) {
      return {
        bg: 'bg-emerald-950/80 border-emerald-800/80 text-emerald-400',
        label: 'Two-Way Door (Easily Reversible)',
      };
    }
    if (type?.toLowerCase().includes('one-way') || type?.toLowerCase().includes('hard')) {
      return {
        bg: 'bg-rose-950/80 border-rose-800/80 text-rose-400',
        label: 'One-Way Door (Hard to Reverse)',
      };
    }
    return {
      bg: 'bg-amber-950/80 border-amber-800/80 text-amber-400',
      label: 'Partially Reversible',
    };
  };

  const reversibilityBadge = getReversibilityBadge(analysis.decisionProfile?.reversibility);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Sticky Top Subheader with Decision Summary & Actions */}
      <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Edit Context</span>
          </button>

          <button
            onClick={onAnalyzeAgain}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-Analyze</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-600/80 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Export & Share Dossier</span>
          </button>

          <button
            onClick={onStartNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Start New Decision</span>
          </button>
        </div>
      </div>

      {/* Decision Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1628] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 blur-3xl pointer-events-none rounded-full" />
        
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-950 text-sky-400 border border-sky-800/80 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            Reasoning Analysis Active
          </span>

          {isCloudSynced ? (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Synced to Cloud (Firestore)</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              Local Session
            </span>
          )}

          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${reversibilityBadge.bg}`}>
            {reversibilityBadge.label}
          </span>

          {input.leaning && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              Current Leaning: <strong className="text-white">{input.leaning.slice(0, 40)}{input.leaning.length > 40 ? '...' : ''}</strong>
            </span>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
          {input.title}
        </h1>

        {/* Reversibility & Time sensitivity breakdown */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px] mb-1">
              Reversibility Profile (Type 1 vs Type 2):
            </span>
            <p className="text-slate-300 leading-relaxed">
              {analysis.decisionProfile?.reversibilityRationale}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px] mb-1">
              Time Sensitivity & Urgency Audit:
            </span>
            <p className="text-slate-300 leading-relaxed">
              {analysis.decisionProfile?.timeSensitivity}
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Non-Prescriptive Notice */}
      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 text-amber-200/90 text-xs sm:text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-amber-300 font-semibold">Reminder: </strong>
          BlindSpot AI does not choose an option for you. The findings below highlight unexamined assumptions, 
          inherent trade-offs, and critical questions so you can exercise your own judgment with maximum clarity.
        </div>
      </div>

      {/* Section 1: Visible Reasoning */}
      <section className="p-6 sm:p-7 rounded-2xl bg-[#0f172a] border border-slate-800/90 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                1. Visible Reasoning
              </h2>
              <p className="text-xs text-slate-400">
                What appears to be consciously driving your thinking right now.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            Non-Judgmental Summary
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-sm text-slate-200 leading-relaxed">
          {analysis.visibleReasoning.summary}
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Primary Stated Drivers:
          </span>
          <div className="flex flex-wrap gap-2">
            {analysis.visibleReasoning.keyDrivers.map((driver, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-sky-950/70 border border-sky-800/60 text-sky-300 text-xs font-medium"
              >
                • {driver}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Hidden Assumptions (AI-Inferred vs User Facts) */}
      <section className="p-6 sm:p-7 rounded-2xl bg-[#0f172a] border border-slate-800/90 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>2. Hidden Assumptions</span>
                <span className="text-xs font-normal text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/60">
                  {analysis.hiddenAssumptions.length} Identified
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Premises taken for granted that have not been explicitly established or proven.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {analysis.hiddenAssumptions.map((item, idx) => {
            const currentStatus = assumptionStatuses[item.id] || 'unexamined';

            return (
              <div
                key={item.id || idx}
                className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 space-y-3.5 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold flex items-center justify-center">
                      A{idx + 1}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">
                      AI-Inferred Assumption
                    </span>
                  </div>

                  {/* Status Toggle Bar */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
                    <span className="text-[10px] text-slate-500 px-1 font-medium">Your audit:</span>
                    {(['unexamined', 'confirmed', 'uncertain', 'challenged'] as AssumptionStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => onUpdateAssumptionStatus(item.id, st)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize transition-all cursor-pointer ${
                          currentStatus === st
                            ? st === 'confirmed'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : st === 'uncertain'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : st === 'challenged'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-700 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* What the assumption appears to be */}
                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    "{item.assumption}"
                  </h3>
                  <div className="mt-1 text-[11px] text-slate-400 italic">
                    Derived from user statement: "{item.relatedFactOrQuote}"
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  {/* Why it matters */}
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-850">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                      Why It Matters If Wrong:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {item.whyItMatters}
                    </p>
                  </div>

                  {/* What evidence would confirm or challenge it */}
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-850">
                    <span className="text-sky-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                      Evidence Required to Verify:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {item.evidenceToVerify}
                    </p>
                  </div>
                </div>

                {/* Deep Dive Action */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() =>
                      setDeepDiveTarget({
                        itemType: 'assumption',
                        title: `Assumption: ${item.assumption}`,
                        text: item.assumption,
                      })
                    }
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/60 transition-colors cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Stress-Test Premise (Failure Mode & 24h Test)</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Potential Blind Spots */}
      <section className="p-6 sm:p-7 rounded-2xl bg-[#0f172a] border border-slate-800/90 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>3. Potential Blind Spots</span>
                <span className="text-xs font-normal text-violet-400 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-900/60">
                  {analysis.potentialBlindSpots.length} Factors
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Critical factors you may have overlooked or underestimated.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.potentialBlindSpots.map((spot, idx) => (
            <div
              key={spot.id || idx}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 flex flex-col justify-between space-y-3 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-300 bg-violet-950/70 border border-violet-800/60 px-2 py-0.5 rounded">
                    {spot.category}
                  </span>

                  <span className="text-[10px] font-medium text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded">
                    {spot.verificationStatus || 'Unknown / Needs Verification'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">
                  {spot.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {spot.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Impact Potential: <strong className="text-white">{spot.potentialImpact}</strong>
                </span>

                <button
                  onClick={() =>
                    setDeepDiveTarget({
                      itemType: 'blind_spot',
                      title: `Blind Spot: ${spot.title}`,
                      text: `${spot.title}: ${spot.description}`,
                    })
                  }
                  className="text-xs font-medium text-slate-400 hover:text-sky-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Explore impact</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Conflicting Considerations (Tensions) */}
      <section className="p-6 sm:p-7 rounded-2xl bg-[#0f172a] border border-slate-800/90 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>4. Conflicting Considerations (Inherent Tensions)</span>
                <span className="text-xs font-normal text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900/60">
                  {analysis.conflictingConsiderations.length} Tensions
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Competing priorities pulling in opposing directions. Neither is "wrong", but they require balance.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {analysis.conflictingConsiderations.map((conflict, idx) => (
            <div
              key={conflict.id || idx}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-3"
            >
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <GitPullRequest className="w-4 h-4" />
                <span>{conflict.tensionTitle}</span>
              </div>

              {/* Visual Balance Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-200">
                  <span className="text-[10px] font-semibold text-rose-400 block uppercase mb-1">
                    Priority A:
                  </span>
                  "{conflict.factorA}"
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-200">
                  <span className="text-[10px] font-semibold text-sky-400 block uppercase mb-1">
                    Priority B:
                  </span>
                  "{conflict.factorB}"
                </div>
              </div>

              <div className="p-3 rounded-lg bg-rose-950/10 border border-rose-900/30 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-rose-300 block mb-0.5">The Inherent Tension:</span>
                {conflict.explanation}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Alternative Perspectives */}
      <section className="p-6 sm:p-7 rounded-2xl bg-[#0f172a] border border-slate-800/90 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                5. Alternative Perspectives
              </h2>
              <p className="text-xs text-slate-400">
                Viewing your dilemma through distinct perceptual frames.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.alternativePerspectives.map((persp, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 space-y-3 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {persp.perspectiveName}
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {persp.viewpoint}
              </p>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-300 block text-[11px] mb-0.5">
                  Reframing Takeaway:
                </span>
                "{persp.keyTakeaway}"
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: Information Gaps */}
      <section className="p-6 sm:p-7 rounded-2xl bg-[#0f172a] border border-slate-800/90 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>6. Information Gaps (What's Missing)</span>
                <span className="text-xs font-normal text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/60">
                  {analysis.informationGaps.length} Items
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Specific facts that would materially improve your decision if confirmed.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {analysis.informationGaps.map((gap, idx) => (
            <div
              key={gap.id || idx}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    ?
                  </span>
                  <span>{gap.missingInformation}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-850">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase mb-0.5">
                    Why It Matters:
                  </span>
                  <p className="text-slate-300">{gap.whyItMatters}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-850">
                  <span className="text-emerald-400 font-semibold block text-[10px] uppercase mb-0.5">
                    How to Verify It:
                  </span>
                  <p className="text-slate-300">{gap.howToObtain}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: Critical Questions & Private Reflection Scratchpad */}
      <section className="p-6 sm:p-7 rounded-2xl bg-[#0f172a] border border-slate-800/90 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>7. Critical Questions & Private Reflection</span>
                <span className="text-xs font-normal text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-900/60">
                  {analysis.criticalQuestions.length} Questions
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Ponder these questions before you decide. You can record your private answers directly below each question.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {analysis.criticalQuestions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/80">
                  {q.category}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Question {idx + 1} of {analysis.criticalQuestions.length}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">
                {q.question}
              </h3>

              <p className="text-xs text-slate-400">
                <strong className="text-slate-300">Why to reflect on this: </strong>
                {q.purpose}
              </p>

              {/* Private reflection text area */}
              <div className="pt-2">
                <label className="text-[11px] font-medium text-slate-400 block mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3 text-sky-400" />
                  <span>Your Private Notes / Answer:</span>
                </label>
                <textarea
                  rows={2}
                  value={userNotes[q.id] || ''}
                  onChange={(e) => onUpdateNote(q.id, e.target.value)}
                  placeholder="Record your thoughts on this question (auto-saved locally)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 8: Neutral Reflection Summary */}
      <section className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0d1527] border border-slate-700/80 space-y-5 shadow-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              8. Reflection Summary
            </h2>
            <p className="text-xs text-slate-400">
              Neutral synthesis: No algorithm can decide your values for you.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 leading-relaxed">
          {analysis.reflectionSummary.neutralMessage}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Suggested Constructive Actions Before Finalizing:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysis.reflectionSummary.suggestedNextSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            Saved to your local session history.
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onBackToEdit}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              Modify Decision Inputs
            </button>

            <button
              onClick={onOpenExport}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20 cursor-pointer"
            >
              Export Complete Dossier
            </button>
          </div>
        </div>
      </section>

      {/* Deep Dive Modal */}
      {deepDiveTarget && (
        <DeepDiveModal
          isOpen={true}
          onClose={() => setDeepDiveTarget(null)}
          itemType={deepDiveTarget.itemType}
          itemTitle={deepDiveTarget.title}
          itemText={deepDiveTarget.text}
          context={input}
        />
      )}
    </div>
  );
};
