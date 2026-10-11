import React, { useState } from 'react';
import { Search, ArrowRight, ShieldAlert, Sparkles, Check, ExternalLink } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const Platforms: React.FC = () => {
  const { settings, openWhatsApp } = useAgency();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'EdTech & Digital Skills', 'Lead Gen & Affiliate Mastery', 'Education & Study Abroad', 'Skill Monetization'];

  const filteredPlatforms = settings.platforms.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePlatformInquiry = (platformName: string) => {
    const msg = `Hi Techmagnet, I am looking for enrollments for ${platformName}. Please share your campaign strategy and onboarding process.`;
    openWhatsApp(msg);
  };

  return (
    <section id="platforms" className="py-20 bg-[#090e1c] relative border-t border-b border-blue-900/20">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-950/70 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
            <span>UNIVERSAL COMPATIBILITY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
            One Agency.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              100+ Affiliate Platforms.
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            Whether you promote career bundles, overseas education, or high-income skill academies, Techmagnet builds customized enrollment engines aligned with your specific affiliate offering.
          </p>
        </div>

        {/* Search and Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 p-2 rounded-xl bg-[#0d162d]/90 border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search your affiliate platform..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Interactive filter buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            {['all', 'EdTech', 'Lead Gen', 'Education', 'Skills'].map((catKey) => {
              const fullCategory =
                catKey === 'all'
                  ? 'all'
                  : catKey === 'EdTech'
                  ? 'EdTech & Digital Skills'
                  : catKey === 'Lead Gen'
                  ? 'Lead Gen & Affiliate Mastery'
                  : catKey === 'Education'
                  ? 'Education & Study Abroad'
                  : 'Skill Monetization';

              const isActive = selectedCategory === fullCategory;
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setSelectedCategory(fullCategory)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {catKey === 'all' ? 'All Platforms' : catKey}
                </button>
              );
            })}
          </div>
        </div>

        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPlatforms.map((platform) => (
            <div
              key={platform.id}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0c1429]/80 backdrop-blur-sm border border-blue-900/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-950/40 hover:-translate-y-1"
            >
              <div>
                {/* Platform top row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900/60 to-indigo-900/60 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-lg font-display group-hover:scale-105 transition-transform">
                    {platform.name.slice(0, 2).toUpperCase()}
                  </div>
                  {platform.badge ? (
                    <span className="text-[11px] font-semibold text-purple-300 bg-purple-950/80 border border-purple-500/30 px-2.5 py-1 rounded-md">
                      {platform.badge}
                    </span>
                  ) : platform.popular ? (
                    <span className="text-[11px] font-semibold text-blue-300 bg-blue-950/80 border border-blue-500/30 px-2.5 py-1 rounded-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      Popular
                    </span>
                  ) : null}
                </div>

                {/* Platform Name and Category */}
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                  {platform.name}
                </h3>
                <p className="text-xs font-medium text-slate-400 mb-3">{platform.category}</p>

                <p className="text-sm text-slate-300 leading-relaxed mb-4">{platform.description}</p>

                {/* Enrollment Focus */}
                <div className="pt-3 border-t border-slate-800/80 mb-6">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block mb-1">
                    Campaign Target
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-blue-200 font-medium">
                    <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{platform.enrollmentFocus}</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Get Enrollments on WhatsApp */}
              <button
                onClick={() => handlePlatformInquiry(platform.name)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600/15 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 hover:border-blue-500 text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-98"
              >
                <span>Get Enrollments</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Empty state if search has no results */}
        {filteredPlatforms.length === 0 && (
          <div className="text-center py-12 p-8 rounded-xl bg-slate-900/40 border border-slate-800 mb-12">
            <p className="text-slate-300 text-sm mb-3">
              Don&apos;t see your specific affiliate platform listed?
            </p>
            <p className="text-slate-400 text-xs mb-4">
              Techmagnet supports any legal affiliate network or customized referral link.
            </p>
            <button
              onClick={() =>
                openWhatsApp(
                  `Hi Techmagnet, I promote "${searchTerm}" and need customized enrollment support. Can you run campaigns for this?`
                )
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-500"
            >
              <span>Inquire for {searchTerm || 'Your Platform'} on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Regulatory Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Independence & Compliance Notice:</strong> IDP, Bizzgurukull, LeadGuru, SkillPaisa, SkillMize, and all other brand names and trademarks belong to their respective registered owners. Techmagnet is an independent performance marketing agency delivering advertising, lead generation, and enrollment assistance services to individual affiliates. Mention of these platforms signifies that our marketing frameworks are compatible with and support these affiliate programs; it does not imply official endorsement, partnership, or authorization.
          </p>
        </div>
      </div>
    </section>
  );
};
