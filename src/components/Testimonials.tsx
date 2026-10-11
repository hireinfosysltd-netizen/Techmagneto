import React from 'react';
import { Quote, CheckCircle2, Edit3, MessageCircle } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const Testimonials: React.FC = () => {
  const { settings, setIsAdminModalOpen, openWhatsApp } = useAgency();

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-950/70 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
              <span>FIELD EVIDENCE & FEEDBACK</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
              Real Impact from{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Active Affiliate Campaigns.
              </span>
            </h2>

            <p className="text-slate-300 text-base mt-3">
              See how structured marketing campaigns turned low-converting referral efforts into predictable affiliate revenue.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-400" />
              <span>Edit Testimonials</span>
            </button>
            <button
              onClick={() =>
                openWhatsApp(
                  'Hi Techmagnet, can you share recent case studies and proof of enrollments in my niche?'
                )
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/30"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ask for Case Studies</span>
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {settings.testimonials.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between p-7 rounded-2xl bg-[#0b1224]/85 border border-slate-800/90 hover:border-blue-500/30 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs tracking-wider">
                      {item.avatarSeed}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-blue-400 font-medium">{item.platform}</p>
                    </div>
                  </div>
                  <Quote className="w-6 h-6 text-slate-700" />
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-400 font-mono">{item.result}</span>
                <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  Verified Affiliate
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Editorial Compliance Note */}
        <p className="text-center text-[11px] text-slate-500 max-w-2xl mx-auto">
          Notice: Feedback entries shown reflect campaign scenarios and client-reported performance metrics. Techmagnet never guarantees identical monetary returns, as outcomes rely on the marketer&apos;s individual follow-up, pricing, and platform policies.
        </p>

      </div>
    </section>
  );
};
