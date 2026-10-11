import React from 'react';
import { Check, Star, MessageSquare, Edit3, Shield, Info, Lock, Smartphone, Zap } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const Pricing: React.FC = () => {
  const { settings, openWhatsApp, setIsAdminModalOpen, openPaymentModal } = useAgency();

  const handlePlanSelect = (planId: string) => {
    const plan = settings.plans.find((p) => p.id === planId);
    if (!plan) return;

    let message = plan.waMessage;
    // Ensure accurate live price is inserted if edited
    if (plan.id === 'starter') {
      message = `Hi Techmagnet, I am interested in the Starter Plan (${plan.price}). Please share the enrollment details.`;
    } else if (plan.id === 'growth') {
      message = `Hi Techmagnet, I am interested in the Growth Plan (${plan.price}). Please share the enrollment details.`;
    } else if (plan.id === 'premium') {
      message = `Hi Techmagnet, I am interested in the Premium Plan (${plan.price}). Please share the enrollment details.`;
    } else if (plan.id === 'enterprise') {
      message = 'Hi Techmagnet, I need a customized affiliate enrollment package. Please contact me.';
    }

    openWhatsApp(message);
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-blue-600/10 via-indigo-600/15 to-purple-600/10 blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-950/70 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
            <span>PERFORMANCE INVESTMENT PACKAGES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
            Transparent Pricing.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              High-Converting Enrollment Plans.
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg mb-6">
            Choose an enrollment acceleration package built for your affiliate platform and growth targets. Click &quot;Choose Plan&quot; to initiate instant WhatsApp onboarding.
          </p>

          {/* Admin Edit Trigger */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/70 text-xs text-slate-400">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Prices are suggested placeholders. Authorized administrators can customize:</span>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2"
            >
              <Lock className="w-3 h-3" />
              <span>Edit Pricing (Protected)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 mb-12 items-stretch">
          {settings.plans.map((plan) => {
            const isPopular = plan.isPopular;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl p-7 transition-all duration-300 ${
                  isPopular
                    ? 'bg-gradient-to-b from-[#0f1d3d] to-[#0a1226] border-2 border-blue-500 shadow-2xl shadow-blue-900/40 transform lg:-translate-y-2'
                    : 'bg-[#0a1022]/90 border border-slate-800 hover:border-blue-900/60 shadow-xl'
                }`}
              >
                {/* Popular Pill Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-md shadow-blue-600/40">
                    <Star className="w-3 h-3 fill-white" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 pb-6 mb-6 border-b border-slate-800">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                      {plan.price}
                    </span>
                    {plan.id !== 'enterprise' && (
                      <span className="text-xs text-slate-400 font-medium">/ package</span>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                      Included in Plan
                    </span>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-300">
                        <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Action Buttons: UPI Gateway + WhatsApp */}
                <div className="pt-2 space-y-2">
                  {/* Direct UPI Payment Gateway Button */}
                  <button
                    type="button"
                    onClick={() => openPaymentModal(plan)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950 transition-all duration-200 active:scale-98"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Pay via UPI {plan.rawPrice ? `(₹${plan.rawPrice.toLocaleString('en-IN')})` : ''}</span>
                    <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                  </button>

                  {/* Choose Plan via WhatsApp Button */}
                  <button
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 active:scale-98 ${
                      isPopular
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 hover:border-blue-500'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Choose Plan (WhatsApp)</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-500">
                    Instant UPI QR & WhatsApp confirmation
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* UPI Payment Gateway Spotlight Banner */}
        <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-blue-950/40 to-slate-900/60 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-5 max-w-4xl mx-auto shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-bold text-white">Instant UPI Payment Gateway</h4>
                {settings.upi?.upiId ? (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 font-mono">
                    {settings.upi.upiId}
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-blue-300">
                    Direct UPI & QR
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Scan with PhonePe, Google Pay, Paytm, BHIM, Cred, or MobiKwik for zero-fee instant campaign activation.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openPaymentModal(null, 5999)}
            className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-900 transition-all shrink-0 active:scale-95"
          >
            Open UPI Gateway & Pay
          </button>
        </div>

        {/* Written Terms and Condition Notice */}
        <div className="p-5 rounded-2xl bg-[#0b1224] border border-blue-900/30 flex items-start gap-3.5 max-w-4xl mx-auto">
          <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200">Contractual Transparency Notice:</strong> All pricing tiers represent suggested campaign service packages and are subject to custom adjustments based on client requirements. Guaranteed enrollment support, prospect volume thresholds, and refund eligibility conditions are explicitly governed by the formal written agreement executed prior to campaign deployment. Techmagnet does not make unilateral earnings claims.
          </div>
        </div>
      </div>
    </section>
  );
};
