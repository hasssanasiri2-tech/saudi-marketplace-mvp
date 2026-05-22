export const cities = [
  'الرياض',
  'جدة',
  'مكة المكرمة',
  'المدينة المنورة',
  'الدمام',
  'الخبر',
  'الظهران',
  'الأحساء',
  'القطيف',
  'الجبيل',
  'الطائف',
  'تبوك',
  'بريدة',
  'عنيزة',
  'الرس',
  'حائل',
  'أبها',
  'خميس مشيط',
  'نجران',
  'جازان',
  'صبيا',
  'أبو عريش',
  'الباحة',
  'سكاكا',
  'عرعر',
  'رفحاء',
  'القريات',
  'ينبع',
  'رابغ',
  'الخرج',
  'المجمعة',
  'الزلفي',
  'الدوادمي',
  'وادي الدواسر',
  'الدرعية',
  'المزاحمية',
  'محايل عسير',
  'بيشة',
  'شرورة',
  'الخفجي',
  'حفر الباطن',
  'النعيرية',
  'رأس تنورة',
  'سيهات',
  'صفوى',
  'الليث',
  'القنفذة',
  'الجموم',
  'بيش',
  'الدرب',
  'العلا',
  'بدر',
  'خيبر',
  'طريف'
]

export const categories = [
  { id: 'cars', name: 'سيارات' },
  { id: 'electronics', name: 'إلكترونيات' },
  { id: 'furniture', name: 'أثاث' },
  { id: 'games', name: 'ألعاب' },
  { id: 'realestate', name: 'عقارات' },
  { id: 'misc', name: 'متفرقات' }
]

export const users = [
  { id: 1, name: 'نورة العتيبي', phone: '0501234567', city: 'الرياض', rating: 4.8, verified: true },
  { id: 2, name: 'سلمان الحربي', phone: '0558881122', city: 'جدة', rating: 4.6, verified: true },
  { id: 3, name: 'ريم القحطاني', phone: '0534412299', city: 'الدمام', rating: 4.9, verified: true },
  { id: 4, name: 'عبدالله الزهراني', phone: '0542209001', city: 'الخبر', rating: 4.4, verified: false }
]

export const listings = [
  {
    id: 101,
    userId: 1,
    title: 'آيفون 15 برو 256GB',
    description: 'الجهاز نظيف جدًا، استخدام سنة، مع الكرتون والشاحن. البطارية ممتازة ولا توجد خدوش واضحة.',
    price: 3490,
    category: 'electronics',
    city: 'الرياض',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80',
    status: 'مستعمل ممتاز',
    createdAt: '2026-05-18'
  },
  {
    id: 102,
    userId: 2,
    title: 'كامري 2021 فل كامل',
    description: 'ممشاها 78 ألف، صيانة وكالة، فحص دوري جديد، السيارة جاهزة للاستخدام.',
    price: 83500,
    category: 'cars',
    city: 'جدة',
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80',
    status: 'نظيف',
    createdAt: '2026-05-17'
  },
  {
    id: 103,
    userId: 3,
    title: 'كنب زاوية مودرن',
    description: 'كنب مريح بلون رمادي فاتح، مناسب للصالة، استعمال بسيط وحالته ممتازة.',
    price: 1450,
    category: 'furniture',
    city: 'الدمام',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    status: 'شبه جديد',
    createdAt: '2026-05-16'
  },
  {
    id: 104,
    userId: 4,
    title: 'بلايستيشن 5 مع يدين',
    description: 'نسخة الأقراص، معه يدين وشريطين. البيع بسبب عدم الاستخدام.',
    price: 1690,
    category: 'games',
    city: 'الخبر',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80',
    status: 'مستعمل ممتاز',
    createdAt: '2026-05-15'
  },
  {
    id: 105,
    userId: 2,
    title: 'شقة للإيجار حي السلامة',
    description: 'ثلاث غرف وصالة، مطبخ راكب، قريبة من الخدمات، مدخل مستقل وموقف خاص.',
    price: 42000,
    category: 'realestate',
    city: 'جدة',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
    status: 'متاح',
    createdAt: '2026-05-14'
  },
  {
    id: 106,
    userId: 1,
    title: 'دراجة كهربائية قابلة للطي',
    description: 'عملية للمشاوير القصيرة، بطارية جيدة، معها شاحنها الأصلي.',
    price: 980,
    category: 'misc',
    city: 'الرياض',
    imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=900&q=80',
    status: 'جيد',
    createdAt: '2026-05-13'
  }
]

export const messages = [
  { id: 1, senderId: 1, receiverId: 2, listingId: 102, text: 'السلام عليكم، هل السيارة متاحة؟', createdAt: '09:15' },
  { id: 2, senderId: 2, receiverId: 1, listingId: 102, text: 'وعليكم السلام، نعم متاحة.', createdAt: '09:17' },
  { id: 3, senderId: 3, receiverId: 1, listingId: 101, text: 'هل السعر قابل للتفاوض؟', createdAt: '11:40' },
  { id: 4, senderId: 1, receiverId: 3, listingId: 101, text: 'ممكن تفاوض بسيط عند الجدية.', createdAt: '11:43' }
]

export const savedListings = [
  { id: 1, userId: 1, listingId: 103 },
  { id: 2, userId: 1, listingId: 105 }
]
