import React from 'react';
import { X, LogOut, ShieldCheck, Cloud, Calendar, User as UserIcon, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  cloudDecisionsCount: number;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  cloudDecisionsCount,
}) => {
  const { currentUser, signOut } = useAuth();

  if (!isOpen || !currentUser) return null;

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in no-print">
      <div className="relative w-full max-w-md bg-[#0e1628] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Your Account</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={displayName}
                className="w-14 h-14 rounded-2xl border border-slate-700 object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {initial}
              </div>
            )}
            <div>
              <h4 className="text-base font-bold text-white">{displayName}</h4>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Cloud Sync Active (Firestore)</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Saved Decisions
              </span>
              <span className="text-xl font-extrabold text-white mt-0.5 block font-mono">
                {cloudDecisionsCount}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Security Privacy
              </span>
              <span className="text-xs font-semibold text-emerald-400 mt-1 block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Private & Isolated
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
            Your analyzed decisions, reflection notes, and audit matrix states are securely encrypted and isolated to your account.
          </div>

          {/* Sign Out Button */}
          <div className="pt-2">
            <button
              onClick={handleSignOut}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700/80 hover:border-rose-900/60 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
