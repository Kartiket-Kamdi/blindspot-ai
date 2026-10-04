import React from 'react';
import { Eye, Compass, History, Sparkles, Plus, BookOpen, LogIn, User as UserIcon, Cloud } from 'lucide-react';
import { EXAMPLE_SCENARIOS } from '../data/examples';
import { DecisionInput } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onSelectExample: (input: DecisionInput) => void;
  onNewDecision: () => void;
  onOpenHistory: () => void;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  historyCount: number;
  currentStep: 'landing' | 'results';
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectExample,
  onNewDecision,
  onOpenHistory,
  onOpenAuth,
  onOpenAccount,
  historyCount,
  currentStep,
}) => {
  const { currentUser } = useAuth();
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onNewDecision}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-amber-400 p-[1.5px] shadow-lg shadow-sky-500/10 group-hover:shadow-sky-500/25 transition-all duration-300">
            <div className="w-full h-full bg-[#0d1322] rounded-[10px] flex items-center justify-center">
              <Eye className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                BlindSpot<span className="text-sky-400 font-extrabold">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                Cognitive Clarity
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Uncover what your reasoning might be missing
            </p>
          </div>
        </div>

        {/* Center / Disclaimer Pill */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Non-prescriptive: You make the decision</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Examples Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Try Scenarios</span>
              <span className="sm:hidden">Demos</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-72 p-2 bg-[#0e1628] border border-slate-700/80 rounded-xl shadow-2xl opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-50">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select a scenario to load:
              </div>
              {EXAMPLE_SCENARIOS.map((example) => (
                <button
                  key={example.id}
                  onClick={() => onSelectExample(example.data)}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800/80 transition-colors group/item"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200 group-hover/item:text-sky-300">
                    <span>{example.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60">
                      {example.badge.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {example.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all cursor-pointer"
            title="Decision History"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-sky-950 text-sky-400 font-mono border border-sky-800/80">
                {historyCount}
              </span>
            )}
          </button>

          {/* Auth Button / Account Trigger */}
          {currentUser ? (
            <button
              onClick={onOpenAccount}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all cursor-pointer"
              title="Account Settings"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={displayName}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {initial}
                </div>
              )}
              <span className="max-w-[80px] sm:max-w-[120px] truncate hidden sm:inline">
                {displayName}
              </span>
              <Cloud className="w-3 h-3 text-emerald-400" />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* New Decision CTA */}
          {currentStep === 'results' ? (
            <button
              onClick={onNewDecision}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 rounded-lg shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Decision</span>
            </button>
          ) : (
            <button
              onClick={() => {
                const element = document.getElementById('decision-form-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
