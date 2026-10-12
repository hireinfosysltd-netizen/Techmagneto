import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings, PricingPlan, PlatformItem, ServiceItem, TestimonialItem, AgencyContact, GstDetails, UpiGatewayDetails } from '../types';
import {
  DEFAULT_CONTACT,
  DEFAULT_PLANS,
  DEFAULT_PLATFORMS,
  DEFAULT_SERVICES,
  DEFAULT_TESTIMONIALS,
  DEFAULT_GST,
  DEFAULT_UPI,
} from '../data/defaultData';

interface AgencyContextType {
  settings: SiteSettings;
  updateContact: (contact: AgencyContact) => void;
  updatePlans: (plans: PricingPlan[]) => void;
  updatePlatforms: (platforms: PlatformItem[]) => void;
  updateServices: (services: ServiceItem[]) => void;
  updateTestimonials: (testimonials: TestimonialItem[]) => void;
  updateGst: (gst: GstDetails) => void;
  updateUpi: (upi: UpiGatewayDetails) => void;
  resetToDefaults: () => void;
  openWhatsApp: (customMessage?: string) => void;
  getWhatsAppUrl: (customMessage?: string) => string;
  activeLegalModal: 'privacy' | 'terms' | 'refund' | null;
  openLegalModal: (type: 'privacy' | 'terms' | 'refund') => void;
  closeLegalModal: () => void;
  isGstModalOpen: boolean;
  setIsGstModalOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  selectedPaymentPlan: PricingPlan | null;
  customPaymentAmount: number | null;
  openPaymentModal: (plan?: PricingPlan | null, customAmount?: number | null) => void;
  closePaymentModal: () => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  theme: 'navy' | 'midnight';
  toggleTheme: () => void;
  setTheme: (theme: 'navy' | 'midnight') => void;
  syncWithServer: () => Promise<void>;
  serverSyncLogs: Array<{ id: string; timestamp: string; upiId: string; paymentLink?: string; source: string; success: boolean }>;
}

const STORAGE_KEY = 'techmagnet_site_settings_v1';
const THEME_STORAGE_KEY = 'techmagnet_theme_mode';

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

export const AgencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.gst) {
          parsed.gst = DEFAULT_GST;
        }
        if (!parsed.upi) {
          parsed.upi = DEFAULT_UPI;
        } else if (parsed.upi.upiId === '7878570874@mbk') {
          // Clear any legacy default placeholder
          parsed.upi.upiId = '';
        }
        if (parsed.plans && Array.isArray(parsed.plans)) {
          parsed.plans = parsed.plans.map((p: any) => {
            if (p.id === 'starter' && (p.rawPrice === 2999 || p.price === '₹2,999')) {
              return {
                ...p,
                price: '₹2,000',
                rawPrice: 2000,
                waMessage: 'Hi Techmagnet, I am interested in the Starter Plan (₹2,000). Please share the enrollment details.',
              };
            }
            return p;
          });
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return {
      contact: DEFAULT_CONTACT,
      plans: DEFAULT_PLANS,
      platforms: DEFAULT_PLATFORMS,
      services: DEFAULT_SERVICES,
      testimonials: DEFAULT_TESTIMONIALS,
      gst: DEFAULT_GST,
      upi: DEFAULT_UPI,
    };
  });

  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'refund' | null>(null);
  const [isGstModalOpen, setIsGstModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<PricingPlan | null>(null);
  const [customPaymentAmount, setCustomPaymentAmount] = useState<number | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const [theme, setThemeState] = useState<'navy' | 'midnight'>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'midnight' || savedTheme === 'navy') {
        return savedTheme;
      }
    } catch {
      // ignore
    }
    return 'navy';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // storage unavailable
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // storage unavailable
    }
    // Update HTML root element
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'midnight') {
      document.documentElement.classList.add('theme-midnight');
      document.documentElement.classList.remove('theme-navy');
    } else {
      document.documentElement.classList.add('theme-navy');
      document.documentElement.classList.remove('theme-midnight');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'navy' ? 'midnight' : 'navy'));
  };

  const setTheme = (newTheme: 'navy' | 'midnight') => {
    setThemeState(newTheme);
  };

  const [serverSyncLogs, setServerSyncLogs] = useState<
    Array<{ id: string; timestamp: string; upiId: string; paymentLink?: string; source: string; success: boolean }>
  >([]);

  // Robust updater for server-provided UPI configuration
  const applyServerUpi = (serverUpi: Partial<UpiGatewayDetails>) => {
    if (!serverUpi) return;
    setSettings((prev) => {
      const upiId = serverUpi.upiId !== undefined ? String(serverUpi.upiId).trim() : (prev.upi?.upiId || '');
      const payeeName = serverUpi.payeeName || prev.upi?.payeeName || 'TECHMAGNET';
      const paymentLink = serverUpi.paymentLink !== undefined ? String(serverUpi.paymentLink).trim() : (prev.upi?.paymentLink || '');
      const scannerImageUrl = serverUpi.scannerImageUrl !== undefined ? String(serverUpi.scannerImageUrl) : (prev.upi?.scannerImageUrl || '');
      const merchantCode = serverUpi.merchantCode || prev.upi?.merchantCode || 'TECHMAGNET';
      const acceptedApps = serverUpi.acceptedApps || prev.upi?.acceptedApps || DEFAULT_UPI.acceptedApps;
      const lastSyncedAt = serverUpi.lastSyncedAt || new Date().toISOString();
      const syncSource = serverUpi.syncSource || prev.upi?.syncSource || 'manual';

      return {
        ...prev,
        upi: {
          upiId,
          payeeName,
          paymentLink,
          scannerImageUrl,
          merchantCode,
          acceptedApps,
          lastSyncedAt,
          syncSource,
        },
      };
    });
  };

  // Function to pull latest UPI & payment link settings from backend server
  const syncWithServer = async () => {
    try {
      const res = await fetch(`/api/upi?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache, no-store',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.upi) {
          applyServerUpi(data.upi);
        }
        if (data.syncLogs && Array.isArray(data.syncLogs)) {
          setServerSyncLogs(data.syncLogs);
        }
      }
    } catch {
      // offline / client-only fallback
    }
  };

  // Initial fetch, real-time SSE stream, and short polling for instant visitor sync
  useEffect(() => {
    syncWithServer();

    // Connect to Server-Sent Events stream for instant real-time pushes
    let sse: EventSource | null = null;
    try {
      sse = new EventSource('/api/upi/stream');
      sse.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.type === 'upi_update' && data.upi) {
            applyServerUpi(data.upi);
            if (data.syncLogs) {
              setServerSyncLogs(data.syncLogs);
            }
          }
        } catch {
          // ignore non-json ping
        }
      };
    } catch {
      // SSE unsupported or blocked
    }

    // Fallback polling every 3 seconds to guarantee sync across all visitors
    const interval = setInterval(syncWithServer, 3000);

    return () => {
      clearInterval(interval);
      if (sse) {
        sse.close();
      }
    };
  }, []);

  const updateContact = (contact: AgencyContact) => {
    setSettings((prev) => ({ ...prev, contact }));
  };

  const updatePlans = (plans: PricingPlan[]) => {
    setSettings((prev) => ({ ...prev, plans }));
  };

  const updatePlatforms = (platforms: PlatformItem[]) => {
    setSettings((prev) => ({ ...prev, platforms }));
  };

  const updateServices = (services: ServiceItem[]) => {
    setSettings((prev) => ({ ...prev, services }));
  };

  const updateTestimonials = (testimonials: TestimonialItem[]) => {
    setSettings((prev) => ({ ...prev, testimonials }));
  };

  const updateGst = (gst: GstDetails) => {
    setSettings((prev) => ({ ...prev, gst }));
  };

  const updateUpi = (upi: UpiGatewayDetails) => {
    applyServerUpi(upi);

    // Also push to backend server with immediate broadcast to all visitors
    fetch('/api/upi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 214966',
      },
      body: JSON.stringify({
        upiId: upi.upiId,
        payeeName: upi.payeeName,
        paymentLink: upi.paymentLink,
        scannerImageUrl: upi.scannerImageUrl,
        merchantCode: upi.merchantCode,
        acceptedApps: upi.acceptedApps,
        source: upi.syncSource || 'Admin Panel Manual',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.upi) {
          applyServerUpi(data.upi);
        }
      })
      .catch((err) => console.warn('Could not sync to backend:', err));
  };

  const openPaymentModal = (plan?: PricingPlan | null, customAmount?: number | null) => {
    setSelectedPaymentPlan(plan || null);
    setCustomPaymentAmount(customAmount || null);
    setIsPaymentModalOpen(true);
    // Instant server refresh on modal open
    syncWithServer();
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedPaymentPlan(null);
    setCustomPaymentAmount(null);
  };

  const resetToDefaults = () => {
    const defaults: SiteSettings = {
      contact: DEFAULT_CONTACT,
      plans: DEFAULT_PLANS,
      platforms: DEFAULT_PLATFORMS,
      services: DEFAULT_SERVICES,
      testimonials: DEFAULT_TESTIMONIALS,
      gst: DEFAULT_GST,
      upi: DEFAULT_UPI,
    };
    setSettings(defaults);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getWhatsAppUrl = (customMessage?: string) => {
    const num = settings.contact.whatsAppPhone.replace(/\D/g, '') || '919023386997';
    const text = customMessage || 'Hi Techmagnet, I want to learn more about your affiliate enrollment services.';
    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  };

  const openWhatsApp = (customMessage?: string) => {
    const url = getWhatsAppUrl(customMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openLegalModal = (type: 'privacy' | 'terms' | 'refund') => {
    setActiveLegalModal(type);
  };

  const closeLegalModal = () => {
    setActiveLegalModal(null);
  };

  return (
    <AgencyContext.Provider
      value={{
        settings,
        updateContact,
        updatePlans,
        updatePlatforms,
        updateServices,
        updateTestimonials,
        updateGst,
        updateUpi,
        resetToDefaults,
        openWhatsApp,
        getWhatsAppUrl,
        activeLegalModal,
        openLegalModal,
        closeLegalModal,
        isGstModalOpen,
        setIsGstModalOpen,
        isPaymentModalOpen,
        selectedPaymentPlan,
        customPaymentAmount,
        openPaymentModal,
        closePaymentModal,
        isAdminModalOpen,
        setIsAdminModalOpen,
        theme,
        toggleTheme,
        setTheme,
        syncWithServer,
        serverSyncLogs,
      }}
    >
      {children}
    </AgencyContext.Provider>
  );
};

export const useAgency = () => {
  const context = useContext(AgencyContext);
  if (!context) {
    throw new Error('useAgency must be used within an AgencyProvider');
  }
  return context;
};
