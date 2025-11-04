// app/travel-guide/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { notFound } from 'next/navigation';

// This will be populated as you create each guide
const destinationData: Record<string, any> = {
  'san-jose-sjo': {
    name: 'San José (SJO)',
    title: 'Complete San José Travel Guide',
    description: 'Everything you need to know about Costa Rica\'s capital',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/sjo-costa-rica-city-sunset.webp',
    isPublished: true
  },
  'la-fortuna-arenal': {
    name: 'La Fortuna / Arenal Volcano',
    title: 'Complete La Fortuna & Arenal Volcano Guide',
    description: 'The ultimate guide to Costa Rica\'s adventure capital',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp',
    isPublished: true
  },
  'puerto-viejo-cahuita': {
    name: 'Puerto Viejo / Cahuita',
    isPublished: false
  },
  'manuel-antonio': {
    name: 'Manuel Antonio',
    isPublished: false
  },
  'quepos': {
    name: 'Quepos',
    isPublished: false
  },
  'uvita': {
    name: 'Uvita',
    isPublished: false
  },
  'samara-nosara': {
    name: 'Sámara / Nosara',
    isPublished: false
  },
  'guanacaste-beaches': {
    name: 'Guanacaste Beaches',
    isPublished: false
  },
  'monteverde': {
    name: 'Monteverde Cloud Forest',
    isPublished: false
  },
  'rincon-de-la-vieja': {
    name: 'Rincón de la Vieja',
    isPublished: false
  }
};

export async function generateStaticParams() {
  return Object.keys(destinationData).map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const destination = destinationData[params.slug];
  
  if (!destination) {
    return {
      title: 'Destination Not Found'
    };
  }

  return {
    title: destination.title || `${destination.name} Travel Guide | Costa Rica`,
    description: destination.description || `Complete travel guide for ${destination.name}, Costa Rica`
  };
}

export default function DestinationPage({ params }: { params: { slug: string } }) {
  const destination = destinationData[params.slug];

  if (!destination) {
    notFound();
  }

  // If destination is not published yet, show coming soon page
  if (!destination.isPublished) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-20 max-w-4xl">
          <Link
            href="/travel-guide"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Travel Guide
          </Link>

          <div className="text-center py-20">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
                <AlertCircle className="h-10 w-10 text-orange-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {destination.name} Guide Coming Soon
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We're currently working on this comprehensive guide. Check back soon for 
              insider tips, practical advice, and everything you need to know about {destination.name}.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/travel-guide"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              >
                View Other Guides
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-lg border-2 border-gray-200 transition-colors"
              >
                Contact Us for Info
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Published destination page
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        </div>

        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-6 pb-12 max-w-6xl">
            <Link
              href="/travel-guide"
              className="inline-flex items-center gap-2 text-white hover:text-gray-200 mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Travel Guide
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl">
              {destination.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content - TO BE CUSTOMIZED PER DESTINATION */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {destination.description}
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                📝 Content Coming Soon
              </h3>
              <p className="text-gray-700">
                This guide is currently being developed. We're gathering the most relevant information,
                insider tips, and practical advice for {destination.name}.
              </p>
            </div>

            {/* Placeholder sections that will be customized */}
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Getting There</h2>
            <p className="text-gray-600">Transportation options and tips...</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Where to Stay</h2>
            <p className="text-gray-600">Accommodation recommendations...</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Things to Do</h2>
            <p className="text-gray-600">Top activities and attractions...</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Local Tips</h2>
            <p className="text-gray-600">Insider advice from locals...</p>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Transportation to {destination.name}?
            </h3>
            <p className="text-gray-600 mb-6">
              Book your private shuttle and arrive safely and comfortably
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}