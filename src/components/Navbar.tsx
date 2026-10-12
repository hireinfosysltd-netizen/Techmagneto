import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Phone, MessageSquare, Smartphone, ShieldCheck } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const { settings, openWhatsApp, openPaymentModal, setIsGstModalOpen } = useAgency();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About Us', href: '#about' },
    { label: 'Platforms', href: '#platforms' },
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Contact Us', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070b16]/90 backdrop-blur-md border-b border-blue-900/30 shadow-lg shadow-black/40 py-3.5'
          : 'bg-[#070b16]/60 backdrop-blur-sm border-b border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Zone 1: Single text element Brand Zone */}
          <a
            href="#hero"
            className="flex items-center gap-2 group whitespace-nowrap shrink-0"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <span className="font-display tracking-tight text-lg">T</span>
            </div>
            <span className="text-xl sm:text-2xl font-black font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-300 bg-clip-text text-transparent">
              TECHMAGNET
            </span>
          </a>

          {/* Zone 2: Navigation Links (Clean single line typography) */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-blue-500/60"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Direct Actions (Theme Toggle + GST Details + Pay UPI + Get Enrollments CTA) */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* User-controlled Theme Toggle */}
            <ThemeToggle />

            {/* View Verified GST Details */}
            <button
              type="button"
              onClick={() => setIsGstModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-blue-300 hover:text-white bg-blue-950/60 hover:bg-blue-600/40 border border-blue-500/30 rounded-lg transition-all duration-200"
              title="View Verified GST Credentials"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>GST Details</span>
            </button>

            {/* Pay via UPI Gateway */}
            <button
              type="button"
              onClick={() => openPaymentModal()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/70 hover:bg-emerald-600 border border-emerald-500/40 rounded-lg transition-all duration-200 shadow-sm active:scale-95"
              title={settings.upi?.upiId ? `Instant UPI Payment (${settings.upi.upiId})` : 'Instant UPI Payment'}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pay via UPI</span>
            </button>

            <a
              href={`tel:${settings.contact.officePhone.replace(/\s+/g, '')}`}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors"
              title="Call Office Phone"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{settings.contact.officePhone}</span>
            </a>

            <button
              onClick={() =>
                openWhatsApp(
                  'Hi Techmagnet, I want to get enrollments for my affiliate business. Please share details.'
                )
              }
              className="relative group inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-size-200 hover:bg-right rounded-lg shadow-md shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-300 whitespace-nowrap shrink-0 active:scale-95"
            >
              <span>Get Enrollments</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex xl:hidden items-center gap-2">
            <ThemeToggle compact />
            <button
              onClick={() =>
                openWhatsApp(
                  'Hi Techmagnet, I want to get enrollments for my affiliate business. Please share details.'
                )
              }
              className="sm:hidden px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md whitespace-nowrap"
            >
              Enrollments
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-md transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0a0f1d] border-b border-blue-900/40 px-5 pt-3 pb-6 shadow-2xl transition-all">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="py-2 text-slate-300 hover:text-blue-400 font-medium text-sm border-b border-slate-800/60"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-2 flex flex-col gap-2.5">
              <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
                <span className="text-xs text-slate-400">Contrast Mode:</span>
                <ThemeToggle />
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsGstModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold text-blue-300 bg-blue-950/60 rounded-lg border border-blue-500/40"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>View GST Details (KnowYourGST)</span>
              </button>
              <a
                href={`tel:${settings.contact.officePhone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold text-slate-300 bg-slate-800/80 rounded-lg border border-slate-700"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Call {settings.contact.officePhone}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openPaymentModal();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md shadow-emerald-950 transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                <span>Pay via UPI Gateway{settings.upi?.upiId ? ` (${settings.upi.upiId})` : ''}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openWhatsApp(
                    'Hi Techmagnet, I want to get enrollments for my affiliate business. Please share details.'
                  );
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md shadow-blue-600/30"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
