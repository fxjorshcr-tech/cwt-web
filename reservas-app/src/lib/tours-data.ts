// src/lib/tours-data.ts
/**
 * ==========================================
 * TOURS DATA - LA FORTUNA PRIVATE TOURS
 * ==========================================
 * Todos los tours operados desde La Fortuna
 */

export interface TourItineraryItem {
  time: string;
  activity: string;
  description?: string;
}

export interface Tour {
  id: string;
  name: string;
  slug: string;
  category: 'full-day' | 'half-day';
  shortDescription: string;
  longDescription: string;
  duration: string;
  durationHours: number;
  pickupTime: string;
  basePrice: number;        // Precio base (mínimo 2 personas)
  pricePerExtraPerson: number;  // Precio por persona extra (3-6)
  minPassengers: number;
  maxPassengers: number;
  minAge: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  image: string;
  gallery?: string[];
  itinerary: TourItineraryItem[];
  included: string[];
  notIncluded: string[];
  whatToBring: string[];
  importantNotes: string[];
  highlights: string[];
}

// ========================================
// FULL DAY TOURS (10 horas)
// ========================================

export const FULL_DAY_TOURS: Tour[] = [
  {
    id: 'bajos-del-toro-blue-falls',
    name: 'Bajos del Toro Blue Falls Waterfall',
    slug: 'bajos-del-toro-blue-falls',
    category: 'full-day',
    shortDescription: 'Discover the hidden gem of Costa Rica - stunning blue waterfall in pristine cloud forest',
    longDescription: 'Experience one of Costa Rica\'s most breathtaking hidden treasures. The Bajos del Toro Blue Falls is a spectacular turquoise waterfall cascading 90 meters into a pristine canyon. This full-day adventure takes you through lush cloud forests, misty trails, and rewards you with views of one of the country\'s most photographed waterfalls. Perfect for nature lovers and photographers seeking an off-the-beaten-path experience.',
    duration: '10 hours',
    durationHours: 10,
    pickupTime: '8:00 AM',
    basePrice: 260,
    pricePerExtraPerson: 59,
    minPassengers: 2,
    maxPassengers: 6,
    minAge: 2,
    difficulty: 'Easy',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    gallery: [
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Beatiful-waterfall-costa-rica-nature.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp',
    ],
    highlights: [
      'Visit the stunning 90-meter Blue Falls waterfall',
      'Hike through pristine cloud forest trails',
      'See multiple waterfalls in one location',
      'Traditional Costa Rican lunch included',
      'Small group experience (max 6 people)',
      'Expert bilingual guide'
    ],
    itinerary: [
      {
        time: '8:00 AM',
        activity: 'Hotel Pickup',
        description: 'Comfortable pickup from your hotel in La Fortuna area'
      },
      {
        time: '9:30 AM',
        activity: 'Arrive at Bajos del Toro',
        description: 'Begin your adventure with a safety briefing and trail orientation'
      },
      {
        time: '10:00 AM',
        activity: 'Waterfall Hike',
        description: 'Hike through cloud forest to reach the magnificent Blue Falls viewpoint'
      },
      {
        time: '11:30 AM',
        activity: 'Explore the Area',
        description: 'Discover additional waterfalls and enjoy the pristine nature'
      },
      {
        time: '1:00 PM',
        activity: 'Traditional Lunch',
        description: 'Enjoy authentic Costa Rican cuisine at a local restaurant'
      },
      {
        time: '2:30 PM',
        activity: 'Return Journey',
        description: 'Scenic drive back through the mountains'
      },
      {
        time: '6:00 PM',
        activity: 'Hotel Drop-off',
        description: 'Return to your hotel in La Fortuna'
      }
    ],
    included: [
      'Professional bilingual guide',
      'Round-trip transportation in A/C van',
      'Park entrance fees',
      'Traditional Costa Rican lunch',
      'Bottled water and snacks',
      'All taxes and service charges'
    ],
    notIncluded: [
      'Additional beverages',
      'Gratuities (optional)',
      'Personal expenses',
      'Travel insurance'
    ],
    whatToBring: [
      'Comfortable hiking shoes (closed-toe)',
      'Light rain jacket or poncho',
      'Sunscreen and sunglasses',
      'Insect repellent',
      'Camera',
      'Small backpack',
      'Extra change of clothes (optional)'
    ],
    importantNotes: [
      'Minimum age: 2 years',
      'Moderate fitness level required',
      'Tour operates rain or shine',
      'Pickup available from La Fortuna area hotels',
      'Please inform us of any dietary restrictions',
      'Bring cash for personal purchases'
    ]
  },

  {
    id: 'poas-la-paz-waterfall',
    name: 'Poás Volcano & La Paz Waterfall Gardens',
    slug: 'poas-la-paz-waterfall',
    category: 'full-day',
    shortDescription: 'Active volcano crater, cloud forest trails, and 5 spectacular waterfalls in one amazing day',
    longDescription: 'Combine two of Costa Rica\'s most iconic natural wonders in one unforgettable day. Stand at the edge of Poás\' active volcanic crater, walk through mystical cloud forests, and explore the magnificent La Paz Waterfall Gardens featuring five spectacular waterfalls. This comprehensive tour also includes visits to a wildlife rescue center, hummingbird garden, and butterfly observatory.',
    duration: '10 hours',
    durationHours: 10,
    pickupTime: '8:00 AM',
    basePrice: 260,
    pricePerExtraPerson: 59,
    minPassengers: 2,
    maxPassengers: 6,
    minAge: 2,
    difficulty: 'Easy',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/sjo-costa-rica-city-sunset.webp',
    gallery: [
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/sjo-costa-rica-city-sunset.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Beatiful-waterfall-costa-rica-nature.webp',
    ],
    highlights: [
      'View Poás active volcanic crater',
      'Visit 5 magnificent waterfalls',
      'Wildlife rescue center tour',
      'Hummingbird garden experience',
      'Walk through cloud forest trails',
      'Butterfly & orchid gardens'
    ],
    itinerary: [
      {
        time: '8:00 AM',
        activity: 'Hotel Pickup',
        description: 'Start your day with pickup from La Fortuna'
      },
      {
        time: '10:00 AM',
        activity: 'Poás Volcano National Park',
        description: 'Witness the impressive active crater and walk cloud forest trails'
      },
      {
        time: '11:30 AM',
        activity: 'La Paz Waterfall Gardens',
        description: 'Begin exploring the five waterfalls and wildlife areas'
      },
      {
        time: '1:00 PM',
        activity: 'Lunch at Mountain Lodge',
        description: 'Traditional buffet lunch with mountain views'
      },
      {
        time: '2:00 PM',
        activity: 'Continue Exploration',
        description: 'Visit butterfly observatory, hummingbird garden, and wildlife rescue center'
      },
      {
        time: '4:00 PM',
        activity: 'Return Journey',
        description: 'Scenic drive back to La Fortuna'
      },
      {
        time: '6:00 PM',
        activity: 'Hotel Drop-off',
        description: 'Return to your accommodation'
      }
    ],
    included: [
      'Expert bilingual naturalist guide',
      'Transportation in A/C vehicle',
      'Poás National Park entrance',
      'La Paz Waterfall Gardens entrance',
      'Buffet lunch',
      'Bottled water and snacks',
      'All taxes'
    ],
    notIncluded: [
      'Additional drinks at restaurant',
      'Souvenirs',
      'Tips for guide',
      'Travel insurance'
    ],
    whatToBring: [
      'Warm jacket or sweater (high altitude)',
      'Comfortable walking shoes',
      'Rain jacket',
      'Camera',
      'Sunscreen',
      'Small daypack',
      'Binoculars (optional)'
    ],
    importantNotes: [
      'Poás crater may close due to volcanic activity',
      'Cool temperatures at high altitude',
      'Moderate walking required',
      'Suitable for all ages (2+)',
      'Tour operates daily',
      'Advance reservation required'
    ]
  },

  {
    id: 'rio-celeste-frog-sloth-tour',
    name: 'Río Celeste + Frog & Sloth Sanctuary',
    slug: 'rio-celeste-frog-sloth-tour',
    category: 'full-day',
    shortDescription: 'Magical turquoise waterfall, jungle hike, and encounter amazing frogs and sloths up close',
    longDescription: 'Discover the mystical Río Celeste, where volcanic minerals create a surreal turquoise river and waterfall. Hike through Tenorio National Park\'s pristine rainforest, see where two rivers merge to create the famous blue color, and explore bubbling volcanic pools. After lunch, visit a specialized frog and sloth sanctuary to learn about and observe these fascinating creatures in their protected habitat.',
    duration: '10 hours',
    durationHours: 10,
    pickupTime: '8:00 AM',
    basePrice: 260,
    pricePerExtraPerson: 59,
    minPassengers: 2,
    maxPassengers: 6,
    minAge: 2,
    difficulty: 'Moderate',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    gallery: [
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Beatiful-waterfall-costa-rica-nature.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp',
    ],
    highlights: [
      'Hike to stunning turquoise Río Celeste waterfall',
      'See where rivers magically turn blue',
      'Visit volcanic hot springs and mud pots',
      'Guided tour of frog sanctuary',
      'Sloth encounter and education',
      'Pristine rainforest experience'
    ],
    itinerary: [
      {
        time: '8:00 AM',
        activity: 'Pickup from Hotel',
        description: 'Depart La Fortuna in comfortable A/C van'
      },
      {
        time: '9:30 AM',
        activity: 'Tenorio National Park Arrival',
        description: 'Begin guided hike through rainforest to Río Celeste'
      },
      {
        time: '10:00 AM',
        activity: 'Río Celeste Waterfall',
        description: 'Witness the magical turquoise waterfall and surrounding trails'
      },
      {
        time: '11:30 AM',
        activity: 'Los Teñideros',
        description: 'See where two clear rivers merge to create the blue phenomenon'
      },
      {
        time: '1:00 PM',
        activity: 'Traditional Lunch',
        description: 'Enjoy local Costa Rican cuisine'
      },
      {
        time: '2:30 PM',
        activity: 'Frog Sanctuary Visit',
        description: 'Guided tour to see colorful poison dart frogs and other species'
      },
      {
        time: '3:30 PM',
        activity: 'Sloth Encounter',
        description: 'Learn about and observe sloths in their sanctuary'
      },
      {
        time: '4:30 PM',
        activity: 'Return to La Fortuna',
        description: 'Scenic drive back'
      },
      {
        time: '6:00 PM',
        activity: 'Hotel Drop-off',
        description: 'End of tour'
      }
    ],
    included: [
      'Bilingual naturalist guide',
      'Round-trip A/C transportation',
      'Tenorio National Park entrance',
      'Frog sanctuary entrance',
      'Sloth sanctuary entrance',
      'Traditional lunch',
      'Rubber boots provided',
      'Water and snacks',
      'All fees and taxes'
    ],
    notIncluded: [
      'Additional beverages',
      'Souvenirs',
      'Optional tips',
      'Travel insurance'
    ],
    whatToBring: [
      'Comfortable clothes for hiking',
      'Swimsuit (optional for natural pools)',
      'Towel',
      'Change of clothes',
      'Rain jacket',
      'Camera (waterproof bag recommended)',
      'Insect repellent',
      'Sunscreen'
    ],
    importantNotes: [
      'Moderate difficulty - 7km hike total',
      'Trail can be muddy and slippery',
      'Rubber boots provided',
      'No swimming in Río Celeste',
      'Weather-dependent (operates rain or shine)',
      'Minimum age 2 years'
    ]
  }
];

// ========================================
// HALF DAY TOURS (6 horas)
// ========================================

export const HALF_DAY_TOURS: Tour[] = [
  {
    id: 'hanging-bridges-fortuna-waterfall',
    name: 'Hanging Bridges + La Fortuna Waterfall',
    slug: 'hanging-bridges-fortuna-waterfall',
    category: 'half-day',
    shortDescription: 'Walk through rainforest canopy on suspension bridges, then swim at stunning 70-meter waterfall',
    longDescription: 'Experience the best of La Fortuna\'s nature in one morning. Walk high above the rainforest floor on 16 suspension bridges offering spectacular views of Arenal Volcano and incredible wildlife spotting opportunities. After the canopy walk, visit the iconic La Fortuna Waterfall where you can swim in crystal-clear natural pools at the base of this 70-meter cascade.',
    duration: '6 hours',
    durationHours: 6,
    pickupTime: '8:00 AM',
    basePrice: 260,
    pricePerExtraPerson: 59,
    minPassengers: 2,
    maxPassengers: 6,
    minAge: 2,
    difficulty: 'Moderate',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    gallery: [
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Beatiful-waterfall-costa-rica-nature.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp',
    ],
    highlights: [
      'Walk 16 hanging bridges through canopy',
      'Stunning Arenal Volcano views',
      'Spot sloths, monkeys, and exotic birds',
      'Swim at La Fortuna Waterfall',
      'Expert wildlife guide',
      'Traditional Costa Rican lunch'
    ],
    itinerary: [
      {
        time: '8:00 AM',
        activity: 'Hotel Pickup',
        description: 'Pickup from La Fortuna area hotels'
      },
      {
        time: '8:30 AM',
        activity: 'Hanging Bridges Park',
        description: 'Begin guided walk across 16 suspension bridges'
      },
      {
        time: '11:00 AM',
        activity: 'La Fortuna Waterfall',
        description: 'Hike down 530 steps to the waterfall, time to swim and relax'
      },
      {
        time: '12:30 PM',
        activity: 'Traditional Lunch',
        description: 'Enjoy authentic Costa Rican meal'
      },
      {
        time: '2:00 PM',
        activity: 'Return to Hotel',
        description: 'Drop-off at your accommodation'
      }
    ],
    included: [
      'Professional bilingual guide',
      'Transportation in A/C vehicle',
      'Hanging Bridges entrance',
      'La Fortuna Waterfall entrance',
      'Traditional lunch',
      'Bottled water',
      'All taxes and fees'
    ],
    notIncluded: [
      'Additional drinks',
      'Tips for guide',
      'Towel (bring your own)',
      'Personal expenses'
    ],
    whatToBring: [
      'Swimsuit and towel',
      'Comfortable walking shoes',
      'Change of clothes',
      'Sunscreen and insect repellent',
      'Camera',
      'Small backpack',
      'Water bottle'
    ],
    importantNotes: [
      '530 steps down to waterfall (and back up!)',
      'Moderate fitness level required',
      'Suitable for ages 2+',
      'Tours operate rain or shine',
      'Lockers available at waterfall'
    ]
  },

  {
    id: 'hanging-bridges-arenal-volcano',
    name: 'Hanging Bridges + Arenal Volcano Hike',
    slug: 'hanging-bridges-arenal-volcano',
    category: 'half-day',
    shortDescription: 'Canopy bridges with wildlife spotting followed by volcano hiking through lava fields',
    longDescription: 'Combine two of Arenal\'s most spectacular experiences. Start with a guided walk through the rainforest canopy on hanging bridges, perfect for spotting wildlife and capturing Arenal Volcano photos. Then hike through historic lava flows at Arenal Volcano National Park, learning about the volcano\'s explosive history and the incredible regeneration of nature since its last major eruption.',
    duration: '6 hours',
    durationHours: 6,
    pickupTime: '8:00 AM',
    basePrice: 260,
    pricePerExtraPerson: 59,
    minPassengers: 2,
    maxPassengers: 6,
    minAge: 2,
    difficulty: 'Moderate',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp',
    gallery: [
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Beatiful-waterfall-costa-rica-nature.webp',
    ],
    highlights: [
      '16 suspension bridges through canopy',
      'Incredible volcano photo opportunities',
      'Hike through 1968 lava flows',
      'Learn volcanic history from expert guide',
      'Wildlife spotting (monkeys, sloths, birds)',
      'Traditional lunch included'
    ],
    itinerary: [
      {
        time: '8:00 AM',
        activity: 'Hotel Pickup',
        description: 'Comfortable pickup from La Fortuna'
      },
      {
        time: '8:30 AM',
        activity: 'Hanging Bridges',
        description: 'Guided walk across suspension bridges with wildlife spotting'
      },
      {
        time: '10:30 AM',
        activity: 'Arenal Volcano National Park',
        description: 'Hike through old lava flows and rainforest trails'
      },
      {
        time: '12:30 PM',
        activity: 'Traditional Lunch',
        description: 'Authentic Costa Rican cuisine'
      },
      {
        time: '2:00 PM',
        activity: 'Return to Hotel',
        description: 'Drop-off in La Fortuna'
      }
    ],
    included: [
      'Expert bilingual naturalist guide',
      'A/C transportation',
      'Hanging Bridges park entrance',
      'Arenal National Park entrance',
      'Traditional lunch',
      'Bottled water and snacks',
      'All fees and taxes'
    ],
    notIncluded: [
      'Extra beverages',
      'Gratuities',
      'Personal items',
      'Travel insurance'
    ],
    whatToBring: [
      'Comfortable hiking shoes',
      'Light rain jacket',
      'Sunscreen and hat',
      'Insect repellent',
      'Camera and binoculars',
      'Small backpack',
      'Reusable water bottle'
    ],
    importantNotes: [
      'Moderate difficulty level',
      'Uneven terrain on lava trails',
      'Volcano views weather-dependent',
      'Minimum age 2 years',
      'Small group experience (max 6)',
      'Operates daily'
    ]
  },

  {
    id: 'fortuna-waterfall-sloth-tour',
    name: 'La Fortuna Waterfall + Sloth Tour',
    slug: 'fortuna-waterfall-sloth-tour',
    category: 'half-day',
    shortDescription: 'Swim at iconic 70-meter waterfall then meet adorable sloths in their natural habitat',
    longDescription: 'Perfect for families and wildlife enthusiasts! Start with a refreshing swim at the magnificent La Fortuna Waterfall, cascading 70 meters into a pristine natural pool. Then visit a specialized sloth sanctuary where expert guides will help you spot and learn about these fascinating slow-moving creatures in their natural rainforest habitat, along with other wildlife.',
    duration: '6 hours',
    durationHours: 6,
    pickupTime: '8:00 AM',
    basePrice: 260,
    pricePerExtraPerson: 59,
    minPassengers: 2,
    maxPassengers: 6,
    minAge: 2,
    difficulty: 'Easy',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    gallery: [
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Beatiful-waterfall-costa-rica-nature.webp',
    ],
    highlights: [
      'Swim at La Fortuna Waterfall',
      'Spot sloths in the wild',
      'Learn about sloth behavior and conservation',
      'See other rainforest wildlife',
      'Great for all ages',
      'Traditional lunch'
    ],
    itinerary: [
      {
        time: '8:00 AM',
        activity: 'Hotel Pickup',
        description: 'Start your nature adventure'
      },
      {
        time: '8:30 AM',
        activity: 'La Fortuna Waterfall',
        description: 'Hike down to waterfall, swim and explore (530 steps)'
      },
      {
        time: '11:00 AM',
        activity: 'Sloth Sanctuary Tour',
        description: 'Guided walk to observe sloths and other wildlife in natural habitat'
      },
      {
        time: '12:30 PM',
        activity: 'Traditional Lunch',
        description: 'Authentic Costa Rican meal'
      },
      {
        time: '2:00 PM',
        activity: 'Hotel Return',
        description: 'Drop-off at accommodation'
      }
    ],
    included: [
      'Bilingual nature guide',
      'Round-trip transportation',
      'Waterfall entrance fee',
      'Sloth sanctuary entrance',
      'Traditional lunch',
      'Water and snacks',
      'All taxes'
    ],
    notIncluded: [
      'Towel for swimming',
      'Additional drinks',
      'Tips (optional)',
      'Photos or souvenirs'
    ],
    whatToBring: [
      'Swimsuit and towel',
      'Extra clothes',
      'Comfortable shoes',
      'Sunscreen',
      'Insect repellent',
      'Camera',
      'Waterproof bag for electronics'
    ],
    importantNotes: [
      'Waterfall has 530 steps each way',
      'Sloth sightings not guaranteed (wild animals)',
      'Easy difficulty level',
      'Perfect for families',
      'Operates rain or shine',
      'Lockers available at waterfall'
    ]
  },

  {
    id: 'sloth-tour-farm-experience',
    name: 'Sloth Tour + Farm Experience',
    slug: 'sloth-tour-farm-experience',
    category: 'half-day',
    shortDescription: 'Observe sloths in the wild, visit working farm, learn traditional coffee & cacao process',
    longDescription: 'Immerse yourself in Costa Rican nature and culture. Begin with a guided sloth-watching tour where you\'ll learn about these amazing creatures and spot them in their natural rainforest home. Then visit an authentic working farm to see how coffee, cacao, and other crops are grown and processed using traditional methods. Taste fresh products and experience true rural Costa Rican life.',
    duration: '6 hours',
    durationHours: 6,
    pickupTime: '8:00 AM',
    basePrice: 260,
    pricePerExtraPerson: 59,
    minPassengers: 2,
    maxPassengers: 6,
    minAge: 2,
    difficulty: 'Easy',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    gallery: [
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/sjo-costa-rica-city-sunset.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Beatiful-waterfall-costa-rica-nature.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp',
    ],
    highlights: [
      'Spot sloths with expert guide',
      'Visit authentic working farm',
      'Learn coffee and cacao process',
      'Taste fresh farm products',
      'Cultural immersion experience',
      'Traditional farm-to-table lunch'
    ],
    itinerary: [
      {
        time: '8:00 AM',
        activity: 'Hotel Pickup',
        description: 'Begin your farm and wildlife adventure'
      },
      {
        time: '8:30 AM',
        activity: 'Sloth Watching Tour',
        description: 'Guided rainforest walk to observe sloths and wildlife'
      },
      {
        time: '10:30 AM',
        activity: 'Farm Tour Begins',
        description: 'Explore coffee, cacao, sugarcane, and tropical fruit plantations'
      },
      {
        time: '11:30 AM',
        activity: 'Processing Demonstrations',
        description: 'See traditional methods of processing coffee and chocolate'
      },
      {
        time: '12:30 PM',
        activity: 'Farm Lunch',
        description: 'Fresh, farm-to-table traditional meal'
      },
      {
        time: '2:00 PM',
        activity: 'Return to Hotel',
        description: 'Drop-off in La Fortuna'
      }
    ],
    included: [
      'Bilingual guide',
      'Transportation',
      'Sloth sanctuary entrance',
      'Farm tour and tastings',
      'Traditional farm lunch',
      'Coffee and chocolate samples',
      'All fees and taxes'
    ],
    notIncluded: [
      'Farm products for purchase',
      'Additional beverages',
      'Gratuities',
      'Personal expenses'
    ],
    whatToBring: [
      'Comfortable walking shoes',
      'Hat and sunglasses',
      'Sunscreen',
      'Insect repellent',
      'Camera',
      'Cash for purchases (optional)',
      'Reusable water bottle'
    ],
    importantNotes: [
      'Easy walking on farm trails',
      'Great for all ages',
      'Educational and cultural experience',
      'Sloth sightings probable but not guaranteed',
      'Small group ensures personal attention',
      'Vegetarian options available for lunch'
    ]
  },

  {
    id: 'chocolate-coffee-fortuna-waterfall',
    name: 'Chocolate & Coffee Tour + La Fortuna Waterfall',
    slug: 'chocolate-coffee-fortuna-waterfall',
    category: 'half-day',
    shortDescription: 'Learn bean-to-bar chocolate & coffee process, then swim at stunning waterfall',
    longDescription: 'Taste and learn! Discover the complete journey from bean to cup and bean to bar at a local organic plantation. Participate in hands-on activities including grinding cacao, roasting coffee, and tasting the final products. Then cool off with a swim at the spectacular La Fortuna Waterfall. Perfect combination of cultural education and natural beauty.',
    duration: '6 hours',
    durationHours: 6,
    pickupTime: '8:00 AM',
    basePrice: 260,
    pricePerExtraPerson: 59,
    minPassengers: 2,
    maxPassengers: 6,
    minAge: 2,
    difficulty: 'Easy',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    gallery: [
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/sjo-costa-rica-city-sunset.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp',
    ],
    highlights: [
      'Hands-on chocolate making experience',
      'Coffee roasting demonstration',
      'Taste fresh coffee and chocolate',
      'Learn about organic farming',
      'Swim at La Fortuna Waterfall',
      'Traditional lunch included'
    ],
    itinerary: [
      {
        time: '8:00 AM',
        activity: 'Hotel Pickup',
        description: 'Start your delicious adventure'
      },
      {
        time: '8:30 AM',
        activity: 'Plantation Tour',
        description: 'Walk through coffee and cacao plantations'
      },
      {
        time: '9:30 AM',
        activity: 'Chocolate Making',
        description: 'Hands-on chocolate grinding and tasting'
      },
      {
        time: '10:30 AM',
        activity: 'Coffee Experience',
        description: 'Roasting, brewing, and tasting session'
      },
      {
        time: '11:30 AM',
        activity: 'La Fortuna Waterfall',
        description: 'Hike down, swim, and relax at the waterfall'
      },
      {
        time: '1:00 PM',
        activity: 'Traditional Lunch',
        description: 'Local cuisine'
      },
      {
        time: '2:00 PM',
        activity: 'Return',
        description: 'Drop-off at hotel'
      }
    ],
    included: [
      'Expert guide',
      'Transportation',
      'Plantation tour and tastings',
      'Waterfall entrance',
      'Traditional lunch',
      'Coffee and chocolate samples',
      'All taxes and fees'
    ],
    notIncluded: [
      'Towel for swimming',
      'Additional products for purchase',
      'Tips',
      'Extra drinks'
    ],
    whatToBring: [
      'Swimsuit and towel',
      'Comfortable shoes',
      'Change of clothes',
      'Sunscreen',
      'Camera',
      'Cash for shopping (optional)',
      'Reusable water bottle'
    ],
    importantNotes: [
      'Interactive and fun for all ages',
      'Waterfall has 530 steps each way',
      'Coffee and chocolate samples included',
      'Option to purchase fresh products',
      'Easy difficulty',
      'Operates daily'
    ]
  },

  {
    id: 'waterfall-volcano-hot-springs',
    name: 'La Fortuna Waterfall + Volcano Hike + Ecotermales Hot Springs',
    slug: 'waterfall-volcano-hot-springs',
    category: 'half-day',
    shortDescription: 'Ultimate combo: swim at waterfall, hike volcano, relax in natural hot springs',
    longDescription: 'Experience the best of La Fortuna in one incredible tour! Start with a refreshing swim at La Fortuna Waterfall, hike through Arenal Volcano\'s lava trails learning about its volcanic history, and end your day relaxing in the natural hot springs at Ecotermales. This perfect combination of adventure and relaxation showcases the diverse natural wonders of the Arenal region.',
    duration: '6 hours',
    durationHours: 6,
    pickupTime: '8:00 AM',
    basePrice: 260,
    pricePerExtraPerson: 59,
    minPassengers: 2,
    maxPassengers: 6,
    minAge: 2,
    difficulty: 'Moderate',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp',
    gallery: [
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
      'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Beatiful-waterfall-costa-rica-nature.webp',
    ],
    highlights: [
      'Swim at 70-meter La Fortuna Waterfall',
      'Hike Arenal Volcano trails',
      'Explore ancient lava flows',
      'Relax in natural hot springs',
      'Beautiful volcanic scenery',
      'Traditional lunch'
    ],
    itinerary: [
      {
        time: '8:00 AM',
        activity: 'Hotel Pickup',
        description: 'Begin your adventure-relaxation combo'
      },
      {
        time: '8:30 AM',
        activity: 'La Fortuna Waterfall',
        description: 'Hike down 530 steps, swim at the base'
      },
      {
        time: '10:30 AM',
        activity: 'Arenal Volcano Hike',
        description: 'Walk through lava fields and rainforest trails'
      },
      {
        time: '12:00 PM',
        activity: 'Traditional Lunch',
        description: 'Recharge with authentic Costa Rican food'
      },
      {
        time: '1:00 PM',
        activity: 'Ecotermales Hot Springs',
        description: 'Relax in natural thermal pools surrounded by rainforest'
      },
      {
        time: '2:00 PM',
        activity: 'Return to Hotel',
        description: 'Drop-off in La Fortuna'
      }
    ],
    included: [
      'Professional guide',
      'A/C transportation',
      'Waterfall entrance',
      'Volcano park entrance',
      'Ecotermales hot springs entrance',
      'Traditional lunch',
      'Towels for hot springs',
      'Water and snacks',
      'All fees'
    ],
    notIncluded: [
      'Swimsuit towel for waterfall',
      'Drinks at hot springs',
      'Lockers (small fee)',
      'Gratuities'
    ],
    whatToBring: [
      'Swimsuit (wear under clothes)',
      'Extra towel',
      'Change of clothes',
      'Waterproof bag',
      'Sunscreen',
      'Insect repellent',
      'Camera',
      'Flip-flops or water shoes'
    ],
    importantNotes: [
      'Moderate fitness required (stairs at waterfall)',
      'Multiple swim opportunities',
      'Hot springs are natural, not chlorinated',
      'Perfect for couples and families',
      'Best value combo tour',
      'Small group experience'
    ]
  }
];

// ========================================
// EXPORT ALL TOURS
// ========================================

export const ALL_TOURS = [...FULL_DAY_TOURS, ...HALF_DAY_TOURS];

export function getTourBySlug(slug: string): Tour | undefined {
  return ALL_TOURS.find(tour => tour.slug === slug);
}

export function getToursByCategory(category: 'full-day' | 'half-day'): Tour[] {
  return ALL_TOURS.filter(tour => tour.category === category);
}