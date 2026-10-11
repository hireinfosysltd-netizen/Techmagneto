import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { DEFAULT_FAQS } from '../data/defaultData';
import { useAgency } from '../context/AgencyContext';

export const Faq: React.FC = () => {
  const { openWhatsApp } = useAgency();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-24 bg-[#090e1c] relative border-t border-b border-blue-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-950/70 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>TRANSPARENCY & CLARITY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            Everything you need to know about our campaign operations, enrollment guarantees, and onboarding.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-12">
          {DEFAULT_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#0b1224]/90 border border-slate-800/90 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-900/50 transition-colors"
                >
                  <span className="text-base sm:text-lg font-bold text-white pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg bg-slate-900 border border-slate-700/60 text-blue-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 bg-blue-950 text-blue-300' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900/50 border border-blue-900/40">
          <h4 className="text-lg font-bold text-white mb-2">Have a question not covered here?</h4>
          <p className="text-sm text-slate-300 mb-6">
            Our growth team is available directly on WhatsApp to answer any questions about your specific platform.
          </p>
          <button
            onClick={() =>
              openWhatsApp(
                'Hi Techmagnet, I have a custom question about your affiliate marketing services.'
              )
            }
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-600/30"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat with Growth Lead on WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
};
