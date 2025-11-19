// src/components/sections/PaymentMethods.tsx
// PROFESSIONAL VERSION - Con colores sutiles pero no tan blanco

'use client';

import { 
  Shield,
  Lock,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Link2,
  Building2
} from 'lucide-react';

export default function PaymentMethods() {
  const paymentMethods = [
    { name: 'Visa', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { name: 'Mastercard', icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    { name: 'American Express', icon: CreditCard, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    { name: 'Discover', icon: CreditCard, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    { name: 'Google Pay', icon: Smartphone, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { name: 'Link', icon: Link2, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { name: 'ACH Direct Debit', icon: Building2, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
  ];

  const securityFeatures = [
    { 
      icon: Shield, 
      label: 'Bank-Level Security',
      description: '256-bit SSL encryption for all transactions',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    { 
      icon: Lock, 
      label: 'PCI DSS Level 1',
      description: 'Highest security certification in payments',
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200'
    },
    { 
      icon: CheckCircle2, 
      label: '3D Secure',
      description: 'Additional fraud protection layer',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-blue-50 via-gray-50 to-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-200 rounded-full mb-6 shadow-sm">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-sm text-blue-600 uppercase tracking-wide">
              Secure Payments
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powered by Stripe
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The same payment technology trusted by millions of businesses worldwide
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT: Payment Methods */}
          <div className="space-y-6">
            
            {/* Stripe Info Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-8 shadow-lg text-white">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">Stripe Payment Processing</h3>
                    <CheckCircle2 className="h-5 w-5 text-green-300" />
                  </div>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    Your payment information is processed directly by Stripe and never stored on our servers. 
                    All transactions are protected with bank-level security.
                  </p>
                </div>
              </div>
            </div>

            {/* Accepted Payment Methods */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
              <h3 className="font-bold text-gray-900 text-lg mb-6">
                Accepted Payment Methods
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {paymentMethods.map((method, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center gap-3 p-4 ${method.bg} rounded-xl border-2 ${method.border} hover:shadow-md transition-all`}
                  >
                    <method.icon className={`h-5 w-5 ${method.color} flex-shrink-0`} />
                    <span className="text-sm font-medium text-gray-700">
                      {method.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Additional payment methods may be available depending on your country and currency
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Security Features */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Your Security is Our Priority
            </h3>

            {securityFeatures.map((feature, idx) => (
              <div 
                key={idx}
                className={`bg-white rounded-2xl p-6 border-2 ${feature.border} shadow-lg hover:shadow-xl transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 ${feature.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-2">
                      {feature.label}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Trust Statement */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock className="h-6 w-6 text-green-700" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-green-900 text-lg mb-2">
                    100% Secure Guarantee
                  </h4>
                  <p className="text-sm text-green-800 leading-relaxed">
                    Your payment data is encrypted and processed through Stripe's PCI Level 1 certified infrastructure — the highest security standard in the payments industry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
            <div className="p-6 text-center bg-gradient-to-br from-blue-50 to-white">
              <p className="text-2xl font-bold text-blue-600 mb-1">256-bit</p>
              <p className="text-sm text-gray-600">SSL Encryption</p>
            </div>
            <div className="p-6 text-center bg-gradient-to-br from-green-50 to-white">
              <p className="text-2xl font-bold text-green-600 mb-1">Level 1</p>
              <p className="text-sm text-gray-600">PCI DSS Certified</p>
            </div>
            <div className="p-6 text-center bg-gradient-to-br from-purple-50 to-white">
              <p className="text-2xl font-bold text-purple-600 mb-1">3D Secure</p>
              <p className="text-sm text-gray-600">Protected</p>
            </div>
            <div className="p-6 text-center bg-gradient-to-br from-orange-50 to-white">
              <p className="text-2xl font-bold text-orange-600 mb-1">Instant</p>
              <p className="text-sm text-gray-600">Confirmation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}