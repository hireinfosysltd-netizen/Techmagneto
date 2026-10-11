import React from 'react';
import { Layers, CheckCircle2, Rocket, Headset, ArrowRight, MessageSquare } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const HowItWorks: React.FC = () => {
  const { openWhatsApp } = useAgency();

  const steps = [
    {
      step: '01',
      title: 'Choose Your Platform',
      desc: 'Tell us which affiliate platform you work with (IDP, Bizzgurukull, LeadGuru, SkillPaisa, SkillMize, or 100+ others).',
      icon: <Layers className="w-6 h-6 text-blue-400" />,
      detail: 'Tailored audience demographics & intent mapping',
    },
    {
      step: '02',
      title: 'Select Your Plan',
      desc: 'Choose an enrollment marketing package suitable for your goals (Starter, Growth, Premium, or Enterprise).',
      icon: <CheckCircle2 className="w-6 h-6 text-indigo-400" />,
      detail: 'Transparent fees with zero hidden retainer surprises',
    },
    {
      step: '03',
      title: 'Campaign Setup',
      desc: 'Our team discusses your requirements and prepares your campaign strategy within 24 to 48 hours.',
      icon: <Rocket className="w-6 h-6 text-purple-400" />,
      detail: 'Ad creative hooks, qualification filters & routing scripts',
    },
    {
      step: '04',
      title: 'Enrollment Support',
      desc: 'Track campaign progress and receive enrollment-related assistance directly through your WhatsApp console.',
      icon: <Headset className="w-6 h-6 text-cyan-400" />,
      detail: 'Ongoing performance reporting and script coaching',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#090e1c] relative border-t border-b border-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-950/70 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
            <span>STREAMLINED ONBOARDING</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
            Four Simple Steps to{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Affiliate Enrollment Momentum.
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            We removed technical friction so you can focus on building relationships and closing enrollments.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="relative p-6 rounded-2xl bg-[#0b1224]/90 border border-slate-800 hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Step indicator header */}
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-2xl font-black text-slate-600 group-hover:text-blue-400 transition-colors">
                    {item.step}
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/70 group-hover:border-blue-500/30 transition-colors">
                    {item.icon}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  Step {index + 1} — {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="text-blue-400 font-medium">Outcome:</span> {item.detail}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Container */}
        <div className="text-center">
          <button
            onClick={() =>
              openWhatsApp(
                'Hi Techmagnet, I want to start my affiliate enrollment campaign today! Please guide me through Step 1.'
              )
            }
            className="inline-flex items-center gap-3 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-xl shadow-blue-600/35 hover:shadow-blue-500/50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <MessageSquare className="w-5 h-5 text-emerald-300" />
            <span>Start Your Campaign Today</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};
