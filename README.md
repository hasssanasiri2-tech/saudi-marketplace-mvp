# سريع

تطبيق سوق بيع وشراء عربي مخصص للموبايل، مبني باستخدام React و Vite و Supabase. الواجهة RTL وتدعم رفع صور الإعلانات إلى Supabase Storage.

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
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
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

يحتاج التطبيق إلى:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

مفتاح `anon` عام ومناسب للواجهة الأمامية عند ضبط سياسات RLS في Supabase. لا تضع مفاتيح سرية مثل `service_role` داخل Vite أو GitHub أو Vercel.

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
2. أنشئ مشروعًا جديدًا في Vercel واختر مستودع GitHub.
3. استخدم الإعدادات الافتراضية لـ Vite:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. أضف متغيرات البيئة في Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. اضغط Deploy.

## ملاحظات إنتاجية

- Service Worker يعمل في الإنتاج فقط، ولا يتم تسجيله أثناء التطوير.
- ملفات `.env` و `dist` و `node_modules` مستبعدة من Git.
- الصور تدعم الحقلين `image_url` و `imageUrl`.
- الواجهة عربية و RTL من `index.html`.
