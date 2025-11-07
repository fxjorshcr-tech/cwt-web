// app/robots.ts
// Next.js automatically generates robots.txt at /robots.txt

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/booking-details/',
        '/*?booking_id=*',
      ],
    },
    sitemap: 'https://cantwaittravelcr.com/sitemap.xml',
  }
}