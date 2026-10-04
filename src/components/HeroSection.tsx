import React from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Search, 
  BrainCircuit, 
  Scale 
} from 'lucide-react';
import { DecisionInput } from '../types';
import { EXAMPLE_SCENARIOS } from '../data/examples';

interface HeroSectionProps {
  onStartAnalysis: () => void;
  onLoadExample: (example: DecisionInput) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartAnalysis,
  onLoadExample,
}) => {
  const featuredExample = EXAMPLE_SCENARIOS[0]; // 6-month internship scenario

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-slate-800/60">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-500/10 via-indigo-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Anti-Slop badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-medium text-slate-300 mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
          <span>Cognitive Decision-Analysis Engine</span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400">Strictly Non-Prescriptive</span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          BlindSpot <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">AI</span>
          <span className="block text-2xl sm:text-3xl lg:text-4xl mt-3 font-semibold text-slate-300">
            See what your reasoning might be missing.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          An AI-powered critical-thinking companion that helps you uncover assumptions, overlooked factors, and unanswered questions before you decide.
        </p>

        {/* Primary & Secondary CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onStartAnalysis}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Analyze a Decision</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onLoadExample(featuredExample.data)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-semibold text-sm transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>Try an Example (6-Month Internship)</span>
          </button>
        </div>

        {/* Mandatory Philosophy Banner */}
        <div className="mt-10 max-w-3xl mx-auto p-4 rounded-xl bg-[#0e1628]/80 border border-slate-800 text-left flex items-start gap-3.5 shadow-inner">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <span className="font-bold text-white block sm:inline">BlindSpot AI does not make decisions for you. </span>
            People naturally focus on the most visible information while leaving crucial assumptions unexamined. 
            This tool helps you deconstruct your logic, find hidden tensions, and test missing facts—so the final decision remains fully yours.
          </div>
        </div>

        {/* 4-Step Process Guide */}
        <div className="mt-14 pt-10 border-t border-slate-800/60">
          <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-6">
            How The Analysis Works
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 relative group hover:border-slate-700 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-800/60 text-sky-400 flex items-center justify-center font-mono font-bold text-xs mb-3">
                01
              </div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                Describe your decision
              </h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Provide the choice, your options, known facts, deadlines, and current leaning.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 relative group hover:border-slate-700 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs mb-3">
                02
              </div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                Explain your reasoning
              </h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Share why you are leaning toward an option and what doubts you already carry.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 relative group hover:border-slate-700 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800/60 text-amber-400 flex items-center justify-center font-mono font-bold text-xs mb-3">
                03
              </div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                Discover blind spots
              </h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Gemini isolates inferred assumptions from stated facts, tensions, and unknowns.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 relative group hover:border-slate-700 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs mb-3">
                04
              </div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                Reflect before deciding
              </h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Work through tailored critical questions, verify unknowns, and choose with clarity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
