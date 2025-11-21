// src/components/forms/booking/TripRouteInfo.tsx
// ✅ Diseño minimalista con mejor visibilidad
interface Route {
  duracion: string;
}

interface TripRouteInfoProps {
  route: Route;
  price: number;
}

export function TripRouteInfo({ route, price }: TripRouteInfoProps) {
  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md">
          <span className="text-blue-900 font-semibold">From: ${price}</span>
        </span>
        <span className="text-gray-400">|</span>
        <span className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-md">
          <span className="text-green-900 font-semibold">{route.duracion} Duration</span>
        </span>
      </div>
    </div>
  );
}