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
    '/about',
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

  // Add popular destination pages (if you have them)
  const destinations = [
    '/transfers/sjo-to-la-fortuna',
    '/transfers/lir-to-tamarindo',
    '/transfers/sjo-to-manuel-antonio',
    '/transfers/sjo-to-monteverde',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...routes, ...destinations]
}