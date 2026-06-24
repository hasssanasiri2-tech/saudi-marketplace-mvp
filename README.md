# سريع

تطبيق سوق بيع وشراء عربي مخصص للموبايل، مبني باستخدام React و Vite و Supabase.

## التشغيل المحلي

ثبت الحزم:

```bash
npm install
```

انسخ ملف البيئة:

```bash
cp .env.example .env
```

ضع قيم Supabase داخل `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxxxx
```

شغل التطبيق:

```bash
npm run dev
```

## متغيرات Supabase

يقرأ التطبيق متغيرات Vite التالية فقط:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

استخدم رابط مشروع Supabase فقط بصيغة:

```text
https://xxxxx.supabase.co
```

لا تضف أي مسار زائد في نهاية الرابط.

## إعداد Vercel

في Vercel اضبط المتغيرات من:

Project Settings → Environment Variables

ثم أضف:

```env
VITE_SUPABASE_URL=Supabase Project URL from Settings → Data API
VITE_SUPABASE_ANON_KEY=Publishable key from Settings → API Keys
```

فعّلها على Production و Preview، ثم اعمل Redeploy بعد الحفظ.

## البناء

```bash
npm run build
```
