import { useSupabase } from '../utils/supabase'

export default defineEventHandler(async () => {
  await useSupabase()
    .from('secrets')
    .delete()
    .lt('expires_at', new Date().toISOString())

  return {
    message: 'Cleanup successful',
  }
})
