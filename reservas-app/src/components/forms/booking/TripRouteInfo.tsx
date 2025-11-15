// src/components/forms/booking/TripRouteInfo.tsx
import { Clock, Route as RouteIcon } from 'lucide-react';

interface Route {
  duracion: string;
  kilometros: number;
}

interface TripRouteInfoProps {
  route: Route;
  price: number;
}

export function TripRouteInfo({ route, price }: TripRouteInfoProps) {
  return (
    <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200">
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xl font-bold text-blue-600">${price}</div>
          <p className="text-xs text-gray-600 mt-0.5">Price</p>
        </div>

        <div className="text-center p-2 bg-orange-50 rounded-lg border border-orange-300">
          <div className="flex flex-col items-center justify-center gap-0.5">
            <Clock className="h-3.5 w-3.5 text-orange-500" />
            <p className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
              {route.duracion}
            </p>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">Duration</p>
        </div>

        <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-col items-center justify-center gap-0.5">
            <RouteIcon className="h-3.5 w-3.5 text-gray-600" />
            <p className="text-sm sm:text-base font-bold text-gray-900">{route.kilometros}</p>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">KM</p>
        </div>
      </div>
    </div>
  );
}
