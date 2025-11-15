// src/components/home/PaymentMethods.tsx
// PROFESSIONAL VERSION - Sleek payment security showcase

'use client';

import { 
  Shield,
  Lock,
  Zap,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Globe
} from 'lucide-react';

export default function PaymentMethods() {
  const paymentLogos = [
    { name: 'Visa', icon: '💳', color: 'from-blue-600 to-blue-700' },
    { name: 'Mastercard', icon: '💳', color: 'from-red-600 to-orange-600' },
    { name: 'Amex', icon: '💳', color: 'from-blue-700 to-indigo-700' },
    { name: 'Apple Pay', icon: '🍎', color: 'from-gray-800 to-gray-900' },
    { name: 'Google Pay', icon: '📱', color: 'from-green-600 to-blue-600' },
    { name: 'Link', icon: '🔗', color: 'from-purple-600 to-pink-600' },
  ];

  const securityBadges = [
    { 
      icon: Shield, 
      label: 'Bank-Level Security',
      description: '256-bit SSL encryption',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      icon: Lock, 
      label: 'PCI DSS Certified',
      description: 'Level 1 compliance',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      icon: Zap, 
      label: 'Instant Booking',
      description: 'Real-time confirmation',
      color: 'from-orange-500 to-red-600'
    },
    { 
      icon: CheckCircle2, 
      label: '3D Secure',
      description: 'Extra layer protection',
      color: 'from-purple-500 to-pink-600'
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" />
      
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full mb-6 shadow-lg shadow-green-500/30">
            <Shield className="h-4 w-4" />
            <span className="font-bold text-sm uppercase tracking-wider">
              Secure Payments
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Protected by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Stripe</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The same payment technology trusted by Amazon, Google, and millions worldwide
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: Payment Methods Showcase */}
          <div className="space-y-6">
            {/* Stripe Badge - Hero Element */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl overflow-hidden">
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shine_3s_ease-in-out_infinite]" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm font-medium">Powered by</p>
                      <h3 className="text-2xl font-bold text-white">Stripe</h3>
                    </div>
                  </div>
                  <Shield className="h-10 w-10 text-white/80" />
                </div>

                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  Your payment information never touches our servers. Everything is processed through Stripe's certified, bank-level infrastructure.
                </p>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-300" />
                  <span className="text-white/90 text-xs font-medium">
                    Trusted by 100+ million businesses worldwide
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods Grid */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                All Major Payment Methods
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {paymentLogos.map((payment, idx) => (
                  <div 
                    key={idx}
                    className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`text-3xl transform group-hover:scale-110 transition-transform`}>
                        {payment.icon}
                      </div>
                      <span className="text-xs font-semibold text-gray-700 text-center">
                        {payment.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Security Features */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Your Security is Our Priority
            </h3>

            {securityBadges.map((badge, idx) => (
              <div 
                key={idx}
                className="group relative bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300"
              >
                {/* Gradient border on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${badge.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm`} />
                
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 h-14 w-14 bg-gradient-to-br ${badge.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <badge.icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">
                      {badge.label}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Trust Statement */}
            <div className="relative mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full blur-2xl" />
              <div className="relative flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-green-900 mb-2">
                    100% Secure Guarantee
                  </p>
                  <p className="text-sm text-green-800 leading-relaxed">
                    Your payment data is encrypted and processed through Stripe's PCI Level 1 certified infrastructure — the highest security standard in the payments industry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-16 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
            <div className="p-6 text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                256-bit
              </p>
              <p className="text-sm text-gray-600">SSL Encryption</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                PCI DSS
              </p>
              <p className="text-sm text-gray-600">Level 1 Certified</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                3D Secure
              </p>
              <p className="text-sm text-gray-600">Protected</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                Instant
              </p>
              <p className="text-sm text-gray-600">Confirmation</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}