import React, { useState, useEffect, useId } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Check,
  Copy,
  Smartphone,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  Lock,
  ArrowRight,
  Sparkles,
  Globe,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const PaymentModal: React.FC = () => {
  const {
    isPaymentModalOpen,
    closePaymentModal,
    selectedPaymentPlan,
    customPaymentAmount,
    settings,
    openWhatsApp,
    setIsAdminModalOpen,
  } = useAgency();

  const utrInputId = useId();
  const payerNameInputId = useId();
  const payerPhoneInputId = useId();

  const [amount, setAmount] = useState<number>(5999);
  const [planTitle, setPlanTitle] = useState<string>('Growth Plan');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [activeStep, setActiveStep] = useState<'pay' | 'confirm' | 'success'>('pay');

  // Confirmation form fields
  const [utrNumber, setUtrNumber] = useState('');
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('IDP');
  const [receiptId, setReceiptId] = useState('');

  const upiId = (settings.upi?.upiId || '').trim();
  const payeeName = settings.upi?.payeeName || 'TECHMAGNET';

  // Sync amount and plan on open
  useEffect(() => {
    if (selectedPaymentPlan) {
      setPlanTitle(selectedPaymentPlan.name);
      if (selectedPaymentPlan.rawPrice) {
        setAmount(selectedPaymentPlan.rawPrice);
      } else {
        setAmount(5999);
      }
    } else if (customPaymentAmount) {
      setAmount(customPaymentAmount);
      setPlanTitle('Custom Campaign Deposit');
    } else {
      setAmount(5999);
      setPlanTitle('Growth Plan');
    }
    setActiveStep('pay');
    setUtrNumber('');
  }, [selectedPaymentPlan, customPaymentAmount, isPaymentModalOpen]);

  // Construct standard NPCI UPI Payment URI if UPI ID is configured
  const upiUri = upiId
    ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
        payeeName
      )}&am=${amount}&cu=INR&tn=${encodeURIComponent(`TECHMAGNET-${planTitle.replace(/\s+/g, '')}-CAMPAIGN`)}`
    : '';

  // Generate high-resolution QR code
  useEffect(() => {
    if (!isPaymentModalOpen || !upiId) {
      setQrCodeDataUrl('');
      return;
    }

    QRCode.toDataURL(upiUri, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#050a18',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));
  }, [upiUri, isPaymentModalOpen, upiId]);

  if (!isPaymentModalOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedReceipt = `TM-PAY-${Date.now().toString().slice(-6)}`;
    setReceiptId(generatedReceipt);
    setActiveStep('success');

    // Notify on WhatsApp with transaction details
    const waReceiptMsg = `*PAYMENT SUBMITTED — TECHMAGNET ENROLLMENT GATEWAY*
----------------------------------------
🧾 *Receipt ID:* ${generatedReceipt}
💰 *Amount Paid:* ₹${amount.toLocaleString('en-IN')}
📦 *Plan Selected:* ${planTitle}
🎯 *Affiliate Platform:* ${selectedPlatform}
👤 *Payer Name:* ${payerName || 'Not specified'}
📱 *Payer Mobile:* ${payerPhone || 'Not specified'}
🔢 *12-Digit UTR / Ref No:* ${utrNumber}
💳 *Paid to UPI:* ${upiId}
----------------------------------------
Please verify my payment and initiate campaign onboarding.`;

    setTimeout(() => {
      openWhatsApp(waReceiptMsg);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#090f20] border border-blue-500/40 shadow-2xl text-slate-100 p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">UPI Payment Gateway</h3>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/90 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Instant Activation
                </span>
              </div>
              <p className="text-xs text-slate-400">Zero Gateway Surcharge · Direct UPI Clearing</p>
            </div>
          </div>

          <button
            onClick={closePaymentModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close Payment Gateway"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-xs text-center font-medium">
          <button
            onClick={() => setActiveStep('pay')}
            className={`py-1.5 px-2 rounded-lg border transition-all ${
              activeStep === 'pay'
                ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                : 'bg-slate-900/60 border-slate-800 text-slate-400'
            }`}
          >
            1. Scan & Pay
          </button>
          <button
            onClick={() => setActiveStep('confirm')}
            className={`py-1.5 px-2 rounded-lg border transition-all ${
              activeStep === 'confirm'
                ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                : 'bg-slate-900/60 border-slate-800 text-slate-400'
            }`}
          >
            2. Enter UTR Ref
          </button>
          <div
            className={`py-1.5 px-2 rounded-lg border transition-all ${
              activeStep === 'success'
                ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold'
                : 'bg-slate-900/60 border-slate-800 text-slate-400'
            }`}
          >
            3. Campaign Activated
          </div>
        </div>

        {/* STEP 1: SCAN & PAY VIA UPI */}
        {activeStep === 'pay' && (
          <div className="space-y-5">
            {/* Amount & Plan Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-slate-900/70 border border-blue-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-blue-400 font-semibold block">
                  Package Selected
                </span>
                <h4 className="text-base font-bold text-white">{planTitle}</h4>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Total Payable</span>
                <span className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
                  ₹{amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Quick Amount Switcher */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Select Amount:</span>
              {[
                { label: 'Starter (₹2,999)', val: 2999, name: 'Starter Plan' },
                { label: 'Growth (₹5,999)', val: 5999, name: 'Growth Plan' },
                { label: 'Premium (₹9,999)', val: 9999, name: 'Premium Plan' },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => {
                    setAmount(p.val);
                    setPlanTitle(p.name);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    amount === p.val
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  ₹{p.val.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            {/* When UPI ID is NOT configured yet */}
            {!upiId ? (
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0e1629] to-[#080d1a] border border-amber-500/30 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">UPI Gateway Not Configured Yet</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                    No UPI ID has been set by the administrator yet. You can connect with our team on WhatsApp for manual enrollment, or log in to the admin panel to set up your UPI ID.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      closePaymentModal();
                      openWhatsApp(`Hi Techmagnet, I want to enroll in the ${planTitle} (₹${amount.toLocaleString('en-IN')}). Please share payment details.`);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Pay / Enroll via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      closePaymentModal();
                      setIsAdminModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs inline-flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Admin: Set or Edit UPI</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* UPI ID Copy Card */}
                <div className="p-3.5 rounded-xl bg-[#0c1429] border border-blue-500/30 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Official Merchant UPI ID
                    </span>
                    <strong className="text-base font-mono text-white tracking-wider select-all">
                      {upiId}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/40 text-xs font-semibold transition-all"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy UPI ID</span>
                      </>
                    )}
                  </button>
                </div>

                {/* QR Code Container */}
                <div className="p-5 rounded-2xl bg-[#080d1a] border border-slate-800 text-center flex flex-col items-center">
                  <span className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    Scan QR with Any Indian UPI App
                  </span>

                  <div className="p-3 rounded-2xl bg-white shadow-xl inline-block mb-3 border-4 border-blue-500/20">
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt="Scan UPI QR Code to pay Techmagnet"
                        className="w-52 h-52 object-contain"
                      />
                    ) : (
                      <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs font-mono">
                        Generating UPI QR...
                      </div>
                    )}
                  </div>

                  {/* Supported apps strip */}
                  <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span>Supported:</span>
                    <span className="font-semibold text-slate-200">PhonePe</span>·
                    <span className="font-semibold text-slate-200">Google Pay</span>·
                    <span className="font-semibold text-slate-200">Paytm</span>·
                    <span className="font-semibold text-slate-200">BHIM</span>·
                    <span className="font-semibold text-slate-200">MobiKwik</span>·
                    <span className="font-semibold text-slate-200">Cred</span>
                  </div>
                </div>
              </>
            )}

            {/* Linked Payment / Deposit Portal Banner */}
            {settings.upi?.paymentLink && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Official Deposit / Payment Gateway Active</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono truncate max-w-[240px] sm:max-w-[290px]">
                    {settings.upi.paymentLink}
                  </p>
                </div>
                <a
                  href={settings.upi.paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1 shadow-sm shrink-0 transition-all"
                >
                  <span>Open Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Direct Mobile UPI & Payment Gateway Buttons */}
            <div className="space-y-2.5">
              {/* If Website Payment Gateway Link is provided, show it as primary button */}
              {settings.upi?.paymentLink && (
                <a
                  href={settings.upi.paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all text-center active:scale-98"
                >
                  <Globe className="w-4 h-4" />
                  <span>
                    Open Payment Gateway ({(() => {
                      try {
                        return new URL(settings.upi.paymentLink).hostname;
                      } catch {
                        return 'External Gateway';
                      }
                    })()})
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}

              {upiId && (
                <a
                  href={upiUri}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all text-center active:scale-98"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Pay ₹{amount.toLocaleString('en-IN')} via UPI App</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <button
                type="button"
                onClick={() => setActiveStep('confirm')}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
              >
                <span>Already Paid? Submit 12-Digit UTR Ref Number</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ENTER UTR NUMBER / VERIFICATION FORM */}
        {activeStep === 'confirm' && (
          <form onSubmit={handleConfirmPayment} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-blue-950/50 border border-blue-500/30 text-xs text-slate-300">
              <p>
                Enter the <strong>12-digit UPI Reference Number / UTR</strong> shown in your banking app receipt after paying to <strong>{upiId}</strong>.
              </p>
            </div>

            <div>
              <label htmlFor={utrInputId} className="block text-xs font-semibold text-slate-300 mb-1">
                12-Digit UPI Ref / UTR Number <span className="text-blue-400">*</span>
              </label>
              <input
                id={utrInputId}
                type="text"
                required
                maxLength={16}
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                placeholder="e.g. 402819284912"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono tracking-wider focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={payerNameInputId} className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Full Name <span className="text-blue-400">*</span>
                </label>
                <input
                  id={payerNameInputId}
                  type="text"
                  required
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder="e.g. Amit Kumar"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor={payerPhoneInputId} className="block text-xs font-semibold text-slate-300 mb-1">
                  WhatsApp Mobile Number <span className="text-blue-400">*</span>
                </label>
                <input
                  id={payerPhoneInputId}
                  type="tel"
                  required
                  value={payerPhone}
                  onChange={(e) => setPayerPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Affiliate Platform
              </label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {settings.platforms.map((p) => (
                  <option key={p.id} value={p.name} className="bg-slate-900 text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveStep('pay')}
                className="px-4 py-2.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
              >
                Back to QR Code
              </button>
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Payment & Activate Campaign</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {activeStep === 'success' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-950">
              <Check className="w-8 h-8" />
            </div>

            <h4 className="text-xl font-bold text-white">Payment Submission Received!</h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Your payment for <strong>{planTitle}</strong> (₹{amount.toLocaleString('en-IN')}) has been recorded under Reference ID: <strong className="font-mono text-emerald-400">{receiptId}</strong>.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-left max-w-sm mx-auto space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Receipt:</span>
                <span className="text-white">{receiptId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>UTR Number:</span>
                <span className="text-white">{utrNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>UPI Payee:</span>
                <span className="text-white">{upiId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Platform:</span>
                <span className="text-white">{selectedPlatform}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2 max-w-sm mx-auto">
              <button
                type="button"
                onClick={() => {
                  const waReceiptMsg = `*PAYMENT SUBMITTED — TECHMAGNET ENROLLMENT GATEWAY*
----------------------------------------
🧾 *Receipt ID:* ${receiptId}
💰 *Amount Paid:* ₹${amount.toLocaleString('en-IN')}
📦 *Plan Selected:* ${planTitle}
🎯 *Affiliate Platform:* ${selectedPlatform}
👤 *Payer Name:* ${payerName || 'Not specified'}
📱 *Payer Mobile:* ${payerPhone || 'Not specified'}
🔢 *12-Digit UTR / Ref No:* ${utrNumber}
💳 *Paid to UPI:* ${upiId}
----------------------------------------
Please verify my payment and initiate campaign onboarding.`;
                  openWhatsApp(waReceiptMsg);
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Notify Support on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={closePaymentModal}
                className="text-xs text-slate-400 hover:text-white py-1.5 underline underline-offset-4"
              >
                Close Gateway
              </button>
            </div>
          </div>
        )}

        {/* Security & Regulatory footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>256-Bit SSL Encrypted Direct UPI</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>NPCI Regulated Indian UPI Rail</span>
          </div>
        </div>
      </div>
    </div>
  );
};
