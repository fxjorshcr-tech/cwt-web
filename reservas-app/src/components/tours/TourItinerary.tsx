// src/components/tours/TourItinerary.tsx
// Componente para mostrar el itinerario del tour de forma visual y fluida

'use client';

import { Clock, MapPin, Camera, Utensils } from 'lucide-react';

interface TourItineraryProps {
  description: string;
}

export function TourItinerary({ description }: TourItineraryProps) {
  // Función para dividir por actividades usando el separador ###
  const createSteps = (text: string) => {
    // Primero intentar dividir por el separador ###
    if (text.includes(' ### ')) {
      return text.split(' ### ').map(s => s.trim()).filter(s => s.length > 0);
    }
    
    // Fallback: dividir en oraciones y agrupar cada 2
    const sentences = text.split(/\.\s+/).filter(s => s.trim().length > 20);
    
    if (sentences.length <= 3) {
      return sentences.map(s => s.trim() + '.');
    }
    
    const grouped = [];
    for (let i = 0; i < sentences.length; i += 2) {
      const group = sentences.slice(i, Math.min(i + 2, sentences.length));
      grouped.push(group.join('. ') + '.');
    }
    
    return grouped;
  };
  
  const steps = createSteps(description);
  
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="h-6 w-6 text-blue-600" />
        Tour Itinerary
      </h2>
      
      {/* Timeline Visual */}
      <div className="space-y-6">
        {steps.map((step, index) => {
          // Detectar horarios en el texto
          const timeMatch = step.match(/(\d{1,2}:\d{2}\s?(?:AM|PM))/);
          const hasTime = timeMatch && timeMatch[0];
          
          // Determinar ícono según posición y contenido del PASO ACTUAL
          let icon = <span className="text-white font-bold text-sm">{index + 1}</span>;
          
          // Primer paso siempre es pickup/inicio
          if (index === 0) {
            icon = <MapPin className="h-5 w-5 text-white" />;
          }
          // Último paso es regreso/final
          else if (index === steps.length - 1) {
            icon = <Camera className="h-5 w-5 text-white" />;
          }
          // Si este paso específico menciona lunch/meal/restaurant, usar tenedor
          else if (
            step.toLowerCase().includes('lunch') || 
            step.toLowerCase().includes('restaurant') ||
            step.toLowerCase().includes('meal') ||
            step.toLowerCase().includes('enjoy a traditional')
          ) {
            icon = <Utensils className="h-5 w-5 text-white" />;
          }
          
          return (
            <div key={index} className="flex gap-4 relative">
              {/* Timeline line */}
              {index < steps.length - 1 && (
                <div className="absolute left-5 top-12 w-0.5 bg-gradient-to-b from-blue-300 via-blue-200 to-blue-100" 
                     style={{ height: 'calc(100% + 24px)' }} />
              )}
              
              {/* Timeline dot with icon */}
              <div className="flex-shrink-0 relative z-10">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  {icon}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-2">
                {hasTime && (
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-3">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {hasTime}
                  </div>
                )}
                <div className="text-gray-700 leading-relaxed">
                  <p>{step}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}