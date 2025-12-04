// src/components/sections/TrustedBy.tsx
// Trusted By section - Shows logos of partner businesses
'use client';

import Image from 'next/image';
import Link from 'next/link';

const PARTNERS = [
  {
    name: 'Arenal EcoGlide',
    logo: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/logo-ecoglide.webp',
    url: 'https://www.arenalecoglide.com',
  },
  {
    name: 'Skyline Canopy Tour',
    logo: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/logo-skyline.webp',
    url: 'https://www.skylinecanopytour.com',
  },
];

export default function TrustedBy() {
  return (
    <section className="py-10 sm:py-12 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
          Trusted by Local Businesses
        </p>

        <div className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16">
          {PARTNERS.map((partner) => (
            <Link
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
              title={partner.name}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={140}
                height={60}
                className="h-12 sm:h-14 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
