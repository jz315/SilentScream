const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isOfflineSingleFileBuild = import.meta.env.MODE === 'single';

import type { SupabaseClient } from '@supabase/supabase-js';

let supabaseClientPromise: Promise<SupabaseClient | null> | null = null;

export function hasSupabaseConfig() {
  if (isOfflineSingleFileBuild) return false;
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export async function getSupabaseClient(): Promise<SupabaseClient | null> {
  if (isOfflineSingleFileBuild) return null;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  if (typeof window !== 'undefined' && window.location?.protocol === 'file:') {
    return null;
  }

  if (!supabaseClientPromise) {
    supabaseClientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(supabaseUrl, supabaseAnonKey)
    );
  }

  return supabaseClientPromise;
}
