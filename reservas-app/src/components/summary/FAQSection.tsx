// src/components/summary/FAQSection.tsx
import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  onViewAll: () => void;
}

export function FAQSection({ faqs, onViewAll }: FAQSectionProps) {
  const [openFAQs, setOpenFAQs] = useState<Set<number>>(new Set());

  const toggleFAQ = (index: number) => {
    setOpenFAQs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <HelpCircle className="h-6 w-6" />
          Frequently Asked Questions
        </CardTitle>
        <CardDescription className="text-blue-700">
          Quick answers to common questions about your booking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openFAQs.has(index);
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-blue-200 overflow-hidden hover:border-blue-400 transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-blue-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4 text-sm">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-blue-600 flex-shrink-0 transition-transform ${
                    isOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-3 text-gray-700 text-sm leading-relaxed border-t border-blue-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}

        <div className="pt-4">
          <button
            onClick={onViewAll}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <HelpCircle className="h-5 w-5" />
            View All FAQs ({faqs.length}+)
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
