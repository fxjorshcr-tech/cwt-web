// app/sitemap.ts
// Next.js automatically generates the sitemap at /sitemap.xml

import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cantwaittravelcr.com'

  // Main pages
  const routes = [
    '',
    '/transfers',
    '/private-tours',
    '/travel-guide',
    '/contact',
    '/faq',
    '/terms',
    '/privacy',
    '/cancellation',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Popular shuttle routes (27 most booked routes)
  const popularShuttleRoutes = [
    // SJO Airport routes
    'sjo-to-la-fortuna',
    'sjo-to-manuel-antonio',
    'sjo-to-tamarindo',
    'sjo-to-monteverde',
    'sjo-to-puerto-viejo',
    
    // La Fortuna routes
    'la-fortuna-to-sjo',
    'la-fortuna-to-lir',
    'la-fortuna-to-monteverde',
    'la-fortuna-to-papagayo',
    'la-fortuna-to-tamarindo',
    'la-fortuna-to-manuel-antonio',
    'la-fortuna-to-jaco',
    'la-fortuna-to-samara',
    'la-fortuna-to-nosara',
    'la-fortuna-to-puerto-viejo',
    
    // LIR Airport routes
    'lir-to-tamarindo',
    'lir-to-papagayo',
    'lir-to-la-fortuna',
    'lir-to-nosara',
    'lir-to-santa-teresa',
    'lir-to-monteverde',
    'lir-to-rio-celeste',
    
    // Monteverde routes
    'monteverde-to-sjo',
    'monteverde-to-manuel-antonio',
    'monteverde-to-tamarindo',
    'monteverde-to-la-fortuna',
  ].map((slug) => ({
    url: `${baseUrl}/shuttle/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...routes, ...popularShuttleRoutes]
}