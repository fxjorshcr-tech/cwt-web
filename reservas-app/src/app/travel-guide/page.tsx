// app/travel-guide/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, MapPin, ArrowRight, Compass, Clock, Users } from 'lucide-react';
import BookingNavbar from '@/components/booking/BookingNavbar';

// Zonas geográficas (sin Central Valley)
const ZONES = [
  { id: 'all', name: 'All Destinations', icon: '🌎' },
  { id: 'airports', name: 'Airports', icon: '✈️' },
  { id: 'northern', name: 'Northern Zone', icon: '🌋' },
  { id: 'caribbean', name: 'Caribbean', icon: '🌴' },
  { id: 'pacific-central', name: 'Central Pacific', icon: '🏖️' },
  { id: 'guanacaste', name: 'Guanacaste', icon: '☀️' },
  { id: 'pacific-south', name: 'South Pacific', icon: '🐒' },
];

const destinations = [
  {
    id: 'san-jose-sjo',
    zone: 'airports',
    name: 'San José (SJO Airport)',
    subtitle: 'Main Gateway • Museums • City Tours',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/sjo-costa-rica-city-sunset.webp',
    
    intro: 'Juan Santamaría International Airport (SJO) is your gateway to Costa Rica. Modern, well-organized, and staffed by friendly English-speaking personnel. Most travelers use it as a transit hub to beaches or rainforests.',
    
    highlights: ['Immigration 30min-1hr', 'Pre-book shuttles', 'ATMs for best rates', 'Airport hotels nearby'],
    
    tips: [
      'Walk past ride hustlers confidently - look for your pre-arranged driver with your name sign.',
      'ATMs in baggage claim offer best exchange rates, much better than currency booths.',
      'Professional drivers wait for you regardless of immigration delays - pre-booking is key.',
      'Hotels near airport (Alajuela) perfect for late arrivals or early departures.',
      'Allow 3 hours before international departures during high season (Dec-Apr).',
      'Download Kölbi SIM card ($20 in arrivals) for instant connectivity.'
    ],
    
    experiences: [
      'National Museum: Pre-Columbian artifacts, butterfly garden, historic fortress',
      'Gold Museum: Stunning underground collection of ancient gold craftsmanship',
      'Mercado Central: Authentic market for traditional casados and local souvenirs',
      'Barrio Escalante: Trendy neighborhood with craft breweries and restaurants'
    ]
  },

  {
    id: 'liberia-lir',
    zone: 'airports',
    name: 'Liberia (LIR Airport)',
    subtitle: 'Beach Gateway • Fast Immigration • Dry & Sunny',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/sjo-costa-rica-city-sunset.webp',
    
    intro: 'Smaller airport means faster everything! Immigration takes 20-40min vs 1-2hrs at SJO. Perfect for beach vacations - Papagayo is 30min away, Tamarindo 1hr.',
    
    highlights: ['20-40min immigration', '30min to beaches', 'Less crowded', 'Hot & sunny'],
    
    tips: [
      'Immigration is famously fast - your beach vacation starts immediately.',
      'Papagayo Peninsula 30min, Tamarindo 1hr, Flamingo 1.5hrs from airport.',
      'Much hotter than San José - sunscreen and hydration from arrival.',
      'December-April is peak season - book hotels and shuttles well in advance.',
      'Kölbi booth in arrivals for instant SIM cards ($20).',
      'Consider airport hotel for late arrivals, then beach next morning.'
    ],
    
    experiences: [
      'Direct beach transfers: Pre-arranged shuttle straight to your hotel',
      'Rincón de la Vieja: Active volcano 1hr away, perfect first/last day activity',
      'Palo Verde: Wetlands with incredible bird life and crocodiles',
      'Liberia City: Authentic white colonial buildings and local markets'
    ]
  },

  {
    id: 'la-fortuna',
    zone: 'northern',
    name: 'La Fortuna / Arenal',
    subtitle: 'Volcano • Hot Springs • Waterfalls • Adventure',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp',
    
    intro: 'Majestic Arenal Volcano rises above a landscape of waterfalls, hot springs, and endless adventures. Costa Rica\'s adventure capital where you can zip through rainforest, soak in volcanic waters, and spot incredible wildlife.',
    
    highlights: ['Arenal Volcano', 'Natural hot springs', 'La Fortuna Waterfall', 'Hanging bridges'],
    
    tips: [
      'Early morning = best volcano views before clouds roll in around 10am.',
      'Choose hot springs based on vibe: Tabacón (luxury), Baldi (family fun), Ecotermales (intimate).',
      'La Fortuna Waterfall: 500 steps down, swimming at base is unforgettable.',
      'Book popular tours 2-3 days ahead during high season.',
      'Pack rain jacket - brief afternoon showers keep everything lush.',
      'Local sodas serve delicious $6-8 casados with authentic Costa Rican flavor.'
    ],
    
    experiences: [
      'Arenal Volcano National Park: Hike through rainforest and ancient lava fields',
      'Natural Hot Springs: Soak in volcanic-heated mineral pools after hiking',
      'Hanging Bridges: Walk through rainforest canopy spotting sloths and toucans',
      'La Fortuna Waterfall: 70-meter cascade with emerald swimming hole'
    ]
  },

  {
    id: 'monteverde',
    zone: 'northern',
    name: 'Monteverde Cloud Forest',
    subtitle: 'Cloud Forest • Hanging Bridges • Zip-lining',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    
    intro: 'Walking through clouds. Mystical cloud forest at 4,600ft elevation where mist creates hanging gardens on every tree. Home to the legendary Resplendent Quetzal and some of Central America\'s most beautiful biodiversity.',
    
    highlights: ['Cloud forest reserves', 'Suspension bridges', 'Quetzal spotting', 'Zip-line tours'],
    
    tips: [
      'Pack layers - cooler here (60-75°F). Rain jacket essential year-round.',
      'Guides dramatically improve experience - they spot 10x more wildlife.',
      'Book reserve tickets online 2-3 days ahead during high season.',
      'Last 30km is bumpy unpaved road - allow 4-5hrs from San José.',
      'Night walks reveal completely different animals - tarantulas, frogs, snakes.',
      'Good hiking shoes with traction essential - trails can be muddy.'
    ],
    
    experiences: [
      'Cloud Forest Reserves: Hike mystical trails spotting Quetzals and wildlife',
      'Hanging Bridges: Walk through canopy 150ft high with spectacular views',
      'Zipline Tours: Fly through clouds on Costa Rica\'s original canopy tours',
      'Night Walks: Discover nocturnal creatures in the transformed forest'
    ]
  },

  {
    id: 'rincon-vieja',
    zone: 'northern',
    name: 'Rincón de la Vieja',
    subtitle: 'Active Volcano • Mud Pots • Ranch Life',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    
    intro: 'Active volcano with bubbling mud pots, volcanic hot springs, and authentic hacienda experiences. Just 1 hour from Liberia airport - perfect first or last stop on a Guanacaste beach trip.',
    
    highlights: ['Bubbling mud pots', 'Volcanic hot springs', 'Waterfall rappelling', 'Horseback riding'],
    
    tips: [
      'Only 1hr from LIR airport - efficient for arriving/departing days.',
      'Start hikes by 7-8am to beat intense heat (it gets HOT!).',
      'Stay at hacienda lodge for full ranch experience with activities included.',
      'Hot springs after volcano hiking = therapeutic muscle relief.',
      'Two sectors: Las Pailas (popular, volcanic features) or Santa María (remote, waterfalls).',
      'Waterfall rappelling doesn\'t require experience - guides make it accessible.'
    ],
    
    experiences: [
      'Las Pailas Trail: Bubbling mud pots, steaming fumaroles, volcanic craters',
      'Volcanic Hot Springs: Therapeutic mineral pools surrounded by nature',
      'Waterfall Rappelling: Thrilling descent down stunning blue waterfalls',
      'Ranch Horseback Riding: Authentic riding through working cattle ranches'
    ]
  },

  {
    id: 'rio-celeste',
    zone: 'northern',
    name: 'Río Celeste / Tenorio',
    subtitle: 'Turquoise Waterfall • Volcanic Phenomenon',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    
    intro: 'Impossibly blue water created by volcanic minerals mixing at river confluence. One of Costa Rica\'s most magical natural wonders hidden in Tenorio Volcano National Park.',
    
    highlights: ['Blue waterfall', 'Where rivers meet & turn blue', 'Jungle trails', 'Hot springs'],
    
    tips: [
      'Buy tickets online before you go at sinac.go.cr - NOT sold at entrance.',
      'Check water color before visiting - heavy rain temporarily turns it brown.',
      'Arrive at 8am opening to beat tour bus crowds arriving around 10am.',
      'Rent rubber boots at entrance ($3-5) if trails are muddy.',
      'Perfect routing: stop between La Fortuna and Guanacaste beaches.',
      'Complete full trail - where rivers meet (Teñideros) is equally impressive as waterfall.'
    ],
    
    experiences: [
      'Río Celeste Waterfall: 98-foot turquoise cascade into blue pool',
      'Teñideros: Watch clear rivers merge and instantly turn bright blue',
      'Blue Lagoon: Still pool of impossibly blue water surrounded by jungle',
      'Bubbling Hot Springs: Volcanic springs bubbling up from underground'
    ]
  },

  {
    id: 'manuel-antonio',
    zone: 'pacific-central',
    name: 'Manuel Antonio',
    subtitle: 'National Park • Beach & Wildlife • Easy Trails',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    
    intro: 'Costa Rica\'s crown jewel combining white-sand beaches with incredible wildlife. Easy trails suitable for all fitness levels with guaranteed monkey, sloth, and toucan sightings.',
    
    highlights: ['National park', 'Beach coves', '4 monkey species', 'Easy wildlife viewing'],
    
    tips: [
      'ESSENTIAL: Book park tickets online in advance at sinac.go.cr - NOT sold at entrance.',
      'Hire a guide at entrance ($80-150) - they spot 10x more wildlife with scopes.',
      'Arrive at 7am opening - cooler temps, more active wildlife, fewer crowds.',
      'Park closed on Tuesdays for maintenance!',
      'Stay in nearby Quepos town for 30-40% lower prices, just 10min away.',
      'Nauyaca Waterfalls (1hr away) consistently rated as visitors\' favorite experience.'
    ],
    
    experiences: [
      'Manuel Antonio Park: White-sand beaches meet jungle with abundant wildlife',
      'Nauyaca Waterfalls: Spectacular two-tier cascade with massive swimming pools',
      'Catamaran Sunset Cruise: Sail coastline, snorkel, dolphins, open bar',
      'Damas Island Mangroves: Kayak through tunnels spotting crocodiles and monkeys'
    ]
  },

  {
    id: 'quepos',
    zone: 'pacific-central',
    name: 'Quepos',
    subtitle: 'Sport Fishing • Local Town • Better Value',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    
    intro: 'Real Costa Rican town just 7km from Manuel Antonio with world-class sport fishing, authentic local flavor, and hotels 30-40% cheaper than tourist strip.',
    
    highlights: ['World-class fishing', 'Farmers market', 'Local restaurants', 'Marina area'],
    
    tips: [
      'Stay in Quepos, visit Manuel Antonio - save money, experience real Costa Rica.',
      'Friday & Saturday farmers market is vibrant with fresh produce and local food.',
      'Sport fishing for marlin and sailfish - world-renowned year-round.',
      'Marina Pez Vela has upscale waterfront dining at reasonable prices.',
      'Local sodas serve authentic $6-8 casados - ask locals for recommendations.',
      'Quepos has full services - banks, ATMs, supermarkets, pharmacies.'
    ],
    
    experiences: [
      'Sport Fishing Charters: Marlin, sailfish, dorado, and tuna',
      'Quepos Farmers Market: Authentic Friday/Saturday morning market',
      'Marina Pez Vela: Waterfront dining and sunset watching',
      'Rainmaker Reserve: Pristine aerial walkways and waterfalls, less crowded'
    ]
  },

  {
    id: 'uvita',
    zone: 'pacific-south',
    name: 'Uvita',
    subtitle: 'Whale Watching • Whale\'s Tail Beach',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    
    intro: 'Pristine South Pacific coast with the famous Whale\'s Tail sandbar formation. Humpback whales migrate here from both hemispheres - nearly 9 months of whale presence.',
    
    highlights: ['Whale\'s Tail sandbar', 'Humpback whales', 'Pristine beaches', 'Waterfalls'],
    
    tips: [
      'Whale\'s Tail sandbar only visible at low tide - check tide tables before visiting.',
      'Two whale seasons: July-Nov (Northern) & Dec-Apr (Southern) - nearly year-round!',
      'Marino Ballena Park entry just $6 - incredible value.',
      'Nauyaca Waterfalls tours from Uvita - one of CR\'s best waterfall experiences.',
      'Town is spread out - rental car or bike makes exploration easier.',
      'Saturday farmers market has excellent organic produce and prepared foods.'
    ],
    
    experiences: [
      'Walk the Whale\'s Tail: Unique sandbar formation extending into ocean',
      'Humpback Whale Watching: Mothers with calves commonly seen',
      'Marino Ballena Park: Snorkel coral reefs and walk pristine beaches',
      'Nauyaca Waterfalls: Journey to spectacular two-tier cascade'
    ]
  },

  {
    id: 'puerto-jimenez',
    zone: 'pacific-south',
    name: 'Puerto Jiménez / Osa',
    subtitle: 'Corcovado • Most Biodiverse Place on Earth',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    
    intro: 'Gateway to Corcovado National Park - National Geographic called it "the most biologically intense place on Earth." Wildlife encounters guaranteed, not "maybe."',
    
    highlights: ['Corcovado Park', 'All 4 monkey species', 'Tapirs & peccaries', 'Scarlet macaws'],
    
    tips: [
      'FLY from SJO (55min, ~$140) - driving is 8+ hours on terrible roads.',
      'Corcovado requires certified guide by LAW - tours $80-150 including everything.',
      'Pack for serious rain year-round - it\'s one of CR\'s wettest regions.',
      'Wildlife is GUARANTEED - scarlet macaws fly over town daily.',
      'Bring sufficient cash - ATMs occasionally run out.',
      'Stay minimum 3 days - given effort to reach, you\'ll want longer anyway.'
    ],
    
    experiences: [
      'Corcovado National Park: Tapirs, all 4 monkeys, possibly jaguars',
      'Scarlet Macaws: Central America\'s largest population flies overhead daily',
      'Matapalo Beach: Beautiful beach with incredible tidepools at low tide',
      'Golfo Dulce Kayaking: Dolphins, sea turtles, bioluminescence at night'
    ]
  },

  {
    id: 'puerto-viejo',
    zone: 'caribbean',
    name: 'Puerto Viejo / Cahuita',
    subtitle: 'Caribbean Vibes • Afro-Caribbean Culture',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    
    intro: 'Costa Rica\'s Caribbean soul with distinct Afro-Caribbean and indigenous BriBri culture. Reggae rhythms, turquoise waters, incredible snorkeling, and laid-back vibes.',
    
    highlights: ['Caribbean beaches', 'Snorkeling & diving', 'Afro-Caribbean food', 'BriBri tours'],
    
    tips: [
      'Rent a bike - best way to explore beaches between Puerto Viejo and Manzanillo.',
      'Try Caribbean food: rice & beans in coconut milk, rondón stew, patí pastries.',
      'Always lock your bike at beach stops - takes 2 seconds, prevents hassle.',
      'Cahuita National Park: easy wildlife spotting, entry by donation.',
      '4-5hr drive to SJO - consider staying near airport night before early flights.',
      'Bring cash - ATMs available but many small places prefer efectivo.'
    ],
    
    experiences: [
      'Cahuita National Park: Flat coastal trail, easy wildlife, excellent snorkeling',
      'Beach Hopping by Bike: Ride from Puerto Viejo to Manzanillo stopping everywhere',
      'BriBri Indigenous Experience: Learn about culture, medicinal plants, chocolate',
      'Caribbean Snorkeling: Healthy coral reefs with abundant tropical fish'
    ]
  },

  {
    id: 'tamarindo',
    zone: 'guanacaste',
    name: 'Guanacaste Beaches',
    subtitle: 'Tamarindo • Conchal • Flamingo • Papagayo',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    
    intro: 'Gold coast beaches from lively Tamarindo to luxury Papagayo. Consistent sunshine, warm water year-round, excellent surfing, and spectacular sunsets.',
    
    highlights: ['Tamarindo surf & nightlife', 'Conchal shell beach', 'Papagayo luxury', 'Catamaran tours'],
    
    tips: [
      'Tamarindo = convenience, nightlife, surf schools - perfect for first-timers.',
      'Playa Conchal made of crushed shells - crystal clear water, bring own food/drinks.',
      'Papagayo Peninsula = luxury resorts with excellent snorkeling right offshore.',
      'Catamaran sunset tours ($85pp) consistently rated as top Guanacaste activity.',
      'December-March strong Papagayo winds - great for windsurfing, challenging for beach lounging.',
      'Playa Grande leatherback turtle nesting Oct-March - book authorized tours ahead.'
    ],
    
    experiences: [
      'Tamarindo Surf: Gentle beach breaks perfect for beginners, warm water',
      'Playa Conchal Paradise: Crushed shell sand, crystal clear snorkeling water',
      'Catamaran Sailing: Snorkel, spot dolphins, sunset with open bar included',
      'Playa Grande Turtles: Watch giant leatherbacks nest under stars (Oct-Mar)'
    ]
  },

  {
    id: 'samara-nosara',
    zone: 'guanacaste',
    name: 'Sámara / Nosara',
    subtitle: 'Family Beaches • Yoga • Surf • Turtles',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    
    intro: 'Two distinct beach towns 40min apart. Sámara offers family-friendly bay perfect for kids. Nosara is upscale yoga & surf destination with powerful waves.',
    
    highlights: ['Sámara family bay', 'Nosara yoga studios', 'Ostional turtles', 'Authentic vibes'],
    
    tips: [
      'Sámara\'s horseshoe bay has gentle waves - perfect for kids and beginner surfers.',
      'Nosara has powerful surf for experienced riders - take lessons if learning.',
      'Roads partially unpaved - passable but rough. 4WD helps in rainy season.',
      'Ostional turtle arribadas (mass nesting) Sep-Nov - thousands simultaneously!',
      'Visit both in one trip - they\'re only 40min apart with different vibes.',
      'Bring extra cash - both towns\' ATMs sometimes run out on weekends.'
    ],
    
    experiences: [
      'Sámara Beach: Protected bay with gentle waves, long sandy beach',
      'Nosara Surfing: World-class waves at Playa Guiones year-round',
      'Yoga in Nosara: Drop-in classes at renowned international studios',
      'Ostional Arribada: Witness thousands of turtles nesting simultaneously'
    ]
  },

  {
    id: 'montezuma-st',
    zone: 'guanacaste',
    name: 'Montezuma / Santa Teresa',
    subtitle: 'Bohemian Paradise • World-Class Surf • Remote',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    
    intro: 'End of the road paradise at tip of Nicoya Peninsula. Bohemian Montezuma, upscale yoga-surf Santa Teresa, and pristine Malpaís beaches.',
    
    highlights: ['Montezuma waterfall', 'Santa Teresa surf', 'Yoga wellness', 'Remote beaches'],
    
    tips: [
      'Take Puntarenas ferry (1hr crossing) - arrive 1hr early with vehicle.',
      'Roads partially unpaved and rough - part of what keeps it special!',
      'Bring extra cash - ATMs run out frequently, especially weekends.',
      'Montezuma Waterfall has 25ft cliff jumping - watch locals first to see where.',
      'Santa Teresa is pricier than Montezuma but has stunning beaches.',
      'Sunset at Playa Carmen is mandatory daily ritual - bring a beverage.'
    ],
    
    experiences: [
      'Montezuma Waterfalls: Three-tier cascade with natural pools and cliff jumping',
      'Santa Teresa Surfing: World-class waves, warm water, thriving surf culture',
      'Cabo Blanco Reserve: Costa Rica\'s first protected area with pristine nature',
      'Yoga & Wellness: Multiple studios, retreat centers, holistic offerings'
    ]
  },
];

export default function TravelGuidePage() {
  const [activeZone, setActiveZone] = useState('all');
  const [openDestinations, setOpenDestinations] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (window.location.hash) {
      const destinationId = window.location.hash.slice(1);
      setOpenDestinations(new Set([destinationId]));
      setTimeout(() => {
        document.getElementById(destinationId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  const filteredDestinations = activeZone === 'all' 
    ? destinations 
    : destinations.filter(d => d.zone === activeZone);

  const toggleDestination = (id: string) => {
    const newOpen = new Set(openDestinations);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenDestinations(newOpen);
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <>
      {/* ✅ NAVBAR */}
      <BookingNavbar />
      
      <main className="min-h-screen bg-white">
      {/* Hero Section - Nueva imagen liviana */}
      <section className="relative h-[65vh] min-h-[450px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Beatiful-waterfall-costa-rica-nature.webp"
            alt="Costa Rica Travel Guide - Beautiful Waterfall"
            fill
            className="object-cover"
            priority
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <Compass className="h-5 w-5 text-white" />
            <span className="text-white text-sm font-medium">EXPLORE COSTA RICA 2026</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            Costa Rica Travel Guide
          </h1>
          
          <p className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
            Expert guides to 14 destinations. Practical tips from locals who live here.
          </p>
        </div>
      </section>

      {/* Sticky Filter Tabs */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {ZONES.map(zone => (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap font-semibold transition-all ${
                  activeZone === zone.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-base">{zone.icon}</span>
                <span className="text-sm">{zone.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Destinations Accordion */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Intro Box */}
          <div className="mb-10 bg-blue-50 border-l-4 border-blue-600 rounded-r-xl p-6">
            <p className="text-gray-700 leading-relaxed">
              <span className="font-bold text-blue-700">💡 How to use this guide:</span> Click any destination below to expand complete details. 
              Each guide includes insider tips, top experiences, and booking links. Multiple destinations can be open simultaneously.
            </p>
          </div>

          <div className="space-y-4">
            {filteredDestinations.map((dest) => {
              const isOpen = openDestinations.has(dest.id);
              
              return (
                <div
                  key={dest.id}
                  id={dest.id}
                  className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all"
                >
                  {/* Clickable Header */}
                  <button
                    onClick={() => toggleDestination(dest.id)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {dest.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-0.5">{dest.subtitle}</p>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`h-6 w-6 text-gray-400 transition-transform flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Expandable Content */}
                  {isOpen && (
                    <div className="border-t border-gray-200">
                      {/* Mini Hero Image */}
                      <div className="relative h-52 md:h-64">
                        <Image
                          src={dest.image}
                          alt={dest.name}
                          fill
                          className="object-cover"
                          quality={65}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>

                      <div className="p-6 md:p-8 space-y-6">
                        {/* Intro */}
                        <p className="text-lg text-gray-700 leading-relaxed">
                          {dest.intro}
                        </p>

                        {/* Highlights */}
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <span>✨</span> Quick Highlights
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {dest.highlights.map((h, i) => (
                              <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                                {h}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Insider Tips */}
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <span>💡</span> Insider Tips
                          </h4>
                          <div className="space-y-2">
                            {dest.tips.map((tip, i) => (
                              <div key={i} className="flex items-start gap-2 text-gray-700">
                                <span className="text-green-600 mt-1 flex-shrink-0">•</span>
                                <span className="text-sm leading-relaxed">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Top Experiences */}
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <span>⭐</span> Top Experiences
                          </h4>
                          <div className="grid md:grid-cols-2 gap-3">
                            {dest.experiences.map((exp, i) => (
                              <div key={i} className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  <span className="font-semibold text-gray-900">{exp.split(':')[0]}:</span>
                                  {exp.split(':')[1]}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTAs */}
                        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                          <Link
                            href="/#booking"
                            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <span>Book Shuttle</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          <Link
                            href="/contact"
                            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 text-center rounded-lg font-semibold border-2 border-gray-300 transition-colors"
                          >
                            Ask Questions
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Explore Costa Rica?
          </h2>
          <p className="text-lg text-blue-100 mb-8 leading-relaxed">
            Book your private shuttle with professional drivers. Door-to-door service to any destination.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#booking"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-bold rounded-xl transition-colors shadow-xl"
            >
              <span>Book Transportation</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl border-2 border-blue-500 transition-colors"
            >
              Contact Us
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Professional Drivers</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Door-to-Door</span>
            </div>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}