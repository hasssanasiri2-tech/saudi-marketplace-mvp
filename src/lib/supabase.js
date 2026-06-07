import { createClient } from '@supabase/supabase-js'

const expectedSupabaseUrl = 'https://fealpdyveipbxvyekpzz.supabase.co'
const forbiddenSupabasePath = ['rest', 'v1'].join('/')
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const hasSupabaseUrl = Boolean(supabaseUrl)
const hasSupabaseAnonKey = Boolean(supabaseAnonKey)
const hasRestPath = Boolean(supabaseUrl?.includes(forbiddenSupabasePath))
const hasValidSupabaseUrl = supabaseUrl === expectedSupabaseUrl && !hasRestPath
const secretKeyPrefix = ['sb', 'secret'].join('_') + '_'
const hasValidAnonKey = Boolean(
  supabaseAnonKey &&
    supabaseAnonKey.startsWith('sb_publishable_') &&
    !supabaseAnonKey.startsWith(secretKeyPrefix)
)

export const supabaseConfigError = (() => {
  if (!hasSupabaseUrl || !hasSupabaseAnonKey) {
    return 'Connection settings are incomplete. Check Supabase environment variables in Vercel.'
  }

  if (!hasValidSupabaseUrl) {
    return 'Supabase URL is invalid. Use only the project URL with no extra path.'
  }

  if (!hasValidAnonKey) {
    return 'Supabase key is invalid. Use only the public publishable key.'
  }

  return ''
})()

if (import.meta.env.DEV) {
  console.info('Supabase env check', {
    VITE_SUPABASE_URL: hasSupabaseUrl,
    VITE_SUPABASE_URL_VALID: hasValidSupabaseUrl,
    VITE_SUPABASE_ANON_KEY: hasSupabaseAnonKey,
    VITE_SUPABASE_ANON_KEY_VALID: hasValidAnonKey
  })

  if (supabaseConfigError) {
    console.error(supabaseConfigError)
  }
}

export const supabase = createClient(
  supabaseUrl || expectedSupabaseUrl,
  supabaseAnonKey || 'placeholder-anon-key'
)
