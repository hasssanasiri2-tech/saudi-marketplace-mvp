# سريع

تطبيق سوق بيع وشراء عربي مخصص للموبايل، مبني باستخدام React و Vite و Supabase. الواجهة تعمل باتجاه RTL وتدعم المصادقة، الإعلانات، ورفع صور الإعلانات إلى Supabase Storage.

## المتطلبات

- Node.js 20 أو أحدث
- حساب Supabase
- Bucket في Supabase Storage باسم `listing-images`

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
VITE_SUPABASE_URL=https://fealpdyveipbxvyekpzz.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-key
```

شغل التطبيق:

```bash
npm run dev
```

افتح الرابط المحلي:

```text
http://127.0.0.1:5173
```

## متغيرات البيئة

يستخدم التطبيق متغيرات Vite التالية فقط:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

لا تستخدم أسماء أخرى مثل `SUPABASE_URL` أو `NEXT_PUBLIC_SUPABASE_URL` داخل هذا المشروع.

يجب أن تكون قيمة `VITE_SUPABASE_URL` هي رابط المشروع فقط:

```text
https://fealpdyveipbxvyekpzz.supabase.co
```

استخدم رابط المشروع فقط بدون أي مسار إضافي في نهاية الرابط.

يجب أن تكون قيمة `VITE_SUPABASE_ANON_KEY` هي مفتاح publishable العام من Supabase. لا تضع مفاتيح سرية داخل Vite أو GitHub أو Vercel.

## البناء

```bash
npm run build
```

معاينة نسخة الإنتاج محليًا:

```bash
npm run preview
```

## النشر على Vercel

1. ارفع المشروع إلى GitHub.
2. افتح Vercel وأنشئ مشروعًا جديدًا من مستودع GitHub.
3. استخدم إعدادات Vite الافتراضية:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. افتح Project Settings في Vercel.
5. ادخل إلى Environment Variables.
6. أضف المتغير `VITE_SUPABASE_URL` بالقيمة `https://fealpdyveipbxvyekpzz.supabase.co`.
7. أضف المتغير `VITE_SUPABASE_ANON_KEY` من Supabase.
8. فعّل المتغيرات على Production و Preview.
9. احفظ الإعدادات ثم أعد النشر Redeploy بعد الحفظ.

## ملاحظات إنتاجية

- Service Worker يعمل في الإنتاج فقط، ولا يتم تسجيله أثناء التطوير.
- ملفات `.env` و `dist` و `node_modules` مستبعدة من Git.
- صور الإعلانات تدعم الحقلين `image_url` و `imageUrl`.
- الواجهة عربية و RTL من ملف `index.html`.
