import React from 'react';
import { Target, Users, BarChart3, Clock, CheckCircle2, ShieldCheck, PhoneCall } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import strategyImage from '../assets/images/techmagnet_strategy_room_1791706750652.jpg';

export const WhyChooseUs: React.FC = () => {
  const { settings, openWhatsApp } = useAgency();

  const advantages = [
    {
      icon: <Target className="w-5 h-5 text-blue-400" />,
      title: 'Intent-Driven Audience Qualification',
      description:
        'We never deliver blind click traffic. We screen leads through structured qualification prompts to ensure prospects understand your educational packages and are motivated to enroll.',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-indigo-400" />,
      title: 'Real-Time Campaign Transparency',
      description:
        'Track ad spend efficiency, cost per qualified prospect, and conversion velocity with clean reports delivered directly to your WhatsApp console.',
    },
    {
      icon: <Users className="w-5 h-5 text-cyan-400" />,
      title: '1-on-1 Dedicated Growth Strategist',
      description:
        'You work with a seasoned performance marketer who knows Indian affiliate ecosystems, commission tier thresholds, and effective objection handling.',
    },
    {
      icon: <Clock className="w-5 h-5 text-purple-400" />,
      title: 'Fast 24-48 Hour Campaign Launch',
      description:
        'No waiting weeks for marketing assets. Our proven frameworks allow rapid deployment so your affiliate link starts receiving qualified traffic almost immediately.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#080d1a] relative border-t border-b border-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Visual Column */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-purple-600/30 rounded-2xl blur-xl opacity-40 -z-10" />

              <div className="rounded-2xl overflow-hidden border border-blue-500/20 bg-[#0a1020] shadow-2xl">
                <img
                  src={strategyImage}
                  alt="Techmagnet Performance Marketing Team in War Room"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                <div className="p-6 bg-[#0a1020]/95 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-white font-bold text-base">Affiliate Growth Engine</h4>
                      <p className="text-slate-400 text-xs">National Reach · Multi-Channel Media</p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-500/30 text-blue-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Primary Channel</span>
                      <strong className="text-white font-medium">WhatsApp Conversion</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Platform Scope</span>
                      <strong className="text-white font-medium">100+ Affiliate Networks</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Column */}
          <div className="lg:col-span-7 flex flex-col items-start order-1 lg:order-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-950/70 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-4">
              <span>ABOUT TECHMAGNET</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight text-balance">
              Your Growth. Our Strategy.{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Real Enrollments.
              </span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg mb-6 leading-relaxed">
              Most affiliate marketers struggle not with course quality, but with consistent customer acquisition. Cold DMing and generic social posting produce low trust and burnout.
            </p>

            <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
              At <strong>TECHMAGNET</strong>, we replace manual hustle with professional advertising infrastructure. We design precision marketing funnels that find people genuinely looking to upskill, present your affiliate program with authority, and route ready-to-enroll prospects directly to your WhatsApp.
            </p>

            {/* Strategic Advantages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8 w-full">
              {advantages.map((adv, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#0d162d]/70 border border-slate-800/80 hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-1.5 rounded-md bg-slate-900 border border-slate-700/60 shrink-0">
                      {adv.icon}
                    </div>
                    <h4 className="text-sm font-bold text-white">{adv.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-8">{adv.description}</p>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() =>
                  openWhatsApp(
                    'Hi Techmagnet, I read about your strategy and would like to consult on my affiliate campaigns.'
                  )
                }
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md shadow-blue-600/30 transition-all"
              >
                <span>Talk with a Growth Strategist</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <a
                href={`tel:${settings.contact.officePhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-semibold rounded-lg border border-slate-700/80 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-blue-400" />
                <span>Call {settings.contact.officePhone}</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
