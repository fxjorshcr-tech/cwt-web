// src/components/home/BookingFormWrapper.tsx
"use client";

import { BookingForm } from "./BookingForm";

interface Location {
  id: string;
  name: string;
  display_name: string;
}

interface BookingFormWrapperProps {
  locations: Location[];
}

export function BookingFormWrapper({ locations }: BookingFormWrapperProps) {
  // El nuevo BookingForm no necesita locations porque carga las rutas directamente desde Supabase
  // Pero mantenemos la prop para no romper page.tsx
  return <BookingForm />;
}