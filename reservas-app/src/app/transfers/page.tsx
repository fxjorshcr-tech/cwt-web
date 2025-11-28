// src/app/transfers/page.tsx
// ✅ OPTIMIZADO: Server Component con formulario client-side aislado
import { Suspense } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import BookingNavbar from '@/components/booking/BookingNavbar';
import BookingSteps from '@/components/booking/BookingSteps';
import PaymentMethods from '@/components/sections/PaymentMethods';
import TransfersBookingSection from '@/components/transfers/TransfersBookingSection';
import {
  CheckCircle2,
  Shield,
  MapPin,
  Users,
  Loader2,
  Mountain,
  Camera,
  Coffee,
  TreePine,
  Car,
  Clock,
  Sparkles,
  Phone,
  Plane
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Private Transportation Services",
  description: "Professional private shuttle and transportation services across Costa Rica. Airport transfers from SJO and LIR to La Fortuna, Monteverde, Manuel Antonio, and all major destinations.",
  keywords: ["Costa Rica transportation", "private shuttle", "airport transfer", "SJO transfer", "LIR transfer"],
};

export default function TransfersPage() {
  return (
    <>
      <BookingNavbar />

      <main className="min-h-screen bg-white">

        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp?width=1600&quality=70"
              alt="Costa Rica Private Transportation Services"
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={70}
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 pt-20 sm:pt-0">
            <div className="text-center max-w-4xl">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 sm:mb-4 drop-shadow-xl leading-tight">
                Private Transportation in Costa Rica
              </h1>

              <p className="text-sm sm:text-base md:text-xl text-white/95 mb-6 sm:mb-8 drop-shadow-md max-w-3xl mx-auto font-medium">
                Direct Operator | Stress-Free Travel
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-8">
                <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20">
                  <Shield className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-green-400" />
                  <span className="text-xs sm:text-sm font-semibold">ICT Certified</span>
                </div>
                <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20">
                  <Users className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-orange-400" />
                  <span className="text-xs sm:text-sm font-semibold">Local Experts</span>
                </div>
                <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20">
                  <CheckCircle2 className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-blue-400" />
                  <span className="text-xs sm:text-sm font-semibold">100% Private</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Form - Client Component */}
        <Suspense
          fallback={
            <section className="relative -mt-16 z-20 px-4 sm:px-6 pb-16">
              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-visible">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 rounded-t-2xl">
                  <h2 className="text-white font-bold text-lg text-center">Get an Instant Quote</h2>
                </div>
                <div className="p-5 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-[72px] bg-gray-100 rounded-lg animate-pulse" />
                    <div className="h-[72px] bg-gray-100 rounded-lg animate-pulse" />
                    <div className="h-[72px] bg-gray-100 rounded-lg animate-pulse" />
                    <div className="h-[72px] bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                  <div className="mt-6 flex justify-center">
                    <div className="w-full sm:w-auto min-w-[220px] h-[52px] bg-gray-200 rounded-xl animate-pulse" />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <div className="h-6 w-32 bg-gray-100 rounded-full animate-pulse" />
                    <div className="h-6 w-36 bg-gray-100 rounded-full animate-pulse" />
                    <div className="h-6 w-40 bg-gray-100 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </section>
          }
        >
          <TransfersBookingSection />
        </Suspense>

        {/* The Journey Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* Left: Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full mb-6">
                  <Mountain className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 font-semibold text-sm">The Journey is Part of the Experience</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Costa Rica deserves to be seen through the window, with a cold drink in hand
                </h2>

                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    The road from San José to La Fortuna winds through coffee plantations, misty mountains,
                    and small towns where locals wave as you pass. The route to Guanacaste reveals dry tropical
                    forests that transform into golden savannas. Every transfer in Costa Rica tells its own story.
                  </p>
                  <p>
                    Our drivers have traveled these roads for years. They know where the best roadside fruit
                    stands are, which viewpoint gives you the clearest shot of Arenal Volcano, and the perfect
                    spot to stretch your legs after a long flight.
                  </p>
                  <p className="font-medium text-gray-800">
                    With us, you arrive relaxed and ready to explore, having already experienced a slice of
                    authentic Costa Rica along the way.
                  </p>
                </div>
              </div>

              {/* Right: Feature Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200">
                  <Car className="h-8 w-8 text-blue-600 mb-3" />
                  <h4 className="font-bold text-gray-900 mb-1">Modern Fleet</h4>
                  <p className="text-sm text-gray-600">Air-conditioned vans, maintained weekly, comfortable for any distance</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 border border-green-200">
                  <TreePine className="h-8 w-8 text-green-600 mb-3" />
                  <h4 className="font-bold text-gray-900 mb-1">Scenic Routes</h4>
                  <p className="text-sm text-gray-600">We take the beautiful roads, with time for photos when you want them</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 border border-orange-200">
                  <Coffee className="h-8 w-8 text-orange-600 mb-3" />
                  <h4 className="font-bold text-gray-900 mb-1">Local Stops</h4>
                  <p className="text-sm text-gray-600">Coffee breaks, fruit stands, bathroom stops when you need them</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 border border-green-200">
                  <Camera className="h-8 w-8 text-green-600 mb-3" />
                  <h4 className="font-bold text-gray-900 mb-1">Photo Opps</h4>
                  <p className="text-sm text-gray-600">Volcano views, river crossings, wildlife sightings, all camera-ready</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Driving in Costa Rica Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Let Us Handle the Road
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Costa Rican roads are beautiful, winding, and full of surprises. Our drivers navigate
                them daily so you can focus on the views and the vacation ahead.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Mountain className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Mountain Passes</h3>
                <p className="text-sm text-gray-600">
                  Hairpin turns through cloud forests, elevation changes from sea level to 2,000 meters.
                  Our drivers know every curve.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TreePine className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Unpaved Sections</h3>
                <p className="text-sm text-gray-600">
                  Some of the best beaches and hotels are down gravel roads. We have the vehicles
                  and experience to get you there safely.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Real Travel Times</h3>
                <p className="text-sm text-gray-600">
                  GPS apps underestimate Costa Rican distances. What looks like 2 hours can easily be 3.5.
                  We give you accurate times.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Rainy Season Ready</h3>
                <p className="text-sm text-gray-600">
                  Afternoon downpours can turn roads slick in minutes. Our drivers adjust pace
                  and routes based on conditions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scenic Adventure / Addons Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start">

              {/* Left: Main Content */}
              <div className="lg:col-span-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full mb-6">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 font-semibold text-sm">Turn Your Transfer Into an Adventure</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Waterfalls, viewpoints, coffee plantations, and local markets along the way
                </h2>

                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Every route in Costa Rica passes by something worth stopping for. Waterfalls hidden
                    just off the main road. Miradores with views of volcanoes and coastlines. Family-run
                    coffee farms, artisan villages, wildlife sanctuaries, and traditional <em>sodas</em> serving
                    casado the way abuela used to make it.
                  </p>
                  <p>
                    Our standard transfers include one complimentary stop for photos or a quick stretch.
                    But if you want to transform your transfer into a half-day exploration, our{' '}
                    <strong className="text-green-700">Explorer Upgrade</strong> adds 3 extra hours to
                    your journey. Visit a waterfall on your way from the airport, stop at a sloth sanctuary,
                    or pull over at that perfect beach you spotted from the road.
                  </p>
                  <p>
                    The Explorer Upgrade also includes a cooler stocked with local beers, San Pellegrino,
                    sodas, and snacks for the road.
                  </p>
                </div>
              </div>

              {/* Right: Addon Cards */}
              <div className="lg:col-span-2 space-y-6">
                {/* Flex Protection Card */}
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border-2 border-orange-200 relative">
                  <div className="absolute -top-3 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Flex Protection</h4>
                      <p className="text-2xl font-bold text-orange-600">$59 <span className="text-sm font-normal text-gray-500">/ transfer</span></p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Change pickup time up to 2 hours later (even 1 hour before)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Free reschedule if your flight is delayed or cancelled</span>
                    </li>
                  </ul>
                </div>

                {/* Explorer Upgrade Card */}
                <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border-2 border-green-200 relative">
                  <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    DELUXE
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Explorer Upgrade</h4>
                      <p className="text-2xl font-bold text-green-600">$195 <span className="text-sm font-normal text-gray-500">/ transfer</span></p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>All Flex Protection benefits included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>+3 hours for scenic stops, waterfalls, viewpoints</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Cooler with beers, San Pellegrino, sodas & snacks</span>
                    </li>
                  </ul>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Add-ons can be selected during the booking process
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Coverage Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* Left: Main Message */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
                  <MapPin className="h-4 w-4 text-orange-300" />
                  <span className="text-white/90 font-semibold text-sm">Based in La Fortuna, Serving All Costa Rica</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
                  From the Caribbean to the Pacific, from the cloud forests to the beaches
                </h2>

                <p className="text-white/80 text-lg leading-relaxed mb-8">
                  Our headquarters is in La Fortuna, at the base of Arenal Volcano, but we keep vehicles
                  strategically positioned in San José, Monteverde, Manuel Antonio, and Guanacaste. This
                  allows us to cover inter-destination transfers efficiently across the country. One company,
                  one fleet, one standard of service.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Plane className="h-5 w-5 text-orange-300" />
                    <span className="text-white/90">SJO Airport</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Plane className="h-5 w-5 text-orange-300" />
                    <span className="text-white/90">Liberia Airport</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-300" />
                    <span className="text-white/90">La Fortuna / Arenal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-300" />
                    <span className="text-white/90">Monteverde</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-300" />
                    <span className="text-white/90">Manuel Antonio</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-300" />
                    <span className="text-white/90">Guanacaste Beaches</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-300" />
                    <span className="text-white/90">Caribbean Coast</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-green-300" />
                    <span className="text-white/90">Santa Teresa / Mal País</span>
                  </div>
                </div>
              </div>

              {/* Right: Support Box */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <Phone className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">With You From Booking to Drop-off</h3>
                    <p className="text-white/70">WhatsApp & Email Support</p>
                  </div>
                </div>

                <div className="space-y-4 text-white/80">
                  <p>
                    From the moment you book until we drop you off at your destination, our team stays
                    connected with you via WhatsApp or email. We monitor your flight, coordinate with
                    your driver, and handle any changes along the way.
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span className="text-white/90">ICT Licensed #4121-2025 | Fully Insured</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us - Consistent Colors */}
        <section className="relative py-20 bg-gray-50 overflow-hidden">

          <div className="container relative mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Direct Service. No Surprises.
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We personally operate every transfer to guarantee excellence.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 - Availability (BLUE Theme) */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-blue-600 group">
                <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <CheckCircle2 className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Guaranteed Availability</h3>
                <p className="text-gray-600 leading-relaxed">
                  We never overbook. We match our bookings strictly to our fleet capacity.
                  <br />
                  <strong className="text-blue-700 block mt-2">If we confirm it, we drive it.</strong>
                </p>
              </div>

              {/* Feature 2 - Private (GREEN Theme) */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-green-500 group">
                <div className="h-14 w-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors duration-300">
                  <Shield className="h-7 w-7 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">100% Private Fleet</h3>
                <p className="text-gray-600 leading-relaxed">
                  Enjoy the comfort of our modern, air-conditioned vans exclusively for your group.
                </p>
              </div>

              {/* Feature 3 - Local (ORANGE Theme) */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-orange-500 group">
                <div className="h-14 w-14 bg-orange-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-300">
                  <MapPin className="h-7 w-7 text-orange-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Local Expert Drivers</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our drivers are experienced professionals from La Fortuna. We know every curve of the road.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Steps */}
        <BookingSteps />

        {/* Payment Methods */}
        <PaymentMethods />
      </main>
    </>
  );
}
