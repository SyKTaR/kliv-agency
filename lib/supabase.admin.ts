import { createClient } from '@supabase/supabase-js'

/**
 * Client Supabase avec le service role key — usage serveur uniquement.
 * Bypass la RLS : ne jamais exposer côté client.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}
