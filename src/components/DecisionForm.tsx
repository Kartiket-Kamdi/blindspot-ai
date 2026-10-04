import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Layers, 
  Compass, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { DecisionInput } from '../types';
import { EXAMPLE_SCENARIOS } from '../data/examples';

interface DecisionFormProps {
  input: DecisionInput;
  onChange: (input: DecisionInput) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
  onSelectExample: (example: DecisionInput) => void;
}

export const DecisionForm: React.FC<DecisionFormProps> = ({
  input,
  onChange,
  onSubmit,
  isLoading,
  error,
  onSelectExample,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'structured'>('all');
  const [fieldErrors, setFieldErrors] = useState<{ title?: string }>({});

  const handleFieldChange = (field: keyof DecisionInput, value: string) => {
    onChange({
      ...input,
      [field]: value,
    });
    if (field === 'title' && value.trim().length > 0) {
      setFieldErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.title || input.title.trim().length === 0) {
      setFieldErrors({ title: 'Please state the decision you are considering.' });
      const el = document.getElementById('field-title');
      if (el) el.focus();
      return;
    }
    onSubmit();
  };

  const handleReset = () => {
    onChange({
      title: '',
      options: '',
      leaning: '',
      leaningReason: '',
      knownFacts: '',
      coreFactors: '',
      constraints: '',
      doubtsAndConcerns: '',
    });
    setFieldErrors({});
  };

  return (
    <div id="decision-form-section" className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Section Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Decision Context Deconstruction</span>
            <span className="text-xs font-normal text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
              Step 1 of 2
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Fill in what you know. Only the primary decision is required; the more context you share, the deeper the blind spot detection.
          </p>
        </div>

        {/* Quick Example Scenarios */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-medium hidden md:inline">Quick load:</span>
          {EXAMPLE_SCENARIOS.slice(0, 3).map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onSelectExample(scenario.data)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Lightbulb className="w-3 h-3 text-amber-400" />
              <span>{scenario.name.split(' ')[0]} {scenario.name.split(' ')[1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Error notification banner */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Analysis Request Error</div>
              <p className="text-xs text-red-300 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Core Decision (Mandatory) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0f172a]/90 border border-slate-800/90 shadow-xl space-y-3 relative group focus-within:border-sky-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <label htmlFor="field-title" className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-mono font-bold">
                1
              </span>
              <span>What decision are you considering?</span>
              <span className="text-rose-400 font-bold">*</span>
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              {input.title.length}/300 chars
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            State the core question or choice in clear terms.
          </p>

          <textarea
            id="field-title"
            rows={2}
            value={input.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="e.g. Whether to accept an offer for a 6-month startup internship in San Francisco and take a semester off college..."
            maxLength={300}
            className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${
              fieldErrors.title ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700/80'
            } text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all`}
          />

          {fieldErrors.title && (
            <p className="text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {fieldErrors.title}
            </p>
          )}
        </div>

        {/* Options & Leaning Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Options Considering */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800/90 space-y-2.5 focus-within:border-indigo-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <label htmlFor="field-options" className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-mono font-bold">
                  2
                </span>
                <span>What options are you considering?</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {input.options.length}/400
              </span>
            </div>
            <p className="text-xs text-slate-400">
              List the primary alternatives (e.g. Option A vs Option B).
            </p>
            <textarea
              id="field-options"
              rows={3}
              value={input.options}
              onChange={(e) => handleFieldChange('options', e.target.value)}
              placeholder="1. Accept the 6-month internship in SF&#10;2. Stay in school for on-time graduation + look for a summer role"
              maxLength={400}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
            />
          </div>

          {/* Current Leaning */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800/90 space-y-2.5 focus-within:border-sky-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <label htmlFor="field-leaning" className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-mono font-bold">
                  3
                </span>
                <span>What are you currently leaning toward?</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {input.leaning.length}/250
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Be honest about your current inclination, if any.
            </p>
            <textarea
              id="field-leaning"
              rows={3}
              value={input.leaning}
              onChange={(e) => handleFieldChange('leaning', e.target.value)}
              placeholder="e.g. Leaning 75% toward accepting the startup internship offer."
              maxLength={250}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
            />
          </div>
        </div>

        {/* Why Leaning Toward It */}
        <div className="p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800/90 space-y-2.5 focus-within:border-amber-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <label htmlFor="field-leaningReason" className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-mono font-bold">
                4
              </span>
              <span>Why are you leaning toward it?</span>
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              {input.leaningReason.length}/500
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Explain the logic, instincts, or feelings guiding your current preference.
          </p>
          <textarea
            id="field-leaningReason"
            rows={3}
            value={input.leaningReason}
            onChange={(e) => handleFieldChange('leaningReason', e.target.value)}
            placeholder="e.g. The startup brand looks incredible on a resume, pay is $55/hr with relocation stipend, and I feel like hands-on startup engineering will teach me 10x more than classes."
            maxLength={500}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
          />
        </div>

        {/* Verified Facts vs Priorities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Known Facts (Distinguished) */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800/90 space-y-2.5 focus-within:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <label htmlFor="field-knownFacts" className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">
                  5
                </span>
                <span>What facts do you currently know?</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {input.knownFacts.length}/600
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Strictly established facts (deadlines, numbers, policies, written contract terms).
            </p>
            <textarea
              id="field-knownFacts"
              rows={3}
              value={input.knownFacts}
              onChange={(e) => handleFieldChange('knownFacts', e.target.value)}
              placeholder="e.g. Offer expires in 7 business days. Academic advisor confirmed graduation delays 1 full year. Contract has no return offer guarantee."
              maxLength={600}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
            />
          </div>

          {/* Factors That Matter Most */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800/90 space-y-2.5 focus-within:border-violet-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <label htmlFor="field-coreFactors" className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-mono font-bold">
                  6
                </span>
                <span>What factors matter most to you?</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {input.coreFactors.length}/400
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Your values and priorities (career velocity, stability, work-life balance, money).
            </p>
            <textarea
              id="field-coreFactors"
              rows={3}
              value={input.coreFactors}
              onChange={(e) => handleFieldChange('coreFactors', e.target.value)}
              placeholder="e.g. Accelerated career trajectory, technical mentorship, financial compensation, resume prestige."
              maxLength={400}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
            />
          </div>
        </div>

        {/* Constraints & Doubts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Constraints */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800/90 space-y-2.5 focus-within:border-orange-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <label htmlFor="field-constraints" className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-mono font-bold">
                  7
                </span>
                <span>What constraints do you have?</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {input.constraints.length}/400
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hard boundaries (deadlines, budgets, family, visas, housing, health).
            </p>
            <textarea
              id="field-constraints"
              rows={3}
              value={input.constraints}
              onChange={(e) => handleFieldChange('constraints', e.target.value)}
              placeholder="e.g. Leave-of-absence paper must be filed by Friday. Need short-term SF housing. Health insurance ends when enrollment pauses."
              maxLength={400}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all"
            />
          </div>

          {/* Concerns or Doubts */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/90 border border-slate-800/90 space-y-2.5 focus-within:border-rose-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <label htmlFor="field-doubtsAndConcerns" className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-mono font-bold">
                  8
                </span>
                <span>What concerns or doubts do you already have?</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {input.doubtsAndConcerns.length}/500
              </span>
            </div>
            <p className="text-xs text-slate-400">
              The hesitations already whispering in the back of your mind.
            </p>
            <textarea
              id="field-doubtsAndConcerns"
              rows={3}
              value={input.doubtsAndConcerns}
              onChange={(e) => handleFieldChange('doubtsAndConcerns', e.target.value)}
              placeholder="e.g. Worried about falling behind my friend group. Fear of startup burnout with 65hr work weeks. What if tech hiring freezes next year?"
              maxLength={500}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="p-5 rounded-2xl bg-[#0b101c] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>BlindSpot AI will challenge your reasoning objectively without choosing for you.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/70 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 sm:flex-initial px-7 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-amber-500 hover:from-sky-400 hover:via-indigo-500 hover:to-amber-400 text-white text-sm font-bold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/35 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Reasoning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Reveal Blind Spots</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
