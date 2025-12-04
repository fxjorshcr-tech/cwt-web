// src/components/sections/InteractiveMap.tsx
// Interactive SVG map of Costa Rica showing popular routes
'use client';

import { useState } from 'react';
import { MapPin, Plane, ArrowRight } from 'lucide-react';

// Location data with approximate coordinates on the SVG (0-100 scale)
const LOCATIONS = [
  { id: 'sjo', name: 'SJO Airport', fullName: 'San José (SJO)', x: 48, y: 52, type: 'airport' },
  { id: 'lir', name: 'LIR Airport', fullName: 'Liberia (LIR)', x: 28, y: 28, type: 'airport' },
  { id: 'la-fortuna', name: 'La Fortuna', fullName: 'La Fortuna / Arenal', x: 42, y: 38, type: 'destination' },
  { id: 'monteverde', name: 'Monteverde', fullName: 'Monteverde', x: 35, y: 45, type: 'destination' },
  { id: 'manuel-antonio', name: 'Manuel Antonio', fullName: 'Manuel Antonio', x: 40, y: 72, type: 'destination' },
  { id: 'tamarindo', name: 'Tamarindo', fullName: 'Tamarindo', x: 22, y: 32, type: 'destination' },
  { id: 'puerto-viejo', name: 'Puerto Viejo', fullName: 'Puerto Viejo', x: 78, y: 58, type: 'destination' },
  { id: 'papagayo', name: 'Papagayo', fullName: 'Gulf of Papagayo', x: 24, y: 24, type: 'destination' },
  { id: 'jaco', name: 'Jacó', fullName: 'Jacó Beach', x: 38, y: 62, type: 'destination' },
  { id: 'guanacaste', name: 'Guanacaste', fullName: 'Guanacaste Beaches', x: 18, y: 35, type: 'destination' },
];

// Popular routes to highlight
const POPULAR_ROUTES = [
  { from: 'sjo', to: 'la-fortuna', label: 'Most Popular' },
  { from: 'sjo', to: 'manuel-antonio', label: 'Beach Favorite' },
  { from: 'lir', to: 'tamarindo', label: 'Quick Transfer' },
  { from: 'sjo', to: 'monteverde', label: 'Cloud Forest' },
  { from: 'lir', to: 'papagayo', label: 'Resort Area' },
];

export default function InteractiveMap() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);

  // Dispatch route selection to the booking form
  const dispatchRouteSelect = (origin: string, destination: string) => {
    // Dispatch custom event for QuickSearchForm to listen
    const event = new CustomEvent('mapRouteSelect', {
      detail: { origin, destination }
    });
    window.dispatchEvent(event);

    // Scroll to booking form
    const bookingSection = document.querySelector('.booking-form-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback: scroll to top where form usually is
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handleLocationClick = (locationId: string) => {
    const location = LOCATIONS.find(l => l.id === locationId);
    if (!location) return;

    if (!selectedOrigin) {
      // First click - select origin
      setSelectedOrigin(locationId);
    } else if (selectedOrigin === locationId) {
      // Clicked same location - deselect
      setSelectedOrigin(null);
    } else {
      // Second click - select destination and trigger route
      const origin = LOCATIONS.find(l => l.id === selectedOrigin);
      if (origin) {
        dispatchRouteSelect(origin.fullName, location.fullName);
      }
      setSelectedOrigin(null);
    }
  };

  const handleQuickRouteClick = (fromId: string, toId: string) => {
    const from = LOCATIONS.find(l => l.id === fromId);
    const to = LOCATIONS.find(l => l.id === toId);
    if (from && to) {
      dispatchRouteSelect(from.fullName, to.fullName);
    }
  };

  const getLocationById = (id: string) => LOCATIONS.find(l => l.id === id);

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Explore Our Routes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Click any destination on the map or choose a popular route below
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 overflow-hidden">
              {/* Selection instruction */}
              {selectedOrigin && (
                <div className="absolute top-4 left-4 right-4 z-20 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Now select your destination
                  </span>
                </div>
              )}

              {/* SVG Map */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-auto max-h-[400px] sm:max-h-[500px]"
                style={{ minHeight: '300px' }}
              >
                {/* Costa Rica Outline (simplified) */}
                <defs>
                  <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#4ade80" />
                  </linearGradient>
                  <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#bfdbfe" />
                    <stop offset="100%" stopColor="#93c5fd" />
                  </linearGradient>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3"/>
                  </filter>
                </defs>

                {/* Ocean background */}
                <rect x="0" y="0" width="100" height="100" fill="url(#oceanGradient)" />

                {/* Simplified Costa Rica shape */}
                <path
                  d="M 15 20
                     Q 20 15, 30 18
                     L 45 22
                     Q 55 20, 65 25
                     L 80 35
                     Q 88 42, 85 55
                     L 82 65
                     Q 78 72, 70 70
                     L 55 75
                     Q 45 80, 35 78
                     L 25 70
                     Q 18 65, 20 55
                     L 18 45
                     Q 12 35, 15 20 Z"
                  fill="url(#landGradient)"
                  stroke="#16a34a"
                  strokeWidth="0.5"
                  filter="url(#shadow)"
                />

                {/* Route lines for popular routes */}
                {POPULAR_ROUTES.map((route, index) => {
                  const from = getLocationById(route.from);
                  const to = getLocationById(route.to);
                  if (!from || !to) return null;

                  return (
                    <line
                      key={index}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#3b82f6"
                      strokeWidth="0.5"
                      strokeDasharray="2,2"
                      opacity="0.4"
                    />
                  );
                })}

                {/* Selected origin highlight line */}
                {selectedOrigin && hoveredLocation && selectedOrigin !== hoveredLocation && (
                  <line
                    x1={getLocationById(selectedOrigin)?.x || 0}
                    y1={getLocationById(selectedOrigin)?.y || 0}
                    x2={getLocationById(hoveredLocation)?.x || 0}
                    y2={getLocationById(hoveredLocation)?.y || 0}
                    stroke="#2563eb"
                    strokeWidth="1.5"
                    strokeDasharray="3,2"
                  />
                )}

                {/* Location markers */}
                {LOCATIONS.map((location) => {
                  const isHovered = hoveredLocation === location.id;
                  const isSelected = selectedOrigin === location.id;
                  const isAirport = location.type === 'airport';

                  return (
                    <g
                      key={location.id}
                      className="cursor-pointer transition-transform"
                      onClick={() => handleLocationClick(location.id)}
                      onMouseEnter={() => setHoveredLocation(location.id)}
                      onMouseLeave={() => setHoveredLocation(null)}
                    >
                      {/* Pulse animation for selected */}
                      {isSelected && (
                        <circle
                          cx={location.x}
                          cy={location.y}
                          r="5"
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="1"
                          opacity="0.5"
                        >
                          <animate
                            attributeName="r"
                            values="3;7;3"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.8;0.2;0.8"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* Marker circle */}
                      <circle
                        cx={location.x}
                        cy={location.y}
                        r={isHovered || isSelected ? 4 : 3}
                        fill={isAirport ? '#dc2626' : isSelected ? '#2563eb' : '#3b82f6'}
                        stroke="white"
                        strokeWidth="1.5"
                        className="transition-all duration-200"
                      />

                      {/* Airport icon */}
                      {isAirport && (
                        <text
                          x={location.x}
                          y={location.y + 0.8}
                          textAnchor="middle"
                          fill="white"
                          fontSize="3"
                          fontWeight="bold"
                        >
                          ✈
                        </text>
                      )}

                      {/* Label */}
                      <text
                        x={location.x}
                        y={location.y - 5}
                        textAnchor="middle"
                        fill={isHovered || isSelected ? '#1e40af' : '#374151'}
                        fontSize={isHovered || isSelected ? '3.5' : '3'}
                        fontWeight={isHovered || isSelected ? 'bold' : 'normal'}
                        className="transition-all duration-200 pointer-events-none"
                      >
                        {location.name}
                      </text>
                    </g>
                  );
                })}

                {/* Legend */}
                <g transform="translate(5, 85)">
                  <circle cx="2" cy="2" r="2" fill="#dc2626" stroke="white" strokeWidth="0.5" />
                  <text x="6" y="3" fontSize="2.5" fill="#374151">Airport</text>
                  <circle cx="20" cy="2" r="2" fill="#3b82f6" stroke="white" strokeWidth="0.5" />
                  <text x="24" y="3" fontSize="2.5" fill="#374151">Destination</text>
                </g>
              </svg>

              {/* Hover tooltip */}
              {hoveredLocation && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
                  {selectedOrigin ? (
                    <span className="flex items-center gap-2">
                      {getLocationById(selectedOrigin)?.name}
                      <ArrowRight className="h-4 w-4" />
                      {getLocationById(hoveredLocation)?.name}
                    </span>
                  ) : (
                    <span>Click to select as origin</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Popular Routes Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Popular Routes
              </h3>

              <div className="space-y-3">
                {POPULAR_ROUTES.map((route, index) => {
                  const from = getLocationById(route.from);
                  const to = getLocationById(route.to);
                  if (!from || !to) return null;

                  return (
                    <button
                      key={index}
                      onClick={() => handleQuickRouteClick(route.from, route.to)}
                      className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                          {route.label}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-900">{from.name}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium text-gray-900">{to.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  400+ routes available across Costa Rica
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
