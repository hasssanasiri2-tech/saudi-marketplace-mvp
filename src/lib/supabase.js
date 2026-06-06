import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const hasSupabaseUrl = Boolean(supabaseUrl)
const hasSupabaseAnonKey = Boolean(supabaseAnonKey)

export const supabaseConfigError =
  !hasSupabaseUrl || !hasSupabaseAnonKey
    ? 'إعدادات الاتصال غير مكتملة. تأكد من متغيرات Supabase في Vercel.'
    : ''

if (import.meta.env.DEV) {
  console.info('Supabase env check', {
    VITE_SUPABASE_URL: hasSupabaseUrl,
    VITE_SUPABASE_ANON_KEY: hasSupabaseAnonKey
  })

  if (supabaseConfigError) {
    console.error(supabaseConfigError)
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)
