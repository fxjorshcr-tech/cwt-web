// src/app/about/page.tsx
// ✅ FIXED: Removed 'use client' to allow SEO Metadata to work
import Image from 'next/image';
import { Metadata } from 'next';
import BookingNavbar from '@/components/booking/BookingNavbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import Link from 'next/link';
import {
  Users,
  Shield,
  Heart,
  MapPin,
  Target,
  Eye,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Truck,
  Calendar,
  BadgeCheck
} from 'lucide-react';

// ✅ SEO Metadata works perfectly now (Server Component)
export const metadata: Metadata = {
  title: 'About Us | Local Experts in La Fortuna',
  description: 'Meet the team behind Can\'t Wait Travel CR. 100% Costa Rican owned and operated. Experienced professionals providing private transport in La Fortuna.',
};

export default function AboutPage() {
  return (
    <>
      <BookingNavbar />

      <div className="min-h-screen bg-white">
        
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] max-h-[700px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/cwt-van-arenal-volcano.webp"
              alt="Can't Wait Travel CR - Private Shuttle Van with Arenal Volcano"
              fill
              sizes="100vw"
              className="object-cover"
              priority

            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center pt-20 sm:pt-0">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20">
              <Heart className="h-4 sm:h-5 w-4 sm:w-5 text-red-400 fill-red-400" />
              <span className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide">
                100% Costa Rican Owned
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 drop-shadow-2xl">
              When Drivers Join Forces
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl drop-shadow-lg font-medium">
              The story of a company built by drivers, for travelers.
            </p>
          </div>
        </section>

        {/* Section 1: The Origin Story */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">

            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6 border border-blue-100">
                <span className="text-blue-700 font-bold text-xs uppercase tracking-wider">
                  Our Story
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                The Story Behind Can't Wait Travel
              </h2>
            </div>

            <div className="prose prose-lg text-gray-600 space-y-6 max-w-3xl mx-auto">
              <p>
                We're two brothers from La Fortuna who grew up watching the tourism industry evolve around us. After nearly two decades working the roads of Costa Rica, we had a simple idea: what if the best drivers stopped working for other companies — and started working together?
              </p>
              <p>
                So we reached out to colleagues we trusted. Professional drivers who shared the same frustration: knowing we could do better if we ran things ourselves.
              </p>
              <p>
                In November 2025, <strong>Can't Wait Travel CR</strong> was born — a company built by drivers, for travelers. We pooled our experience, invested in our own fleet of modern vehicles, and created something rare: a shuttle company with zero middlemen.
              </p>
              <p className="text-gray-800 font-medium text-xl">
                We run our own vehicles with our own team. What you see is what you get.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-6 justify-center">
              <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-xl">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-semibold text-gray-800">Local Experts</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-xl">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-semibold text-gray-800">Driver-Owned</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-xl">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-semibold text-gray-800">No Middlemen</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mission / Vision / Values */}
        <section className="py-12 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Drives Us
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our philosophy is simple: treat every guest like family.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Mission */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 border-blue-600">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To end the stress of travel by providing reliable, direct, and honest transportation. We don't just drive; we host.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 border-orange-500">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To be the standard for private transport in Costa Rica, proving that a local company can offer world-class service.
                </p>
              </div>

              {/* Values */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 border-green-500">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Values</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Safety Above All
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Honest Pricing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Pura Vida Spirit
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why Trust Us - Credentials */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-blue-900 rounded-3xl overflow-hidden shadow-2xl p-10 md:p-16 text-white text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-800 rounded-full mb-6 border border-blue-700">
                <Shield className="h-4 w-4 text-blue-300" />
                <span className="font-bold text-xs uppercase tracking-wider">Official Credentials</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Licensed, Insured & Verified
              </h2>
              <p className="text-blue-100 mb-10 text-lg leading-relaxed max-w-2xl mx-auto">
                We take your safety seriously. We operate legally under the regulations of the Costa Rican Tourism Board (ICT).
              </p>

              <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                <div className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-xl">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-300" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">ICT License #4121-2025</p>
                    <p className="text-sm text-blue-200">Official Tourism Operator</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-xl">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-300" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Professional Drivers</p>
                    <p className="text-sm text-blue-200">Background checked & Licensed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Network & Commitment */}
        <section className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto px-6 max-w-6xl">

            {/* Strategic Coverage */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6 border border-blue-100">
                <Truck className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 font-bold text-xs uppercase tracking-wider">
                  Strategic Coverage
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Vehicles Where You Need Them
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-12">
                We strategically position our fleet across Costa Rica's main tourist hubs for faster response times and local expertise.
              </p>

              {/* Location Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
                {[
                  { name: 'San José', sub: 'SJO Airport', icon: '✈️' },
                  { name: 'Guanacaste', sub: 'LIR & Beaches', icon: '🏖️' },
                  { name: 'La Fortuna', sub: 'Arenal Volcano', icon: '🌋' },
                  { name: 'Monteverde', sub: 'Cloud Forest', icon: '🌿' },
                  { name: 'Manuel Antonio', sub: 'Pacific Coast', icon: '🐒' },
                ].map((location) => (
                  <div
                    key={location.name}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
                  >
                    <span className="text-2xl mb-2 block">{location.icon}</span>
                    <p className="font-bold text-gray-900 text-sm">{location.name}</p>
                    <p className="text-xs text-gray-500">{location.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Commitment Section */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 mt-16">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full mb-6 border border-green-100">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-green-700 font-bold text-xs uppercase tracking-wider">
                      Our Commitment
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Quality Over Quantity
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    We intentionally limit our daily bookings to guarantee every reservation. While others overbook and scramble to find drivers, <strong>we keep our word</strong>.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    When you book with us, you get peace of mind — not excuses. That's the Can't Wait Travel difference.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { text: 'Confirmed means confirmed', desc: 'Your booking is guaranteed' },
                    { text: 'No overbooking', desc: 'We never accept more than we can handle' },
                    { text: 'No last-minute cancellations', desc: 'We honor every commitment' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-4 bg-gray-50 p-4 rounded-xl">
                      <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                        <BadgeCheck className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.text}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trusted By */}
            <div className="mt-16 text-center">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
                Trusted by Local Businesses
              </p>
              <div className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16">
                <Link
                  href="https://www.arenalecoglide.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
                  title="Arenal EcoGlide"
                >
                  <Image
                    src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/logo-ecoglide.webp"
                    alt="Arenal EcoGlide"
                    width={140}
                    height={60}
                    className="h-12 sm:h-14 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform"
                  />
                </Link>
                <Link
                  href="https://www.skylinecanopytour.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
                  title="Skyline Canopy Tour"
                >
                  <Image
                    src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/logo-skyline.webp"
                    alt="Skyline Canopy Tour"
                    width={140}
                    height={60}
                    className="h-12 sm:h-14 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform"
                  />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <div className="bg-gray-900 rounded-3xl p-12 text-white shadow-2xl">
              <Sparkles className="h-12 w-12 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Let's Plan Your Trip
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                We are ready to welcome you to Costa Rica. Book directly with us and skip the middlemen.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/transfers"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
                >
                  Book Your Ride
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="https://wa.me/50687032191" 
                  target="_blank"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-500 transition-all"
                >
                  Chat on WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>

      <WhatsAppButton />
    </>
  );
}