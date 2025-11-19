// src/app/about/page.tsx
// ✅ ABOUT PAGE - Actualizada con nueva estructura
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
            
            <p className="text-lg sm:text-xl text-white/95 max-w-3xl drop-shadow-lg">
              We're more than a shuttle service – we're your local friends in Costa Rica
            </p>
          </div>
        </section>

        {/* Section 1: 30+ años de experiencia - FOTO IZQUIERDA */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              {/* Imagen */}
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Beatiful-waterfall-costa-rica-nature.webp"
                  alt="La Fortuna and Arenal Volcano"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Texto */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4 border border-blue-200">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">
                    Our Home
                  </span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Ticos with 30+ Years of Experience
                </h2>
                
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p className="leading-relaxed">
                    We're <strong>ticos</strong> – born and raised in <strong>La Fortuna de San Carlos</strong>, right at the 
                    foot of the majestic <strong>Arenal Volcano</strong>. This isn't just where we work; it's where we grew up, 
                    where our families live, and where we've spent over <strong>30 combined years</strong> learning every curve 
                    of these roads.
                  </p>
                  
                  <p className="leading-relaxed">
                    When you ride with us, you're not hiring a faceless shuttle service. You're getting someone who knows 
                    which viewpoint has the best sunrise over the volcano, where the quetzals nest during migration season, 
                    and which family-run restaurant makes the best <em>casado</em> in town. That's the difference local knowledge makes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Conexiones principales - TEXTO IZQUIERDA */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              {/* Texto */}
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4 border border-orange-200">
                  <Sparkles className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-700 font-bold text-sm uppercase tracking-wide">
                    Our Mission
                  </span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Obsessed with Showing You the Real Costa Rica
                </h2>
                
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p className="leading-relaxed">
                    We connect Costa Rica's most popular destinations – <strong>SJO and LIR airports, La Fortuna, Manuel Antonio, 
                    Tamarindo, Monteverde</strong> – with private shuttles that actually feel private. No rushing to fit a shared 
                    schedule, no unnecessary stops. Just you, your group, and a comfortable ride on your timeline.
                  </p>
                  
                  <p className="leading-relaxed">
                    Here's what drives us: we genuinely want you to experience <strong>the real Costa Rica</strong>. The one where 
                    locals stop to help strangers, where a simple drive becomes a conversation about our history, and where 
                    <em className="text-orange-600">pura vida</em> isn't just a tourist slogan – it's how we actually live.
                  </p>

                  <p className="leading-relaxed">
                    We've seen too many travelers leave Costa Rica having only scratched the surface. That's why we make every 
                    transfer count, turning travel time into an authentic cultural experience you won't find in any guidebook.
                  </p>
                </div>
              </div>

              {/* Imagen */}
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2">
                <Image
                  src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Beatiful-waterfall-costa-rica-nature.webp"
                  alt="Private Shuttle Connections Across Costa Rica"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Pasión por compartir - FOTO IZQUIERDA */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              {/* Imagen */}
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Beatiful-waterfall-costa-rica-nature.webp"
                  alt="Sharing Costa Rica's Beauty"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Texto */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-4 border border-green-200">
                  <Heart className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-bold text-sm uppercase tracking-wide">
                    Our Passion
                  </span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  We Love Sharing Our Country with You
                </h2>
                
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p className="leading-relaxed">
                    Ask any tico what makes them proudest about Costa Rica, and you'll get a two-hour answer. We're no different. 
                    Transportation is just what we do – <strong>teaching people about our country</strong> is what we love.
                  </p>
                  
                  <p className="leading-relaxed">
                    Whether it's explaining why we abolished our army in 1948, pointing out a three-toed sloth that most people 
                    would drive right past, or recommending a <strong>soda</strong> (that's our word for small local restaurants) 
                    where the gallo pinto tastes like your grandmother made it – these moments matter to us.
                  </p>

                  <p className="leading-relaxed">
                    Every trip we take, whether it's a quick airport transfer or a full-day private tour from La Fortuna, 
                    becomes our chance to show you why <strong>we love being Costa Rican</strong>. Your journey is our opportunity 
                    to share our home, our stories, and our pride in this beautiful country.
                  </p>
                </div>
              </div>
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

        {/* Why Choose Us */}
        <section className="py-20 bg-white">
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