// src/components/sections/MostBookedCTAServer.tsx
import { createClient } from '@/lib/supabase/server';
import MostBookedCTA from './MostBookedCTA';

// Nombres exactos de la base de datos
const popularRoutes = [
  { from: 'SJO - Juan Santamaria Int. Airport', to: 'La Fortuna (Arenal)', slug: 'sjo-to-la-fortuna', displayFrom: 'SJO Airport', displayTo: 'La Fortuna' },
  { from: 'SJO - Juan Santamaria Int. Airport', to: 'Tamarindo (Guanacaste)', slug: 'sjo-to-tamarindo', displayFrom: 'SJO Airport', displayTo: 'Tamarindo' },
  { from: 'SJO - Juan Santamaria Int. Airport', to: 'Monteverde (Cloud Forest)', slug: 'sjo-to-monteverde', displayFrom: 'SJO Airport', displayTo: 'Monteverde' },
  { from: 'LIR - Liberia Int. Airport', to: 'Tamarindo (Guanacaste)', slug: 'lir-to-tamarindo', displayFrom: 'LIR Airport', displayTo: 'Tamarindo' },
  { from: 'LIR - Liberia Int. Airport', to: 'La Fortuna (Arenal)', slug: 'lir-to-la-fortuna', displayFrom: 'LIR Airport', displayTo: 'La Fortuna' },
  { from: 'La Fortuna (Arenal)', to: 'Monteverde (Cloud Forest)', slug: 'la-fortuna-to-monteverde', displayFrom: 'La Fortuna', displayTo: 'Monteverde' },
];

async function getRoutePrice(from: string, to: string) {
  const supabase = createClient();

  const { data } = await supabase
    .from('routes')
    .select('precio1a6, precio7a9, precio10a12, duracion')
    .ilike('origen', `%${from}%`)
    .ilike('destino', `%${to}%`)
    .single();

  if (!data) {
    return { price: null, duration: null };
  }

  const minPrice = Math.min(
    data.precio1a6 || Infinity,
    data.precio7a9 || Infinity,
    data.precio10a12 || Infinity
  );

  return {
    price: minPrice === Infinity ? null : minPrice,
    duration: data.duracion
  };
}

export default async function MostBookedCTAServer() {
  // Fetch prices for all routes
  const routesWithPrices = await Promise.all(
    popularRoutes.map(async (route) => {
      const { price, duration } = await getRoutePrice(route.from, route.to);
      return {
        ...route,
        price,
        duration
      };
    })
  );

  return <MostBookedCTA routes={routesWithPrices} />;
}
