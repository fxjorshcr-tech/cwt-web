// src/components/home/PaymentMethods.tsx
'use client';

import { 
  CreditCard,
  Smartphone,
  Shield,
  Lock,
  Zap,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';

export default function PaymentMethods() {
  const paymentMethods = [
    { name: 'Visa', logo: '💳' },
    { name: 'Mastercard', logo: '💳' },
    { name: 'American Express', logo: '💳' },
    { name: 'Apple Pay', logo: '🍎' },
    { name: 'Google Pay', logo: '📱' },
    { name: 'Link', logo: '🔗' },
  ];

  const securityFeatures = [
    { icon: Shield, text: 'Bank-level encryption' },
    { icon: Lock, text: 'PCI DSS Compliant' },
    { icon: Zap, text: 'Instant confirmation' },
    { icon: CheckCircle2, text: '3D Secure protection' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
            <Shield className="h-4 w-4 text-blue-700" />
            <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">
              Secure Payments
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Bank-Level Security with Stripe
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We use Stripe's enterprise payment infrastructure trusted by millions worldwide
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          
          {/* Left: Payment Methods */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-blue-600" />
              Multiple Payment Options
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {paymentMethods.map((method, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{method.logo}</span>
                    <span className="text-sm font-semibold text-gray-700">
                      {method.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stripe Badge */}
            <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-indigo-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  Powered by
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Stripe</span>
                  </div>
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Security Features */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Why Our Payment System is Secure
            </h3>
            
            <div className="space-y-4">
              {securityFeatures.map((feature, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-2 shadow-lg">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {feature.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Statement */}
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <p className="text-sm text-green-900">
                <span className="font-bold">🔒 100% Secure:</span> Your payment information never touches our servers. 
                All transactions are processed directly through Stripe's certified infrastructure.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4">
            <p className="text-3xl font-bold text-blue-600">256-bit</p>
            <p className="text-sm text-gray-600 mt-1">SSL Encryption</p>
          </div>
          <div className="p-4">
            <p className="text-3xl font-bold text-indigo-600">PCI DSS</p>
            <p className="text-sm text-gray-600 mt-1">Level 1 Certified</p>
          </div>
          <div className="p-4">
            <p className="text-3xl font-bold text-purple-600">3D Secure</p>
            <p className="text-sm text-gray-600 mt-1">Extra Protection</p>
          </div>
          <div className="p-4">
            <p className="text-3xl font-bold text-green-600">Instant</p>
            <p className="text-sm text-gray-600 mt-1">Confirmation</p>
          </div>
        </div>
      </div>
    </section>
  );
}