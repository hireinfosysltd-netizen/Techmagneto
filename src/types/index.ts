export interface PlatformItem {
  id: string;
  name: string;
  category: string;
  description: string;
  popular: boolean;
  enrollmentFocus: string;
  badge?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  icon: string;
}

export interface PricingPlan {
  id: 'starter' | 'growth' | 'premium' | 'enterprise';
  name: string;
  price: string;
  rawPrice: number | null;
  period?: string;
  tagline: string;
  isPopular?: boolean;
  features: string[];
  waMessage: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  platform: string;
  quote: string;
  result: string;
  avatarSeed: string;
  verified: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export interface AgencyContact {
  officePhone: string;
  whatsAppPhone: string;
  email: string;
  address: string;
  operatingHours: string;
}

export interface GstDetails {
  gstin: string;
  legalName: string;
  tradeName: string;
  status: string;
  stateCode: string;
  state: string;
  taxpayerType: string;
  verificationUrl: string;
  source: string;
}

export interface UpiGatewayDetails {
  upiId: string;
  payeeName: string;
  merchantCode?: string;
  acceptedApps: string[];
  paymentLink?: string;
  scannerImageUrl?: string;
  lastSyncedAt?: string;
  syncSource?: 'manual' | 'app_webhook' | 'scanner_upload';
}

export interface SiteSettings {
  contact: AgencyContact;
  plans: PricingPlan[];
  platforms: PlatformItem[];
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  gst: GstDetails;
  upi: UpiGatewayDetails;
}
