/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AgencyProvider } from './context/AgencyContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Platforms } from './components/Platforms';
import { Services } from './components/Services';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Pricing } from './components/Pricing';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { Faq } from './components/Faq';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { LegalModal } from './components/LegalModal';
import { AdminModal } from './components/AdminModal';
import { GstModal } from './components/GstModal';
import { PaymentModal } from './components/PaymentModal';

export default function App() {
  return (
    <AgencyProvider>
      <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        {/* Navigation */}
        <Navbar />

        {/* Main Content Sections */}
        <main className="flex-grow">
          {/* Hero Section */}
          <Hero />

          {/* Platforms Section (IDP, Bizzgurukull, LeadGuru, SkillPaisa, SkillMize, 100+ others) */}
          <Platforms />

          {/* 6 Core Services */}
          <Services />

          {/* About & Why Choose Techmagnet */}
          <WhyChooseUs />

          {/* Pricing & Plans (Starter ₹2,000, Growth ₹5,999, Premium ₹9,999, Enterprise) */}
          <Pricing />

          {/* 4-Step How It Works */}
          <HowItWorks />

          {/* Verified Field Testimonials & Case Studies */}
          <Testimonials />

          {/* Frequently Asked Questions */}
          <Faq />

          {/* Contact Section & Lead Capture Form */}
          <Contact />
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Floating Elements & Modals */}
        <FloatingWhatsApp />
        <LegalModal />
        <AdminModal />
        <GstModal />
        <PaymentModal />
      </div>
    </AgencyProvider>
  );
}
