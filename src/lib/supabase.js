import { createClient } from '@supabase/supabase-js'

const expectedSupabaseUrl = 'https://fealpdyveipbxvyekpzz.supabase.co'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const hasSupabaseUrl = Boolean(supabaseUrl)
const hasSupabaseAnonKey = Boolean(supabaseAnonKey)
const hasValidSupabaseUrl = supabaseUrl === expectedSupabaseUrl
const secretKeyPrefix = ['sb', 'secret'].join('_') + '_'
const hasValidAnonKey = Boolean(
  supabaseAnonKey &&
    supabaseAnonKey.startsWith('sb_publishable_') &&
    !supabaseAnonKey.startsWith(secretKeyPrefix)
)

export const supabaseConfigError = (() => {
  if (!hasSupabaseUrl || !hasSupabaseAnonKey) {
    return 'إعدادات الاتصال غير مكتملة. تأكد من متغيرات Supabase في Vercel.'
  }

  if (!hasValidSupabaseUrl) {
    return 'رابط Supabase غير صحيح. استخدم رابط المشروع بدون /rest/v1.'
  }

  if (!hasValidAnonKey) {
    return 'مفتاح Supabase غير صحيح. استخدم مفتاح publishable العام فقط.'
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
