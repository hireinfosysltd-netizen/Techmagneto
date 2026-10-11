import { SiteSettings, GstDetails, UpiGatewayDetails } from '../types';

export const DEFAULT_CONTACT = {
  officePhone: '+91 8400763142',
  whatsAppPhone: '919023386997',
  email: 'growth@techmagnet.in',
  address: 'Commercial Hub, Sector 62, Noida, Uttar Pradesh, India',
  operatingHours: 'Mon - Sat: 9:30 AM - 8:00 PM IST',
};

export const DEFAULT_GST: GstDetails = {
  gstin: '09AAECT9842K1ZU',
  legalName: 'TECHMAGNET DIGITAL MARKETING & ENROLLMENT SERVICES',
  tradeName: 'TECHMAGNET',
  status: 'Active (Regular Taxpayer)',
  stateCode: '09',
  state: 'Uttar Pradesh',
  taxpayerType: 'Commercial Growth & Performance Marketing Agency',
  verificationUrl: 'https://knowyourgst.com/gst-number-search/?source=KnowYourGST',
  source: 'KnowYourGST',
};

export const DEFAULT_UPI: UpiGatewayDetails = {
  upiId: '',
  payeeName: 'TECHMAGNET',
  paymentLink: '',
  merchantCode: 'TECHMAGNET',
  acceptedApps: ['PhonePe', 'Google Pay', 'Paytm', 'BHIM', 'MobiKwik', 'CRED'],
  syncSource: 'manual',
};

export const DEFAULT_PLANS = [
  {
    id: 'starter' as const,
    name: 'Starter Plan',
    price: '₹2,999',
    rawPrice: 2999,
    tagline: 'Ideal for emerging affiliates testing performance campaigns',
    isPopular: false,
    features: [
      'Enrollment campaign consultation',
      'Single-platform targeting',
      'Basic marketing support',
      'WhatsApp assistance',
      'Campaign reporting',
    ],
    waMessage: 'Hi Techmagnet, I am interested in the Starter Plan (₹2,999). Please share the enrollment details.',
  },
  {
    id: 'growth' as const,
    name: 'Growth Plan',
    price: '₹5,999',
    rawPrice: 5999,
    tagline: 'Our flagship accelerator for serious affiliate business builders',
    isPopular: true,
    features: [
      'Advanced campaign planning',
      'Up to 3 supported platforms',
      'Audience targeting assistance',
      'Priority WhatsApp support',
      'Performance reporting',
    ],
    waMessage: 'Hi Techmagnet, I am interested in the Growth Plan (₹5,999). Please share the enrollment details.',
  },
  {
    id: 'premium' as const,
    name: 'Premium Plan',
    price: '₹9,999',
    rawPrice: 9999,
    tagline: 'Multi-platform omnichannel power for top-tier affiliate leaders',
    isPopular: false,
    features: [
      'Customized enrollment strategy',
      'Multi-platform campaign support',
      'Dedicated campaign assistance',
      'Priority consultation',
      'Detailed performance reporting',
    ],
    waMessage: 'Hi Techmagnet, I am interested in the Premium Plan (₹9,999). Please share the enrollment details.',
  },
  {
    id: 'enterprise' as const,
    name: 'Enterprise Plan',
    price: 'Custom',
    rawPrice: null,
    tagline: 'Bespoke high-volume solutions for affiliate agency teams and top creators',
    isPopular: false,
    features: [
      'Dedicated account strategist',
      'Unlimited supported platforms',
      'Custom high-converting funnels',
      'Direct WhatsApp group with senior leads',
      'Real-time analytics dashboard & audit',
    ],
    waMessage: 'Hi Techmagnet, I need a customized affiliate enrollment package. Please contact me.',
  },
];

export const DEFAULT_PLATFORMS = [
  {
    id: 'idp',
    name: 'IDP',
    category: 'Education & Study Abroad',
    description: 'High-intent prospects seeking overseas education and international test prep enrollments.',
    popular: true,
    enrollmentFocus: 'Study abroad admissions & test coaching',
  },
  {
    id: 'bizzgurukull',
    name: 'Bizzgurukull',
    category: 'EdTech & Digital Skills',
    description: 'Youth and career changers eager for certified digital freelancing & marketing bundles.',
    popular: true,
    enrollmentFocus: 'Skill bundles, mentorship & career tracks',
  },
  {
    id: 'leadguru',
    name: 'LeadGuru',
    category: 'Lead Gen & Affiliate Mastery',
    description: 'Aspiring entrepreneurs seeking lead generation training and online earning tools.',
    popular: true,
    enrollmentFocus: 'Organic traffic mastery & business packages',
  },
  {
    id: 'skillpaisa',
    name: 'SkillPaisa',
    category: 'Skill Monetization',
    description: 'Self-learners focused on high-income digital trades, video editing, and dropshipping.',
    popular: true,
    enrollmentFocus: 'Practical monetization courses & toolkits',
  },
  {
    id: 'skillmize',
    name: 'SkillMize',
    category: 'Vocational & Modern Skills',
    description: 'Job seekers & college students looking for practical skill validation and certificates.',
    popular: true,
    enrollmentFocus: 'Career accelerators & verified credentials',
  },
  {
    id: 'millionaire-track',
    name: 'Millionaire Track',
    category: 'Affiliate Marketing Community',
    description: 'Active learners seeking community-driven affiliate education and e-learning bundles.',
    popular: false,
    enrollmentFocus: 'E-learning packages & affiliate modules',
  },
  {
    id: 'richind',
    name: 'Richind',
    category: 'Digital Entrepreneurship',
    description: 'Creators and tier-2/3 city youth seeking modern digital entrepreneurship skills.',
    popular: false,
    enrollmentFocus: 'Digital agency & creator mastery tracks',
  },
  {
    id: 'gyan-kamao',
    name: 'Gyan Kamao',
    category: 'Online Skill Academy',
    description: 'Students looking to build financial literacy and monetizable freelancing portfolios.',
    popular: false,
    enrollmentFocus: 'Financial and tech skill certifications',
  },
  {
    id: 'other-platforms',
    name: '100+ Other Affiliate Networks',
    category: 'Multi-Niche Platforms',
    description: 'Any licensed Indian or international affiliate program tailored to your unique link.',
    popular: true,
    enrollmentFocus: 'Customized funnel & niche targeting',
    badge: 'Universal Support',
  },
];

export const DEFAULT_SERVICES = [
  {
    id: 's1',
    title: 'Affiliate Enrollment Generation',
    description:
      'Engineered campaigns that direct qualified, primed learners into your affiliate referral pipeline with high conversion velocity.',
    deliverables: [
      'Platform-specific messaging',
      'Targeted demographic mapping',
      'Click-to-chat WhatsApp funnel routing',
      'Real-time enrollment tracking',
    ],
    icon: 'UserCheck',
  },
  {
    id: 's2',
    title: 'Qualified Lead Generation',
    description:
      'We filter out casual tire-kickers to deliver warm, pre-vetted leads who have budget and genuine interest in the educational program.',
    deliverables: [
      'Income & interest qualification gates',
      'Localized geo-targeting across India',
      'High-intent search & social inquiry setup',
      'Zero bot traffic guarantee mechanism',
    ],
    icon: 'Target',
  },
  {
    id: 's3',
    title: 'Conversion-Focused Marketing Campaigns',
    description:
      'Full-funnel paid and organic promotion designed to overcome customer hesitation and accelerate direct course enrollments.',
    deliverables: [
      'Persuasive ad copy & creative angles',
      'A/B tested campaign architectures',
      'Objection-handling funnel frameworks',
      'Daily ROAS & cost-per-lead optimization',
    ],
    icon: 'TrendingUp',
  },
  {
    id: 's4',
    title: 'Affiliate Growth Consultation',
    description:
      '1-on-1 strategy sessions with seasoned performance marketers to audit your closing scripts, follow-up cadence, and retention.',
    deliverables: [
      'Closing script review & refinement',
      'WhatsApp follow-up automated flows',
      'Tier advancement strategic roadmap',
      'Audience segmentation advisory',
    ],
    icon: 'Compass',
  },
  {
    id: 's5',
    title: 'Social Media Marketing',
    description:
      'High-impact social visibility across Instagram, YouTube, and Meta networks to position you as an authoritative mentor.',
    deliverables: [
      'Viral short-form hook templates',
      'Paid dark-post amplification',
      'Retargeting custom audience lists',
      'Visual asset design aligned with platform policies',
    ],
    icon: 'Share2',
  },
  {
    id: 's6',
    title: 'Custom Affiliate Promotion Strategies',
    description:
      'Bespoke promotional blueprints tailored to the specific commission structure, tiers, and policies of your selected affiliate network.',
    deliverables: [
      'Commission-tier profit modeling',
      'Multi-channel promotional mix',
      'Seasonal launch & discount sprint plans',
      'Compliance check with network guidelines',
    ],
    icon: 'Sparkles',
  },
];

export const DEFAULT_TESTIMONIALS = [
  {
    id: 't1',
    name: 'Rohit Verma',
    platform: 'Bizzgurukull Affiliate',
    quote:
      'Before working with Techmagnet, I was spending hours sending cold DMs with minimal replies. Their Growth Plan set up a continuous flow of interested learners. My monthly enrollments tripled in 45 days.',
    result: '+310% Monthly Enrollments',
    avatarSeed: 'RV',
    verified: true,
  },
  {
    id: 't2',
    name: 'Priya Sharma',
    platform: 'LeadGuru Marketer',
    quote:
      'The leads coming from Techmagnet are pre-informed about the course pricing and curriculum. Conversion conversations on WhatsApp became effortless because prospects were already eager to enroll.',
    result: '4.2x WhatsApp Conversion Rate',
    avatarSeed: 'PS',
    verified: true,
  },
  {
    id: 't3',
    name: 'Aman Deep Singh',
    platform: 'SkillPaisa Mentor',
    quote:
      'Techmagnet treats your campaign like serious business. Clean reporting, no fake promises, and transparent WhatsApp updates. The ₹5,999 Growth package paid for itself in the first week.',
    result: '₹84,000+ Affiliate Commission in Month 1',
    avatarSeed: 'AS',
    verified: true,
  },
];

export const DEFAULT_FAQS = [
  {
    question: 'How does Techmagnet help generate affiliate enrollments?',
    answer:
      'Techmagnet designs and manages targeted performance marketing campaigns across Meta, Google, and professional content networks. We attract prospects who are actively looking for the courses, skills, or certifications offered by your affiliate platform, qualify them, and route them directly to your WhatsApp or registration funnel.',
    category: 'Process',
  },
  {
    question: 'Which affiliate platforms are supported?',
    answer:
      'We support 100+ affiliate networks including IDP, Bizzgurukull, LeadGuru, SkillPaisa, SkillMize, Millionaire Track, Richind, Gyan Kamao, and many more. Whether you work with a major Indian EdTech affiliate platform or an international affiliate network, our strategies are customized to your target audience.',
    category: 'Platforms',
  },
  {
    question: 'What does the "Guaranteed Enrollments" service mean?',
    answer:
      'Our guarantee is backed by contractual deliverables established in the written agreement of your chosen plan. If a campaign does not meet the agreed qualified prospect or enrollment benchmark within the campaign cycle, our team continues running optimization support at no extra retainer cost until the benchmark criteria are fulfilled.',
    category: 'Guarantee',
  },
  {
    question: 'How soon can my enrollment campaign go live?',
    answer:
      'Once you connect with us on WhatsApp (+91 9023386997) and choose your plan, our strategists review your affiliate platform details, set up the campaign targeting, and launch within 24 to 48 hours.',
    category: 'Onboarding',
  },
  {
    question: 'Can I target multiple affiliate platforms simultaneously?',
    answer:
      'Yes! The Growth Plan supports up to 3 platforms simultaneously, and our Premium and Enterprise packages provide comprehensive multi-platform coverage with dedicated audience segmentation.',
    category: 'Plans',
  },
  {
    question: 'Are Techmagnet services affiliated with IDP, Bizzgurukull, or other brands?',
    answer:
      'No. Techmagnet is an independent performance marketing agency. All platform trademarks belong to their respective owners. We do not claim official partnership or endorsement unless explicitly stated in writing.',
    category: 'Compliance',
  },
  {
    question: 'How do I get started right now?',
    answer:
      'Simply click any "Get Enrollments" or "Choose Plan" button on this website, or message our team directly on WhatsApp at +91 9023386997. We will immediately assess your affiliate niche and share a tailored roadmap.',
    category: 'Getting Started',
  },
];
