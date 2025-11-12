// src/components/tours/TourGallery.tsx
/**
 * Galería híbrida de fotos del tour
 * - Foto principal grande
 * - Thumbnails clickeables abajo
 * - 0 KB de librerías externas
 * - Performance optimizada
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TourGalleryProps {
  images: string[];
  tourName: string;
}

export function TourGallery({ images, tourName }: TourGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Foto Principal */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 group">
        <Image
          src={images[selectedIndex]}
          alt={`${tourName} - Photo ${selectedIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          priority={selectedIndex === 0}
          quality={85}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Navigation Arrows (solo si hay más de 1 foto) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails (solo si hay más de 1 foto) */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-video rounded-lg overflow-hidden transition-all ${
                index === selectedIndex
                  ? 'ring-4 ring-blue-500 scale-105'
                  : 'ring-2 ring-gray-200 hover:ring-gray-300 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={image}
                alt={`${tourName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 200px"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}