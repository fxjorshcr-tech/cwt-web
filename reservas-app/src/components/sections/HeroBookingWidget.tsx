// src/components/sections/HeroBookingWidget.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Route {
  id: number;
  origen: string | null;
  destino: string | null;
}

export default function HeroBookingWidget() {
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(2);

  useEffect(() => {
    loadRoutes();
  }, []);

  async function loadRoutes() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('routes')
      .select('id, origen, destino')
      .order('origen');

    if (!error && data) {
      setRoutes(data);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (from && to && date) {
      router.push(`/transfers?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&passengers=${passengers}`);
    }
  }

  const fromLocations = Array.from(new Set(routes.map(r => r.origen).filter((loc): loc is string => loc !== null))).sort();
  const toLocations = from
    ? Array.from(new Set(routes.filter(r => r.origen === from).map(r => r.destino).filter((loc): loc is string => loc !== null))).sort()
    : Array.from(new Set(routes.map(r => r.destino).filter((loc): loc is string => loc !== null))).sort();

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 -mt-12 relative z-20">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* From Location */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              <MapPin className="h-3.5 w-3.5 inline mr-1" />
              From
            </label>
            <select
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setTo('');
              }}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select origin</option>
              {fromLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* To Location */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              <MapPin className="h-3.5 w-3.5 inline mr-1" />
              To
            </label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              disabled={!from}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Select destination</option>
              {toLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              <Calendar className="h-3.5 w-3.5 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Passengers */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              <Users className="h-3.5 w-3.5 inline mr-1" />
              Passengers
            </label>
            <input
              type="number"
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              min={1}
              max={12}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <div className="lg:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
