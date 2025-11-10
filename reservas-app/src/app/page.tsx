// src/app/page.tsx - ✅ FULLY UPDATED VERSION
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/home/BookingForm";
import BookingSteps from "@/components/booking/BookingSteps";
import BookingNavbar from "@/components/booking/BookingNavbar";
import WhyPrivateShuttle from "@/components/home/WhyPrivateShuttle";
import ValueProposition from "@/components/home/ValueProposition";
import PaymentMethods from "@/components/home/PaymentMethods"; // ✅ NUEVO
import TravelGuide from "@/components/home/TravelGuide";
import PrivateTours from "@/components/home/PrivateTours";
import GoogleReviews from "@/components/home/GoogleReviews";
import FinalCTA from "@/components/home/FinalCTA";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToBookingButton from "@/components/ScrollToBookingButton";
import StructuredData from "@/components/SEO/StructuredData";
import type { Metadata } from 'next';
import Script from 'next/script';

// ✅ SEO META TAGS - Natural y optimizado
export const metadata: Metadata = {
  title: 'Costa Rica Private Shuttle & Airport Transfers | Can\'t Wait Travel',
  description: 'Book reliable private shuttle service in Costa Rica. Airport transfers from SJO and Liberia to La Fortuna, Manuel Antonio, Tamarindo, and more. Professional bilingual drivers, modern vehicles, fully licensed.',
  
  keywords: [
    'private shuttle costa rica',
    'costa rica airport transfer',
    'SJO airport shuttle',
    'LIR airport transportation',
    'private transfer la fortuna',
    'shuttle to manuel antonio',
    'costa rica transportation service',
    'bilingual driver costa rica',
    'can\'t wait travel'
  ],
  openGraph: {
    title: 'Private Shuttle Costa Rica | Can\'t Wait Travel',
    description: 'Professional private shuttle service with bilingual drivers. Book your Costa Rica airport transfer today.',
    url: 'https://cantwaittravelcr.com',
    siteName: 'Can\'t Wait Travel',
    images: [
      {
        url: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp',
        width: 1200,
        height: 630,
        alt: 'Costa Rica Beach - Private Shuttle Service',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Private Shuttle Costa Rica | Can\'t Wait Travel',
    description: 'Professional airport transfers and private shuttle service across Costa Rica.',
    images: ['https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://cantwaittravelcr.com',
  },
};

export default async function Home() {
  return (
    <>
      {/* ✅ SKIP TO CONTENT LINK - Fixed: solo visible en keyboard focus */}
      <a 
        href="#main-content" 
        className="absolute -top-96 left-4 z-[9999] px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg focus:top-4 transition-all"
      >
        Skip to main content
      </a>

      {/* Google Analytics */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
            async
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
        </>
      )}

      <main id="main-content" className="min-h-screen overflow-x-hidden">
        
        {/* SEO - Structured Data */}
        <StructuredData />

        {/* ✅ NAVBAR */}
        <BookingNavbar />

        {/* Hero Section */}
        <section className="relative h-screen overflow-x-hidden max-w-full">
          <div className="absolute inset-0 z-0 max-w-full">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp"
              alt="Private Shuttle Costa Rica - Beach Transportation Service"
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={75}
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA="
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
            <div className="text-center max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 drop-shadow-2xl leading-tight">
                Private Shuttles & Tours
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-white/95 mb-6 drop-shadow-lg max-w-2xl mx-auto font-light">
                Door-to-Door Transportation & Tailored Experiences Across Costa Rica
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
                <span className="text-sm sm:text-base md:text-lg font-medium text-white drop-shadow-xl">
                  Trusted
                </span>
                <span className="text-white text-lg">•</span>
                <span className="text-sm sm:text-base md:text-lg font-medium text-white drop-shadow-xl">
                  Flexible
                </span>
                <span className="text-white text-lg">•</span>
                <span className="text-sm sm:text-base md:text-lg font-medium text-white drop-shadow-xl">
                  Authentic
                </span>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </section>

        {/* ✅ Booking Form - Con ID para el scroll */}
        <section id="booking-form" className="relative -mt-32 z-20 px-6 pb-20">
          <Suspense fallback={
            <div className="w-full max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full" />
                  <p className="text-gray-600">Loading booking form...</p>
                </div>
              </div>
            </div>
          }>
            <BookingForm />
          </Suspense>
        </section>

        {/* Booking Steps */}
        <BookingSteps />

        {/* ✅ NUEVA SECCIÓN - Payment Methods con Stripe */}
        <PaymentMethods />

        {/* Why Private Shuttle */}
        <WhyPrivateShuttle />

        {/* Value Proposition */}
        <ValueProposition />

        {/* Travel Guide - Simplificado */}
        <TravelGuide />

        {/* Private Tours */}
        <PrivateTours />

        {/* Google Reviews */}
        <GoogleReviews />

        {/* Final CTA */}
        <FinalCTA />

        {/* ✅ BOTONES FLOTANTES - Al final antes del footer */}
        <ScrollToBookingButton />
        <WhatsAppButton />

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-6" role="contentinfo">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="mb-4 flex items-center">
                  <div className="relative w-40 h-10">
                    <Image
                      src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/logo-cant-wait-travel.webp"
                      alt="Can't Wait Travel Logo"
                      fill
                      sizes="160px"
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Professional private shuttle service in Costa Rica. Licensed by ICT, 
                  fully insured, and trusted by travelers worldwide.
                </p>
                <p className="text-gray-400 text-xs mb-2">
                  ICT License: 4121-2025
                </p>
                <p className="text-gray-400 text-xs mb-6">
                  WhatsApp: +506-8596-2438
                </p>

                {/* Social Media */}
                <div className="mt-6">
                  <h3 className="font-bold text-sm mb-3">Follow Us</h3>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://wa.me/50685962438"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-green-500 transition-colors p-2 rounded-full hover:bg-gray-800"
                      aria-label="WhatsApp"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </a>
                    <a
                      href="https://instagram.com/cantwaittravelcr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-pink-500 transition-colors p-2 rounded-full hover:bg-gray-800"
                      aria-label="Instagram"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a
                      href="https://facebook.com/cantwaittravelcr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-gray-800"
                      aria-label="Facebook"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link href="/transfers" className="hover:text-white transition">Private Shuttles</Link></li>
                  <li><Link href="/private-tours" className="hover:text-white transition">Tailored Tours</Link></li>
                  <li><Link href="/travel-guide" className="hover:text-white transition">Travel Guide</Link></li>
                  <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-3">Legal</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                  <li><Link href="/cancellation" className="hover:text-white transition">Cancellation Policy</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-300 text-sm">
                © {new Date().getFullYear()} Can't Wait Travel Costa Rica. All rights reserved.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Costa Rica Private Shuttle Service | San José Airport (SJO) | Liberia Airport (LIR) | 
                La Fortuna | Manuel Antonio | Tamarindo | Monteverde
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}