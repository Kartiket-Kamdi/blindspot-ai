import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DecisionForm } from './components/DecisionForm';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ExportModal } from './components/ExportModal';
import { SavedDrawer } from './components/SavedDrawer';
import { AuthModal } from './components/AuthModal';
import { AccountModal } from './components/AccountModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DecisionInput, AnalysisResult, SavedSession, AssumptionStatus } from './types';
import { analyzeDecision } from './services/api';
import { 
  saveDecisionToCloud, 
  updateDecisionNotesInCloud, 
  deleteDecisionFromCloud, 
  subscribeToUserDecisions,
  CloudDecision 
} from './services/decisionsDb';
import { Sparkles, Brain, Scale, Search, ShieldCheck, Cloud, LogIn, History, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'blindspot_ai_sessions_v1';

const INITIAL_INPUT: DecisionInput = {
  title: '',
  options: '',
  leaning: '',
  leaningReason: '',
  knownFacts: '',
  coreFactors: '',
  constraints: '',
  doubtsAndConcerns: '',
};

function MainApp() {
  const { currentUser, loading: authLoading } = useAuth();

  const [currentStep, setCurrentStep] = useState<'landing' | 'results'>('landing');
  const [input, setInput] = useState<DecisionInput>(INITIAL_INPUT);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeDecisionId, setActiveDecisionId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // User interactions on results
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [assumptionStatuses, setAssumptionStatuses] = useState<Record<string, AssumptionStatus>>({});

  // Modals & Drawers
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Sessions: either from Firestore (if user signed in) or from localStorage
  const [sessions, setSessions] = useState<SavedSession[]>([]);

  // 1. Listen to Firestore when user is authenticated
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = subscribeToUserDecisions(
        currentUser.uid,
        (cloudItems) => {
          const mapped: SavedSession[] = cloudItems.map((item) => ({
            id: item.id,
            title: item.title,
            createdAt: item.createdAt,
            input: {
              title: item.title,
              options: item.options,
              leaning: item.leaning,
              leaningReason: item.leaningReason,
              knownFacts: item.knownFacts,
              coreFactors: item.coreFactors,
              constraints: item.constraints,
              doubtsAndConcerns: item.doubtsAndConcerns,
            },
            analysis: item.analysis,
            userNotes: item.userNotes || {},
            assumptionStatuses: item.assumptionStatuses || {},
          }));
          setSessions(mapped);
        },
        (err) => {
          console.warn('Firestore subscription warning:', err);
        }
      );
      return () => unsubscribe();
    } else {
      // Anonymous / offline fallback: load from localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSessions(JSON.parse(stored));
        } else {
          setSessions([]);
        }
      } catch (e) {
        console.error('Failed to load sessions from localStorage', e);
      }
    }
  }, [currentUser]);

  // Cycling loading stage messages
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStage(0);
      interval = setInterval(() => {
        setLoadingStage((prev) => (prev + 1) % 4);
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const loadingMessages = [
    'Distinguishing stated facts from unverified assumptions...',
    'Scanning for hidden trade-offs, opportunity costs, and second-order effects...',
    'Mapping conflicting considerations & competing personal priorities...',
    'Formulating situation-specific critical questions and reflection angles...',
  ];

  // Save or update decision
  const persistDecision = async (
    currentInput: DecisionInput,
    currentAnalysis: AnalysisResult,
    notes = userNotes,
    statuses = assumptionStatuses
  ) => {
    const decisionId = `dec_${Date.now()}`;
    setActiveDecisionId(decisionId);

    if (currentUser) {
      try {
        await saveDecisionToCloud(
          currentUser.uid,
          currentInput,
          currentAnalysis,
          notes,
          statuses,
          decisionId
        );
      } catch (err) {
        console.error('Failed to save to Firestore:', err);
      }
    } else {
      // Local storage fallback for guests
      try {
        const newSession: SavedSession = {
          id: decisionId,
          title: currentInput.title,
          createdAt: new Date().toISOString(),
          input: currentInput,
          analysis: currentAnalysis,
          userNotes: notes,
          assumptionStatuses: statuses,
        };
        const updated = [newSession, ...sessions.slice(0, 19)];
        setSessions(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save session locally', e);
      }
    }
  };

  const handleStartAnalysis = async () => {
    if (!input.title || input.title.trim().length === 0) {
      setError('Please state the decision you are considering.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeDecision(input);
      setAnalysis(result);
      setCurrentStep('results');
      setUserNotes({});
      setAssumptionStatuses({});
      await persistDecision(input, result, {}, {});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred while analyzing reasoning.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectExample = (exampleData: DecisionInput) => {
    setInput(exampleData);
    setError(null);
    setCurrentStep('landing');
    setTimeout(() => {
      const el = document.getElementById('decision-form-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleNewDecision = () => {
    setInput(INITIAL_INPUT);
    setAnalysis(null);
    setActiveDecisionId(null);
    setUserNotes({});
    setAssumptionStatuses({});
    setCurrentStep('landing');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToEdit = () => {
    setCurrentStep('landing');
    setTimeout(() => {
      const el = document.getElementById('decision-form-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLoadSession = (session: SavedSession) => {
    setInput(session.input);
    setAnalysis(session.analysis);
    setActiveDecisionId(session.id);
    setUserNotes(session.userNotes || {});
    setAssumptionStatuses(session.assumptionStatuses || {});
    setCurrentStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSession = async (id: string) => {
    if (currentUser) {
      try {
        await deleteDecisionFromCloud(currentUser.uid, id);
      } catch (err) {
        console.error('Failed to delete cloud decision:', err);
      }
    } else {
      const updated = sessions.filter((s) => s.id !== id);
      setSessions(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const handleClearAllSessions = async () => {
    if (currentUser) {
      for (const s of sessions) {
        await deleteDecisionFromCloud(currentUser.uid, s.id);
      }
    } else {
      setSessions([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleUpdateNote = (questionId: string, note: string) => {
    const updatedNotes = { ...userNotes, [questionId]: note };
    setUserNotes(updatedNotes);

    if (currentUser && activeDecisionId) {
      updateDecisionNotesInCloud(currentUser.uid, activeDecisionId, updatedNotes, assumptionStatuses).catch(
        (err) => console.warn('Could not sync note to cloud:', err)
      );
    }
  };

  const handleUpdateAssumptionStatus = (id: string, status: AssumptionStatus) => {
    const updatedStatuses = { ...assumptionStatuses, [id]: status };
    setAssumptionStatuses(updatedStatuses);

    if (currentUser && activeDecisionId) {
      updateDecisionNotesInCloud(currentUser.uid, activeDecisionId, userNotes, updatedStatuses).catch(
        (err) => console.warn('Could not sync assumption status to cloud:', err)
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-300">
      {/* Top Navbar */}
      <Navbar
        onSelectExample={handleSelectExample}
        onNewDecision={handleNewDecision}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        historyCount={sessions.length}
        currentStep={currentStep}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Fullscreen Loading State during Gemini Analysis */}
        {isLoading && (
          <div className="fixed inset-0 z-50 bg-[#090d16]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 blur-xl opacity-50 animate-pulse" />
              <div className="relative w-full h-full rounded-2xl bg-[#0e1628] border border-sky-500/40 flex items-center justify-center">
                <Brain className="w-10 h-10 text-sky-400 animate-bounce" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-sky-400 font-mono mb-4">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>Analyzing Cognitive Structure</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white max-w-lg mb-3">
              Deconstructing Decision Reasoning
            </h3>

            <p className="text-sm text-slate-400 max-w-md h-12 flex items-center justify-center transition-all duration-300">
              {loadingMessages[loadingStage]}
            </p>

            <div className="mt-8 flex items-center gap-1.5">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === loadingStage ? 'w-8 bg-sky-400' : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>

            <div className="mt-10 max-w-sm text-xs text-slate-500 border-t border-slate-800/80 pt-4">
              BlindSpot AI evaluates hidden assumptions without making the decision for you.
            </div>
          </div>
        )}

        {/* View Switching */}
        {currentStep === 'landing' ? (
          <div>
            <HeroSection
              onStartAnalysis={() => {
                const el = document.getElementById('decision-form-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              onLoadExample={handleSelectExample}
            />

            {/* Authenticated Dashboard Quick-Bar when user is signed in */}
            {currentUser && sessions.length > 0 && (
              <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
                <div className="p-4 rounded-2xl bg-[#0f172a]/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        <span>Welcome back, {currentUser.displayName || currentUser.email?.split('@')[0]}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {sessions.length} Cloud Decision{sessions.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Latest: "{sessions[0].title.slice(0, 60)}{sessions[0].title.length > 60 ? '...' : ''}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleLoadSession(sessions[0])}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-sky-400 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Resume Latest</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setIsHistoryOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <History className="w-3 h-3 text-slate-400" />
                      <span>All History</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <DecisionForm
              input={input}
              onChange={setInput}
              onSubmit={handleStartAnalysis}
              isLoading={isLoading}
              error={error}
              onSelectExample={handleSelectExample}
            />
          </div>
        ) : analysis ? (
          <AnalysisDashboard
            input={input}
            analysis={analysis}
            onBackToEdit={handleBackToEdit}
            onAnalyzeAgain={handleStartAnalysis}
            onStartNew={handleNewDecision}
            onOpenExport={() => setIsExportOpen(true)}
            userNotes={userNotes}
            onUpdateNote={handleUpdateNote}
            assumptionStatuses={assumptionStatuses}
            onUpdateAssumptionStatus={handleUpdateAssumptionStatus}
            isCloudSynced={!!currentUser}
          />
        ) : null}
      </main>

      {/* Export / Share Modal */}
      {analysis && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          input={input}
          analysis={analysis}
          userNotes={userNotes}
        />
      )}

      {/* Cloud & Local Decision History Drawer */}
      <SavedDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={sessions}
        onLoadSession={handleLoadSession}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearAllSessions}
        onOpenAuth={() => setIsAuthOpen(true)}
        isCloudSynced={!!currentUser}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Account Settings Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        cloudDecisionsCount={sessions.length}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060911] py-8 text-center text-xs text-slate-500 no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">BlindSpot AI</span>
            <span>•</span>
            <span>Critical-Thinking Companion</span>
          </div>

          <div className="text-[11px] text-slate-500 max-w-md">
            Strictly non-prescriptive. Designed to encourage assumption-testing, perspective exploration, and cognitive clarity.
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-600 font-mono">
            <span>Powered by Gemini</span>
            <span>•</span>
            <span>Firebase Cloud Persistence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
