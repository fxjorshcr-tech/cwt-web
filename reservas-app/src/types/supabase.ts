// src/types/supabase.ts

/**
 * TIPOS DE SUPABASE - ESTRUCTURA REAL DE TU BASE DE DATOS
 * 
 * ⚠️ IMPORTANTE: Este archivo refleja la estructura EXACTA de tu base de datos
 * Regenerar cuando cambies el esquema:
 * npx supabase gen types typescript --project-id mmlbslwljvmscbgsqkkq > src/types/supabase.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // ========================================
      // TABLA: routes (Rutas/Interconexiones)
      // ========================================
      routes: {
        Row: {
          id: number
          created_at: string
          origen: string | null
          destino: string | null
          alias: string | null
          kilometros: number | null
          duracion: string | null
          precio1a6: number | null
          precio7a9: number | null
          precio10a12: number | null
          precio13a18: number | null
        }
        Insert: {
          id?: number
          created_at?: string
          origen?: string | null
          destino?: string | null
          alias?: string | null
          kilometros?: number | null
          duracion?: string | null
          precio1a6?: number | null
          precio7a9?: number | null
          precio10a12?: number | null
          precio13a18?: number | null
        }
        Update: {
          id?: number
          created_at?: string
          origen?: string | null
          destino?: string | null
          alias?: string | null
          kilometros?: number | null
          duracion?: string | null
          precio1a6?: number | null
          precio7a9?: number | null
          precio10a12?: number | null
          precio13a18?: number | null
        }
        Relationships: []
      }

      // ========================================
      // TABLA: trips (Viajes/Reservas)
      // ESTRUCTURA EXACTA según tu base de datos
      // ========================================
      trips: {
        Row: {
          // Identificadores
          id: string                    // uuid - NO es number, es string
          booking_id: string            // text - ID agrupador de múltiples viajes
          
          // Ubicaciones (OBLIGATORIAS)
          from_location: string         // text - Origen
          to_location: string           // text - Destino
          
          // Fecha (OBLIGATORIA)
          date: string                  // date - Fecha del viaje
          
          // Pasajeros (OBLIGATORIOS)
          adults: number                // integer - Adultos
          children: number              // integer - Niños
          
          // Precio y distancia (OBLIGATORIOS)
          price: number                 // numeric - Precio base
          distance: number | null       // integer - Distancia en km (nullable)
          duration: string | null       // text - Duración estimada (nullable)
          
          // Timestamps
          created_at: string | null     // timestamptz - Auto-generado
          updated_at: string | null     // timestamptz - Auto-generado
          
          // Direcciones (OPCIONALES)
          pickup_address: string | null      // text
          pickup_instructions: string | null // text
          dropoff_address: string | null     // text
          dropoff_instructions: string | null // text
          
          // Horarios (OPCIONALES)
          pickup_time: string | null    // time - Hora de recogida
          arrival_time: string | null   // time - Hora de llegada
          
          // Información de vuelo (OPCIONAL)
          flight_number: string | null  // text
          airline: string | null        // text
          
          // Cargos adicionales (OPCIONALES)
          night_surcharge: number | null // numeric - Recargo nocturno
          fees: number | null           // numeric - Fees del 13%
          final_price: number | null    // numeric - Precio final total
          
          // Solicitudes especiales (OPCIONAL)
          special_requests: string | null // text
        }
        Insert: {
          // ⚠️ IMPORTANTE: uuid se genera automáticamente, NO lo incluyas
          id?: string
          
          // CAMPOS OBLIGATORIOS
          booking_id: string
          from_location: string
          to_location: string
          date: string
          adults: number
          children: number
          price: number
          
          // CAMPOS OPCIONALES
          distance?: number | null
          duration?: string | null
          created_at?: string | null
          updated_at?: string | null
          pickup_address?: string | null
          pickup_instructions?: string | null
          dropoff_address?: string | null
          dropoff_instructions?: string | null
          pickup_time?: string | null
          arrival_time?: string | null
          flight_number?: string | null
          airline?: string | null
          night_surcharge?: number | null
          fees?: number | null
          final_price?: number | null
          special_requests?: string | null
        }
        Update: {
          id?: string
          booking_id?: string
          from_location?: string
          to_location?: string
          date?: string
          adults?: number
          children?: number
          price?: number
          distance?: number | null
          duration?: string | null
          created_at?: string | null
          updated_at?: string | null
          pickup_address?: string | null
          pickup_instructions?: string | null
          dropoff_address?: string | null
          dropoff_instructions?: string | null
          pickup_time?: string | null
          arrival_time?: string | null
          flight_number?: string | null
          airline?: string | null
          night_surcharge?: number | null
          fees?: number | null
          final_price?: number | null
          special_requests?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ========================================
// TIPOS DE UTILIDAD
// ========================================

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]

// Tipos específicos para Routes
export type Route = Tables<'routes'>['Row']
export type RouteInsert = Tables<'routes'>['Insert']
export type RouteUpdate = Tables<'routes'>['Update']

// Tipos específicos para Trips
export type Trip = Tables<'trips'>['Row']
export type TripInsert = Tables<'trips'>['Insert']
export type TripUpdate = Tables<'trips'>['Update']

// ========================================
// INTERFACES DE DOMINIO
// ========================================

/**
 * Interface para crear una nueva reserva
 */
export interface CreateTripData {
  booking_id: string
  from_location: string
  to_location: string
  date: string
  adults: number
  children: number
  price: number
  distance?: number
  duration?: string
}

/**
 * Interface para el formulario de reserva
 */
export interface BookingFormData {
  from_location: string
  to_location: string
  date: string
  adults: number
  children: number
}