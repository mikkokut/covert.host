import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../types/supabase'

export const useSupabase = () => {
  const { supabase: { url, key } } = useRuntimeConfig()
  return createClient<Database>(url, key)
}
