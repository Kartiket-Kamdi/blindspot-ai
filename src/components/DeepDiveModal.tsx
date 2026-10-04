import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertTriangle, FlaskConical, GitFork, Check } from 'lucide-react';
import { runDeepDive } from '../services/api';
import { DecisionInput } from '../types';

interface DeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: 'assumption' | 'blind_spot' | 'critical_question';
  itemTitle: string;
  itemText: string;
  context: DecisionInput;
}

export const DeepDiveModal: React.FC<DeepDiveModalProps> = ({
  isOpen,
  onClose,
  itemType,
  itemTitle,
  itemText,
  context,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    unseenFailureMode: string;
    verificationExperiment: string;
    secondOrderEffect: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && itemText) {
      setLoading(true);
      setError(null);
      runDeepDive(itemType, itemText, context)
        .then((res) => {
          setData(res);
        })
        .catch((err) => {
          setError(err.message || 'Failed to simulate deep-dive scenario.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setData(null);
    }
  }, [isOpen, itemText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0e1628] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Critical-Thinking Deep Dive</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 border border-slate-700">
                  {itemType === 'assumption' ? 'Stress-Testing Assumption' : 'Probing Blind Spot'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1 max-w-md">
                {itemTitle || itemText}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Premise being examined */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1 text-[10px]">
              Target Premise:
            </span>
            "{itemText}"
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400">
                Stress-testing premise & formulating 24-hr verification experiment...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-300">
              {error}
            </div>
          ) : data ? (
            <div className="space-y-4">
              {/* Failure Mode */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Unseen Failure Mode (Opposite Premise)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-6">
                  {data.unseenFailureMode}
                </p>
              </div>

              {/* 24-48h Verification Experiment */}
              <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-900/40 space-y-1.5">
                <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs">
                  <FlaskConical className="w-4 h-4 shrink-0" />
                  <span>Low-Risk 24-48 Hour Verification Test</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-6">
                  {data.verificationExperiment}
                </p>
              </div>

              {/* Second-Order Effect */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/40 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                  <GitFork className="w-4 h-4 shrink-0" />
                  <span>Downstream Second-Order Effect (6–12 Months Later)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-6">
                  {data.secondOrderEffect}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            BlindSpot AI • Objective Stress Testing
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
