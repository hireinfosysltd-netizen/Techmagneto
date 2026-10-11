import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const FloatingWhatsApp: React.FC = () => {
  const { openWhatsApp } = useAgency();
  const [showTooltip, setShowTooltip] = useState(true);

  const handleClick = () => {
    openWhatsApp(
      'Hi Techmagnet, I am on your website and want to discuss enrollment campaigns for my affiliate business.'
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 group">
      {/* Tooltip Card */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#090f1f]/95 border border-emerald-500/40 text-white shadow-2xl backdrop-blur-md animate-fade-in transition-all">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <div className="text-left">
            <p className="text-xs font-bold text-white leading-tight">Chat with Techmagnet</p>
            <p className="text-[10px] text-emerald-300">Online & Ready to Assist</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
            aria-label="Close WhatsApp prompt"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleClick}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/60 transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-500/40"
        aria-label="Chat with Techmagnet on WhatsApp (+91 9023386997)"
        title="Chat with Techmagnet on WhatsApp (+91 9023386997)"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#070b16]" />
        </span>

        {/* WhatsApp Icon */}
        <MessageSquare className="w-7 h-7 fill-white/20" />
      </button>
    </div>
  );
};
