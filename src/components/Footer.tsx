import React from 'react';
import { Phone, MessageSquare, Shield, Sliders, Lock, ShieldCheck, Smartphone } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const Footer: React.FC = () => {
  const { settings, openWhatsApp, openLegalModal, setIsAdminModalOpen, setIsGstModalOpen, openPaymentModal } = useAgency();

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050811] border-t border-slate-800 text-slate-400 text-xs pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1 & 2: Brand Lockup & Value */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                <span className="font-display tracking-tight text-lg">T</span>
              </div>
              <span className="text-2xl font-black font-display tracking-tight text-white">
                TECHMAGNET
              </span>
            </div>

            <p className="text-slate-300 font-medium text-sm">
              Your Growth. Our Strategy. Real Enrollments.
            </p>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              India&apos;s specialized affiliate enrollment and growth marketing agency. We support affiliate entrepreneurs across 100+ platforms with targeted acquisition funnels, verified lead qualification, and strategic conversion consultation.
            </p>

            {/* Direct Contact & UPI Payment Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => openPaymentModal()}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 hover:text-white hover:bg-emerald-600 transition-colors shadow-sm"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>UPI Pay: {settings.upi?.upiId || 'Instant Clearing'}</span>
              </button>

              <button
                onClick={() =>
                  openWhatsApp(
                    'Hi Techmagnet, I want to discuss enrollment generation for my affiliate platform.'
                  )
                }
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                <span>WhatsApp: +91 {settings.contact.whatsAppPhone.slice(2)}</span>
              </button>

              <a
                href={`tel:${settings.contact.officePhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-950/60 border border-blue-500/40 text-blue-300 hover:text-white hover:bg-blue-600 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call: {settings.contact.officePhone}</span>
              </a>
            </div>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '#hero' },
                { label: 'About Us', href: '#about' },
                { label: 'Platforms (100+)', href: '#platforms' },
                { label: 'Our Services', href: '#services' },
                { label: 'Pricing & Plans', href: '#pricing' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'FAQs', href: '#faqs' },
                { label: 'Contact Us', href: '#contact' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Featured Supported Platforms */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Supported Platforms</h4>
            <ul className="space-y-2 text-slate-400">
              {['IDP Admissions', 'Bizzgurukull', 'LeadGuru', 'SkillPaisa', 'SkillMize', 'Millionaire Track', 'Richind', '100+ Other Networks'].map((plat) => (
                <li key={plat}>
                  <button
                    onClick={() =>
                      openWhatsApp(
                        `Hi Techmagnet, I need enrollment marketing for ${plat}. Please share strategy.`
                      )
                    }
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    {plat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Legal & Administrative */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Compliance & Legal</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => openLegalModal('privacy')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegalModal('terms')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Terms and Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegalModal('refund')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Refund and Cancellation Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsGstModalOpen(true)}
                  className="hover:text-blue-400 transition-colors text-left flex items-center gap-1.5 text-emerald-400 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>View GST Details</span>
                </button>
              </li>
            </ul>

            <div className="pt-4">
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white text-[11px] font-medium"
              >
                <Lock className="w-3 h-3 text-blue-400" />
                <span>Admin Controls (Locked)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Regulatory Disclaimer Box */}
        <div className="py-6 border-b border-slate-800/80 flex items-start gap-3">
          <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            <strong>Legal Disclaimer:</strong> TECHMAGNET is an independent digital growth marketing and performance advertising consultancy. All platform names, trademarks, and logos (including IDP, Bizzgurukull, LeadGuru, SkillPaisa, SkillMize, and others) are the property of their respective owners. Mention of these platforms denotes service compatibility for enrolled affiliates and does not imply official endorsement, affiliation, sponsorship, or licensing. Guaranteed enrollments are subject to the specific terms and eligibility conditions stated in your written plan agreement.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} TECHMAGNET. All rights reserved. India.
          </div>
          <div className="flex items-center gap-4">
            <span>Office: {settings.contact.officePhone}</span>
            <span>·</span>
            <span>WhatsApp: +91 {settings.contact.whatsAppPhone.slice(2)}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
