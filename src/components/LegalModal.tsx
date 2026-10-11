import React from 'react';
import { X, Shield, FileText, RefreshCw } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const LegalModal: React.FC = () => {
  const { activeLegalModal, closeLegalModal, settings } = useAgency();

  if (!activeLegalModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#0b1224] border border-slate-700 p-6 sm:p-8 text-slate-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            {activeLegalModal === 'privacy' && <Shield className="w-6 h-6 text-blue-400" />}
            {activeLegalModal === 'terms' && <FileText className="w-6 h-6 text-indigo-400" />}
            {activeLegalModal === 'refund' && <RefreshCw className="w-6 h-6 text-purple-400" />}
            <div>
              <h3 className="text-xl font-bold text-white">
                {activeLegalModal === 'privacy' && 'Privacy Policy'}
                {activeLegalModal === 'terms' && 'Terms and Conditions'}
                {activeLegalModal === 'refund' && 'Refund and Cancellation Policy'}
              </h3>
              <p className="text-xs text-slate-400">TECHMAGNET Agency Compliance Documentation</p>
            </div>
          </div>
          <button
            onClick={closeLegalModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {activeLegalModal === 'privacy' && (
            <>
              <p>
                <strong>1. Information Collection:</strong> TECHMAGNET collects basic contact details
                (such as your name, mobile number, and chosen affiliate platform) solely to evaluate
                campaign feasibility, configure marketing funnels, and communicate via WhatsApp and phone.
              </p>
              <p>
                <strong>2. Use of Data:</strong> We do not sell, license, or distribute your private
                information to unauthorized third parties. Lead records generated during advertising
                campaigns belong to your account as designated by the written terms of your service plan.
              </p>
              <p>
                <strong>3. Communications:</strong> By submitting an inquiry on this website, you authorize
                TECHMAGNET growth specialists to contact you via WhatsApp (+91 {settings.contact.whatsAppPhone.slice(2)})
                and office phone (+91 {settings.contact.officePhone.replace(/\D/g, '').slice(2)}).
              </p>
              <p>
                <strong>4. Security:</strong> We deploy reasonable technical controls to safeguard customer
                data and conversation records.
              </p>
            </>
          )}

          {activeLegalModal === 'terms' && (
            <>
              <p>
                <strong>1. Scope of Agency Services:</strong> TECHMAGNET is an independent digital growth
                and advertising agency. We provide strategic consulting, audience qualification, and paid
                media campaign execution for affiliate marketers.
              </p>
              <p>
                <strong>2. Platform Independence:</strong> References to third-party affiliate networks
                (including IDP, Bizzgurukull, LeadGuru, SkillPaisa, SkillMize, and others) do not indicate
                an official endorsement, joint venture, or authorization by those entities.
              </p>
              <p>
                <strong>3. Enrollment Assurances:</strong> Any guaranteed enrollment commitments are
                explicitly governed by the written contract executed for the selected campaign tier.
                Guarantees require client adherence to script guidelines, prompt WhatsApp lead follow-ups,
                and approved landing page disclosures.
              </p>
              <p>
                <strong>4. Client Responsibility:</strong> The client is solely responsible for ensuring
                their affiliate links and course promotions abide by their respective network&apos;s code of
                conduct and legal guidelines.
              </p>
            </>
          )}

          {activeLegalModal === 'refund' && (
            <>
              <p>
                <strong>1. Digital Advertising Nature:</strong> Advertising media spend, customized copy,
                and strategist labor are committed immediately upon onboarding. Therefore, once ad
                expenditures and campaign assets have been deployed, retainers are non-refundable.
              </p>
              <p>
                <strong>2. Performance Guarantee Execution:</strong> If a guaranteed enrollment package
                fails to meet the mutually agreed minimum qualified prospect threshold within the campaign
                window, TECHMAGNET commits to extending optimization support and ad delivery at no
                additional service fee until contractual targets are reached.
              </p>
              <p>
                <strong>3. Cancellation Prior to Launch:</strong> If you request cancellation before creative
                assets or ad accounts have been initiated (within 12 hours of payment), a partial refund
                minus administrative processing fees may be granted at the agency&apos;s discretion.
              </p>
            </>
          )}
        </div>

        {/* Footer Close */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={closeLegalModal}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
