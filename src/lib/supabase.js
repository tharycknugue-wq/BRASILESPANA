import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('[BRASILESPANA] Supabase env vars not set. Auth and DB features will be unavailable.')
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken:    true,
        persistSession:      true,
        detectSessionInUrl:  true,
        storageKey:          'brasilespana-auth',
      },
    })
  : null
