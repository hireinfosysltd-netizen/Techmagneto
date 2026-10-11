import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import {
  X,
  Save,
  RotateCcw,
  DollarSign,
  Layers,
  Briefcase,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  LogOut,
  FileCheck,
  Smartphone,
  Check,
  AlertCircle,
  Sparkles,
  Upload,
  Globe,
  Code,
  ArrowUpRight,
  Copy,
  Terminal,
  RefreshCw,
  Radio,
  Play,
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { PricingPlan, PlatformItem, ServiceItem, AgencyContact, GstDetails, UpiGatewayDetails } from '../types';

const ADMIN_ACCESS_KEY = '214966';
const SESSION_AUTH_KEY = 'techmagnet_admin_session';

export const AdminModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    settings,
    updatePlans,
    updatePlatforms,
    updateServices,
    updateContact,
    updateGst,
    updateUpi,
    resetToDefaults,
    syncWithServer,
    serverSyncLogs,
  } = useAgency();

  const [activeTab, setActiveTab] = useState<'plans' | 'platforms' | 'services' | 'contact' | 'gst' | 'upi'>('upi');

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_AUTH_KEY) === 'authenticated';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Local draft state
  const [draftPlans, setDraftPlans] = useState<PricingPlan[]>(settings.plans);
  const [draftPlatforms, setDraftPlatforms] = useState<PlatformItem[]>(settings.platforms);
  const [draftServices, setDraftServices] = useState<ServiceItem[]>(settings.services);
  const [draftContact, setDraftContact] = useState<AgencyContact>(settings.contact);
  const [draftGst, setDraftGst] = useState<GstDetails>(settings.gst);
  const [draftUpi, setDraftUpi] = useState<UpiGatewayDetails>(settings.upi);
  const [saveNotification, setSaveNotification] = useState(false);
  const [upiSavedToast, setUpiSavedToast] = useState(false);
  const [previewQrUrl, setPreviewQrUrl] = useState<string>('');

  // Scanner upload and Webhook simulation state
  const [scannerStatus, setScannerStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'android' | 'flutter' | 'python'>('curl');
  const [simulating, setSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync draft states when modal opens
  useEffect(() => {
    if (isAdminModalOpen) {
      setDraftPlans(settings.plans);
      setDraftPlatforms(settings.platforms);
      setDraftServices(settings.services);
      setDraftContact(settings.contact);
      setDraftGst(settings.gst);
      setDraftUpi(settings.upi || {
        upiId: '',
        payeeName: 'TECHMAGNET',
        merchantCode: 'TECHMAGNET',
        acceptedApps: ['PhonePe', 'Google Pay', 'Paytm', 'BHIM', 'MobiKwik', 'CRED'],
      });
    }
  }, [isAdminModalOpen, settings]);

  // Generate live preview QR code for the draft UPI ID
  useEffect(() => {
    if (draftUpi?.upiId && draftUpi.upiId.includes('@')) {
      const uri = `upi://pay?pa=${encodeURIComponent(draftUpi.upiId)}&pn=${encodeURIComponent(
        draftUpi.payeeName || 'TECHMAGNET'
      )}&cu=INR&tn=TECHMAGNET-TEST`;
      QRCode.toDataURL(uri, {
        width: 160,
        margin: 1,
        color: { dark: '#050a18', light: '#ffffff' },
      })
        .then((url) => setPreviewQrUrl(url))
        .catch(() => setPreviewQrUrl(''));
    } else {
      setPreviewQrUrl('');
    }
  }, [draftUpi?.upiId, draftUpi?.payeeName]);

  // Decode QR code from uploaded scanner screenshot or photo
  const handleScannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScannerStatus({ type: 'idle', message: 'Analyzing scanner QR image...' });

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setScannerStatus({ type: 'error', message: 'Unable to initialize image processor.' });
          return;
        }
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          const raw = code.data.trim();
          let extractedId = '';
          let extractedPayee = '';

          if (raw.startsWith('upi://')) {
            try {
              const url = new URL(raw);
              extractedId = url.searchParams.get('pa') || '';
              const pn = url.searchParams.get('pn');
              if (pn) extractedPayee = decodeURIComponent(pn);
            } catch {
              const paMatch = raw.match(/[?&]pa=([^&]+)/);
              if (paMatch) extractedId = decodeURIComponent(paMatch[1]);
              const pnMatch = raw.match(/[?&]pn=([^&]+)/);
              if (pnMatch) extractedPayee = decodeURIComponent(pnMatch[1]);
            }
          } else if (raw.includes('@') && !raw.includes('://')) {
            extractedId = raw;
          }

          if (extractedId) {
            const updated: UpiGatewayDetails = {
              ...draftUpi,
              upiId: extractedId,
              payeeName: extractedPayee || draftUpi.payeeName,
              scannerImageUrl: dataUrl,
              syncSource: 'scanner_upload',
            };
            setDraftUpi(updated);
            updateUpi(updated);
            setScannerStatus({
              type: 'success',
              message: `Extracted UPI ID: "${extractedId}"! The website payment gateway has been updated immediately.`,
            });
          } else {
            // Might be a custom web payment link
            const updated: UpiGatewayDetails = {
              ...draftUpi,
              paymentLink: raw,
              scannerImageUrl: dataUrl,
              syncSource: 'scanner_upload',
            };
            setDraftUpi(updated);
            updateUpi(updated);
            setScannerStatus({
              type: 'success',
              message: `Extracted Payment Gateway URL: "${raw}"! Website payment gateway updated.`,
            });
          }
        } else {
          setScannerStatus({
            type: 'error',
            message: 'No readable QR code found in this image. Please upload a clear screenshot of the scanner QR.',
          });
        }
      };
      img.onerror = () => {
        setScannerStatus({ type: 'error', message: 'Failed to load image file.' });
      };
    };
    reader.readAsDataURL(file);
  };

  // Test simulation of incoming app upload
  const handleSimulateAppUpload = async (testId: string, testLink?: string) => {
    setSimulating(true);
    setSimulationLog(null);
    try {
      const res = await fetch('/api/upi/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_ACCESS_KEY}`,
        },
        body: JSON.stringify({
          upiId: testId,
          paymentLink: testLink || '',
          payeeName: 'TECHMAGNET',
          source: 'Simulated Mobile App',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDraftUpi((prev) => ({
          ...prev,
          upiId: testId,
          paymentLink: testLink !== undefined ? testLink : prev.paymentLink,
          lastSyncedAt: new Date().toISOString(),
          syncSource: 'app_webhook',
        }));
        await syncWithServer();
        setSimulationLog(`200 OK — Successfully synced "${testId}" from app! Website updated live.`);
      } else {
        setSimulationLog(`Error: ${data.error || 'Failed to sync'}`);
      }
    } catch (err: any) {
      setSimulationLog(`Network error: ${err.message}`);
    } finally {
      setSimulating(false);
    }
  };

  if (!isAdminModalOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_ACCESS_KEY) {
      setIsAuthenticated(true);
      setAuthError('');
      setPasswordInput('');
      try {
        sessionStorage.setItem(SESSION_AUTH_KEY, 'authenticated');
      } catch {
        // ignore
      }
    } else {
      setAuthError('Invalid password. Access denied.');
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setAuthError('');
    try {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
    } catch {
      // ignore
    }
  };

  const handleClose = () => {
    setAuthError('');
    setPasswordInput('');
    setIsAdminModalOpen(false);
  };

  const handleSaveAll = () => {
    updatePlans(draftPlans);
    updatePlatforms(draftPlatforms);
    updateServices(draftServices);
    updateContact(draftContact);
    updateGst(draftGst);
    updateUpi(draftUpi);
    setSaveNotification(true);
    setTimeout(() => {
      setSaveNotification(false);
      setIsAdminModalOpen(false);
    }, 800);
  };

  const handleReset = () => {
    if (window.confirm('Reset all pricing, platforms, and services back to original defaults?')) {
      resetToDefaults();
      setIsAdminModalOpen(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
        <div
          className="relative w-full max-w-md rounded-2xl bg-[#090f20] border border-blue-500/40 shadow-2xl text-slate-100 overflow-hidden p-6 sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Admin Authentication</h3>
                <p className="text-[11px] text-slate-400">Restricted agency management zone</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleUnlock} className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Please enter your authorized administrator security password to unlock live pricing and content controls.
            </p>

            {authError && (
              <div className="p-3 rounded-lg bg-red-950/70 border border-red-500/40 text-red-300 text-xs font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Enter administrator password"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-[#0d162d] border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all duration-200"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#090f20] border border-blue-500/40 shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-[#0d162d]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h3 className="text-xl font-bold text-white">Agency Content & Pricing Editor</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 ml-2">
                Authenticated
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize plan prices, platform titles, contact numbers, and service copy in real time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLock}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-medium border border-slate-700"
              title="Lock admin session"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span>Lock</span>
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-[#070b16] text-xs font-medium">
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all ${
              activeTab === 'plans'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Pricing & Plans</span>
          </button>
          <button
            onClick={() => setActiveTab('platforms')}
            className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all ${
              activeTab === 'platforms'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Platforms (100+)</span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all ${
              activeTab === 'services'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Services (6)</span>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all ${
              activeTab === 'contact'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Contact & WhatsApp</span>
          </button>
          <button
            onClick={() => setActiveTab('gst')}
            className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all ${
              activeTab === 'gst'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>GST & Verification</span>
          </button>
          <button
            onClick={() => setActiveTab('upi')}
            className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all ${
              activeTab === 'upi'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>UPI Gateway ({draftUpi.upiId})</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
          
          {/* Tab 1: Pricing Plans */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <p className="text-xs text-slate-400">
                Update prices and plan tags. The WhatsApp prefilled message will automatically update to match new prices.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draftPlans.map((plan, idx) => (
                  <div key={plan.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-base">{plan.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">ID: {plan.id}</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Display Price</label>
                      <input
                        type="text"
                        value={plan.price}
                        onChange={(e) => {
                          const updated = [...draftPlans];
                          updated[idx] = { ...updated[idx], price: e.target.value };
                          setDraftPlans(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0a1020] border border-slate-700 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={plan.tagline}
                        onChange={(e) => {
                          const updated = [...draftPlans];
                          updated[idx] = { ...updated[idx], tagline: e.target.value };
                          setDraftPlans(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0a1020] border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Platforms */}
          {activeTab === 'platforms' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Edit supported affiliate platforms and their enrollment campaign targets.
              </p>
              <div className="space-y-3">
                {draftPlatforms.map((plat, idx) => (
                  <div key={plat.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Platform Name</label>
                      <input
                        type="text"
                        value={plat.name}
                        onChange={(e) => {
                          const updated = [...draftPlatforms];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setDraftPlatforms(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded bg-[#0a1020] border border-slate-700 text-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Category</label>
                      <input
                        type="text"
                        value={plat.category}
                        onChange={(e) => {
                          const updated = [...draftPlatforms];
                          updated[idx] = { ...updated[idx], category: e.target.value };
                          setDraftPlatforms(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded bg-[#0a1020] border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Campaign Target</label>
                      <input
                        type="text"
                        value={plat.enrollmentFocus}
                        onChange={(e) => {
                          const updated = [...draftPlatforms];
                          updated[idx] = { ...updated[idx], enrollmentFocus: e.target.value };
                          setDraftPlatforms(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded bg-[#0a1020] border border-slate-700 text-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Services */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Edit titles and descriptions of the 6 core services.</p>
              <div className="space-y-3">
                {draftServices.map((svc, idx) => (
                  <div key={svc.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">Service {idx + 1}</span>
                    </div>
                    <input
                      type="text"
                      value={svc.title}
                      onChange={(e) => {
                        const updated = [...draftServices];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setDraftServices(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0a1020] border border-slate-700 text-white font-semibold"
                    />
                    <textarea
                      rows={2}
                      value={svc.description}
                      onChange={(e) => {
                        const updated = [...draftServices];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setDraftServices(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0a1020] border border-slate-700 text-white text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Contact */}
          {activeTab === 'contact' && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Office Telephone (Click-to-Call)
                  </label>
                  <input
                    type="text"
                    value={draftContact.officePhone}
                    onChange={(e) =>
                      setDraftContact({ ...draftContact, officePhone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp Number (e.g. 919023386997)
                  </label>
                  <input
                    type="text"
                    value={draftContact.whatsAppPhone}
                    onChange={(e) =>
                      setDraftContact({ ...draftContact, whatsAppPhone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="text"
                  value={draftContact.email}
                  onChange={(e) => setDraftContact({ ...draftContact, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Office Address</label>
                <input
                  type="text"
                  value={draftContact.address}
                  onChange={(e) => setDraftContact({ ...draftContact, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-slate-700 text-white"
                />
              </div>
            </div>
          )}

          {/* Tab 5: GST Details & Verification Link */}
          {activeTab === 'gst' && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <p className="text-xs text-slate-400">
                Configure your agency&apos;s verified Goods & Services Tax (GST) credentials and public verification link. Customers will be able to click on this link to view and verify your business details.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    GSTIN (15 Characters)
                  </label>
                  <input
                    type="text"
                    value={draftGst.gstin}
                    onChange={(e) => setDraftGst({ ...draftGst, gstin: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-slate-700 text-white font-mono uppercase tracking-wider"
                    placeholder="e.g. 09AAECT9842K1ZU"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Taxpayer Registration Status
                  </label>
                  <input
                    type="text"
                    value={draftGst.status}
                    onChange={(e) => setDraftGst({ ...draftGst, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-slate-700 text-white"
                    placeholder="e.g. Active (Regular Taxpayer)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Legal Registered Entity Name
                  </label>
                  <input
                    type="text"
                    value={draftGst.legalName}
                    onChange={(e) => setDraftGst({ ...draftGst, legalName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Trade / Agency Name
                  </label>
                  <input
                    type="text"
                    value={draftGst.tradeName}
                    onChange={(e) => setDraftGst({ ...draftGst, tradeName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    State & Code
                  </label>
                  <input
                    type="text"
                    value={draftGst.state}
                    onChange={(e) => setDraftGst({ ...draftGst, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-slate-700 text-white"
                    placeholder="e.g. Uttar Pradesh (09)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Verification Source Name
                  </label>
                  <input
                    type="text"
                    value={draftGst.source}
                    onChange={(e) => setDraftGst({ ...draftGst, source: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-slate-700 text-white font-mono"
                    placeholder="e.g. KnowYourGST"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Public GST Verification Link (Customers Click to View)
                </label>
                <input
                  type="url"
                  value={draftGst.verificationUrl}
                  onChange={(e) => setDraftGst({ ...draftGst, verificationUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0a1020] border border-slate-700 text-white font-mono text-xs"
                  placeholder="https://knowyourgst.com/gst-number-search/?source=KnowYourGST"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Customers clicking &quot;View GST Details&quot; will be able to open this link to verify official taxpayer records.
                </p>
              </div>
            </div>
          )}

          {/* Tab 6: UPI Payment Gateway & Scanner Auto-Upload Settings */}
          {activeTab === 'upi' && (
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>UPI & Website Payment Gateway Configuration</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage direct UPI payments, website payment links, and automatic scanner uploads from your mobile app.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateUpi(draftUpi);
                      setUpiSavedToast(true);
                      setTimeout(() => setUpiSavedToast(false), 2500);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/40 transition-all self-start sm:self-auto shrink-0"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{upiSavedToast ? 'Settings Saved!' : 'Save Payment Settings'}</span>
                  </button>
                </div>
              </div>

              {upiSavedToast && (
                <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Payment configuration successfully saved! {draftUpi.upiId ? `UPI ID "${draftUpi.upiId}" is active across the entire website.` : 'UPI is now unconfigured.'}
                  </span>
                </div>
              )}

              {/* Status Alert Banner */}
              {!draftUpi.upiId ? (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">No UPI ID is currently set</p>
                    <p className="text-[11px] text-amber-300/80 mt-0.5">
                      Enter your UPI ID below or upload a QR scanner screenshot, then click <strong>&quot;Save Payment Settings&quot;</strong> to activate UPI payments across the website.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Active UPI ID: <strong className="font-mono text-white">{draftUpi.upiId}</strong> ({draftUpi.payeeName || 'TECHMAGNET'})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraftUpi({ ...draftUpi, upiId: '' })}
                    className="text-[11px] text-red-400 hover:text-red-300 font-medium underline transition-colors"
                  >
                    Clear UPI ID
                  </button>
                </div>
              )}

              {/* Main Inputs & Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-4">
                  {/* Primary UPI ID & Business Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Primary UPI ID (VPA)
                      </label>
                      <input
                        type="text"
                        value={draftUpi.upiId}
                        onChange={(e) => setDraftUpi({ ...draftUpi, upiId: e.target.value.trim() })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0a1020] border border-slate-700 text-white font-mono font-bold text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="Enter UPI ID (e.g. merchant@okaxis, yourname@upi)"
                      />
                      <div className="flex items-center justify-between text-[11px] mt-1.5">
                        <span className="text-slate-400">Current active ID:</span>
                        {draftUpi.upiId ? (
                          <span className="text-emerald-400 font-mono font-semibold">{draftUpi.upiId}</span>
                        ) : (
                          <span className="text-amber-400 font-semibold">Not Set</span>
                        )}
                      </div>
                      {draftUpi.upiId && !draftUpi.upiId.includes('@') && (
                        <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>A valid UPI ID must include &apos;@&apos; (e.g. merchant@okhdfcbank)</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Payee / Merchant Business Name
                      </label>
                      <input
                        type="text"
                        value={draftUpi.payeeName}
                        onChange={(e) => setDraftUpi({ ...draftUpi, payeeName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0a1020] border border-slate-700 text-white font-medium text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="e.g. TECHMAGNET"
                      />
                      <p className="text-[11px] text-slate-500 mt-1.5">
                        Shown to customers in PhonePe, GPay, Paytm during transfer.
                      </p>
                    </div>
                  </div>

                  {/* Website Payment Gateway Link (NEW) */}
                  <div className="p-3.5 rounded-xl bg-[#0a1020] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        <span>Website Payment Gateway Link (Optional)</span>
                      </label>
                      {draftUpi.paymentLink && (
                        <a
                          href={draftUpi.paymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
                        >
                          <span>Test Link</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <input
                      type="url"
                      value={draftUpi.paymentLink || ''}
                      onChange={(e) => setDraftUpi({ ...draftUpi, paymentLink: e.target.value.trim() })}
                      className="w-full px-3 py-2 rounded-lg bg-[#070b16] border border-slate-700 text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                      placeholder="e.g. https://razorpay.me/@techmagnet, https://phonepe.com/..., or custom gateway link"
                    />
                    <p className="text-[11px] text-slate-400">
                      If provided, customers clicking &quot;Pay&quot; will see an &quot;Open Payment Gateway&quot; button directly opening this payment URL alongside the QR scanner.
                    </p>
                  </div>

                  {/* QR Scanner Image Upload & Decoder */}
                  <div className="p-3.5 rounded-xl bg-[#0a1020] border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Upload Scanner Image / QR Screenshot</span>
                      </span>
                      <span className="text-[10px] text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
                        Auto QR Decoder
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Upload a photo or screenshot of your UPI scanner QR code. The system will automatically decode the image, extract the UPI ID, and update this website immediately.
                    </p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 text-xs font-semibold transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Select Scanner Image / Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScannerUpload}
                          className="hidden"
                        />
                      </label>
                      {scannerStatus.message && (
                        <div
                          className={`text-xs p-2 rounded-lg flex items-center gap-2 flex-1 ${
                            scannerStatus.type === 'success'
                              ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-medium'
                              : scannerStatus.type === 'error'
                              ? 'bg-red-950/80 border border-red-500/40 text-red-300'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {scannerStatus.type === 'success' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : scannerStatus.type === 'error' ? (
                            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          ) : (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                          )}
                          <span className="line-clamp-2">{scannerStatus.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Live QR Preview Box */}
                <div className="p-4 rounded-xl bg-[#070b16] border border-slate-800 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Live QR Preview
                  </span>
                  {previewQrUrl ? (
                    <div className="p-2 bg-white rounded-lg shadow-md mb-2">
                      <img
                        src={previewQrUrl}
                        alt="UPI QR Preview"
                        className="w-36 h-36 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-36 h-36 bg-slate-800/70 rounded-lg flex flex-col items-center justify-center text-slate-400 text-xs mb-2 border border-slate-700/60 p-2 text-center">
                      <Smartphone className="w-6 h-6 text-slate-500 mb-1" />
                      <span>{draftUpi.upiId ? 'Generating QR...' : 'No UPI ID set'}</span>
                    </div>
                  )}
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    {draftUpi.upiId || 'No UPI ID Configured'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    {draftUpi.payeeName || 'TECHMAGNET'}
                  </span>
                  {draftUpi.paymentLink && (
                    <span className="text-[10px] text-blue-400 mt-1 truncate max-w-[180px]">
                      🔗 Gateway Link Attached
                    </span>
                  )}
                  {draftUpi.lastSyncedAt && (
                    <span className="text-[9px] text-slate-400 mt-2">
                      Last synced: {new Date(draftUpi.lastSyncedAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>

              {/* AUTOMATIC EXTERNAL APP INTEGRATION (Answers: "I have an app... can it upload automatically?") */}
              <div className="p-4 rounded-xl bg-[#060a15] border border-blue-500/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-600/30 text-blue-400 flex items-center justify-center">
                      <Radio className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                        ⚡ External App Auto-Sync Webhook API
                      </h5>
                      <p className="text-[11px] text-slate-400">
                        When your mobile app uploads or changes a scanner, your app can call this API to automatically update this website in real time.
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold self-start sm:self-auto">
                    API LIVE & ACTIVE
                  </span>
                </div>

                {/* Webhook Endpoint Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#0a1020] border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Webhook POST URL
                    </span>
                    <code className="text-blue-300 font-mono text-[11px] break-all select-all">
                      {typeof window !== 'undefined' ? `${window.location.origin}/api/upi/sync` : '/api/upi/sync'}
                    </code>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0a1020] border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      API Authorization Key (Secret)
                    </span>
                    <code className="text-emerald-400 font-mono text-[11px] select-all">
                      Bearer {ADMIN_ACCESS_KEY}
                    </code>
                  </div>
                </div>

                {/* Code Snippets for Developers */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                      <Terminal className="w-3.5 h-3.5 text-blue-400" />
                      <span>App Code Snippet:</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {(['curl', 'android', 'flutter', 'python'] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveCodeTab(tab)}
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider transition-all ${
                            activeCodeTab === tab
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative p-3 rounded-lg bg-black/70 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                    <pre className="whitespace-pre">
                      {activeCodeTab === 'curl' &&
                        `curl -X POST "${typeof window !== 'undefined' ? window.location.origin : 'https://techmagnet.in'}/api/upi/sync" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer 214966" \\
  -d '{
    "upiId": "${draftUpi.upiId || 'yourname@upi'}",
    "paymentLink": "https://your-payment-link.com",
    "payeeName": "TECHMAGNET",
    "source": "My Scanner App"
  }'`}

                      {activeCodeTab === 'android' &&
                        `// Android (Kotlin / OkHttp)
val client = OkHttpClient()
val json = JSONObject().apply {
    put("upiId", scannedUpiId)
    put("paymentLink", scannedPaymentLink)
    put("payeeName", "TECHMAGNET")
    put("source", "Android Scanner App")
}
val body = json.toString().toRequestBody("application/json".toMediaType())
val request = Request.Builder()
    .url("${typeof window !== 'undefined' ? window.location.origin : 'https://techmagnet.in'}/api/upi/sync")
    .addHeader("Authorization", "Bearer 214966")
    .post(body)
    .build()
client.newCall(request).enqueue(callback)`}

                      {activeCodeTab === 'flutter' &&
                        `// Flutter / Dart
final response = await http.post(
  Uri.parse('${typeof window !== 'undefined' ? window.location.origin : 'https://techmagnet.in'}/api/upi/sync'),
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 214966',
  },
  body: jsonEncode({
    'upiId': scannedUpiId,
    'paymentLink': paymentUrl,
    'payeeName': 'TECHMAGNET',
    'source': 'Flutter Scanner App',
  }),
);`}

                      {activeCodeTab === 'python' &&
                        `# Python Requests
import requests

payload = {
    "upiId": "${draftUpi.upiId || 'yourname@upi'}",
    "paymentLink": "https://your-payment-link.com",
    "payeeName": "TECHMAGNET",
    "source": "Python Automation"
}
headers = {
    "Authorization": "Bearer 214966",
    "Content-Type": "application/json"
}
r = requests.post("${typeof window !== 'undefined' ? window.location.origin : 'https://techmagnet.in'}/api/upi/sync", json=payload, headers=headers)
print(r.json())`}
                    </pre>

                    <button
                      type="button"
                      onClick={() => {
                        const targetId = draftUpi.upiId || 'yourname@upi';
                        const snippet =
                          activeCodeTab === 'curl'
                            ? `curl -X POST "${typeof window !== 'undefined' ? window.location.origin : 'https://techmagnet.in'}/api/upi/sync" -H "Content-Type: application/json" -H "Authorization: Bearer 214966" -d '{"upiId":"${targetId}","payeeName":"TECHMAGNET"}'`
                            : activeCodeTab === 'android'
                            ? `// Android OkHttp POST to ${typeof window !== 'undefined' ? window.location.origin : 'https://techmagnet.in'}/api/upi/sync`
                            : `// Flutter HTTP POST to ${typeof window !== 'undefined' ? window.location.origin : 'https://techmagnet.in'}/api/upi/sync`;
                        navigator.clipboard.writeText(snippet);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Live App Upload Simulator */}
                <div className="p-3.5 rounded-lg bg-[#0a1020] border border-blue-500/20 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Test Live App Upload Simulator</span>
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Click below to test sending a simulated mobile app scanner upload to the website right now.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={simulating}
                        onClick={() => handleSimulateAppUpload(draftUpi.upiId || 'techmagnet@okaxis')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/40 text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        {simulating ? 'Sending...' : 'Test Sync: App to Website'}
                      </button>
                    </div>
                  </div>

                  {simulationLog && (
                    <div className="text-xs p-2 rounded bg-black/60 border border-emerald-500/40 text-emerald-300 font-mono flex items-center gap-1.5 animate-fade-in">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{simulationLog}</span>
                    </div>
                  )}
                </div>

                {/* Recent Sync Activity Log */}
                {serverSyncLogs && serverSyncLogs.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Recent Sync Events from App ({serverSyncLogs.length})
                    </span>
                    <div className="max-h-28 overflow-y-auto space-y-1 text-[11px] font-mono">
                      {serverSyncLogs.slice(-4).reverse().map((log) => (
                        <div
                          key={log.id}
                          className="p-1.5 rounded bg-black/40 border border-slate-800 text-slate-400 flex items-center justify-between"
                        >
                          <span className="text-slate-300">
                            {log.source}: <strong className="text-emerald-300">{log.upiId}</strong>
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-800 bg-[#0d162d] flex items-center justify-between">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset to Factory Defaults</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saveNotification ? 'Saved Successfully!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
