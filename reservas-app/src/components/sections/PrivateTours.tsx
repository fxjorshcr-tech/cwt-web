// src/components/sections/PrivateTours.tsx
'use client';

import { ArrowRight, Mountain } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PrivateTours() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">

        {/* Simple Banner Card */}
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border-2 border-orange-200">
          <div className="grid md:grid-cols-2 gap-0">

            {/* Image Side */}
            <div className="relative h-64 md:h-auto">
              <Image
                src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-mountains-sky-costa-rica.webp"
                alt="Private Tours from La Fortuna"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
                quality={75}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>

              {/* Small Badge on Image */}
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-orange-600/90 backdrop-blur-sm rounded-lg">
                <span className="text-white text-xs font-bold uppercase tracking-wide">
                  Also Offering
                </span>
              </div>
            </div>

            {/* Content Side */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <Mountain className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-bold text-orange-600 uppercase tracking-wide">
                  Departing from La Fortuna
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Private Tours in Arenal
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Explore volcanoes, waterfalls, hanging bridges, and hot springs with our expert local guides.
                <strong className="text-gray-900"> 100% operated by us—</strong>private groups only.
              </p>

              <Link
                href="/private-tours"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl w-full md:w-auto"
              >
                Explore Tours
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}