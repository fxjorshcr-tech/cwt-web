// src/components/seo/StructuredData.tsx
// ✅ UPDATED with real domain and contact info

'use client';

export default function StructuredData() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TravelAgency"],
    "@id": "https://cantwaittravelcr.com/#business",
    "name": "Can't Wait Travel CR",
    "image": "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/logo-cant-wait-travel.webp",
    "description": "Professional private shuttle and airport transfer service in Costa Rica. Experienced professionals, bilingual drivers, modern vehicles. ICT licensed #4121-2025.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "La Fortuna",
      "addressRegion": "Alajuela",
      "addressCountry": "CR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 10.4677,
      "longitude": -84.6431
    },
    "url": "https://cantwaittravelcr.com",
    "telephone": "+506-8596-2438",
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://cantwaittravelcr.com/#service",
    "serviceType": "Private Shuttle & Airport Transfer",
    "name": "Private Shuttle & Airport Transfers Costa Rica",
    "description": "Door-to-door private shuttle and airport transfer service from SJO and LIR airports to all major Costa Rica destinations including La Fortuna, Manuel Antonio, Tamarindo, and Monteverde. Over 400+ routes available.",
    "provider": {
      "@id": "https://cantwaittravelcr.com/#business"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Costa Rica"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Private Shuttle Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Airport Transfer SJO",
            "description": "Private shuttle from San José Airport (SJO) to any destination in Costa Rica"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Airport Transfer LIR",
            "description": "Private shuttle from Liberia Airport (LIR) to Guanacaste destinations"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Inter-Destination Transfers",
            "description": "Private shuttle between Costa Rica destinations"
          }
        }
      ]
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://cantwaittravelcr.com"
      }
    ]
  };

  return (
    <>
      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      
      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}