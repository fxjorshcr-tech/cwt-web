// src/types/supabase.ts

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

      trips: {
        Row: {
          id: string
          booking_id: string
          from_location: string
          to_location: string
          date: string
          adults: number
          children: number
          price: number
          distance: number | null
          duration: string | null
          created_at: string | null
          updated_at: string | null
          pickup_address: string | null
          pickup_instructions: string | null
          dropoff_address: string | null
          dropoff_instructions: string | null
          pickup_time: string | null
          arrival_time: string | null
          flight_number: string | null
          airline: string | null
          night_surcharge: number | null
          fees: number | null
          final_price: number | null
          special_requests: string | null
          children_ages: number[] | null
          add_ons: string[] | null
          add_ons_price: number | null
          customer_first_name: string | null
          customer_last_name: string | null
          customer_email: string | null
          customer_phone: string | null
          customer_country: string | null
        }
        Insert: {
          id?: string
          booking_id: string
          from_location: string
          to_location: string
          date: string
          adults: number
          children: number
          price: number
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
          children_ages?: number[] | null
          add_ons?: string[] | null
          add_ons_price?: number | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          customer_country?: string | null
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
          children_ages?: number[] | null
          add_ons?: string[] | null
          add_ons_price?: number | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          customer_country?: string | null
        }
        Relationships: []
      }

      tour_bookings: {
        Row: {
          id: string
          booking_id: string
          tour_slug: string
          tour_name: string
          date: string
          adults: number
          children: number
          base_price: number
          price_per_extra_person: number
          total_price: number
          hotel: string
          special_requests: string | null
          customer_first_name: string | null
          customer_last_name: string | null
          customer_email: string | null
          customer_phone: string | null
          customer_country: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          tour_slug: string
          tour_name: string
          date: string
          adults: number
          children: number
          base_price: number
          price_per_extra_person: number
          total_price: number
          hotel: string
          special_requests?: string | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          customer_country?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          tour_slug?: string
          tour_name?: string
          date?: string
          adults?: number
          children?: number
          base_price?: number
          price_per_extra_person?: number
          total_price?: number
          hotel?: string
          special_requests?: string | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          customer_country?: string | null
          status?: string
          created_at?: string
          updated_at?: string
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

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]

export type Route = Tables<'routes'>['Row']
export type RouteInsert = Tables<'routes'>['Insert']
export type RouteUpdate = Tables<'routes'>['Update']

export type Trip = Tables<'trips'>['Row']
export type TripInsert = Tables<'trips'>['Insert']
export type TripUpdate = Tables<'trips'>['Update']

export type TourBooking = Tables<'tour_bookings'>['Row']
export type TourBookingInsert = Tables<'tour_bookings'>['Insert']
export type TourBookingUpdate = Tables<'tour_bookings'>['Update']

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

export interface BookingFormData {
  from_location: string
  to_location: string
  date: string
  adults: number
  children: number
}