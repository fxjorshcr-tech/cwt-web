// src/lib/supabase-tours.ts
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/lib/database.types';

// Usamos el tipo directamente de la base de datos
export type Tour = Tables<'tours'>;

export async function getAllTours(): Promise<Tour[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching tours:', error);
    return [];
  }

  return data || [];
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching tour:', error);
    return null;
  }

  return data;
}