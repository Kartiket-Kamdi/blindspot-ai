import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Calendar, 
  ArrowRight, 
  Eye, 
  Sparkles, 
  Cloud, 
  Search, 
  LogIn, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { SavedSession } from '../types';
import { useAuth } from '../context/AuthContext';

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SavedSession[];
  onLoadSession: (session: SavedSession) => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
  onOpenAuth: () => void;
  isCloudSynced: boolean;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  onLoadSession,
  onDeleteSession,
  onClearAll,
  onOpenAuth,
  isCloudSynced,
}) => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in no-print">
      <div className="w-full max-w-md bg-[#0d1322] border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">
              {currentUser ? 'Cloud Decision History' : 'Decision History'}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
              {sessions.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Status Alert */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs">
          {currentUser ? (
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Cloud className="w-3.5 h-3.5" />
              <span>Synced with Firebase Firestore</span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-slate-400 text-[11px]">Saved locally on device</span>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign in to sync cloud</span>
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        {sessions.length > 3 && (
          <div className="p-3 border-b border-slate-800/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search past decisions..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredSessions.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <Sparkles className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-400">
                {searchQuery ? 'No matching decisions found' : 'No saved analyses yet'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                {currentUser
                  ? 'Completed decisions are automatically synced to your secure cloud database.'
                  : 'Analyze a decision to save it to your history.'}
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    {new Date(session.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity p-1 cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                  {session.title}
                </h4>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-900/60 font-medium">
                    {session.analysis?.decisionProfile?.reversibility || 'Analysis Ready'}
                  </span>

                  <button
                    onClick={() => {
                      onLoadSession(session);
                      onClose();
                    }}
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Analysis</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {sessions.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400/80 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <span className="text-[11px] text-slate-500">
              {currentUser ? 'Stored in Firestore' : 'Stored locally'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
