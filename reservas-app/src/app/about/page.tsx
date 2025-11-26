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
  Sparkles
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

      <main className="min-h-screen bg-white">
        
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] max-h-[700px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp?width=1600&quality=60"
              alt="About Can't Wait Travel Costa Rica"
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={70}
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center pt-20 sm:pt-0">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20">
              <Heart className="h-4 sm:h-5 w-4 sm:w-5 text-red-400 fill-red-400" />
              <span className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide">
                100% Costa Rican Owned
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 drop-shadow-2xl">
              Your Local Hosts
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl drop-shadow-lg font-medium">
              We are a family of operators dedicated to showing you the real Costa Rica.
            </p>
          </div>
        </section>

        {/* Section 1: The Origin Story */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              
              {/* Imagen */}
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl transform md:-rotate-1 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Beatiful-waterfall-costa-rica-nature.webp"
                  alt="La Fortuna and Arenal Volcano"
                  fill
                  className="object-cover"
                />
                {/* Etiqueta sobre la imagen */}
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
                  <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    La Fortuna, Costa Rica
                  </p>
                </div>
              </div>

              {/* Texto */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6 border border-blue-100">
                  <span className="text-blue-700 font-bold text-xs uppercase tracking-wider">
                    Our Roots
                  </span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Born & Raised at the Foot of the Volcano
                </h2>
                
                <div className="prose prose-lg text-gray-600 space-y-6">
                  <p>
                    While <strong>Can't Wait Travel</strong> was officially born in 2025, our story begins much earlier. We are two brothers who have lived and worked in La Fortuna's tourism sector since 2006.
                  </p>
                  <p>
                    After almost two decades of learning the roads and the industry, we united to create a private transfer service that covers every corner of Costa Rica. We built this company to offer what others didn't: a ride where you are treated like family, not just a passenger.
                  </p>
                  <p>
                    From the airport to the beach, and everywhere in between, experience Costa Rica with the confidence of drivers who have been here from the start.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-semibold text-gray-800">Local Experts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-semibold text-gray-800">Family Owned</span>
                  </div>
                </div>
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
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="bg-blue-900 rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-10 md:p-16 text-white">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-800 rounded-full mb-6 border border-blue-700">
                    <Shield className="h-4 w-4 text-blue-300" />
                    <span className="font-bold text-xs uppercase tracking-wider">Official Credentials</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Licensed, Insured & Verified.
                  </h2>
                  <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                    We take your safety seriously. We operate legally under the regulations of the Costa Rican Tourism Board (ICT).
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <Shield className="h-6 w-6 text-blue-300" />
                      </div>
                      <div>
                        <p className="font-bold">ICT License #4121-2025</p>
                        <p className="text-sm text-blue-200">Official Tourism Operator</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-300" />
                      </div>
                      <div>
                        <p className="font-bold">Professional Drivers</p>
                        <p className="text-sm text-blue-200">Background checked & Licensed</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative h-full min-h-[400px] bg-gray-200">
                  <Image
                     src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Beatiful-waterfall-costa-rica-nature.webp"
                     alt="Can't Wait Travel Team"
                     fill
                     className="object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply" />
                </div>
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

      </main>

      <WhatsAppButton />
    </>
  );
}