// src/utils/supabaseClient.ts

import { createBrowserClient } from '@supabase/ssr';

// Define las variables de entorno de forma tipada (buena práctica con TypeScript)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * ¿Por qué este archivo?
 * * En Next.js (App Router), tenemos dos "lados":
 * 1. El Cliente (el navegador web, 'use client')
 * 2. El Servidor (donde se renderiza la página, 'use server' o componentes de servidor)
 * * Necesitamos una forma de hablar con Supabase desde AMBOS lados.
 * * Esta función 'createClient' crea un cliente Supabase específicamente 
 * para ser usado en COMPONENTES DE CLIENTE ('use client').
 * * Para las acciones del servidor, usaremos un cliente diferente 
 * (lo configuraremos cuando lleguemos a ese punto).
 */

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );