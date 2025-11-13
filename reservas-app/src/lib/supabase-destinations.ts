// src/lib/supabase-destinations.ts
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/lib/database.types';

export type Destination = Tables<'destinations'>;

export async function getAllDestinations(): Promise<Destination[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }

  return data || [];
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching destination:', error);
    return null;
  }

  return data;
}

export async function getDestinationsByZone(zone: string): Promise<Destination[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('zone', zone)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching destinations by zone:', error);
    return [];
  }

  return data || [];
}