// src/hooks/useNightSurcharge.ts

import { useState, useEffect } from 'react';

interface NightSurchargeResult {
  surcharge: number;
  isNightTime: boolean;
  showWarning: boolean;
  surchargePercentage: number;
}

/**
 * Hook para calcular el recargo nocturno (9 PM - 4 AM)
 * 
 * LÓGICA DEL NEGOCIO:
 * - Horario nocturno: 21:00 (9 PM) hasta 03:59 (3:59 AM)
 * - Recargo: 15% del precio base
 * - Se aplica automáticamente según la hora seleccionada
 * 
 * @param pickupTime - Hora en formato HH:mm (24 horas)
 * @param basePrice - Precio base de la ruta
 * @returns Objeto con el monto del recargo, estado nocturno y advertencia
 */
export const useNightSurcharge = (
  pickupTime: string,
  basePrice: number
): NightSurchargeResult => {
  const [surcharge, setSurcharge] = useState(0);
  const [isNightTime, setIsNightTime] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const SURCHARGE_PERCENTAGE = 0.15; // 15%

  useEffect(() => {
    // Si no hay hora o precio, resetear todo
    if (!pickupTime || !pickupTime.includes(':') || !basePrice) {
      setSurcharge(0);
      setIsNightTime(false);
      setShowWarning(false);
      return;
    }

    try {
      const [hourStr] = pickupTime.split(':');
      const hour = parseInt(hourStr, 10);

      // Validar que la hora sea válida
      if (isNaN(hour) || hour < 0 || hour > 23) {
        setSurcharge(0);
        setIsNightTime(false);
        setShowWarning(false);
        return;
      }

      /**
       * HORARIO NOCTURNO:
       * - 21:00 a 23:59 (9 PM a 11:59 PM)
       * - 00:00 a 03:59 (12 AM a 3:59 AM)
       */
      const isNight = hour >= 21 || hour < 4;

      setIsNightTime(isNight);

      if (isNight) {
        const calculatedSurcharge = basePrice * SURCHARGE_PERCENTAGE;
        setSurcharge(calculatedSurcharge);
        setShowWarning(true);
      } else {
        setSurcharge(0);
        setShowWarning(false);
      }
    } catch (error) {
      console.error('Error al calcular recargo nocturno:', error);
      setSurcharge(0);
      setIsNightTime(false);
      setShowWarning(false);
    }
  }, [pickupTime, basePrice]);

  return {
    surcharge,
    isNightTime,
    showWarning,
    surchargePercentage: SURCHARGE_PERCENTAGE * 100, // Retornar como porcentaje (15)
  };
};

/**
 * Función auxiliar para formatear la hora para visualización
 * @param time - Hora en formato HH:mm (24 horas)
 * @returns Hora en formato de 12 horas con AM/PM
 */
export const formatTimeForDisplay = (time: string): string => {
  if (!time || !time.includes(':')) return time;

  try {
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;

    if (isNaN(hour) || hour < 0 || hour > 23) return time;

    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // Convertir 0 a 12 para 12 AM, y 13-23 a 1-11

    return `${hour}:${minute} ${ampm}`;
  } catch (error) {
    console.error('Error al formatear hora:', error);
    return time;
  }
};

/**
 * Función auxiliar para verificar si una hora está en horario nocturno
 * @param time - Hora en formato HH:mm
 * @returns true si está en horario nocturno
 */
export const isNightTimeHour = (time: string): boolean => {
  if (!time || !time.includes(':')) return false;

  try {
    const [hourStr] = time.split(':');
    const hour = parseInt(hourStr, 10);

    if (isNaN(hour) || hour < 0 || hour > 23) return false;

    return hour >= 21 || hour < 4;
  } catch (error) {
    return false;
  }
};