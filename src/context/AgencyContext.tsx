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

  // Function to pull latest UPI & payment link settings from backend server
  const syncWithServer = async () => {
    try {
      const res = await fetch('/api/upi');
      if (res.ok) {
        const data = await res.json();
        if (data.upi) {
          setSettings((prev) => {
            const serverUpiId = data.upi.upiId || '';
            const serverPaymentLink = data.upi.paymentLink || '';
            const serverPayeeName = data.upi.payeeName || 'TECHMAGNET';
            const hasChanged =
              prev.upi.upiId !== serverUpiId ||
              prev.upi.paymentLink !== serverPaymentLink ||
              prev.upi.payeeName !== serverPayeeName ||
              prev.upi.lastSyncedAt !== data.upi.lastSyncedAt;
            if (hasChanged) {
              return {
                ...prev,
                upi: {
                  ...prev.upi,
                  ...data.upi,
                  upiId: serverUpiId,
                  paymentLink: serverPaymentLink,
                  payeeName: serverPayeeName,
                },
              };
            }
            return prev;
          });
        }
        if (data.syncLogs && Array.isArray(data.syncLogs)) {
          setServerSyncLogs(data.syncLogs);
        }
      }
    } catch {
      // offline / client-only fallback
    }
  };

  // Initial fetch and light periodic polling (every 8s) to detect incoming app scanner uploads
  useEffect(() => {
    syncWithServer();
    const interval = setInterval(syncWithServer, 8000);
    return () => clearInterval(interval);
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
    setSettings((prev) => ({ ...prev, upi }));
    // Also push to backend server
    fetch('/api/upi/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        upiId: upi.upiId,
        payeeName: upi.payeeName,
        paymentLink: upi.paymentLink,
        scannerImageUrl: upi.scannerImageUrl,
        source: upi.syncSource || 'Admin Panel Manual',
      }),
    })
      .then((res) => res.json())
      .then(() => syncWithServer())
      .catch((err) => console.warn('Could not sync to backend:', err));
  };

  const openPaymentModal = (plan?: PricingPlan | null, customAmount?: number | null) => {
    setSelectedPaymentPlan(plan || null);
    setCustomPaymentAmount(customAmount || null);
    setIsPaymentModalOpen(true);
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
