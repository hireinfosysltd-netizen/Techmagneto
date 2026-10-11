import React, { useState } from 'react';
import { Phone, MessageSquare, Send, CheckCircle2, Clock, MapPin, Mail, AlertCircle, ShieldCheck, ExternalLink } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const Contact: React.FC = () => {
  const { settings, openWhatsApp, setIsGstModalOpen } = useAgency();

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [platform, setPlatform] = useState('IDP');
  const [interestedPlan, setInterestedPlan] = useState('Growth Plan (₹5,999)');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobileNumber.trim()) {
      setErrorMsg('Please enter your full name and mobile number.');
      return;
    }

    setErrorMsg('');
    setSubmitted(true);

    // Formatted WhatsApp message with all details
    const formattedWA = `*NEW INQUIRY FROM TECHMAGNET WEBSITE*
----------------------------------------
👤 *Full Name:* ${fullName.trim()}
📱 *Mobile Number:* ${mobileNumber.trim()}
🎯 *Affiliate Platform:* ${platform}
📦 *Interested Plan:* ${interestedPlan}
💬 *Message / Goals:* ${message.trim() || 'Looking for rapid enrollment generation.'}
----------------------------------------
Please review and connect with me.`;

    // Open WhatsApp with all entered details
    setTimeout(() => {
      openWhatsApp(formattedWA);
    }, 600);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Agency Information */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-950/70 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
              <span>GET IN TOUCH DIRECTLY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight text-balance">
              Let&apos;s Launch Your{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Enrollment Campaign.
              </span>
            </h2>

            <p className="text-slate-300 text-base mb-8 leading-relaxed">
              Have questions about platform compatibility, campaign budgets, or target volumes? Call our office or connect instantly with our senior strategy team on WhatsApp.
            </p>

            {/* Direct Contact Cards */}
            <div className="w-full space-y-4 mb-8">
              {/* WhatsApp Chat Card */}
              <div className="p-5 rounded-2xl bg-[#0d162d]/90 border border-blue-500/30 shadow-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Instant WhatsApp Chat
                    </span>
                    <strong className="text-base text-white font-mono">
                      +91 {settings.contact.whatsAppPhone.slice(2)}
                    </strong>
                    <p className="text-[11px] text-slate-400">Average reply: &lt; 5 minutes</p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    openWhatsApp(
                      'Hi Techmagnet, I would like to connect with an enrollment marketing specialist.'
                    )
                  }
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-all whitespace-nowrap"
                >
                  Chat Now
                </button>
              </div>

              {/* Office Phone Card (Click-to-call) */}
              <div className="p-5 rounded-2xl bg-[#0b1224]/90 border border-slate-800 shadow-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                      Office Telephone
                    </span>
                    <strong className="text-base text-white font-mono">
                      {settings.contact.officePhone}
                    </strong>
                    <p className="text-[11px] text-slate-400">Direct voice consultation</p>
                  </div>
                </div>

                <a
                  href={`tel:${settings.contact.officePhone.replace(/\s+/g, '')}`}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
                >
                  Click to Call
                </a>
              </div>
            </div>

            {/* Operating info */}
            <div className="w-full pt-6 border-t border-slate-800/80 space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{settings.contact.operatingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{settings.contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{settings.contact.email}</span>
              </div>

              {/* GST Details Card */}
              <div className="pt-2">
                <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        Verified Business Taxpayer
                      </span>
                      <strong className="text-xs text-white font-mono">{settings.gst.gstin}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsGstModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-[11px] font-semibold transition-all whitespace-nowrap"
                  >
                    <span>View GST</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Lead Capture Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-[#0b1224]/90 border border-slate-800 shadow-2xl relative">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white tracking-tight">Campaign Inquiry Form</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Submit your details to immediately trigger your custom enrollment plan on WhatsApp.
                </p>
              </div>

              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Inquiry Form Generated!</h4>
                  <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
                    Opening WhatsApp to connect you directly with a Techmagnet strategist. If the chat window didn&apos;t open automatically, click the button below.
                  </p>
                  <button
                    onClick={() => {
                      const formattedWA = `*NEW INQUIRY FROM TECHMAGNET WEBSITE*
----------------------------------------
👤 *Full Name:* ${fullName.trim()}
📱 *Mobile Number:* ${mobileNumber.trim()}
🎯 *Affiliate Platform:* ${platform}
📦 *Interested Plan:* ${interestedPlan}
💬 *Message / Goals:* ${message.trim() || 'Looking for rapid enrollment generation.'}
----------------------------------------`;
                      openWhatsApp(formattedWA);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-lg shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open in WhatsApp</span>
                  </button>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-slate-400 hover:text-white mt-4 underline underline-offset-4"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Full Name <span className="text-blue-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Mobile Number (WhatsApp) <span className="text-blue-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="e.g. +91 9876543210"
                        className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Affiliate Platform Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Affiliate Platform <span className="text-blue-400">*</span>
                      </label>
                      <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        {settings.platforms.map((p) => (
                          <option key={p.id} value={p.name} className="bg-slate-900 text-white">
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Interested Plan Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Interested Plan <span className="text-blue-400">*</span>
                      </label>
                      <select
                        value={interestedPlan}
                        onChange={(e) => setInterestedPlan(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        {settings.plans.map((p) => (
                          <option
                            key={p.id}
                            value={`${p.name} (${p.price})`}
                            className="bg-slate-900 text-white"
                          >
                            {p.name} — {p.price}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Goals or Specific Requirements (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your target monthly enrollments or challenges you are facing..."
                      className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Form Submission Button */}
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-200 active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry & Open on WhatsApp</span>
                  </button>

                  <p className="text-[11px] text-center text-slate-500">
                    By submitting, you agree to receive campaign consultation updates via WhatsApp. We respect your privacy.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
