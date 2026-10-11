import React from 'react';
import { Moon, Sparkles } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false, className = '' }) => {
  const { theme, toggleTheme } = useAgency();

  const isMidnight = theme === 'midnight';

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isMidnight ? 'Deep Navy' : 'Midnight Black'} theme`}
        title={`Current: ${isMidnight ? 'Midnight Black Contrast' : 'Deep Navy'}. Click to switch theme.`}
        className={`relative inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all ${className}`}
      >
        {isMidnight ? (
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
        ) : (
          <Moon className="w-4 h-4 text-blue-400" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isMidnight ? 'Deep Navy' : 'Midnight Black'} theme`}
      className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-blue-500/50 text-xs font-medium text-slate-200 transition-all duration-200 shadow-sm active:scale-95 ${className}`}
      title="Toggle between Deep Navy and Midnight Black contrast modes"
    >
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full transition-colors ${
            isMidnight ? 'bg-purple-400 shadow-sm shadow-purple-400/50' : 'bg-blue-400 shadow-sm shadow-blue-400/50'
          }`}
        />
        {isMidnight ? (
          <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        )}
      </div>

      <span className="whitespace-nowrap font-medium text-slate-300 group-hover:text-white">
        {isMidnight ? 'Midnight Black' : 'Deep Navy'}
      </span>
    </button>
  );
};
