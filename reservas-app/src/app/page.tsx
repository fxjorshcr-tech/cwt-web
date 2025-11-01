import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabaseClient";
import { BookingFormWrapper } from "@/components/home/BookingFormWrapper";

interface Location {
  id: string;
  name: string;
  display_name: string;
}

async function getLocations(): Promise<Location[]> {
  const supabase = createClient();
  
  const { data: routes, error } = await supabase
    .from('routes')
    .select('origen, destino');

  if (error) {
    console.error('❌ Error:', error);
    return [];
  }

  const locationsSet = new Set<string>();
  routes?.forEach(route => {
    if (route.origen) locationsSet.add(route.origen);
    if (route.destino) locationsSet.add(route.destino);
  });

  const locations: Location[] = Array.from(locationsSet)
    .map(loc => ({
      id: loc,
      name: loc,
      display_name: loc.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }))
    .sort((a, b) => a.display_name.localeCompare(b.display_name));

  console.log('✅ Locations:', locations.length);
  return locations;
}

export default async function Home() {
  const locations = await getLocations();

  return (
    <main className="min-h-screen">
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-40 h-12 md:w-48 md:h-14">
              <Image
                src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/private-shuttle-logo-white.png"
                alt="Can't Wait Travel"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white hover:text-gray-200 transition font-medium">Home</Link>
            <Link href="/transfers" className="text-white hover:text-gray-200 transition font-medium">Transfers</Link>
            <Link href="/about" className="text-white hover:text-gray-200 transition font-medium">About</Link>
            <Link href="/contact" className="text-white hover:text-gray-200 transition font-medium">Contact</Link>
            <Button size="lg" className="rounded-full px-8">Book</Button>
          </div>

          <div className="md:hidden">
            <Button size="lg" className="rounded-full">Book</Button>
          </div>
        </div>
      </nav>

      <section className="relative h-screen">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/private-shuttle-costa-rica-service.WEBP"
            alt="Costa Rica"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <div className="text-center mb-12 max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
              PRIVATE TRANSPORTATION
            </h1>
            <p className="text-xl md:text-2xl text-white mb-3 drop-shadow-lg font-semibold">
              Reliable Airport Shuttles & Door-to-Door Service in Costa Rica
            </p>
            <p className="text-base md:text-lg text-white/95 max-w-2xl mx-auto drop-shadow-md">
              Safe, comfortable, and professional transportation across Costa Rica
            </p>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      <section className="relative -mt-32 z-20 px-6 pb-20">
        <BookingFormWrapper locations={locations} />
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Service</h3>
              <p className="text-gray-600">Experienced drivers</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">No hidden fees</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Availability</h3>
              <p className="text-gray-600">Always ready</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="relative w-40 h-10">
              <Image
                src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/private-shuttle-logo-white.png"
                alt="Can't Wait Travel"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Can't Wait Travel</p>
        </div>
      </footer>
    </main>
  );
}