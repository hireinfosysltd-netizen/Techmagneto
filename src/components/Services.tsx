import React from 'react';
import {
  UserCheck,
  Target,
  TrendingUp,
  Compass,
  Share2,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const Services: React.FC = () => {
  const { settings, openWhatsApp } = useAgency();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserCheck':
        return <UserCheck className="w-6 h-6 text-blue-400" />;
      case 'Target':
        return <Target className="w-6 h-6 text-indigo-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-cyan-400" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-purple-400" />;
      case 'Share2':
        return <Share2 className="w-6 h-6 text-blue-400" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-6 h-6 text-violet-400" />;
    }
  };

  const handleServiceInquiry = (serviceTitle: string) => {
    const message = `Hi Techmagnet, I am interested in your service: "${serviceTitle}". Please share pricing and execution methodology.`;
    openWhatsApp(message);
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-950/70 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
            <span>PERFORMANCE MARKETING SOLUTIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
            Six Specialized Services.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Engineered For Maximum Enrollments.
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            From high-converting ad funnels to 1-on-1 closing consultations, every capability is designed to help affiliate partners scale sustainably and predictably.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {settings.services.map((service, index) => {
            const formattedIndex = String(index + 1).padStart(2, '0');
            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between p-8 rounded-2xl bg-[#0b1224]/80 backdrop-blur-md border border-slate-800/80 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-950/30 hover:-translate-y-1"
              >
                <div>
                  {/* Top Bar with Editorial Index & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-semibold tracking-wider text-slate-500 group-hover:text-blue-400 transition-colors">
                      {formattedIndex}
                    </span>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/70 group-hover:border-blue-500/40 transition-colors">
                      {getServiceIcon(service.icon)}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Deliverables List */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-800/80 mb-8">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                      Key Deliverables
                    </span>
                    {service.deliverables.map((item, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Inquiry Button */}
                <button
                  onClick={() => handleServiceInquiry(service.title)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700/80 hover:border-blue-500 text-xs font-semibold transition-all duration-200"
                >
                  <span>Inquire on WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900/60 border border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-white mb-1">
              Need a personalized multi-service package?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Our marketing leads can combine lead generation, creative design, and script coaching into a unified monthly retainer.
            </p>
          </div>
          <button
            onClick={() =>
              openWhatsApp(
                'Hi Techmagnet, I need a combined multi-service strategy for my affiliate team. Please schedule a consultation.'
              )
            }
            className="whitespace-nowrap px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all shrink-0"
          >
            Request Custom Consultation
          </button>
        </div>
      </div>
    </section>
  );
};
