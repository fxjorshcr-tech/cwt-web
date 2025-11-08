// src/app/about/page.tsx
// ✅ ABOUT PAGE - Liviana y optimizada
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import BookingNavbar from '@/components/booking/BookingNavbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import {
  Users,
  Award,
  Shield,
  Heart,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  Target,
  Eye,
  Sparkles
} from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us - Can't Wait Travel Costa Rica</title>
        <meta name="description" content="Learn about Can't Wait Travel, a 100% Costa Rican company providing professional private shuttle services since 2019. ICT licensed and trusted by travelers worldwide." />
        <link rel="canonical" href="https://cantwaittravelcr.com/about" />
      </Head>

      <BookingNavbar />

      <main className="min-h-screen bg-white">
        
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp?width=1600&quality=60"
              alt="About Can't Wait Travel Costa Rica"
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={60}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <Heart className="h-5 w-5 text-white" />
              <span className="text-white font-semibold text-sm uppercase tracking-wide">
                100% Costa Rican Company
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              Pura Vida Transportation
            </h1>
            
            <p className="text-lg sm:text-xl text-white/95 max-w-3xl mb-8 drop-shadow-lg">
              We're more than a shuttle service – we're your local friends in Costa Rica
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 mt-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-white drop-shadow-lg">500+</p>
                <p className="text-sm text-white/90">Happy Travelers</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-white drop-shadow-lg">6</p>
                <p className="text-sm text-white/90">Years Experience</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-white drop-shadow-lg">4.9</p>
                <p className="text-sm text-white/90">Average Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4 border border-blue-200">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">
                  Our Story
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Born from a Love for Costa Rica
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p className="leading-relaxed">
                Can't Wait Travel was founded in <strong>2019</strong> by a group of Costa Rican natives who 
                saw a gap in the transportation market: travelers wanted reliable, safe, and authentic 
                experiences, but many services felt impersonal or overpriced.
              </p>

              <p className="leading-relaxed">
                We started with <strong>just two vehicles</strong> and a simple mission: treat every traveler 
                like family. Our drivers aren't just chauffeurs – they're local experts who share stories, 
                recommend hidden gems, and ensure you experience the real <em className="text-blue-600">pura vida</em>.
              </p>

              <p className="leading-relaxed">
                Today, we're proud to serve <strong>hundreds of travelers monthly</strong>, maintaining our 
                commitment to personal service while growing our fleet and team. We're licensed by the Costa 
                Rican Tourism Board (ICT License #4121-2025), fully insured, and dedicated to making your 
                journey as memorable as your destination.
              </p>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Mission */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-100">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  To provide safe, reliable, and authentic transportation experiences that showcase 
                  Costa Rica's beauty and culture while exceeding traveler expectations.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-orange-100">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Eye className="h-7 w-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  To be Costa Rica's most trusted and beloved private shuttle service, known for 
                  turning transportation into meaningful experiences.
                </p>
              </div>

              {/* Values */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-100">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Our Values</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Safety first, always</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Authentic pura vida</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Local expertise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Family treatment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4 border border-blue-200">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">
                  Our Team
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet the People Behind Your Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our drivers are experienced Costa Rican natives passionate about sharing their country
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Team Member 1 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <Users className="h-20 w-20 text-white opacity-50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Carlos Rodríguez</h3>
                  <p className="text-sm text-blue-600 font-semibold mb-3">Founder & CEO</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    15+ years in tourism. Carlos started Can't Wait Travel to share authentic 
                    Costa Rican experiences with the world.
                  </p>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <Users className="h-20 w-20 text-white opacity-50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">María Sánchez</h3>
                  <p className="text-sm text-orange-600 font-semibold mb-3">Operations Manager</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Coordinates all bookings and ensures every trip runs smoothly. María's attention 
                    to detail is unmatched.
                  </p>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <Users className="h-20 w-20 text-white opacity-50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Luis Morales</h3>
                  <p className="text-sm text-green-600 font-semibold mb-3">Senior Driver</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    10+ years driving Costa Rica's roads. Luis knows every shortcut and the best 
                    stops along the way.
                  </p>
                </div>
              </div>

              {/* Team Member 4 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <Users className="h-20 w-20 text-white opacity-50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Ana Vargas</h3>
                  <p className="text-sm text-purple-600 font-semibold mb-3">Customer Success</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Available 24/7 to answer questions and assist travelers. Ana ensures everyone 
                    feels supported.
                  </p>
                </div>
              </div>

              {/* Team Member 5 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                  <Users className="h-20 w-20 text-white opacity-50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Diego Fernández</h3>
                  <p className="text-sm text-cyan-600 font-semibold mb-3">Driver & Guide</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Born and raised in La Fortuna. Diego shares insider knowledge about volcanoes 
                    and hot springs.
                  </p>
                </div>
              </div>

              {/* Team Member 6 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                  <Users className="h-20 w-20 text-white opacity-50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Sofia Ramírez</h3>
                  <p className="text-sm text-pink-600 font-semibold mb-3">Driver & Translator</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Fluent in English, Spanish, and German. Sofia bridges cultures and makes 
                    everyone feel at home.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Travelers Choose Us
              </h2>
              <p className="text-lg text-gray-600">
                What sets Can't Wait Travel apart from other shuttle services
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Fully Licensed</h3>
                <p className="text-sm text-gray-600">
                  ICT License #4121-2025 and full commercial insurance coverage
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Local Experts</h3>
                <p className="text-sm text-gray-600">
                  All drivers are Costa Rican natives with deep local knowledge
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600">
                  Round-the-clock assistance via WhatsApp, phone, or email
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Top Rated</h3>
                <p className="text-sm text-gray-600">
                  4.9/5 average rating from 500+ verified travelers
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-600">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Experience Pura Vida Transportation?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Book your private shuttle today and discover why travelers trust Can't Wait Travel
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/transfers"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Book a Transfer
              </a>
              <a
                href="/contact"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>

      </main>

      <WhatsAppButton />
    </>
  );
}