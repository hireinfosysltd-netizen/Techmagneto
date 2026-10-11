import React from 'react';
import { MessageSquare, ArrowRight, ShieldCheck, Zap, Layers, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import heroImage from '../assets/images/hero_techmagnet_growth_1791706728850.jpg';

export const Hero: React.FC = () => {
  const { openWhatsApp, setIsGstModalOpen } = useAgency();

  const handleScrollToPlans = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector('#pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Background ambient gradient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-purple-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value proposition and CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tagline kicker + Clickable GST Trust Badge */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-medium backdrop-blur-sm">
                <span className="font-semibold text-white">TECHMAGNET</span>
                <span className="text-blue-500 font-bold">·</span>
                <span>Your Growth. Our Strategy. Real Enrollments.</span>
              </div>

              <button
                type="button"
                onClick={() => setIsGstModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
                title="Click to view verified GST taxpayer credentials"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>GST Registered · View Details</span>
              </button>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] mb-6 text-balance">
              Guaranteed Enrollments.{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Powerful Affiliate Growth.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Scale your affiliate business with Techmagnet. We help affiliates across 100+ platforms connect with potential customers and grow their enrollments through strategic marketing campaigns.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={() =>
                  openWhatsApp(
                    'Hi Techmagnet, I am ready to scale my affiliate enrollments. Please guide me on getting started.'
                  )
                }
                className="inline-flex items-center justify-center gap-3 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageSquare className="w-5 h-5 text-emerald-300 fill-emerald-300/20" />
                <span>Get Started on WhatsApp</span>
              </button>

              <button
                onClick={handleScrollToPlans}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-850 border border-slate-700/80 hover:border-slate-600 rounded-lg transition-all duration-200 backdrop-blur-sm"
              >
                <span>Explore Our Plans</span>
                <ArrowRight className="w-4 h-4 text-blue-400" />
              </button>
            </div>

            {/* 3 Trust Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 w-full">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-800/40 text-blue-400 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">100+ Platforms Covered</h4>
                  <p className="text-xs text-slate-400 mt-0.5">IDP, Bizzgurukull & custom networks</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">Dedicated Growth Support</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Direct WhatsApp strategist guidance</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">Customized Campaigns</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Qualified buyer-focused targeting</p>
                </div>
              </div>
            </div>

            {/* Clarification banner */}
            <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
              *Guaranteed enrollment services are governed strictly by the selected campaign plan&apos;s written terms and platform eligibility conditions.
            </p>
          </div>

          {/* Right Column: Visual Dashboard with Glassmorphism Overlay */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative background glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-30 -z-10" />

              {/* Main Image Container */}
              <div className="relative rounded-xl overflow-hidden border border-blue-500/25 bg-[#0b1224] shadow-2xl shadow-black/80">
                <img
                  src={heroImage}
                  alt="TECHMAGNET Affiliate Performance Marketing Analytics Dashboard"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b16] via-[#070b16]/30 to-transparent pointer-events-none" />

                {/* Glass card floating pill 1: Live Campaign Indicator */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between p-3 rounded-lg bg-[#0d162d]/85 backdrop-blur-md border border-blue-500/30 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-semibold text-white">Active Enrollment Engine</span>
                  </div>
                  <span className="text-blue-300 font-mono text-[11px] tabular-nums">100+ NETWORKS</span>
                </div>

                {/* Bottom interactive metric overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#090f20]/90 backdrop-blur-md border border-slate-700/60 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300">Conversion Growth Trajectory</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 font-mono tabular-nums">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +112% ROAS
                    </span>
                  </div>

                  {/* Progress visualization */}
                  <div className="w-full bg-slate-800 rounded-full h-2 mb-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-2 rounded-full w-4/5 animate-pulse" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Pre-qualified Learners</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Instant WhatsApp Routing</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
