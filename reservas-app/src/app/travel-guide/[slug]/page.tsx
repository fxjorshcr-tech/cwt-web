// app/travel-guide/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, MapPin, Clock, AlertCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getDestinationRoutes, formatDuration, type Route } from '@/lib/getDestinationRoutes';

// CONTENIDO COMPLETO REESCRITO - TODOS LOS DESTINOS
// Tono: Profesional, positivo, útil, celebrando Costa Rica

const destinationContent: Record<string, any> = {
  
  'san-jose-sjo': {
    name: 'San José (SJO)',
    title: 'Your Complete Guide to SJO Airport & San José',
    subtitle: 'Where Your Costa Rica Adventure Begins',
    description: 'Everything you need for a smooth arrival at Juan Santamaría International Airport.',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/sjo-costa-rica-city-sunset.webp',
    searchTerm: 'San Jose',
    isPublished: true,
    
    intro: `Welcome to Costa Rica! Juan Santamaría International Airport (SJO) is your gateway to one of the world's most biodiverse countries. Whether you're heading straight to the beach, staying to explore the capital, or catching a connection, this guide will help you navigate your arrival with confidence and ease.`,
    
    vibe: {
      title: 'THE VIBE: EFFICIENT GATEWAY TO PARADISE',
      content: `**Your First Impression:** SJO is a modern, well-organized airport that handles millions of visitors each year. The staff is friendly, most speak English, and the process is straightforward once you know what to expect.

**San José City:** Costa Rica's vibrant capital offers excellent museums, fantastic restaurants, authentic markets, and a thriving coffee culture. While many travelers head directly to beaches or rainforests, spending time in San José gives you insight into modern Costa Rican life and culture.

**The Smart Traveler's Approach:** Most visitors use San José as a convenient transit hub, maximizing their time in nature. Our private shuttle service bridges that gap perfectly—comfortable, reliable transportation from the moment you land to wherever paradise calls.

**Local Knowledge:** The Central Valley where San José sits has a pleasant climate year-round and incredible mountain views. Traffic can be heavy during rush hours (6-9am, 4-7pm), but experienced drivers know the best routes and timing.`,
    },
    
    insiderTips: [
      {
        title: 'Airport Exit Strategy Made Simple',
        content: 'After clearing customs, you\'ll see many people offering rides. Simply walk past them with confidence and look for your pre-arranged driver holding a sign with your name. Pre-booking ensures fixed prices, professional service, and peace of mind from the start.'
      },
      {
        title: 'Immigration Wait Times Vary',
        content: 'Processing through immigration typically takes 30 minutes to 1 hour, though it can be longer during peak season. Don\'t worry—your private shuttle driver will wait for you regardless of delays, unlike scheduled shared services that might leave without you.'
      },
      {
        title: 'Why We Recommend Against Driving on Day 1',
        content: 'After a long flight, you deserve to relax. Roads can be unfamiliar, GPS doesn\'t always account for traffic patterns, and it gets dark around 6pm year-round. Let a professional driver handle your first journey while you enjoy the scenery and decompress.'
      },
      {
        title: 'Smart Money Tips',
        content: 'Use the ATMs in the baggage claim area for the best exchange rates—much better than currency exchange booths. Costa Rican Colones or US Dollars both work well throughout the country. Many places accept cards, but having some cash is always wise.'
      },
      {
        title: 'Get Connected Immediately',
        content: 'Kölbi SIM cards are available right in the arrivals area for about $20. Having data from the moment you land makes navigation, restaurant reservations, and staying in touch easy. Coverage is excellent throughout most of Costa Rica.'
      },
      {
        title: 'The Welcome Stop Advantage',
        content: 'Ask your driver about stopping at a supermarket on the way to your hotel. It\'s a great chance to grab snacks, drinks, sunscreen, or any essentials before you settle in. Local drivers know the best spots.'
      },
      {
        title: 'Child Safety First',
        content: 'Traveling with kids? Reputable shuttle services provide appropriate car seats at no extra charge. Just request them when booking. It\'s one less thing to worry about and ensures your family\'s safety.'
      },
      {
        title: 'Airport Hotels vs Downtown',
        content: 'Hotels near the airport (in Alajuela) are perfect for late arrivals or early departures—you\'re 10 minutes from the terminal. If staying multiple days to explore, downtown San José offers better access to museums, restaurants, and cultural attractions.'
      },
      {
        title: 'Pro Timing for Departures',
        content: 'For international departures, arrive 3 hours early during high season (Dec-Apr) and 2.5 hours during green season. Your driver knows exactly when to leave based on traffic patterns and the time of day.'
      },
      {
        title: 'Maximize Your Vacation Time',
        content: 'While San José has wonderful attractions, most travelers find Costa Rica\'s magic in its natural wonders. Going directly from the airport to your beach or mountain destination means more time enjoying what you came for.'
      }
    ],
    
    experiences: [
      {
        title: 'National Museum of Costa Rica',
        description: 'Beautifully curated museum in a historic fortress showcasing pre-Columbian artifacts, colonial history, and modern culture. The butterfly garden alone is worth the visit. Great for a half-day if you have time between flights.'
      },
      {
        title: 'Pre-Columbian Gold Museum',
        description: 'Stunning underground museum displaying one of the finest collections of pre-Columbian gold in the Americas. The craftsmanship of ancient indigenous cultures is breathtaking. Located in Plaza de la Cultura downtown.'
      },
      {
        title: 'Mercado Central',
        description: 'Authentic local market bustling with energy. Perfect for trying traditional casados at soda counters, buying fresh tropical fruits, and finding unique souvenirs at local prices. A real slice of Tico life.'
      },
      {
        title: 'Teatro Nacional',
        description: 'Gorgeous 19th-century theater modeled after European opera houses. Take a guided tour or catch an evening performance. The coffee shop inside is a charming spot for a break.'
      },
      {
        title: 'Barrio Escalante',
        description: 'San José\'s trendy neighborhood packed with innovative restaurants, craft breweries, and specialty coffee shops. This is where young Ticos and expats gather for great food and nightlife.'
      },
      {
        title: 'La Sabana Park',
        description: 'The city\'s largest urban park—think Central Park but Costa Rican. Great for morning walks, the National Art Museum is here, and locals playing pickup soccer on weekends creates a festive atmosphere.'
      }
    ]
  },

  'la-fortuna-arenal': {
    name: 'La Fortuna / Arenal Volcano',
    title: 'The Complete Guide to La Fortuna & Arenal',
    subtitle: 'Costa Rica\'s Adventure Paradise',
    description: 'Where majestic volcanoes meet thrilling adventures and natural hot springs.',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-volcano-tour-visit.webp',
    searchTerm: 'La Fortuna',
    isPublished: true,
    
    intro: `La Fortuna is pure magic. The majestic cone of Arenal Volcano rises above a landscape of waterfalls, hot springs, hanging bridges, and endless green. This is Costa Rica's adventure capital, where you can zip through rainforest canopies, soak in volcanic-heated waters, and spot wildlife all in the same day. Welcome to one of Central America's most spectacular destinations.`,
    
    vibe: {
      title: 'THE VIBE: ADVENTURE MEETS RELAXATION',
      content: `**The Setting:** La Fortuna sits in the shadow of Arenal Volcano with Lake Arenal stretching beyond. The town perfectly balances adventure tourism with authentic Costa Rican charm—you'll find world-class tour operators next to traditional sodas serving home-cooked meals.

**Perfect for Everyone:** Families love the variety of activities at different intensity levels. Couples find romance in hot springs and sunset lake views. Solo travelers and groups connect through adventure tours. There really is something for every type of visitor.

**About the Volcano:** Arenal is technically dormant (no lava since 2010), but it's still magnificently beautiful. The volcano creates its own weather patterns, so clouds are common—especially in afternoons. Morning offers the best chance for clear views, and when you see that perfect cone, it's absolutely worth the wait.

**Getting Around:** The town center is walkable with restaurants, tour offices, and shops all close together. Major attractions (volcano viewpoints, hot springs, waterfalls) are 10-30 minutes away by car. Most hotels offer shuttle services, or you can easily arrange transportation through tour companies.`,
    },
    
    insiderTips: [
      {
        title: 'Best Time for Volcano Views',
        content: 'Early morning, right after sunrise, gives you the best chance of seeing Arenal without clouds. The volcano creates its own micro-climate and often "hides" by mid-morning. Set your alarm—those sunrise views are spectacular!'
      },
      {
        title: 'Choosing Your Hot Springs Experience',
        content: 'La Fortuna has hot springs for every style and budget. Tabacón offers luxury and lush gardens. Baldi has multiple pools and water slides (great for families). Ecotermales is intimate and peaceful. Los Laureles and Titokú are newer, beautiful options. Each has its own charm—choose based on your vibe.'
      },
      {
        title: 'Embrace the Rain',
        content: 'This is rainforest! Brief afternoon showers are common and keep everything gorgeously green. Pack a light rain jacket and waterproof phone case. The rain is warm, refreshing, and part of the authentic experience. Plus, fewer tourists = better photos!'
      },
      {
        title: 'Authentic Meals at Local Sodas',
        content: 'For the real Costa Rican experience and great value, eat at local sodas (small family restaurants). A traditional casado (rice, beans, salad, plantains, and your choice of protein) costs $6-8 and is delicious. Ask locals or your hotel for their favorite spot.'
      },
      {
        title: 'Smart Footwear Choice',
        content: 'Bring comfortable closed-toe shoes with good traction. Trails can be muddy, and you\'ll be walking on various terrains. Waterproof hiking shoes or trail runners are ideal. Save flip-flops for the pool and hot springs.'
      },
      {
        title: 'Currency Tips',
        content: 'While USD is widely accepted, paying in Costa Rican Colones usually gets you better prices, especially at smaller establishments. ATMs are readily available in town. Many places accept credit cards, but cash is handy for tips and small purchases.'
      },
      {
        title: 'Tap Water is Safe',
        content: 'Costa Rica has excellent water quality standards. Tap water in La Fortuna is treated and safe to drink. Bring a reusable water bottle to stay hydrated while reducing plastic waste. You\'ll need plenty of water for all those adventures!'
      },
      {
        title: 'Book Popular Activities Ahead',
        content: 'During high season (December-April), popular tours and hot springs can fill up. Booking 2-3 days in advance ensures you get your preferred times. Many hotels can arrange this for you, or book directly with tour companies.'
      },
      {
        title: 'Transportation Between Towns',
        content: 'La Fortuna is a perfect hub with excellent connections to Monteverde, Guanacaste beaches, and beyond. Private shuttles are comfortable and efficient. Public buses are very affordable but take longer. Choose based on your schedule and budget.'
      },
      {
        title: 'Hidden Gem: El Castillo',
        content: 'The quieter village of El Castillo, 30 minutes away on the other side of Lake Arenal, offers stunning volcano views and a more tranquil atmosphere. It\'s worth a day trip for the butterfly conservatory and hiking trails with fewer crowds.'
      }
    ],
    
    experiences: [
      {
        title: 'La Fortuna Waterfall',
        description: 'A stunning 70-meter cascade tumbling into an emerald swimming hole. The hike down 500 steps through the jungle is manageable, and swimming at the base is unforgettable. The climb back up is a workout, but take your time and enjoy!'
      },
      {
        title: 'Arenal Volcano National Park',
        description: 'Hike through lush rainforest and across ancient lava fields. Multiple trail options for different fitness levels, all with opportunities to spot wildlife. The views of the volcano from various angles are incredible.'
      },
      {
        title: 'Hot Springs Experience',
        description: 'Soak in naturally heated mineral pools surrounded by tropical gardens. The volcanic waters are genuinely therapeutic and relaxing. Many resorts offer day passes including dinner, making it a perfect evening activity.'
      },
      {
        title: 'Hanging Bridges',
        description: 'Walk through the rainforest canopy on a series of suspension bridges. Mistico Park is the most popular with excellent guides who help spot sloths, toucans, and other wildlife. The perspective from above the jungle is magical.'
      },
      {
        title: 'Lake Arenal Adventures',
        description: 'Costa Rica\'s largest lake offers kayaking, paddleboarding, and boat tours with incredible volcano views. Sunset tours are particularly beautiful. The lake is also famous for windsurfing due to consistent winds.'
      },
      {
        title: 'Canyoning & Rappelling',
        description: 'For thrill-seekers, rappel down waterfalls in pristine canyons. Professional guides make it accessible even for beginners. It\'s an adrenaline rush with spectacular scenery. Pure Vida Adventures and Desafio are excellent operators.'
      },
      {
        title: 'Chocolate & Coffee Tours',
        description: 'Learn how Costa Rica produces some of the world\'s finest coffee and chocolate. Many farms offer hands-on experiences from bean to finished product. You\'ll never look at your morning coffee the same way!'
      },
      {
        title: 'Wildlife Night Tours',
        description: 'The rainforest transforms after dark. Guided night walks reveal frogs, sloths, snakes, tarantulas, and countless insects. It\'s like discovering a completely different world. Bring a flashlight and sense of adventure!'
      }
    ]
  },

  'puerto-viejo-cahuita': {
    name: 'Puerto Viejo / Cahuita',
    title: 'Your Guide to Costa Rica\'s Caribbean Coast',
    subtitle: 'Where Reggae Rhythms Meet Paradise Beaches',
    description: 'Discover the laid-back Caribbean vibe, Afro-Caribbean culture, and stunning coastline.',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    searchTerm: 'Puerto Viejo',
    isPublished: true,
    
    intro: `Welcome to Costa Rica's Caribbean soul. Puerto Viejo and Cahuita offer something completely different from the Pacific coast—a rich Afro-Caribbean and indigenous culture, spectacular beaches with calm turquoise waters, incredible coral reef snorkeling, and a rhythm of life that moves to reggae and calypso beats. This is where "tranquilo" isn't just a word, it's a way of life.`,
    
    vibe: {
      title: 'THE VIBE: CARIBBEAN PARADISE MEETS RICH CULTURE',
      content: `**A Unique Cultural Blend:** The southern Caribbean coast has a distinct identity. Afro-Caribbean and BriBri indigenous influences create a vibrant cultural tapestry. You'll hear Creole English, Spanish, and indigenous languages. The food, music, and atmosphere are wonderfully different from the rest of Costa Rica.

**The Perfect Beach Life:** Imagine riding a bicycle between beautiful beaches, stopping wherever catches your eye. That's how most people experience the coast between Puerto Viejo and Manzanillo. The road is mostly flat, the beaches are stunning, and each one has its own personality.

**Culinary Adventures:** Caribbean cuisine is a highlight. Don't leave without trying rice and beans cooked in coconut milk, rondón stew (a flavorful seafood and root vegetable dish), or patí (spicy meat pastries). The local food scene is fantastic and authentically delicious.

**The Pace:** Life moves slower here, and that's the beauty of it. Service might take longer than you're used to, but it comes with genuine smiles and conversation. Embrace "Caribbean time"—it's part of what makes this place special.`,
    },
    
    insiderTips: [
      {
        title: 'The Bicycle is Your Best Friend',
        content: 'Renting a bike is the absolute best way to explore the coast. The main road from Puerto Viejo to Manzanillo is mostly flat and scenic. You can stop at any beach that catches your eye—Cocles, Punta Uva, Playa Chiquita—and take your time. It\'s freedom and adventure combined!'
      },
      {
        title: 'Beach Safety Basics',
        content: 'Like at beaches worldwide, keep valuables secured. Most hotels have safes—use them. When swimming, take turns watching belongings or use waterproof bags for essentials. The local community is wonderful, but tourists are targets everywhere. Simple precautions ensure peace of mind.'
      },
      {
        title: 'Secure Your Bike',
        content: 'Always lock your bicycle, even for short stops. Rental shops provide locks—use them religiously. It takes two seconds and prevents disappointment. Many beach restaurants and shops have designated bike parking areas.'
      },
      {
        title: 'Cash is Convenient',
        content: 'While cards work at larger establishments, many local sodas, small shops, and tour guides prefer cash. ATMs are in town, but bring enough for a few days. There\'s something nice about supporting local businesses directly with cash anyway.'
      },
      {
        title: 'Respect Wildlife',
        content: 'Cahuita National Park is famous for easy wildlife spotting, but please don\'t feed the animals. It\'s harmful to their health and behavior. Enjoy observing them naturally—it\'s much more rewarding and helps preserve this special ecosystem.'
      },
      {
        title: 'Plan Your SJO Return Carefully',
        content: 'The drive from Puerto Viejo to SJO airport is 4-5 hours depending on traffic. If you have an international flight, consider staying near the airport the night before if your flight is early. Better safe than stressed! Many travelers underestimate this distance.'
      },
      {
        title: 'Water Quality',
        content: 'While most of Costa Rica has drinkable tap water, many visitors prefer bottled or filtered water in Puerto Viejo. Bring a water bottle with a built-in filter, or stock up on bottled water. Staying hydrated in the Caribbean heat is important.'
      },
      {
        title: 'Tuk-Tuks Add to the Fun',
        content: 'Puerto Viejo has colorful tuk-tuks (three-wheeled taxis) that are convenient, affordable, and fun! They\'re perfect for short trips when you don\'t feel like biking. Negotiate the price before you hop in—usually $2-5 for most town trips.'
      },
      {
        title: 'Know Your Surf Spots',
        content: 'Salsa Brava is Puerto Viejo\'s famous reef break, but it\'s for experienced surfers only. Beginners should head to Playa Cocles which has gentler beach breaks and surf schools. The instructors are patient and the learning environment is perfect.'
      },
      {
        title: 'Give Yourself Time',
        content: 'Don\'t rush through the Caribbean. Most visitors wish they\'d stayed longer. Three to five days lets you experience the different beaches, do a jungle tour, visit Cahuita National Park, and truly relax into the Caribbean rhythm. You\'ll thank yourself!'
      }
    ],
    
    experiences: [
      {
        title: 'Cahuita National Park',
        description: 'One of Costa Rica\'s most accessible parks with a flat coastal trail where you\'ll spot monkeys, sloths, and colorful birds with ease. The coral reef offers excellent snorkeling with tropical fish and healthy corals. Entry is by donation, making it incredible value.'
      },
      {
        title: 'Beach Hopping by Bicycle',
        description: 'Ride from Puerto Viejo to Manzanillo stopping at Playa Cocles (surf and beach bars), Punta Uva (calm, family-friendly), Playa Chiquita (secluded), and beyond. Each beach has unique character and beauty. This is the quintessential Caribbean coast experience.'
      },
      {
        title: 'Jaguar Rescue Center',
        description: 'An ethical wildlife sanctuary rehabilitating injured and orphaned animals. See sloths, monkeys, birds, and reptiles up close while learning about conservation. The staff\'s dedication is inspiring, and your visit supports their important work.'
      },
      {
        title: 'Caribbean Snorkeling',
        description: 'The coral reefs off Cahuita and Manzanillo are some of Costa Rica\'s best. Crystal-clear water, abundant marine life, and healthy corals create an underwater paradise. Bring reef-safe sunscreen to protect this delicate ecosystem.'
      },
      {
        title: 'Surfing Paradise',
        description: 'From beginner-friendly beach breaks at Cocles to the legendary Salsa Brava reef break for experts, the surf is excellent year-round. Warm water means no wetsuit needed! Multiple surf schools offer lessons and board rentals.'
      },
      {
        title: 'BriBri Indigenous Experience',
        description: 'Visit the Kekoldi Indigenous Reserve to learn about BriBri culture, medicinal plants, and traditional chocolate making. It\'s an authentic cultural exchange that supports indigenous communities directly. Deeply educational and meaningful.'
      },
      {
        title: 'Manzanillo Wildlife Refuge',
        description: 'The road ends at Manzanillo, where pristine rainforest meets the sea. Excellent hiking trails, quieter beaches, and a laid-back fishing village atmosphere. It feels like the edge of the world in the best possible way.'
      },
      {
        title: 'Caribbean Cuisine Tour',
        description: 'Take a cooking class or food tour to learn about Caribbean Costa Rican cuisine. Make rice and beans in coconut milk, patí pastries, and fresh ceviche. The fusion of African, indigenous, and Caribbean influences is delicious and unique.'
      }
    ]
  },

  // Continuaré con los demás destinos...
// PARTE 2 - DESTINOS REESCRITOS (Continuación)

  'manuel-antonio': {
    name: 'Manuel Antonio',
    title: 'The Complete Manuel Antonio Guide',
    subtitle: 'Where Pristine Beaches Meet Incredible Wildlife',
    description: 'Costa Rica\'s most famous national park—and for very good reasons.',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    searchTerm: 'Manuel Antonio',
    isPublished: true,
    
    intro: `Manuel Antonio is Costa Rica's crown jewel—a small national park that delivers an unbeatable combination of white-sand beaches nestled in jungle coves, easy wildlife spotting, and trails suitable for all fitness levels. Despite being one of the country's smallest parks, it's packed with biodiversity and natural beauty. This is where you'll see monkeys playing on the beach, sloths hanging in trees, and toucans flying overhead, all while surrounded by tropical paradise.`,
    
    vibe: {
      title: 'THE VIBE: ACCESSIBLE PARADISE FOR EVERYONE',
      content: `**Why It's Special:** Manuel Antonio perfectly balances adventure and accessibility. The trails are well-maintained and relatively easy, making it perfect for families with kids or visitors who want amazing nature experiences without strenuous hiking. You can swim in pristine coves, spot incredible wildlife, and be back at your hotel for lunch.

**The Wildlife:** Four species of monkeys (white-faced, howler, squirrel, and spider), both two-toed and three-toed sloths, iguanas, coatis, countless birds—you'll see more wildlife here than almost anywhere else in Costa Rica. Many hotels in the area have wildlife right on property too!

**The Area:** The "Manuel Antonio" area includes the national park, the town of Manuel Antonio (along the hilltop road to the park), and nearby Quepos (the main town 7km away). Quepos has more local flavor, better prices, and is worth exploring.

**Best For:** This destination works wonderfully for first-time visitors to Costa Rica, families with children, couples seeking a mix of adventure and relaxation, and anyone who wants stunning beaches combined with guaranteed wildlife sightings.`,
    },
    
    insiderTips: [
      {
        title: 'Essential: Book Park Tickets Online',
        content: 'This is crucial—you cannot buy tickets at the park entrance anymore. All tickets must be purchased in advance at sinac.go.cr. The park limits daily visitors to protect the ecosystem, so tickets can sell out during high season (December-April). Book 3-5 days ahead to be safe.'
      },
      {
        title: 'Hiring a Guide is Worth Every Penny',
        content: 'Professional guides have spotting scopes and trained eyes that can find wildlife you\'d walk right past. They\'ll show you sloths hidden in trees, snakes camouflaged on branches, and colorful frogs you\'d never notice. It transforms the experience from good to unforgettable. Guides are available at the park entrance.'
      },
      {
        title: 'Early Arrival Benefits',
        content: 'The park opens at 7am, and arriving early gives you multiple advantages: cooler temperatures, more active wildlife, better light for photos, and fewer people. It\'s worth setting that alarm! The difference between 7am and 10am is dramatic.'
      },
      {
        title: 'Remember: Closed on Tuesdays',
        content: 'The park closes every Tuesday for maintenance and ecosystem recovery. Plan your visit accordingly! If you\'re doing a multi-day trip, schedule Tuesday for other activities—there are plenty of great options in the area.'
      },
      {
        title: 'Explore Quepos Too',
        content: 'Quepos, 7km from Manuel Antonio, is an authentic Costa Rican town with excellent local restaurants, a fantastic weekend farmers market, and better prices than the tourist zone. It\'s worth spending time there for a more genuine experience and great food.'
      },
      {
        title: 'Beach Safety',
        content: 'Playa Espadilla Norte (outside the park entrance) can have strong currents—check for flags and ask lifeguards about conditions. The beaches inside the park (Manuel Antonio and Espadilla Sur) are generally calmer and more protected. Always swim where others are swimming.'
      },
      {
        title: 'Bring Plenty of Water and Snacks',
        content: 'The park gets hot and humid, especially mid-day. Bring at least 2 liters of water per person and some snacks. There are minimal facilities inside—just small beach shacks near Playa Manuel Antonio selling drinks and snacks at premium prices.'
      },
      {
        title: 'Perfect Trip Length',
        content: 'Most travelers find 2-3 full days ideal for Manuel Antonio. One day for the national park, another for other activities (catamaran tours, waterfalls, chocolate tours), and time to simply relax and enjoy your hotel. The area deserves more than just a quick visit.'
      },
      {
        title: 'Don\'t Miss Nauyaca Waterfalls',
        content: 'About an hour away, Nauyaca is one of Costa Rica\'s most spectacular waterfalls—a dramatic two-tier cascade with a massive swimming pool at the base. It\'s well worth the side trip and consistently rated as one of visitors\' favorite experiences in the region.'
      },
      {
        title: 'Catamaran Sunset Tours',
        content: 'These are magical—sailing along the stunning coastline, snorkeling in calm bays, watching for dolphins and whales (in season), and enjoying sunset with drinks and food included. It\'s romantic, fun, and gives you a different perspective of the beautiful coast.'
      }
    ],
    
    experiences: [
      {
        title: 'Manuel Antonio National Park',
        description: 'Walk easy jungle trails to stunning beaches while spotting abundant wildlife. Cathedral Point offers breathtaking views. The combination of forest and beach is unique. Plan 3-4 hours minimum to truly enjoy it. Swimming at Playa Manuel Antonio is a perfect way to cool off mid-visit.'
      },
      {
        title: 'Nauyaca Waterfalls',
        description: 'Two stunning tiers totaling 200 feet dropping into a massive natural pool perfect for swimming. The journey there (horseback or short hike) through beautiful countryside is part of the adventure. This is consistently ranked among visitors\' top experiences in the area.'
      },
      {
        title: 'Sunset Catamaran Cruise',
        description: 'Sail from Quepos marina along the spectacular coastline. Snorkel in protected bays with colorful fish, enjoy open bar and fresh food, and watch the sky explode in colors as the sun sets over the Pacific. Often see dolphins and sea turtles too!'
      },
      {
        title: 'Damas Island Mangrove Tour',
        description: 'Explore the fascinating mangrove ecosystem by kayak or small boat. Spot crocodiles (from a safe distance!), monkeys, sloths, and incredible birdlife. The mangroves are a completely different ecosystem—equally beautiful and important. Great for photographers.'
      },
      {
        title: 'Playa Biesanz',
        description: 'This hidden gem is a sheltered cove between Manuel Antonio and Quepos with calm, clear water ideal for swimming and snorkeling. It\'s less crowded than the park beaches and easy to reach. Bring snorkel gear and enjoy the underwater world.'
      },
      {
        title: 'Kids Saving the Rainforest',
        description: 'Visit this inspiring wildlife rescue center to see rescued and rehabilitated animals including monkeys, sloths, birds, and more. The guides are passionate, and your visit directly supports their conservation work. It\'s educational and heartwarming.'
      },
      {
        title: 'Adventure Park Canopy Tours',
        description: 'Multiple operators offer zipline tours through the rainforest canopy. Many combine ziplining with rappelling and Tarzan swings. It\'s thrilling, scenic, and you\'ll see the forest from an entirely different perspective. Perfect for adventurous families.'
      },
      {
        title: 'Quepos Farmers Market',
        description: 'Every Friday and Saturday morning, locals gather at this vibrant market. Fresh tropical fruits, homemade goods, local crafts, and traditional food. It\'s the real Costa Rica and offers great people-watching plus delicious, affordable snacks.'
      }
    ]
  },

  'monteverde': {
    name: 'Monteverde Cloud Forest',
    title: 'Your Complete Monteverde Guide',
    subtitle: 'Walking Through the Clouds',
    description: 'Experience the mystical beauty of Costa Rica\'s world-famous cloud forest.',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    searchTerm: 'Monteverde',
    isPublished: true,
    
    intro: `Monteverde is pure magic. As you climb into the mountains, the temperature drops, the air freshens, and everything becomes intensely green. Mist rolls through moss-covered trees draped with orchids and bromeliads. This isn't just a forest—it's a cloud forest, a rare ecosystem where the forest literally lives in the clouds. It's cooler, mistier, and completely enchanting. This is where you'll find the legendary Resplendent Quetzal and some of Central America's most beautiful biodiversity.`,
    
    vibe: {
      title: 'THE VIBE: MYSTICAL MOUNTAIN PARADISE',
      content: `**The Setting:** Monteverde sits at around 1,400 meters (4,600 feet) elevation where clouds meet mountain forest. The result is a unique ecosystem supporting incredible biodiversity. The constant moisture creates a wonderland of mosses, ferns, orchids, and hanging gardens on every tree.

**Conservation Heritage:** Monteverde was settled by Quakers in the 1950s who dedicated themselves to protecting the forest. That conservation ethic remains the community's heart and soul. You'll feel it in the carefully managed reserves, the sustainable tourism approach, and the genuine care for nature everywhere.

**What to Expect:** Bring layers! Temperatures range from 15-25°C (60-75°F), and it can be wonderfully cool after the heat of coastal areas. The climate is often misty with light rain (that magical "pelos de gato" mist), but that's part of the cloud forest's charm. When the mist clears and you see the view? Absolutely spectacular.

**Adventure Central:** Monteverde pioneered canopy tours in Costa Rica. Beyond the famous hanging bridges and ziplines, there are excellent hiking trails, night walks, coffee and chocolate tours, and some of the best birdwatching in Central America.`,
    },
    
    insiderTips: [
      {
        title: 'Pack for Mountain Weather',
        content: 'Bring a good rain jacket, long pants, and layers. Monteverde is significantly cooler than the beaches—you\'ll actually appreciate a light fleece or sweater, especially in the morning and evening. Waterproof your day pack too. The weather is part of what makes the cloud forest magical!'
      },
      {
        title: 'Guides Unlock the Magic',
        content: 'Want to see the spectacular Resplendent Quetzal? Hire a certified naturalist guide. Their knowledge and trained eyes will show you 10 times more wildlife and explain the fascinating ecology. Many visitors say the guide made their cloud forest experience unforgettable. Worth every dollar.'
      },
      {
        title: 'Book Reserve Tickets Ahead',
        content: 'Both the Monteverde Cloud Forest Reserve and Santa Elena Reserve limit daily visitors. During high season, book tickets online 2-3 days in advance. This protects the forest and ensures you get in. Same goes for popular zipline tours—book ahead!'
      },
      {
        title: 'Monteverde vs Santa Elena Reserve',
        content: 'Both are spectacular! The Monteverde Reserve is more famous and has excellent infrastructure. Santa Elena Reserve is equally beautiful, often less crowded, and supports local schools with its profits. You don\'t need to visit both—choose based on your preference and schedule.'
      },
      {
        title: 'The Road Is an Adventure',
        content: 'The last 30km to Monteverde is partially unpaved and bumpy—that\'s just how it is. The good news? It keeps Monteverde special and less overrun. Allow 4-5 hours from San José. The rough road is a small price for reaching this incredible place. Sit back and enjoy!'
      },
      {
        title: 'Understanding "Dry" Season',
        content: 'Monteverde\'s dry season (December-April) is still quite misty—that\'s the cloud forest! It\'s typically windier and drier than green season, but mist is normal year-round. That\'s what creates this amazing ecosystem. Embrace it rather than fighting it!'
      },
      {
        title: 'Direct Shuttle vs Jeep-Boat-Jeep',
        content: 'The "Jeep-Boat-Jeep" transfer between La Fortuna and Monteverde sounds adventurous but involves multiple vehicle changes and isn\'t actually faster. Most travelers find a direct private shuttle more comfortable and stress-free. Save the adventure for the cloud forest itself!'
      },
      {
        title: 'Essential: Good Hiking Shoes',
        content: 'Trails can be muddy and slippery. Good hiking shoes or boots with traction are essential—not optional. Many trails have steps and elevation changes. Your feet will thank you! Regular sneakers just don\'t cut it here.'
      },
      {
        title: 'Night Walks Are Incredible',
        content: 'The cloud forest transforms after dark. Guided night walks reveal tarantulas, snakes, frogs, and other nocturnal creatures you\'d never see during the day. It\'s spooky, exciting, and absolutely fascinating. Don\'t skip this experience!'
      },
      {
        title: 'Give Yourself Time',
        content: 'Monteverde deserves at least 2 full days, ideally 3. One day for a reserve, one for canopy/hanging bridges or ziplines, and time for coffee/chocolate tours or other activities. The area offers so much—rushing through means missing too much magic.'
      }
    ],
    
    experiences: [
      {
        title: 'Cloud Forest Reserve Hiking',
        description: 'Walk through the mystical Monteverde or Santa Elena reserves. Professional guides help spot the Resplendent Quetzal, three-wattled bellbird, and countless other species. The biodiversity is mind-blowing. Even without a guide, the trails are peaceful and beautiful.'
      },
      {
        title: 'Hanging Bridges Canopy Walk',
        description: 'Walk through the forest canopy on a series of suspension bridges. Some stretch 150+ feet long and hang high above the ground. The perspective is incredible, and you\'re at eye-level with birds and monkeys. Exhilarating and educational at once.'
      },
      {
        title: 'Zipline Canopy Tours',
        description: 'Monteverde pioneered ziplines in Costa Rica. Fly through the clouds on some of the country\'s longest cables. Multiple operators offer tours ranging from family-friendly to extreme. The adrenaline rush combined with spectacular views is unforgettable.'
      },
      {
        title: 'Night Walk Adventure',
        description: 'Discover the nocturnal cloud forest with expert guides using flashlights. See tarantulas, snakes (including the beautiful eyelash viper), frogs, sleeping birds, and more. The sounds and atmosphere are completely different at night. Magical and slightly spooky!'
      },
      {
        title: 'Coffee & Chocolate Tours',
        description: 'Learn the journey from bean to cup and cacao to chocolate bar. Many tours let you participate in the process and taste the results. It\'s educational, delicious, and supports local farmers. Don Juans and Café de Monteverde are excellent.'
      },
      {
        title: 'Curi-Cancha Reserve',
        description: 'A less crowded alternative to the main reserves with excellent bird watching, well-maintained trails, and professional guides. The hanging bridges here are also beautiful. It\'s more intimate and peaceful—a hidden gem.'
      },
      {
        title: 'Monteverde Butterfly Garden',
        description: 'See hundreds of native butterfly species in different climate-controlled environments. Learn about their life cycle and importance to the ecosystem. Great for families and photography. The blue morpho butterflies are stunning!'
      },
      {
        title: 'Santa Elena Town',
        description: 'Explore the actual town with local shops, good restaurants, and friendly Ticos. The community art center and cheese factory are worth visiting. It\'s more authentic than the tourist strip and offers a glimpse into local mountain life.'
      }
    ]
  },

  'rio-celeste': {
    name: 'Río Celeste / Tenorio',
    title: 'The Complete Río Celeste Guide',
    subtitle: 'Costa Rica\'s Most Magical Blue Waterfall',
    description: 'Witness nature\'s surreal turquoise phenomenon in Tenorio Volcano National Park.',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    searchTerm: 'Rio Celeste',
    isPublished: true,
    
    intro: `Imagine water so impossibly blue it looks like someone poured paint into the river. That's Río Celeste—one of Costa Rica's most magical natural wonders. Hidden in Tenorio Volcano National Park, this stunning blue river is created by a unique chemical reaction where two clear rivers meet. The waterfall, lagoon, and bubbling hot springs make this a highlight of any Costa Rica trip. It's remote, authentic, and absolutely worth the journey.`,
    
    vibe: {
      title: 'THE VIBE: REMOTE NATURAL WONDER',
      content: `**The Magic:** Local legend says God dipped his paintbrush in the river after painting the sky. The science is equally fascinating—two clear rivers merge, and volcanic minerals create an optical phenomenon that makes the water appear impossibly turquoise. It's genuinely surreal to see in person.

**The Setting:** Río Celeste is in Tenorio Volcano National Park, roughly halfway between La Fortuna and Liberia. The surrounding area (Bijagua) is rural, authentic Costa Rica—rolling green hills, cattle farms, and very few tourists. It feels wonderfully undiscovered despite the park's popularity.

**Important Note:** The water's color depends on conditions. Heavy rain temporarily turns it brown as sediment gets stirred up. This is natural and temporary, but checking conditions before visiting is wise. When it's blue (most of the time), it's absolutely spectacular.

**The Experience:** The main trail is a moderate 6km (3.7 miles) roundtrip through beautiful jungle. You'll see the stunning waterfall, the magical spot where rivers meet (Teñideros), a blue lagoon, and bubbling volcanic hot springs. It's an immersive nature experience without being overly strenuous.`,
    },
    
    insiderTips: [
      {
        title: 'Essential: Buy Tickets Online Before You Go',
        content: 'You must purchase tickets at sinac.go.cr in advance—they\'re not sold at the entrance. The park costs $12 per person plus $5 parking. It limits visitors to protect the environment (400 people at once, 1200 daily). This surprises many visitors, so plan ahead!'
      },
      {
        title: 'Arrive Early for the Best Experience',
        content: 'Get there when the park opens at 8am. You\'ll beat the tour bus crowds (they arrive around 10am), it\'s cooler in the morning, and you might have spots to yourself for photos. The park stops admitting people at 2pm, so timing matters!'
      },
      {
        title: 'Check Water Conditions First',
        content: 'Call your hotel or a local tour operator the morning of your visit to confirm the water is blue. If it rained heavily recently, the water may be temporarily brown. While the hike is still beautiful, the main attraction is that incredible blue color. Most days it\'s perfect!'
      },
      {
        title: 'Prepare for Mud',
        content: 'Trails can be quite muddy, especially after rain. Many locals rent rubber boots at the entrance for $3-5—totally worth it if conditions are wet. Otherwise, good waterproof hiking boots work great. Hiking poles can also be helpful on muddy sections.'
      },
      {
        title: 'Swimming Rules',
        content: 'Swimming in the blue river is no longer permitted to protect the ecosystem. This is strictly enforced. However, there\'s a nice swimming spot about 1km past the park entrance on the same road where you can swim for free. Ask locals for directions!'
      },
      {
        title: 'Consider Hiring a Guide',
        content: 'While trails are well-marked and you don\'t need a guide, having one enriches the experience enormously. They spot wildlife you\'d miss (sloths, snakes, birds), explain the fascinating geology, and share local stories. Group guides cost around $55 and are worth it.'
      },
      {
        title: 'Best Time to Visit',
        content: 'The dry season (December-April) offers the highest probability of blue water, though it can still rain occasionally—this is cloud forest. The wettest months (September-October) are trickiest. May-November is generally fine but check conditions beforehand.'
      },
      {
        title: 'Perfect Routing Strategy',
        content: 'Río Celeste makes an excellent stop between La Fortuna and the Guanacaste beaches. Leave La Fortuna at 7am, hike by 9am, enjoy lunch in charming Bijagua, and arrive at the beach by 3-4pm. It breaks up the drive perfectly and adds a highlight to your trip!'
      },
      {
        title: 'Complete the Full Trail',
        content: 'Many people just see the waterfall and turn back—don\'t make that mistake! The spot where the rivers meet (Teñideros) is equally impressive, watching clear water instantly turn blue. The blue lagoon and bubbling hot springs are worth seeing too. Do the full trail!'
      },
      {
        title: 'Stay in Bijagua to Beat Crowds',
        content: 'The tiny town of Bijagua (15 minutes from the park) has lovely small hotels. Staying overnight means you can be first in line when the park opens and experience it nearly empty. Plus, Bijagua is charming and authentic—a nice bonus!'
      }
    ],
    
    experiences: [
      {
        title: 'Río Celeste Waterfall',
        description: 'The park\'s crown jewel—98 feet (30m) of impossibly turquoise water cascading into a blue pool surrounded by lush jungle. You\'ll descend 258 steps to reach it (your knees will feel the climb back!), but the view is absolutely worth every step. Magical.'
      },
      {
        title: 'Teñideros (Where Rivers Meet)',
        description: 'This spot is mind-blowing—watch two perfectly clear rivers merge and instantly turn bright blue. It\'s like witnessing alchemy! The color change is so dramatic and sudden. Many visitors say this is even more impressive than the waterfall. Nature\'s magic at work.'
      },
      {
        title: 'Laguna Azul (Blue Lagoon)',
        description: 'A still pool of impossibly blue water surrounded by green jungle. It looks almost artificial but is completely natural. Perfect for photos and quiet contemplation. The reflection on calm days is stunning.'
      },
      {
        title: 'Borbollones (Bubbling Hot Springs)',
        description: 'Volcanic hot springs bubbling up from the ground. You can\'t swim here anymore (park rules), but they\'re fascinating to observe and smell the sulfur. It reminds you that Costa Rica sits on the Ring of Fire!'
      },
      {
        title: 'Wildlife Watching',
        description: 'The jungle around Río Celeste is alive with wildlife. Sloths, howler monkeys, toucans, eyelash vipers, and colorful poison dart frogs all live here. Bring binoculars and move quietly for best viewing. A guide significantly improves your chances.'
      },
      {
        title: 'Bijagua Town Experience',
        description: 'This tiny, authentic Tico town offers great local sodas with home-cooked meals, friendly locals, and a completely non-touristy vibe. It\'s the real rural Costa Rica. Stay here to truly immerse yourself in local life and support the community.'
      },
      {
        title: 'Tenorio Lodge Hot Springs',
        description: 'Natural hot springs complex near Bijagua with beautiful thermal pools in a garden setting. It\'s relaxing after the hike and more accessible than the bubbling springs in the park. Great way to end your Río Celeste day.'
      }
    ]
  },

  'montezuma-santa-teresa': {
    name: 'Montezuma / Santa Teresa / Malpaís',
    title: 'Guide to the Southern Nicoya Peninsula',
    subtitle: 'Bohemian Paradise with World-Class Surf',
    description: 'Remote beach towns where yoga meets surfing at the tip of the peninsula.',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    searchTerm: 'Santa Teresa',
    isPublished: true,
    
    intro: `Welcome to the end of the road—literally. The southern tip of the Nicoya Peninsula is where paved roads end and paradise begins. These three interconnected beach towns offer some of Costa Rica's best surfing, stunning sunsets, yoga studios, and a laid-back bohemian vibe. Getting here requires effort (ferry rides or rough roads), but that remoteness is exactly what keeps it special and beautiful.`,
    
    vibe: {
      title: 'THE VIBE: THREE TOWNS, EACH WITH UNIQUE PERSONALITY',
      content: `**Montezuma: The Original Hippie Haven**
The OG backpacker paradise since the 1970s. Montezuma is compact, walkable, and alternative. Think colorful street art, drum circles on the beach, affordable hostels, and a jump-able waterfall. It's the most "town-like" with services concentrated in one area. Perfect for budget travelers and free spirits.

**Santa Teresa: Surf & Yoga Paradise**
The most developed and international. World-class surf breaks, high-end vegan restaurants, beautiful yoga studios, and stunning beaches. It's trendy, Instagram-worthy, and attracts a more upscale crowd. Prices match the quality—it's pricier but gorgeous.

**Malpaís: The Quiet Retreat**
Stretches along rocky coastline south of Santa Teresa. More secluded, fewer services, rockier beaches. Choose Malpaís if you want to escape the scene and have more privacy. It's peaceful and less crowded.

**What They Share:** All three are remote, laid-back, and spectacular. The surf is excellent, sunsets are legendary, and the vibe is distinctly "end of the road." Getting here takes commitment, but that's precisely why it remains relatively unspoiled.`,
    },
    
    insiderTips: [
      {
        title: 'The Ferry Experience',
        content: 'The Puntarenas ferry is the most popular route. It takes 1 hour and costs about $1-2 per person plus $20 per car. The crossing can be rough, so take motion sickness medicine if you\'re prone to it. Arrive at least an hour early with a vehicle. The ferry is an adventure itself—enjoy it!'
      },
      {
        title: 'Road Conditions Are Challenging',
        content: 'The roads are partially unpaved, rocky, and can be rough, especially in rainy season. 4WD is highly recommended, particularly May-November. Regular cars can make it in dry season but go slowly. This is part of what keeps the area special—embrace the adventure!'
      },
      {
        title: 'Cash is Essential',
        content: 'ATMs exist but sometimes run out of money, especially in Santa Teresa on weekends. Bring sufficient cash for your stay. While many restaurants accept cards, plenty of places prefer cash. The nearest reliable ATM can be an hour away if locals are out.'
      },
      {
        title: 'Smart Strategy: Stay ST, Visit Montezuma',
        content: 'Many travelers stay in Santa Teresa (better beach, more accommodation options) and day-trip to Montezuma for its character and waterfall. They\'re only 20 minutes apart. This gives you the best of both worlds—Santa Teresa\'s beauty with Montezuma\'s charm.'
      },
      {
        title: 'Montezuma Waterfall is Unmissable',
        content: 'Short, beautiful hike to a three-tier waterfall with swimming holes. The second tier has a 25-foot jump that locals do constantly. Watch where people jump first, assess your comfort level, and enjoy! It\'s free, gorgeous, and quintessentially Montezuma.'
      },
      {
        title: 'The Surf is Exceptional',
        content: 'Santa Teresa is considered one of Costa Rica\'s best surf destinations. Consistent waves year-round, warm water, multiple breaks for all levels. Playa Hermosa and Playa Santa Teresa are the main spots. Beach breaks for beginners, reef breaks for advanced—everyone finds their wave.'
      },
      {
        title: 'Budget Accordingly',
        content: 'Prices reflect the remote location—everything has to be brought in. Expect 30-40% higher prices than other parts of Costa Rica. A meal that costs $10 elsewhere might be $14-16 here. Eating at local sodas helps manage costs and supports locals.'
      },
      {
        title: 'Don\'t Miss Cabo Blanco',
        content: 'At the absolute tip of the peninsula sits Cabo Blanco Nature Reserve—Costa Rica\'s first protected area (1963). Amazing hiking, deserted beaches, abundant wildlife. Most tourists skip it, which is exactly why it\'s so special. Go early!'
      },
      {
        title: 'Sunset is a Daily Ritual',
        content: 'Everyone stops for sunset here—it\'s mandatory pura vida. Grab a beer, find a spot on the beach, and watch the sky turn incredible colors over the Pacific. Playa Carmen in Santa Teresa is the gathering spot. Pure magic every single time.'
      },
      {
        title: 'Book Accommodation in Advance',
        content: 'Especially December-April, hotels fill up fast. This area is small with limited accommodation. Book shuttles, hotels, and the ferry weeks ahead during high season. Last-minute travelers often struggle to find rooms. Plan ahead!'
      }
    ],
    
    experiences: [
      {
        title: 'Montezuma Waterfalls',
        description: 'Hike to a beautiful three-tier waterfall with natural swimming pools. Jump from the second tier if you\'re adventurous (locals do it all the time). Free to visit, absolutely beautiful, and the quintessential Montezuma experience. Arrive early to beat crowds.'
      },
      {
        title: 'Surfing Santa Teresa',
        description: 'World-class waves for all skill levels. Playa Hermosa, Playa Santa Teresa, and Playa Carmen all offer excellent surf. Warm water means no wetsuit needed! Countless surf schools offer lessons. The surf culture here is fantastic.'
      },
      {
        title: 'Cabo Blanco Nature Reserve',
        description: 'Costa Rica\'s oldest national park offers pristine beaches, excellent hiking through primary forest, and abundant wildlife including monkeys and coatis. It\'s what all of Costa Rica looked like before development. Absolutely worth the trip to the peninsula\'s tip.'
      },
      {
        title: 'Yoga & Wellness',
        description: 'Santa Teresa is yoga central with numerous studios, retreat centers, and wellness offerings. From beach sunrise yoga to sound healing, the wellness scene rivals Bali or Tulum. Many studios offer drop-in classes for visitors.'
      },
      {
        title: 'Tortuga Island Day Trip',
        description: 'From Montezuma, boat to this picture-perfect white-sand island. Snorkel in crystal-clear water, kayak, paddle board, or just relax on pristine beaches. It\'s one of Costa Rica\'s most beautiful day trips. Tours include lunch and equipment.'
      },
      {
        title: 'Sunset at Playa Carmen',
        description: 'The daily gathering spot in Santa Teresa. Bring a beverage, sit in the sand, and watch the sky explode in pinks, oranges, and purples as the sun melts into the Pacific. It never gets old. The perfect way to end every day.'
      },
      {
        title: 'Mal País Tide Pools',
        description: 'Explore fascinating tide pools during low tide. See starfish, crabs, colorful fish, and sea anemones trapped in natural pools. It\'s like an outdoor aquarium. Check tide times and wear water shoes for best experience.'
      },
      {
        title: 'Montezuma Town Vibe',
        description: 'Simply wandering Montezuma\'s colorful streets is an experience. Live music, art galleries, craft shops, organic cafes, and interesting people from around the world. The bohemian atmosphere is authentic and welcoming. Great nighttime energy too.'
      }
    ]
  },

// Continuaré en la siguiente parte...
// PARTE 3 - DESTINOS FINALES (Continuación)

  'liberia-lir': {
    name: 'Liberia (LIR Airport)',
    title: 'Complete Guide to Liberia Airport & City',
    subtitle: 'Your Gateway to Guanacaste\'s Golden Coast',
    description: 'Everything you need for a smooth arrival at Costa Rica\'s beach airport.',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/sjo-costa-rica-city-sunset.webp',
    searchTerm: 'Liberia',
    isPublished: true,
    
    intro: `Flying into Liberia (LIR)? Excellent choice! Daniel Oduber Quirós International Airport is Costa Rica's second international airport and your fast track to Guanacaste's spectacular beaches. It's smaller, faster, and way more convenient than SJO if beaches are your destination. From Tamarindo to Papagayo to Flamingo, you'll be at the beach in 30-90 minutes instead of 4-5 hours. Here's everything you need to know for a smooth arrival.`,
    
    vibe: {
      title: 'THE VIBE: EFFICIENT BEACH GATEWAY',
      content: `**The Airport Advantage:** LIR is significantly smaller than San José's airport, which means faster everything—immigration typically takes 20-40 minutes versus 1-2 hours at SJO. For beach-bound travelers, this is a game-changer. Your vacation starts the moment you land.

**Perfect Location:** Papagayo Peninsula is 30 minutes away, Tamarindo is 1 hour, Playa Flamingo is 1.5 hours. Compare that to 4-5 hours from SJO! The time savings alone makes LIR worth considering, especially for week-long beach vacations.

**Liberia City:** The capital of Guanacaste province, nicknamed "La Ciudad Blanca" (The White City) for its white colonial buildings. It's authentic, hot, and refreshingly non-touristy. Most visitors head straight to beaches, but the city has its own charm if you're curious about real Guanacaste.

**The Weather:** Guanacaste is Costa Rica's driest, sunniest province. It's noticeably hotter than San José (5-10°F warmer), especially during dry season. The heat hits you the moment you step outside—welcome to beach country!`,
    },
    
    insiderTips: [
      {
        title: 'Speed is the Big Advantage',
        content: 'Immigration at LIR is famously fast compared to SJO. During peak season when SJO can take 2+ hours, LIR usually processes you through in 30-40 minutes. Smaller airport, fewer flights, less waiting. Your beach vacation literally starts sooner!'
      },
      {
        title: 'Limited International Connections',
        content: 'LIR primarily serves North American destinations (USA, Canada). If you\'re coming from Europe, South America, or Asia, you\'ll likely connect through SJO or a US hub anyway. But for direct US/Canada flights, LIR is perfect for beach trips.'
      },
      {
        title: 'The Airport Exit Strategy',
        content: 'Like SJO, you\'ll encounter people offering rides immediately after customs. Walk confidently through them and look for your pre-arranged driver with your name sign. Pre-booking guarantees fixed prices and professional service. It\'s much less chaotic than SJO though!'
      },
      {
        title: 'Car Rental Considerations',
        content: 'All major rental companies operate at LIR. Prices and insurance requirements are similar to SJO. Read online reviews carefully—some agencies have better reputations than others. Many travelers report that local agencies offer better service than international chains.'
      },
      {
        title: 'Get Connected Immediately',
        content: 'Kölbi has a booth in the arrivals area where you can buy SIM cards for about $20. Having data from the start makes beach navigation, restaurant reservations, and communication easy. Coverage is excellent throughout Guanacaste beaches.'
      },
      {
        title: 'The Heat is Real',
        content: 'Step outside and feel the Guanacaste sunshine! It\'s significantly hotter than San José, especially mid-day. Sunscreen, hat, and sunglasses are essential from arrival. Hydrate well—the dry heat can be deceptive. Welcome to Costa Rica\'s sunniest region!'
      },
      {
        title: 'Airport Hotels vs Beach Hotels',
        content: 'If your flight arrives late (after 6pm), consider staying near the airport that first night. Hampton Inn and Hilton Garden Inn are 10-15 minutes away and very convenient. Then head to the beach fresh the next morning. Beats driving unfamiliar roads after dark.'
      },
      {
        title: 'High Season Crowds',
        content: 'December-April is peak season in Guanacaste. Beaches, hotels, and shuttles fill up fast. Book accommodation and transportation well in advance—waiting until last minute often means limited options or higher prices. Plan ahead for best selection!'
      },
      {
        title: 'Departure Timing',
        content: 'While LIR is smaller, still arrive 2.5-3 hours before international flights. Security lines can build up when multiple flights depart close together. Better to relax at the airport than stress about missing your flight. Plan accordingly!'
      },
      {
        title: 'Money Matters',
        content: 'ATMs in arrivals offer good exchange rates—much better than exchange booths. Many Guanacaste businesses accept USD, but you\'ll often get better prices paying in colones. Grab some local currency and some US dollars for flexibility.'
      }
    ],
    
    experiences: [
      {
        title: 'Direct Beach Transfers',
        description: 'This is what 95% of LIR arrivals do—pre-arranged shuttle directly from airport to your beach hotel. No navigation stress, no unfamiliar roads, just relax and enjoy the journey. Your vacation starts the moment you land. Professional, comfortable, worth it.'
      },
      {
        title: 'Liberia City Exploration',
        description: 'If you have time between flights, the white colonial buildings, central park, and local market offer authentic Guanacaste culture. Very few tourists visit the city, which is precisely why it\'s interesting. Real Costa Rica, unfiltered.'
      },
      {
        title: 'Rincón de la Vieja Day Trip',
        description: 'The active volcano is just 1 hour from LIR. Hot springs, mud baths, bubbling fumaroles, waterfall hikes, and wildlife. Perfect first or last day activity if flight timing works. Full-day tours pick up from airport-area hotels.'
      },
      {
        title: 'Palo Verde National Park',
        description: 'Wetlands teeming with bird life and crocodiles, 45 minutes from Liberia. Boat tours offer incredible wildlife viewing in a completely different ecosystem from beaches. Best for bird watchers and nature photographers.'
      },
      {
        title: 'Airport Lounges',
        description: 'LIR has small lounges available for Priority Pass holders or pay-as-you-go ($40-50). Air conditioning, snacks, drinks, and WiFi make waiting for departures more comfortable. Nice way to spend your last hours before heading home.'
      }
    ]
  },

  'guanacaste-beaches': {
    name: 'Guanacaste Beaches',
    title: 'Complete Guide to Guanacaste\'s Gold Coast',
    subtitle: 'From Lively Tamarindo to Luxury Papagayo',
    description: 'Discover Costa Rica\'s sunniest beaches with options for every style and budget.',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    searchTerm: 'Tamarindo',
    isPublished: true,
    
    intro: `Guanacaste is Costa Rica's sunny northwest—the driest region with the most reliable beach weather year-round. From the vibrant energy of Tamarindo to the pristine white sands of Conchal to the luxury of Papagayo, there's truly a beach for everyone. This is where Costa Ricans and international travelers alike come for consistent sunshine, warm water, excellent surfing, and spectacular sunsets. Here's your complete guide to finding your perfect beach.`,
    
    vibe: {
      title: 'THE BEACHES: FIND YOUR PERFECT MATCH',
      content: `**TAMARINDO: Vibrant Beach Town**
Guanacaste's most developed beach destination with excellent surf, numerous restaurants and bars, active nightlife, and full tourist infrastructure. It's lively, international, and has everything you need. Great for first-time visitors who want convenience and nightlife. The surf scene is fantastic!

**PLAYA CONCHAL: Postcard Perfect**
Made of crushed shells, the sand literally sparkles. Crystal clear water, calm swimming, beautiful snorkeling. The Westin resort is here. It gets busy with day-trippers but remains stunning. This is the beach every Instagram photo promises.

**PAPAGAYO PENINSULA: Luxury Escape**
Home to Four Seasons, Andaz, and other high-end resorts. Private, beautifully maintained, serene. Excellent snorkeling right offshore. If you want all-inclusive luxury with pristine beaches and don't need the "authentic" local experience, Papagayo delivers perfection.

**PLAYA FLAMINGO: Family-Friendly Paradise**
Lovely white-sand beach with calm waters. Nice marina, upscale but not as expensive as Papagayo. Growing expat community brings good restaurants. Excellent for families with the beach's gentle waves and shallow areas.

**PLAYA GRANDE: Surf & Turtles**
Famous for surfing and leatherback turtle nesting (October-March). Less developed than nearby Tamarindo but equally good waves. More tranquil vibe with fewer services. Perfect if you want good surf without Tamarindo's crowds.

**PLAYA AVELLANAS/NEGRA: Surfer's Secret**
Incredible surf breaks, minimal development, authentic vibe. The JW Marriott in Avellanas added some development but it remains relatively quiet. For serious surfers and those seeking less touristy beaches.

**PLAYA POTRERO/BRASILITO: Local Charm**
Small fishing villages with Costa Rican families. Affordable local sodas, genuine Tico atmosphere, nice beaches. Not as "wow" as Conchal or Flamingo, but wonderfully authentic and budget-friendly.`,
    },
    
    insiderTips: [
      {
        title: 'Tamarindo Offers Convenience & Energy',
        content: 'Tamarindo is developed, international, and convenient—and those are actually good things if you want infrastructure, English-speaking services, and nightlife. It\'s not "untouched paradise," but it\'s perfect for first-time visitors, families wanting easy logistics, and anyone who likes an active beach scene.'
      },
      {
        title: 'Beach Quality Varies Significantly',
        content: 'Research your specific beach! Tamarindo\'s main beach is decent for surfing but the water quality varies. Conchal and Flamingo have much clearer water. Punta Islita and Nosara are pristine. Each beach has different strengths—choose based on what matters most to you.'
      },
      {
        title: 'Some Roads Are Adventurous',
        content: 'Access to Playa Negra, Avellanas, and Junquillal involves unpaved roads. Conchal\'s access is partially unpaved. 4WD helps in rainy season but isn\'t always essential in dry season. Factor this into timing and vehicle choice. It\'s manageable—just know what to expect!'
      },
      {
        title: 'Water is Warm Year-Round',
        content: 'Unlike the Pacific Central coast, Guanacaste\'s water stays bathwater warm thanks to no cold currents. It\'s perfect for kids, non-wetsuit snorkeling, and long swimming sessions. One of Guanacaste\'s best features for beach lovers!'
      },
      {
        title: 'Dry Season is Spectacular',
        content: 'December-April offers almost guaranteed sunshine in Guanacaste. This is THE place to visit during dry season. Rainy season (May-November) still has beautiful sunny mornings with afternoon showers. But for sun seekers, dry season is perfect.'
      },
      {
        title: 'Papagayo Winds (December-March)',
        content: 'Strong winds blow through northern Guanacaste December-March. Great for windsurfing and kitesurfing, less ideal for beach lounging. Some beaches are more sheltered than others. Ask locally or research which beaches have natural wind protection.'
      },
      {
        title: 'Dining Budget Awareness',
        content: 'Popular beaches have tourist pricing. Budget accordingly—meals cost more than inland. Tamarindo is especially expensive. Eating at sodas in Brasilito or Potrero offers authentic food at local prices. Or stay in condos and cook some meals yourself.'
      },
      {
        title: 'Traffic in Tamarindo',
        content: 'The main road gets congested during high season evenings, especially 4-7pm. Walk, bike, or scooter when possible. Parking can be challenging. Many hotels/condos are within walking distance of restaurants and beach—take advantage of that!'
      },
      {
        title: 'Turtle Tours at Playa Grande',
        content: 'October-March, watch giant leatherback turtles nest at night. Tours must be booked in advance through authorized operators—they limit visitors to protect turtles. Tours run 8pm-midnight, cost $35-45. It\'s magical and supports conservation. Highly recommended!'
      },
      {
        title: 'Beach Hopping is Easy',
        content: 'Beaches are relatively close together. With a rental car, you can visit multiple beaches in one day. OR book a catamaran tour that stops at several beaches for swimming and snorkeling. Exploring different beaches lets you find your favorite!'
      },
      {
        title: 'Surfing Year-Round',
        content: 'Tamarindo, Playa Grande, Avellanas, and Negra have consistent waves all year. Warm water, no wetsuit needed! Tamarindo is best for beginners with its gentle beach break. Negra and Avellanas have reef breaks for advanced surfers. Something for every level!'
      },
      {
        title: 'Catamaran Tours Are Fantastic',
        content: 'Sunset sailing from Tamarindo, Flamingo, or Papagayo is a highlight. Snorkel in calm bays, spot dolphins and turtles, enjoy open bar and fresh food, watch spectacular sunsets from the water. Around $85/person. Consistently rated as a top activity!'
      }
    ],
    
    experiences: [
      {
        title: 'Tamarindo Surf Culture',
        description: 'Learn to surf or improve your skills at Costa Rica\'s surf central. Dozens of schools line the beach, 2-hour lessons cost ~$50. The beach break is gentle and perfect for beginners. The surf community is welcoming and the lifestyle is infectious!'
      },
      {
        title: 'Playa Conchal Paradise',
        description: 'Visit this shell-sand beach for incredible swimming and snorkeling. Bring your own food and drinks (the Westin controls beach services). The water is crystal clear and perfect for snorkeling. Arrive early to stake out your spot—it gets popular!'
      },
      {
        title: 'Sunset Catamaran Sailing',
        description: 'Sail the stunning coastline, snorkel in protected bays, spot dolphins and sea turtles, and watch the sun melt into the Pacific with drinks and food included. Departs from Tamarindo, Flamingo, or Potrero. Pure magic!'
      },
      {
        title: 'Tamarindo Nightlife',
        description: 'Beach bars, clubs, and live music make Tamarindo Guanacaste\'s nightlife capital. Pacifico, Sharky\'s, Voodoo Lounge, and Aqua are popular spots. It gets lively on weekends! The only real party scene on this coast.'
      },
      {
        title: 'Las Catalinas',
        description: 'This car-free, pedestrian-only planned community near Flamingo features colorful architecture, nice beaches, good restaurants, and European village vibes. Interesting to explore even if you\'re staying elsewhere. Very photogenic and unique in Costa Rica.'
      },
      {
        title: 'Papagayo Peninsula Snorkeling',
        description: 'If staying at Four Seasons, Andaz, or other Papagayo resorts—the snorkeling right offshore is excellent. Calm, clear water with abundant marine life. Many resorts provide complimentary snorkel gear. Perfect for families with kids.'
      },
      {
        title: 'Playa Grande Turtle Conservation',
        description: 'October-March, witness massive leatherback turtles laying eggs under the stars. Guided tours only (to protect turtles). Restricted access makes it special. Book ahead! Watching these ancient creatures is profoundly moving. Unforgettable.'
      },
      {
        title: 'Tamarindo Estuary Kayaking',
        description: 'Paddle through mangrove tunnels spotting crocodiles (from safe distance!), monkeys, birds, and iguanas. Best at high tide. Guided tours cost ~$45. It\'s a different perspective on nature right next to busy Tamarindo. Great for families!'
      }
    ]
  },

  'puerto-jimenez': {
    name: 'Puerto Jiménez / Osa Peninsula',
    title: 'Your Guide to the Osa Peninsula',
    subtitle: 'Gateway to the Most Biodiverse Place on Earth',
    description: 'Experience Costa Rica\'s wildest region and Corcovado National Park.',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    searchTerm: 'Puerto Jimenez',
    isPublished: true,
    
    intro: `The Osa Peninsula is Costa Rica at its wildest and most spectacular. Home to Corcovado National Park—which National Geographic called "the most biologically intense place on Earth"—this remote region offers wildlife encounters found nowhere else. Puerto Jiménez is the gateway town. This isn't luxury beach resorts; this is raw, powerful nature. If you're serious about seeing Costa Rica's incredible wildlife, this is where you come. Prepare for adventure.`,
    
    vibe: {
      title: 'THE VIBE: WILD, REMOTE, SPECTACULAR',
      content: `**The Reality:** Osa is isolated, hot, humid, and it rains even in "dry" season. Roads are rough, services are limited, and you will see bugs. If you want air-conditioned comfort and manicured beaches, this isn't your destination. But if you want REAL jungle and incredible wildlife? This is paradise.

**The Reward:** Corcovado has 2.5% of the world's biodiversity on 0.001% of its surface. You'll see scarlet macaws flying overhead, all four monkey species, sloths, tapirs, peccaries, crocodiles, and more. Wildlife isn't "maybe"—it's guaranteed. This is what you came to Costa Rica for.

**Puerto Jiménez:** A small town (5,000 people) that's half fishing village, half adventure tourism hub. It has a tiny airport, basic services, local sodas, and tour operators. Scarlet macaws literally fly down the main street. It's authentic, unpretentious, and wonderfully real.

**The Lodges:** From rustic to luxury eco-resorts, many accommodations are off-grid (solar power, rainwater). Some of the world's finest eco-lodges are here. But "luxury" still means wildlife in your room and howler monkeys as your alarm clock. That's the beauty!

**Who Belongs Here:** Serious nature lovers, bird watchers, wildlife photographers, adventure seekers, and people who want Costa Rica as it was 30 years ago. If that's you, Osa will blow your mind.`,
    },
    
    insiderTips: [
      {
        title: 'Flying is Absolutely Worth It',
        content: 'Driving from San José is 8+ hours on rough roads, including unpaved sections with river crossings. Flying to Puerto Jiménez (PJM) from SJO takes 55 minutes and costs ~$140 each way. Given the time savings and road conditions, nearly everyone flies. Your vacation time is precious—spend it in Corcovado, not on rough roads!'
      },
      {
        title: 'Corcovado Requires a Certified Guide',
        content: 'You cannot enter Corcovado without a licensed guide—it\'s law. No exceptions. Tours cost $80-150 per person including transport, guide, meals, and park entry. The guides are exceptional wildlife spotters and make the experience exponentially better. It\'s expensive but absolutely worth it.'
      },
      {
        title: 'Pack for Serious Rain',
        content: 'Osa gets rain year-round, even in "dry" season. It\'s one of Costa Rica\'s wettest regions. Pack everything waterproof—clothes, bags, phone cases, camera gear. Quick-dry clothes are essential. Don\'t fight the rain—embrace it! It\'s why everything is so lush and alive.'
      },
      {
        title: 'The Heat and Humidity Are Intense',
        content: 'Temperatures in the high 80s-90s°F with near 100% humidity. You\'ll sweat constantly. Bring lightweight, moisture-wicking clothes. Multiple changes because nothing dries fully. This is real tropical jungle—hot, humid, and wildly alive!'
      },
      {
        title: 'Wildlife is Actually Guaranteed',
        content: 'Unlike other Costa Rica destinations where you "might" see animals, here you WILL. Scarlet macaws fly over Puerto Jiménez town daily. Monkeys are everywhere. In Corcovado, you\'ll see more wildlife in one day than most people see in weeks elsewhere. This is the real deal.'
      },
      {
        title: 'Bring Sufficient Cash',
        content: 'ATMs in Puerto Jiménez occasionally run out of money. Bring enough cash for your entire stay. Many remote lodges don\'t accept cards. Credit cards work in town restaurants but not everywhere. Cash is essential—plan accordingly.'
      },
      {
        title: 'Matapalo vs Carate Lodges',
        content: 'Matapalo (20 min south of PJ) has relatively easier road access and beautiful beaches. Carate (1 hour south, true end of the road) is more remote and requires 4WD always. Both offer incredible nature. Choose based on how remote you want to be!'
      },
      {
        title: 'Book Everything Months in Advance',
        content: 'Lodges, domestic flights, and Corcovado tours fill up quickly, especially December-April. The area is small with limited capacity. Book 3-6 months ahead for high season. Last-minute bookings are nearly impossible. Plan early!'
      },
      {
        title: 'The Scarlet Macaws!',
        content: 'Osa has Central America\'s largest scarlet macaw population. They fly overhead in pairs, squawking loudly, every single day. You\'ll see them in town, on beaches, in the jungle. Their bright red, blue, and yellow colors against green jungle is breathtaking. Never gets old!'
      },
      {
        title: 'Stay Minimum 3 Days',
        content: 'Given the effort to reach Osa, stay at least 3 full days. One day for Corcovado, one for local trails or Matapalo beach, one for kayaking or other activities. This place deserves time. You\'ll wish you\'d stayed longer—everyone does!'
      }
    ],
    
    experiences: [
      {
        title: 'Corcovado National Park',
        description: 'THE reason to come. Day hikes from Sirena station let you see tapirs, peccaries, all four monkey species, crocodiles, scarlet macaws, and possibly jaguars. The biodiversity is staggering. Most biologically intense place on Earth—and you\'ll believe it. Life-changing.'
      },
      {
        title: 'Matapalo Beach & Tidepools',
        description: 'Beautiful beach south of Puerto Jiménez with incredible tidepools at low tide. Starfish, crabs, trapped fish, natural infinity pools. The combination of rainforest and ocean is magical. Check tide times for best viewing. Bring water shoes.'
      },
      {
        title: 'Night Jungle Tours',
        description: 'The jungle transforms after dark. Guided walks reveal frogs (including the famous red-eyed tree frog), snakes, tarantulas, and nocturnal mammals. Flashlights, expert guides, and the sounds of the jungle at night. Spooky, exciting, fascinating!'
      },
      {
        title: 'Golfo Dulce Kayaking',
        description: 'The calm gulf offers spectacular kayaking. Dolphins are commonly seen, sea turtles, and even whales during migration. Mangrove tours available too. Some areas have bioluminescent plankton at night—paddle through glowing water. Magical!'
      },
      {
        title: 'Tree of Life Wildlife Rescue',
        description: 'In Puerto Jiménez, this sanctuary rehabilitates injured and orphaned animals. See sloths, monkeys, birds, and reptiles up close while learning about conservation. Visits by donation—all money supports their work. The staff\'s dedication is inspiring.'
      },
      {
        title: 'Playa Platanares',
        description: 'Near Puerto Jiménez, this long beach offers surf, swimming, snorkeling, and relaxation. More accessible than Matapalo or Carate but still beautiful. Several good lodges here including the famous Iguana Lodge. Great for combining beach and jungle.'
      },
      {
        title: 'Osa Canopy Zipline',
        description: 'Not as famous as Monteverde but equally good! Zipline through primary rainforest with views of Golfo Dulce. Nine cables including some very long ones. See wildlife while flying through the canopy. Excellent guides and well-maintained operation.'
      },
      {
        title: 'Multi-Day Corcovado Trek',
        description: 'For serious adventurers: 2-3 day trek through Corcovado staying at ranger stations. Sleep in bunks, full immersion in the jungle, incredible wildlife encounters. It\'s challenging but the experience is unparalleled. This is hard-core adventure at its finest!'
      }
    ]
  },

// Continuaré con los 4 destinos que faltaban (Quepos, Uvita, Samara/Nosara, Rincon) en la siguiente parte...
// PARTE 4 - LOS 4 DESTINOS NUEVOS COMPLETOS

  'quepos': {
    name: 'Quepos',
    title: 'The Complete Guide to Quepos',
    subtitle: 'Gateway Town with Authentic Tico Flavor',
    description: 'Sport fishing capital and real Costa Rican town just minutes from Manuel Antonio.',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    searchTerm: 'Quepos',
    isPublished: true,
    
    intro: `Just 7 kilometers from Manuel Antonio National Park sits Quepos—a real working Costa Rican town that most tourists overlook. This is a mistake! Quepos offers authentic local life, excellent restaurants at better prices, world-class sport fishing, and a vibrant weekend farmers market. It's where Ticos actually live and work, not just serve tourists. Staying in Quepos gives you the best of both worlds: easy access to Manuel Antonio's nature plus genuine Costa Rican culture.`,
    
    vibe: {
      title: 'THE VIBE: AUTHENTIC FISHING TOWN',
      content: `**The Real Costa Rica:** Unlike the tourist strip leading to Manuel Antonio, Quepos is a functioning Costa Rican town of about 20,000 people. You'll hear Spanish everywhere, see locals going about daily life, and experience authentic Tico culture. It's refreshingly real.

**Sport Fishing Paradise:** Quepos is one of Costa Rica's premier sport fishing destinations. The waters off the coast are famous for marlin, sailfish, dorado (mahi-mahi), and tuna. World-class fishing year-round. The marina is full of charter boats ready to take you out.

**The Practical Choice:** Hotels in Quepos cost 30-40% less than Manuel Antonio while being only 10 minutes away. Local restaurants serve authentic food at real prices. The town has banks, supermarkets, and services. It's simply more practical and economical.

**Weekend Energy:** Friday and Saturday mornings, the farmers market (feria) transforms the town. Locals come from surrounding areas to sell produce, buy supplies, and socialize. The energy is fantastic—this is real Tico culture in action.

**Perfect Base:** Use Quepos as your home base for exploring the region. Manuel Antonio National Park, Damas Island mangroves, Nauyaca Waterfalls, and rainforest adventures are all easily accessible. Return to town for great dinners and local atmosphere.`,
    },
    
    insiderTips: [
      {
        title: 'Stay in Quepos, Visit Manuel Antonio',
        content: 'This is the savvy traveler\'s strategy. Hotels in Quepos offer better value, you\'re among locals, restaurants are more authentic and affordable, and Manuel Antonio is just a 10-minute, $3 taxi ride away. Best of both worlds without the tourist trap pricing!'
      },
      {
        title: 'The Weekend Farmers Market is Essential',
        content: 'Every Friday and Saturday morning, the feria takes over several blocks. Fresh tropical fruits, homemade tamales, local crafts, produce, and meat. Locals do their weekly shopping here. Arrive by 9am for the best selection. It\'s colorful, energetic, and delicious!'
      },
      {
        title: 'Sport Fishing is World-Class',
        content: 'Quepos consistently ranks among the world\'s best sport fishing destinations. Marlin and sailfish year-round, with peak season December-April. Full-day charters cost $800-1,500 for the boat (up to 6 people). Half-day trips are more affordable. Even non-fishers enjoy the experience!'
      },
      {
        title: 'Marina Area Has Excellent Dining',
        content: 'The marina district (Marina Pez Vela) has upscale restaurants with beautiful views. El Gran Escape is famous for fresh fish. Gabriella\'s serves excellent steak. Z Gastro Bar is trendy. Prices are reasonable and quality is high. Great for special dinners!'
      },
      {
        title: 'Local Sodas for Authentic Meals',
        content: 'Venture into downtown Quepos to find family-run sodas serving traditional casados for $5-8. The food is home-cooked, portions are generous, and the atmosphere is welcoming. Ask locals for their favorite—they love sharing recommendations!'
      },
      {
        title: 'Transportation to Manuel Antonio',
        content: 'Taxis between Quepos and Manuel Antonio cost $3-5 and run constantly. Buses are even cheaper ($0.50) and frequent. Most hotels in Quepos offer shuttle services. Getting to the beach and park is incredibly easy—don\'t feel like you need to stay IN Manuel Antonio.'
      },
      {
        title: 'Banking and Services',
        content: 'Quepos has full banking services, ATMs, pharmacies, medical clinics, supermarkets, and hardware stores. It\'s a real town with everything you need. Much more convenient than staying in the hills above Manuel Antonio where services are limited.'
      },
      {
        title: 'Playa Playitas Swimming Beach',
        content: 'On the Quepos side of the estuary sits Playitas, a calm local beach perfect for swimming and sunset watching. It\'s where Tico families go on weekends. Not as spectacular as Manuel Antonio beaches but convenient, free, and authentically local.'
      },
      {
        title: 'Rainmaker Aerial Walkway',
        content: 'Just 30 minutes inland, this private reserve has an impressive aerial walkway system through pristine rainforest. Excellent alternative to Manuel Antonio\'s crowds. The canopy bridges and waterfalls are stunning. Much less visited!'
      },
      {
        title: 'Nightlife is Low-Key but Fun',
        content: 'Quepos has several bars and clubs, especially around the marina. Fish Head Bar is popular with expats. Cuban Republik plays great music. The vibe is casual and friendly—mix with locals and long-term expats. Much more authentic than Manuel Antonio nightlife.'
      }
    ],
    
    experiences: [
      {
        title: 'World-Class Sport Fishing',
        description: 'Charter a boat for marlin, sailfish, dorado, and tuna. Quepos is consistently rated among the world\'s best fishing destinations. Even if you don\'t keep fish, the thrill of hooking a 300-pound marlin is unforgettable. Half or full-day options available.'
      },
      {
        title: 'Quepos Farmers Market',
        description: 'Every Friday and Saturday morning, experience real Costa Rican market culture. Fresh produce, homemade food, local crafts, and the energy of locals shopping for the week. Arrive early, bring reusable bags, and practice your Spanish!'
      },
      {
        title: 'Marina Pez Vela',
        description: 'The modern marina hosts fishing charters, sailboat tours, jet ski rentals, and waterfront dining. Watch boats come in with their catches in the afternoon. It\'s a beautiful spot for sunset drinks and people-watching.'
      },
      {
        title: 'Rainmaker Reserve',
        description: 'Drive 30 minutes inland to this pristine private reserve. Aerial walkways through primary rainforest, six beautiful waterfalls, crystal-clear swimming holes, and abundant wildlife. Much less crowded than Manuel Antonio and equally beautiful.'
      },
      {
        title: 'Damas Island Mangrove Tours',
        description: 'Kayak or boat through mangrove tunnels spotting crocodiles, monkeys, sloths, herons, and iguanas. The mangrove ecosystem is fascinating and completely different from rainforest. Tours leave from Damas, 15 minutes from Quepos.'
      },
      {
        title: 'Local Restaurant Scene',
        description: 'Quepos has Costa Rica\'s best restaurant concentration outside San José. From authentic sodas to upscale marina dining to craft beer bars—the food scene is diverse and delicious. Much better value than Manuel Antonio strip.'
      },
      {
        title: 'Playa Espadilla Norte Beach Access',
        description: 'The public beach leading to Manuel Antonio National Park starts right where Quepos ends. It\'s a long stretch of sand perfect for walking, surfing, and sunset watching. Free access, fewer crowds than inside the park.'
      },
      {
        title: 'Town Walking Tour',
        description: 'Simply walk around downtown Quepos observing daily life. The central market, church, parque, and residential streets give you insight into real Costa Rican life. It\'s not a tourist show—it\'s just real people living their lives. Wonderfully authentic.'
      }
    ]
  },

  'uvita': {
    name: 'Uvita',
    title: 'Your Complete Guide to Uvita',
    subtitle: 'The Hidden Gem of Costa Rica\'s South Pacific',
    description: 'Pristine beaches, whale watching, and the famous Whale\'s Tail formation.',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    searchTerm: 'Uvita',
    isPublished: true,
    
    intro: `Uvita is Costa Rica's beautiful secret on the South Pacific coast. Anchored by the stunning Whale's Tail beach formation in Marino Ballena National Park, Uvita offers pristine nature without overdevelopment. Humpback whales migrate here twice yearly, waterfalls cascade through jungle, and the beaches remain relatively quiet even in high season. This is Costa Rica for people who want beauty without crowds—pure, peaceful, spectacular nature.`,
    
    vibe: {
      title: 'THE VIBE: PEACEFUL COASTAL PARADISE',
      content: `**The Setting:** Uvita sits along Costa Rica's Costanera Sur, between the more developed areas of Manuel Antonio (north) and the Osa Peninsula (south). It's perfectly positioned—close enough to amenities but far enough to feel remote and peaceful. The setting is spectacularly beautiful.

**The Whale's Tail:** At low tide, Playa Uvita reveals an incredible natural sandbar shaped exactly like a whale's tail extending into the ocean. It's part of Marino Ballena National Park (literally "Marine Whale" park). You can walk out on the tail with ocean on both sides. Stunning and unique.

**Whale Watching Central:** Humpback whales migrate here from both hemispheres, making Uvita one of the only places in the world with whale presence nearly year-round. Peak seasons are July-November (Northern Hemisphere) and December-April (Southern Hemisphere). Mothers with calves are commonly seen.

**The Development:** Uvita is wonderfully underdeveloped. There's a small commercial center with restaurants, shops, and tour operators, but it remains low-key and peaceful. Accommodations range from budget hostels to beautiful eco-lodges hidden in the hills.

**Who Loves Uvita:** People seeking peace, nature lovers, families wanting safe beaches, whale enthusiasts, and travelers who prefer authenticity over luxury resorts. If you want trendy beach clubs and nightlife, look elsewhere. If you want pristine nature and tranquility, Uvita is perfect.`,
    },
    
    insiderTips: [
      {
        title: 'The Whale\'s Tail Appears at Low Tide',
        content: 'The famous sandbar formation is only visible during low tide. Check tide tables and plan your visit accordingly—usually 2-3 hours before low tide through 1 hour after. Walking out on the whale\'s tail with ocean on both sides is surreal. Don\'t miss it!'
      },
      {
        title: 'Whale Watching is Exceptional',
        content: 'Uvita has two whale seasons with different populations. July-November brings Northern Hemisphere humpbacks; December-April brings Southern Hemisphere whales. That\'s nearly 9 months of potential whale sightings! Tours cost $65-80 and have excellent success rates. Seeing mothers with calves is common and magical.'
      },
      {
        title: 'Marino Ballena National Park',
        content: 'Entry costs just $6 for foreigners—incredible value! The park protects both beach and marine areas. You can snorkel, swim, walk the whale\'s tail, and spot marine life. Go early to avoid midday heat and claim a good spot under the trees.'
      },
      {
        title: 'Nauyaca Waterfalls from Uvita',
        content: 'These spectacular two-tier waterfalls are about 45 minutes from Uvita. Horseback or short hike in, then swim in massive natural pools. It\'s consistently rated one of Costa Rica\'s best waterfall experiences. Book tours from Uvita—many operators offer packages.'
      },
      {
        title: 'Town Layout is Spread Out',
        content: 'Uvita doesn\'t have a traditional town center. Services and restaurants are spread along the highway. Having a rental car makes exploration much easier. Alternatively, many hotels offer bicycle rentals which work well for getting around the flat coastal road.'
      },
      {
        title: 'Excellent Local Restaurants',
        content: 'Despite being small, Uvita has a fantastic food scene. Sibu offers upscale fusion, Sabor Español serves excellent Spanish cuisine, Baker Bean has great coffee and pastries. The Saturday farmers market at Uvita  provides fresh local produce and prepared foods.'
      },
      {
        title: 'Playa Hermosa (Not the Same One)',
        content: 'Just north of Uvita sits another beautiful beach called Playa Hermosa (different from Guanacaste\'s Hermosa). Much less visited, it offers excellent swimming, boogie boarding, and is palm tree-lined. Worth exploring if you want even more solitude.'
      },
      {
        title: 'Catarata Uvita Waterfall',
        content: 'Right in town, a short trail leads to this beautiful jungle waterfall with a swimming hole. It\'s easily accessible, costs just a few dollars, and is perfect for a quick nature fix between beach visits. Much less known than Nauyaca.'
      },
      {
        title: 'Pack for Both Beach and Jungle',
        content: 'Uvita\'s beauty lies in having both. Bring beach gear (snorkel, swimsuit, sunscreen) plus closed-toe shoes for waterfall hikes and jungle trails. Quick-dry clothes work for everything. The combination of marine and terrestrial activities makes Uvita special.'
      },
      {
        title: 'Stay at Least 3-4 Days',
        content: 'Uvita deserves time. One day for the whale\'s tail and park, one for whale watching, one for waterfalls, plus time to simply relax. The pace is slow and peaceful—rushing through defeats the purpose. Give yourself time to decompress and enjoy.'
      }
    ],
    
    experiences: [
      {
        title: 'Walk the Whale\'s Tail',
        description: 'During low tide, walk out on the famous sandbar formation that looks exactly like a whale\'s tail from above. Ocean on both sides, incredible photo opportunities, shallow tide pools with marine life. It\'s surreal and beautiful. Check tide tables!'
      },
      {
        title: 'Humpback Whale Watching',
        description: 'Take a boat tour to see humpback whales, dolphins, and sea turtles in their natural habitat. Mothers teaching calves to breach is commonly seen. The boat rides through Marino Ballena National Park are stunning even when whales are shy. Nearly guaranteed success during peak seasons.'
      },
      {
        title: 'Marino Ballena National Park',
        description: 'This marine park protects coral reefs, beaches, and marine life. Snorkel among tropical fish, walk pristine beaches, spot various species of crabs and birds. Entry is just $6—one of Costa Rica\'s best values. The park rangers are knowledgeable and friendly.'
      },
      {
        title: 'Nauyaca Waterfalls Adventure',
        description: 'Journey to these spectacular two-tier waterfalls. Horseback through countryside or hike through jungle, then swim in massive crystal-clear pools. The lower pool is like a natural infinity pool. Tours from Uvita include transport and guide. Don\'t skip this!'
      },
      {
        title: 'Snorkeling & Diving',
        description: 'The marine park offers excellent snorkeling with healthy coral reefs and abundant marine life. Caño Island (offshore) provides world-class diving. The underwater visibility is excellent, and the marine biodiversity rivals the terrestrial jungle.'
      },
      {
        title: 'Uvita Farmers Market',
        description: 'Every Saturday morning, locals and expats gather at the organic farmers market. Fresh produce, artisan bread, local honey, organic coffee, prepared foods, and crafts. It\'s social, delicious, and supports local farmers. Arrive by 9am for best selection.'
      },
      {
        title: 'Waterfall Rappelling',
        description: 'Several local operators offer canyoning and waterfall rappelling adventures. Rappel down jungle waterfalls—thrilling and scenic. It\'s an adrenaline rush in a stunning natural setting. Suitable for beginners with good fitness and no fear of heights.'
      },
      {
        title: 'Beach Hopping',
        description: 'The Costanera Sur from Dominical to Uvita to Ojochal has numerous beautiful beaches, each with unique character. Rent a car or bike and explore—Playa Colonia, Playa Ballena, Playa Hermosa, Playa Ventanas (with caves!). All are gorgeous and relatively quiet.'
      }
    ]
  },

  'samara-nosara': {
    name: 'Sámara / Nosara',
    title: 'Complete Guide to Sámara & Nosara',
    subtitle: 'Laid-Back Beach Towns with Surf & Yoga',
    description: 'Experience authentic beach life in two of Costa Rica\'s most charming coastal towns.',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    searchTerm: 'Samara',
    isPublished: true,
    
    intro: `Sámara and Nosara represent two distinct flavors of Guanacaste beach life—both wonderful in their own ways. Sámara is a charming, accessible beach town with a lovely bay perfect for families. Nosara is more spread out and upscale, famous for yoga and world-class surfing. Both offer the "real" Costa Rica with local communities, authentic vibes, and stunning nature. Choose based on your style, or visit both—they're only 40 minutes apart.`,
    
    vibe: {
      title: 'THE VIBE: TWO TOWNS, TWO PERSONALITIES',
      content: `**SÁMARA: Family-Friendly Beach Charm**
Sámara feels like a real Costa Rican beach town that happens to welcome tourists rather than existing solely for them. The horseshoe bay has gentle waves perfect for swimming and learning to surf. The town is compact and walkable with beach restaurants, small hotels, and friendly locals. It's safe, affordable, and wonderfully unpretentious. Perfect for families, first-time visitors, and anyone who wants an authentic beach town without pretension.

**NOSARA: Yoga, Surf & Wellness Paradise**
Nosara has evolved into an upscale wellness destination. World-renowned yoga studios, healthy restaurants, and serious surf breaks attract a health-conscious international crowd. It's more spread out, pricier, and less "town-like" than Sámara. The beach is stunning but the waves are powerful. It's perfect for yogis, experienced surfers, and people seeking the wellness lifestyle in a beautiful setting.

**Getting There:** Both require navigating partially unpaved roads (typical Guanacaste). The roads are passable but bumpy—4WD helps but isn't always essential in dry season. The difficult access keeps both places relatively undiscovered and special.

**The Common Ground:** Both towns have strong local communities, excellent restaurants, beautiful beaches, consistent surf, and the laid-back Guanacaste spirit. Neither is overrun with mega-resorts or spring break crowds. They're real, authentic, and wonderful.`,
    },
    
    insiderTips: [
      {
        title: 'Sámara\'s Bay is Perfect for Families',
        content: 'The curved bay creates calm, gentle waves ideal for children and beginners. The beach is long, sandy, and beautiful. Lifeguards are usually present. Many consider it one of Costa Rica\'s best family beaches. Swimming is safe and pleasant—rare on the Pacific coast!'
      },
      {
        title: 'Nosara\'s Surf is for Experienced Riders',
        content: 'Playa Guiones (Nosara\'s main beach) has powerful waves and strong currents. It\'s excellent for intermediate to advanced surfers but challenging for beginners. If you\'re learning to surf, take lessons rather than going out alone. The surf instructors know where it\'s safer.'
      },
      {
        title: 'Nosara Yoga Epicenter',
        content: 'Bodhi Tree Yoga Resort and the Nosara Yoga Institute are internationally famous. Many visitors come specifically for yoga retreats and teacher trainings. Drop-in classes are available for travelers. The yoga community is welcoming and the studios are beautiful.'
      },
      {
        title: 'Road Access is Adventurous',
        content: 'Both towns require navigating unpaved sections of road, especially the last 20-30 minutes. Passable but rough in spots. Go slowly, especially in rainy season. The difficult access is exactly why these places remain special and not overrun. Embrace the adventure!'
      },
      {
        title: 'Sámara is More Budget-Friendly',
        content: 'Sámara offers better value with more affordable hotels, restaurants, and activities. Nosara is noticeably pricier with upscale establishments catering to the yoga/wellness crowd. Choose based on your budget and preferred atmosphere. Both are worth the money!'
      },
      {
        title: 'Visit Both in One Trip',
        content: 'They\'re only 40 minutes apart (though the road is rough). Many travelers stay in one and day-trip to the other. This lets you experience both vibes. Sámara for the family beach day, Nosara for yoga class and upscale dining. Best of both worlds!'
      },
      {
        title: 'Bring Cash',
        content: 'Both towns have ATMs but they sometimes run out. Bring sufficient cash, especially for Nosara where cash is handy for yoga class drop-ins, market purchases, and smaller establishments. Cards work at most restaurants but not everywhere.'
      },
      {
        title: 'Ostional Turtle Sanctuary Near Nosara',
        content: 'One of the world\'s most important olive ridley turtle nesting beaches is just 20 minutes from Nosara. During arribadas (mass nesting events, usually Sep-Nov), thousands of turtles come ashore simultaneously. Tours must be with authorized guides. It\'s mind-blowing!'
      },
      {
        title: 'Rental Car Highly Recommended',
        content: 'Both areas are spread out. Having a car lets you explore different beaches, restaurants, and nearby attractions at your own pace. Public transport is limited. Many accommodations are not right in town, making a car very useful.'
      },
      {
        title: 'Stay at Least 4-5 Days',
        content: 'These aren\'t places to rush through. The vibe is slow, peaceful, and restorative. Spend time on the beach, take a yoga class, surf, explore nearby beaches, eat well, and truly relax. The value is in slowing down and soaking it all in.'
      }
    ],
    
    experiences: [
      {
        title: 'Sámara Beach & Bay',
        description: 'Swim, paddleboard, kayak, or learn to surf in this protected bay with gentle waves. The beach is beautiful, long, and perfect for walking at sunset. Family-friendly and safe. Several beachfront restaurants offer fresh seafood and cold drinks.'
      },
      {
        title: 'Nosara Surfing',
        description: 'Ride world-class waves at Playa Guiones—one of Costa Rica\'s best surf beaches. Consistent waves year-round, warm water, and a thriving surf culture. Multiple surf schools and board rentals available. The surf community is welcoming and passionate.'
      },
      {
        title: 'Yoga in Nosara',
        description: 'Drop into classes at renowned studios like Bodhi Tree or Nosara Yoga Institute. All levels welcome, from beginners to experienced practitioners. Yoga on the platform with jungle views and ocean breezes is transcendent. Many studios also offer workshops and meditation.'
      },
      {
        title: 'Ostional Turtle Arribada',
        description: 'Witness one of nature\'s most spectacular events—thousands of olive ridley sea turtles nesting simultaneously. Peak is typically September-November. Must go with authorized guides. The number of turtles is overwhelming and moving. Truly unforgettable.'
      },
      {
        title: 'Sámara to Carrillo Beach Walk',
        description: 'Walk or drive to nearby Playa Carrillo, considered one of Guanacaste\'s most beautiful beaches. White sand, clear water, coconut palms, and much quieter than Sámara. Perfect for a peaceful beach day. The walk along the coast is scenic.'
      },
      {
        title: 'Werner Sauter Biological Reserve',
        description: 'Near Sámara, this private reserve offers guided night hikes and day tours through dry tropical forest. See wildlife you\'d miss elsewhere—monkeys, coatis, countless birds, and if lucky, ocelots. The guides are excellent and passionate about conservation.'
      },
      {
        title: 'Playa Barrigona',
        description: 'Hidden gem beach between Sámara and Nosara. Long, pristine, and usually deserted. The access road is very rough (4WD essential) which keeps crowds away. Bring everything you need—there are no services. Worth it for solitude seekers!'
      },
      {
        title: 'Farmers Market Experience',
        description: 'Nosara has an excellent Saturday organic market. Fresh produce, artisan bread, local honey, prepared foods, and crafts. It\'s social, delicious, and supports local farmers and artisans. Arrive early for best selection. Great people-watching too!'
      }
    ]
  },

  'rincon-de-la-vieja': {
    name: 'Rincón de la Vieja',
    title: 'Complete Guide to Rincón de la Vieja',
    subtitle: 'Active Volcano Adventures & Natural Hot Springs',
    description: 'Experience bubbling mud pots, volcanic hot springs, and authentic ranch life.',
    image: 'https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/waterfall-costa-rica-tour.webp',
    searchTerm: 'Rincon de la Vieja',
    isPublished: true,
    
    intro: `Rincón de la Vieja National Park offers something genuinely different—an active volcano with bubbling mud pots, volcanic hot springs, pristine waterfalls, and authentic hacienda experiences. Located just an hour from Liberia airport, it's the perfect first or last stop on a Guanacaste beach trip. You'll hike through dramatic volcanic landscapes, soak in natural hot springs, maybe go horseback riding on a working cattle ranch, and see a wilder, more rugged side of Costa Rica. It's adventure with a cowboy twist.`,
    
    vibe: {
      title: 'THE VIBE: VOLCANIC ADVENTURE MEETS RANCH LIFE',
      content: `**The Volcano:** Rincón de la Vieja is an active volcano—not lava-spewing, but definitely alive. You'll see and smell the volcanic activity: bubbling mud pots, steaming fumaroles, sulfur vents, and hot springs. It's fascinating and slightly otherworldly. The volcano last erupted in 2021, keeping things interesting!

**The Landscape:** This is dry tropical forest, very different from cloud forest or Caribbean jungle. During dry season, it feels almost African—hot, dusty, wide open spaces with deciduous trees. Rainy season transforms everything green. The contrast is dramatic.

**Hacienda Culture:** The area around the park is working cattle ranch country. Several lodges are actual functioning haciendas where you can experience authentic Costa Rican ranch life. Horseback riding, cowboy culture, and rural traditions are alive here.

**The Location:** Only 1 hour from Liberia airport (LIR) makes this perfect for arriving or departing. Many travelers spend their first or last night here before flying out or heading to beaches. It's efficient and adds a completely different landscape to your trip.

**Adventure Central:** The park and surrounding lodges offer incredible activities: volcano hiking, waterfall rappelling, horseback riding, hot springs, ziplines, river tubing, and more. It's outdoor adventure playground for active travelers.`,
    },
    
    insiderTips: [
      {
        title: 'Two Sectors, Different Experiences',
        content: 'The park has two sectors: Las Pailas (more popular, closer to lodges, impressive volcanic features) and Santa María (more remote, waterfalls, cooler temps). Las Pailas is what most people visit and it\'s spectacular. Either way, you need to choose—they\'re far apart.'
      },
      {
        title: 'Guides Are Highly Recommended',
        content: 'While you can hike independently, guides add enormous value. They spot wildlife, explain the fascinating volcanic geology, know the safe trails, and share local knowledge. The volcanic features are much more interesting when someone explains what you\'re seeing.'
      },
      {
        title: 'Go Early to Beat the Heat',
        content: 'This area gets HOT, especially during dry season (December-April). Start hikes by 7-8am when it\'s cooler, wildlife is more active, and you\'ll finish before midday heat. Bring tons of water, sunscreen, hat, and lightweight clothes. The sun is intense!'
      },
      {
        title: 'Stay at a Hacienda Lodge',
        content: 'Rather than staying in Liberia, book a lodge near the park. Places like Hacienda Guachipelín, Borinquen Resort, or Buena Vista Lodge offer volcano tours, hot springs, horseback riding, and meals. The full ranch experience is worth it. Many have excellent all-inclusive packages.'
      },
      {
        title: 'Hot Springs After Hiking',
        content: 'Several lodges have natural hot spring complexes on property. After hiking the volcanic trails, soaking in volcanic-heated pools is heaven for tired muscles. Borinquen Resort has particularly beautiful hot springs with views. Build this into your day!'
      },
      {
        title: 'Waterfall Rappelling is Thrilling',
        content: 'Several operators offer canyoning/waterfall rappelling in the area. You\'ll rappel down the stunning blue waterfall in the park or nearby waterfalls. It\'s exhilarating, scenic, and doesn\'t require previous experience—just reasonable fitness and a sense of adventure!'
      },
      {
        title: 'Perfect First or Last Stop',
        content: 'Only 1 hour from LIR airport, Rincón de la Vieja makes logical sense. Arrive at LIR, transfer directly to a lodge, do the volcano and activities next day, then continue to beaches. Or reverse when departing. It breaks up travel and adds a unique landscape.'
      },
      {
        title: 'Horseback Riding is Authentic',
        content: 'This is real cowboy country. Horseback rides go through working cattle ranches, forests, and to waterfalls. It\'s not touristy trail rides—it\'s authentic ranch riding. If you can ride, request faster rides. They\'ll accommodate all experience levels.'
      },
      {
        title: 'Wildlife is Abundant',
        content: 'White-faced monkeys, howlers, coatis, armadillos, countless birds including toucans and parrots. The dry forest supports different wildlife than rainforest. Bring binoculars! Early morning hikes offer best wildlife viewing.'
      },
      {
        title: 'Allow 1-2 Full Days',
        content: 'Don\'t just squeeze in a half-day tour. Allow time for a full day of volcano hiking and hot springs, maybe a second day for horseback riding, canopy zip lines, or river tubing. The area deserves more than a quick visit. The activities are too good to rush!'
      }
    ],
    
    experiences: [
      {
        title: 'Las Pailas Volcano Trail',
        description: 'Hike this fascinating trail through active volcanic landscape. See bubbling mud pots (pailas), steaming fumaroles, sulfur vents, and volcanic craters. The earth is literally alive beneath your feet. It\'s educational, dramatic, and unlike anything else in Costa Rica. Allow 3-4 hours.'
      },
      {
        title: 'Natural Hot Springs',
        description: 'Soak in volcanic-heated thermal pools surrounded by nature. Each lodge has different hot spring setups—some rustic, some luxurious. The minerals are therapeutic and the experience is deeply relaxing after hiking. Many lodges include this with stays or tours.'
      },
      {
        title: 'Oropéndola Waterfall Rappelling',
        description: 'Rappel down or beside this stunning blue waterfall. Professional guides make it accessible for beginners. It\'s thrilling, scenic, and cooling! You\'ll get wet, laugh a lot, and feel accomplished. One of the region\'s signature adventures.'
      },
      {
        title: 'Horseback Riding to Waterfalls',
        description: 'Ride through working cattle ranches and forest to reach stunning waterfalls. This is authentic ranch riding, not nose-to-tail tourist trails. The cowboys (sabaneros) are real, and the landscape is beautiful. Swimming at hidden waterfall pools is magical.'
      },
      {
        title: 'Canopy Zipline Tours',
        description: 'Fly through the dry forest canopy on ziplines. Several lodges have excellent canopy tours on property. Views include volcano, surrounding landscape, and often forest wildlife below. It\'s thrilling with spectacular scenery.'
      },
      {
        title: 'River Tubing Adventure',
        description: 'Float down the Río Negro in inflatable tubes. It\'s fun, refreshing, and scenic—not extreme rapids, just  enjoyable floating through beautiful landscape. Perfect for hot afternoons. Most lodges offer this as part of activity packages.'
      },
      {
        title: 'Pailas de Agua Fría',
        description: 'Less visited but equally fascinating volcanic features including cold water bubbling pots (hence the name). It\'s a longer, more challenging hike. For those wanting a quieter, more adventurous volcano experience. Guides recommended for this trail.'
      },
      {
        title: 'Wildlife Watching',
        description: 'The dry forest supports different species than rainforest. Excellent bird watching including three-wattled bellbird, orange-fronted parakeet, and various toucans. Mammals include three monkey species, coatis, and if very lucky, mountain cats. Early morning is best.'
      }
    ]
  }

};

// ==============================================
// REACT COMPONENT
// ==============================================

export default function DestinationPage({ params }: { params: { slug: string } }) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  
  const destination = destinationContent[params.slug];

  useEffect(() => {
    async function fetchRoutes() {
      if (destination?.searchTerm) {
        const fetchedRoutes = await getDestinationRoutes(destination.searchTerm);
        setRoutes(fetchedRoutes);
      }
      setLoading(false);
    }
    
    fetchRoutes();
  }, [destination]);

  if (!destination) {
    notFound();
  }

  if (!destination.isPublished) {
    return (
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-20 max-w-4xl">
          <Link
            href="/travel-guide"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors"
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

  return (
    <main className="min-h-screen bg-white">
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
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl mb-4">
              {destination.title}
            </h1>
            <p className="text-xl text-white/90 drop-shadow-lg">
              {destination.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          
          <div className="mb-12">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">👋</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-600 mb-1">Can't Wait Travel Team</p>
                  <p className="text-gray-500 text-sm">Local experts who live and breathe Costa Rica</p>
                </div>
              </div>
              <p className="text-xl text-gray-700 leading-relaxed">
                {destination.intro}
              </p>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 italic">
                  💬 We've researched extensively and talked with our drivers to bring you the most practical, 
                  honest advice. This is what we wish someone had told us!
                </p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <div className="bg-gradient-to-br from-blue-50 via-orange-50 to-yellow-50 rounded-3xl p-8 md:p-12 border-2 border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🌴</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {destination.vibe.title}
                </h2>
              </div>
              <div className="prose prose-lg max-w-none">
                {destination.vibe.content.split('\n\n').map((paragraph: string, idx: number) => {
                  if (paragraph.trim().startsWith('**')) {
                    const boldMatch = paragraph.match(/\*\*(.+?)\*\*/);
                    const boldText = boldMatch ? boldMatch[1] : '';
                    const restText = paragraph.replace(/\*\*(.+?)\*\*/, '').trim();
                    return (
                      <p key={idx} className="mb-6 text-gray-700 leading-relaxed">
                        <span className="font-bold text-blue-700 text-lg">{boldText}</span>
                        {restText && <span className="ml-1">{restText}</span>}
                      </p>
                    );
                  }
                  return (
                    <p key={idx} className="mb-6 text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              10 Insider Tips for {destination.name}
            </h2>
            <p className="text-gray-600 mb-8">
              Based on extensive research, local expertise, and real traveler experiences:
            </p>
            <div className="space-y-6">
              {destination.insiderTips.map((tip: any, idx: number) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-600">
                  <h3 className="font-bold text-gray-900 mb-2">
                    {idx + 1}. {tip.title}
                  </h3>
                  <p className="text-gray-600">
                    {tip.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-4">
                <span className="text-2xl">⭐</span>
                <span className="font-bold text-green-700 text-sm uppercase tracking-wide">Our Favorite Experiences</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What to Do in {destination.name}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These are the activities our team and clients love most. Trust us, they're worth it! 🇨🇷
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {destination.experiences.map((exp: any, idx: number) => (
                <div key={idx} className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">
                        {['🌴', '🏖️', '🌊', '🦥', '🌋', '☕', '🚣', '🎣'][idx % 8]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {exp.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-500 italic">
                💡 Pro tip: Our drivers know all these spots and can give you even more recommendations!
              </p>
            </div>
          </div>

          <div className="mb-16">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-gray-200">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
                    <span className="text-xl">🚐</span>
                    <span className="font-semibold text-blue-700 text-sm uppercase tracking-wide">Can't Wait Travel</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Popular Routes from {destination.name}
                  </h2>
                  <p className="text-lg text-gray-600">
                    Our professional drivers will get you there safely and comfortably
                  </p>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading routes...</p>
                  </div>
                ) : routes.length > 0 ? (
                  <>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                      {routes.slice(0, 6).map((route) => (
                        <div key={route.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MapPin className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {route.origen} → {route.destino}
                                </h3>
                                {route.alias && (
                                  <p className="text-sm text-gray-500 mt-0.5">{route.alias}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-6 flex-shrink-0">
                              <div className="text-right">
                                <div className="flex items-center gap-1.5 text-gray-600">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-sm font-medium">{formatDuration(route.duracion)}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">${route.precio1a6}</div>
                                <div className="text-xs text-gray-500">1-6 passengers</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-500">
                        ✨ All shuttles include: AC • WiFi • Professional driver • Door-to-door service
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-600">
                      Routes from {destination.name} coming soon. Contact us for personalized quotes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-10 border border-blue-100">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mb-6">
                <span className="text-4xl">🚐</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Visit {destination.name}?
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Skip the hassle of public buses or expensive rental cars. 
                Let our local drivers take you directly from the airport. 
                Safe, comfortable, and stress-free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <Link
                  href="/#booking"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  <span>Book Your Shuttle</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all"
                >
                  <span>Ask Us Anything</span>
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="text-green-600">✓</span>
                  <span>Professional Drivers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-green-600">✓</span>
                  <span>AC & WiFi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-green-600">✓</span>
                  <span>Door-to-Door</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}