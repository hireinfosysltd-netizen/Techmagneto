import React, { useState } from 'react';
import { X, ShieldCheck, ExternalLink, Copy, Check, FileCheck, Building2, MapPin, BadgeCheck, MessageSquare } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const GstModal: React.FC = () => {
  const { isGstModalOpen, setIsGstModalOpen, settings, openWhatsApp } = useAgency();
  const [copied, setCopied] = useState(false);

  if (!isGstModalOpen) return null;

  const gst = settings.gst;

  const handleCopyGstin = () => {
    navigator.clipboard.writeText(gst.gstin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRequestInvoice = () => {
    openWhatsApp(
      `Hi Techmagnet, I am requesting a formal GST tax invoice for enrollment services (GSTIN: ${gst.gstin}). Please share invoice details.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#090f20] border border-blue-500/40 shadow-2xl text-slate-100 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">Verified GST Details</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official taxpayer credentials & compliance information
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGstModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close GST details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GSTIN Hero Card */}
        <div className="p-5 rounded-xl bg-[#0d162d] border border-blue-500/30 mb-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                GSTIN / Taxpayer Identification Number
              </span>
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-wider select-all">
                  {gst.gstin}
                </span>
              </div>
            </div>

            <button
              onClick={handleCopyGstin}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-semibold transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>GSTIN Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy GSTIN</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Verified Business Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Legal Business Name</span>
            </div>
            <p className="text-sm font-bold text-white">{gst.legalName}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <BadgeCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Trade Name</span>
            </div>
            <p className="text-sm font-bold text-white">{gst.tradeName}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>Registered Jurisdiction</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {gst.state} (State Code: {gst.stateCode})
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Taxpayer Status</span>
            </div>
            <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {gst.status}
            </p>
          </div>
        </div>

        {/* Source & Verification Actions */}
        <div className="p-4 rounded-xl bg-[#070b16] border border-slate-800 space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
            <span>Information Verification Source:</span>
            <span className="font-semibold text-blue-300 font-mono">
              Source: {gst.source || 'KnowYourGST'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            {/* Primary Link: KnowYourGST */}
            <a
              href={gst.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all text-center"
            >
              <span>View GST Details on KnowYourGST</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Official Portal Backup Link */}
            <a
              href="https://services.gst.gov.in/services/searchtp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
            >
              <span>Official GST Portal (Gov.in)</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Tax Invoice Assistance */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
          <p>Need a B2B Tax Invoice with Input Tax Credit (ITC)?</p>
          <button
            onClick={handleRequestInvoice}
            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Request Invoice on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
