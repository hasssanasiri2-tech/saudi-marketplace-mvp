import { useMemo, useState } from 'react'
import {
  BadgeCheck,
  BedDouble,
  Bell,
  Bookmark,
  BookmarkCheck,
  Car,
  ChevronLeft,
  CircleUserRound,
  Gamepad2,
  Heart,
  Home,
  ImagePlus,
  LogOut,
  Menu,
  MessageCircle,
  Eye,
  EyeOff,
  Package,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Smartphone,
  Sofa,
  Star,
  UserRoundCheck,
  X
} from 'lucide-react'
import { categories, cities, listings as seedListings, messages, savedListings, users } from './data/mockData'
import { formatPrice, getRelativeDate } from './utils/format'

const categoryIcons = {
  cars: Car,
  electronics: Smartphone,
  furniture: Sofa,
  games: Gamepad2,
  realestate: BedDouble,
  misc: Package
}

const currentUserSeed = users[0]

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(currentUserSeed)
  const [activePage, setActivePage] = useState('home')
  const [selectedListingId, setSelectedListingId] = useState(seedListings[0].id)
  const [allListings, setAllListings] = useState(seedListings)
  const [savedIds, setSavedIds] = useState(savedListings.filter((item) => item.userId === user.id).map((item) => item.listingId))
  const [filters, setFilters] = useState({ query: '', city: 'الكل', category: 'الكل', maxPrice: 'الكل' })

  const selectedListing = allListings.find((listing) => listing.id === selectedListingId) || allListings[0]
  const seller = users.find((item) => item.id === selectedListing.userId) || user

  const filteredListings = useMemo(() => {
    return allListings.filter((listing) => {
      const matchesQuery = listing.title.includes(filters.query) || listing.description.includes(filters.query)
      const matchesCity = filters.city === 'الكل' || listing.city === filters.city
      const matchesCategory = filters.category === 'الكل' || listing.category === filters.category
      const matchesPrice =
        filters.maxPrice === 'الكل' ||
        (filters.maxPrice === '1000' && listing.price <= 1000) ||
        (filters.maxPrice === '5000' && listing.price <= 5000) ||
        (filters.maxPrice === '50000' && listing.price <= 50000)

      return matchesQuery && matchesCity && matchesCategory && matchesPrice
    })
  }, [allListings, filters])

  function openListing(id) {
    setSelectedListingId(id)
    setActivePage('details')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toggleSaved(id) {
    setSavedIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]))
  }

  function publishListing(payload) {
    const newListing = {
      ...payload,
      id: Date.now(),
      userId: user.id,
      status: 'جديد',
      createdAt: new Date().toISOString().slice(0, 10)
    }
    setAllListings((items) => [newListing, ...items])
    setSelectedListingId(newListing.id)
    setActivePage('details')
  }

  if (!isLoggedIn) {
    return <LoginPage user={user} setUser={setUser} onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="mx-auto min-h-screen w-full max-w-md bg-[#f7faf9] shadow-soft md:my-6 md:min-h-[880px] md:overflow-hidden md:rounded-[32px]">
        <AppHeader user={user} activePage={activePage} setActivePage={setActivePage} />

        <main className="safe-bottom px-4 pb-6">
          {activePage === 'home' && (
            <HomePage
              filters={filters}
              setFilters={setFilters}
              listings={filteredListings}
              savedIds={savedIds}
              onOpenListing={openListing}
              onToggleSaved={toggleSaved}
            />
          )}
          {activePage === 'add' && <AddListingPage onPublish={publishListing} userCity={user.city} />}
          {activePage === 'details' && (
            <DetailsPage
              listing={selectedListing}
              seller={seller}
              isSaved={savedIds.includes(selectedListing.id)}
              onBack={() => setActivePage('home')}
              onChat={() => setActivePage('chat')}
              onToggleSaved={() => toggleSaved(selectedListing.id)}
            />
          )}
          {activePage === 'chat' && <ChatPage user={user} onOpenListing={openListing} />}
          {activePage === 'profile' && (
            <ProfilePage
              user={user}
              listings={allListings}
              savedIds={savedIds}
              onLogout={() => setIsLoggedIn(false)}
              onOpenListing={openListing}
            />
          )}
        </main>

        <BottomNav activePage={activePage} setActivePage={setActivePage} />
      </div>
    </div>
  )
}

function LoginPage({ user, setUser, onLogin }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef8f5] px-5" dir="rtl">
      <section className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-soft">
        <div className="mb-7">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-700 text-white">
            <Package size={28} />
          </div>
          <p className="text-sm font-bold text-teal-700">سريع</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight text-slate-950">أسهل طريقة لبيع وشراء الأشياء بسرعة وبثقة</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">مرحبًا {user.name || 'ضيفنا'}، يسعدنا وجودك في سريع.</p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            onLogin()
          }}
        >
          <Field label="اسم المستخدم">
            <input
              required
              className="input"
              value={user.name}
              autoComplete="username"
              onChange={(event) => setUser({ ...user, name: event.target.value })}
              placeholder="اسم المستخدم"
            />
          </Field>
          <Field label="كلمة المرور">
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                className="input pl-14"
                autoComplete="current-password"
                defaultValue="123456"
                placeholder="كلمة المرور"
              />
              <button
                className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600"
                type="button"
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>

          <div className="flex items-center justify-between gap-3 text-sm font-extrabold">
            <button className="text-teal-700" type="button" onClick={() => alert('سيتم إضافة شاشة إنشاء الحساب في النسخة التالية من الـ MVP.')}>
              إنشاء حساب
            </button>
            <button className="text-teal-700" type="button" onClick={() => alert('سيتم إرسال رابط استعادة كلمة المرور في النسخة التالية من الـ MVP.')}>
              نسيت كلمة المرور؟
            </button>
          </div>

          <button className="btn-primary w-full" type="submit">
            دخول وتجربة التطبيق
          </button>
        </form>
      </section>
    </div>
  )
}

function AppHeader({ user, activePage, setActivePage }) {
  const titles = {
    home: 'الإعلانات القريبة',
    add: 'إضافة إعلان',
    details: 'تفاصيل الإعلان',
    chat: 'المحادثات',
    profile: 'حسابي'
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-[#f7faf9]/95 px-4 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <button className="icon-button" aria-label="القائمة">
          <Menu size={21} />
        </button>
        <div className="text-center">
          <p className="text-xs font-bold text-teal-700">سريع</p>
          <h2 className="text-lg font-extrabold text-slate-950">{titles[activePage]}</h2>
        </div>
        <button className="icon-button relative" aria-label="التنبيهات" onClick={() => setActivePage('profile')}>
          <Bell size={20} />
          {user.verified && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-teal-600" />}
        </button>
      </div>
    </header>
  )
}

function HomePage({ filters, setFilters, listings, savedIds, onOpenListing, onToggleSaved }) {
  return (
    <div className="space-y-5 pt-4">
      <section>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold text-teal-700">تصفح بالقرب منك</p>
            <h1 className="mt-1 text-[22px] font-extrabold leading-tight text-slate-950">الرياض</h1>
          </div>
          <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-700 text-white shadow-sm" aria-label="إضافة إعلان">
            <Plus size={24} />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-1">
          <Search size={21} className="text-teal-700" />
          <input
            className="w-full bg-transparent py-3 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="ابحث في سريع"
            value={filters.query}
            onChange={(event) => setFilters({ ...filters, query: event.target.value })}
          />
        </div>
      </section>

      <FilterBar filters={filters} setFilters={setFilters} />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-950">الفئات</h3>
          <span className="text-xs font-bold text-slate-500">اختر ما يناسبك</span>
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => {
            const Icon = categoryIcons[category.id]
            const active = filters.category === category.id
            return (
              <button
                key={category.id}
                className={`flex min-w-[104px] items-center gap-2 rounded-full border px-3 py-2.5 text-sm font-bold transition ${
                  active ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-200 bg-white text-slate-700'
                }`}
                onClick={() => setFilters({ ...filters, category: active ? 'الكل' : category.id })}
              >
                <Icon size={18} />
                {category.name}
              </button>
            )
          })}
        </div>
      </section>

    <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-950">إعلانات مقترحة</h3>
          <span className="text-xs font-bold text-slate-500">{listings.length} إعلان</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isSaved={savedIds.includes(listing.id)}
              onOpen={() => onOpenListing(listing.id)}
              onToggleSaved={() => onToggleSaved(listing.id)}
            />
          ))}
        </div>
        {listings.length === 0 && <EmptyState text="لا توجد إعلانات مطابقة للفلاتر الحالية." />}
      </section>
    </div>
  )
}

function FilterBar({ filters, setFilters }) {
  return (
    <section className="rounded-[18px] border border-slate-200 bg-white p-3">
      <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-800">
        <SlidersHorizontal size={18} className="text-teal-700" />
        تصفية سريعة
      </div>
      <div className="grid grid-cols-3 gap-2">
        <select className="select-compact" value={filters.city} onChange={(event) => setFilters({ ...filters, city: event.target.value })}>
          <option>الكل</option>
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
        <select className="select-compact" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
          <option value="الكل">كل الفئات</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select className="select-compact" value={filters.maxPrice} onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value })}>
          <option value="الكل">كل الأسعار</option>
          <option value="1000">حتى 1000</option>
          <option value="5000">حتى 5000</option>
          <option value="50000">حتى 50000</option>
        </select>
      </div>
    </section>
  )
}

function ListingCard({ listing, isSaved, onOpen, onToggleSaved }) {
  return (
    <article className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
      <button className="block w-full text-right" onClick={onOpen}>
        <img src={listing.imageUrl} alt={listing.title} className="aspect-square w-full object-cover" />
      </button>
      <div className="relative min-w-0 p-2.5">
        <button className="absolute left-2 top-[-44px] flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/95" onClick={onToggleSaved} aria-label="حفظ الإعلان">
          {isSaved ? <BookmarkCheck size={18} className="text-teal-700" /> : <Bookmark size={18} />}
        </button>
        <div>
          <button className="min-w-0 text-right" onClick={onOpen}>
            <p className="text-base font-extrabold text-slate-950">{formatPrice(listing.price)}</p>
            <h4 className="mt-1 line-clamp-2 min-h-10 text-sm font-extrabold leading-5 text-slate-950">{listing.title}</h4>
          </button>
        </div>
        <div className="mt-2 grid gap-1 text-[11px] font-bold text-slate-500">
          <span>{listing.city}</span>
          <span>{listing.status}</span>
        </div>
      </div>
    </article>
  )
}

function AddListingPage({ onPublish, userCity }) {
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: categories[0].id,
    city: userCity,
    description: '',
    imageUrl: ''
  })
  const [preview, setPreview] = useState('')

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <form
      className="space-y-4 pt-4"
      onSubmit={(event) => {
        event.preventDefault()
        onPublish({
          ...form,
          price: Number(form.price),
          imageUrl:
            preview ||
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'
        })
      }}
    >
      <label className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-teal-200 bg-white text-center">
        {preview ? (
          <img src={preview} alt="معاينة الإعلان" className="h-full w-full rounded-3xl object-cover" />
        ) : (
          <>
            <ImagePlus size={34} className="text-teal-700" />
            <span className="mt-3 text-sm font-extrabold text-slate-900">ارفع صورة المنتج</span>
            <span className="mt-1 text-xs font-bold text-slate-500">صورة واضحة تزيد الثقة</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) setPreview(URL.createObjectURL(file))
          }}
        />
      </label>

      <Field label="عنوان المنتج">
        <input required className="input" value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="مثال: آيفون 15 برو" />
      </Field>
      <Field label="السعر">
        <input required inputMode="numeric" className="input" value={form.price} onChange={(event) => updateForm('price', event.target.value)} placeholder="السعر بالريال" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="الفئة">
          <select className="input" value={form.category} onChange={(event) => updateForm('category', event.target.value)}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="المدينة">
          <select className="input" value={form.city} onChange={(event) => updateForm('city', event.target.value)}>
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="وصف مختصر">
        <textarea
          required
          className="input min-h-28 resize-none leading-6"
          value={form.description}
          onChange={(event) => updateForm('description', event.target.value)}
          placeholder="اذكر الحالة، مدة الاستخدام، وما يشجع المشتري."
        />
      </Field>

      <button className="btn-primary w-full" type="submit">
        نشر الإعلان
      </button>
    </form>
  )
}

function DetailsPage({ listing, seller, isSaved, onBack, onChat, onToggleSaved }) {
  return (
    <div className="space-y-4 pt-4">
      <button className="flex items-center gap-1 text-sm font-extrabold text-slate-600" onClick={onBack}>
        <ChevronLeft size={18} />
        رجوع للإعلانات
      </button>

      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <img src={listing.imageUrl} alt={listing.title} className="aspect-[16/11] w-full object-cover" />
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold leading-tight text-slate-950">{listing.title}</h1>
              <p className="mt-2 text-xl font-extrabold text-teal-700">{formatPrice(listing.price)}</p>
            </div>
            <button className="icon-button" onClick={onToggleSaved} aria-label="حفظ الإعلان">
              {isSaved ? <BookmarkCheck size={21} className="text-teal-700" /> : <Bookmark size={21} />}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill>{listing.city}</Pill>
            <Pill>{listing.status}</Pill>
            <Pill>{getRelativeDate(listing.createdAt)}</Pill>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4">
        <h2 className="text-base font-extrabold text-slate-950">الوصف</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">{listing.description}</p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <CircleUserRound size={26} />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h3 className="font-extrabold text-slate-950">{seller.name}</h3>
                {seller.verified && <BadgeCheck size={17} className="text-teal-700" />}
              </div>
              <p className="mt-1 text-xs font-bold text-slate-500">{seller.city}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-extrabold text-amber-700">
            <Star size={15} fill="currentColor" />
            {seller.rating}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-[1fr_auto] gap-3">
        <button className="btn-primary" onClick={onChat}>
          <MessageCircle size={19} />
          مراسلة البائع
        </button>
        <button className="btn-secondary" onClick={onToggleSaved} aria-label="حفظ الإعلان">
          <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  )
}

function ChatPage({ user, onOpenListing }) {
  const [activeListingId, setActiveListingId] = useState(102)
  const [draft, setDraft] = useState('')
  const [localMessages, setLocalMessages] = useState(messages)
  const conversations = useMemo(() => {
    const ids = [...new Set(localMessages.map((message) => message.listingId))]
    return ids.map((id) => seedListings.find((listing) => listing.id === id)).filter(Boolean)
  }, [localMessages])
  const thread = localMessages.filter((message) => message.listingId === activeListingId)
  const activeListing = seedListings.find((listing) => listing.id === activeListingId)

  return (
    <div className="space-y-4 pt-4">
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {conversations.map((listing) => (
          <button
            key={listing.id}
            className={`min-w-[180px] rounded-2xl border p-3 text-right ${
              activeListingId === listing.id ? 'border-teal-700 bg-teal-50' : 'border-slate-200 bg-white'
            }`}
            onClick={() => setActiveListingId(listing.id)}
          >
            <p className="truncate text-sm font-extrabold text-slate-950">{listing.title}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">{listing.city}</p>
          </button>
        ))}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white">
        <button className="flex w-full items-center justify-between border-b border-slate-100 p-4 text-right" onClick={() => onOpenListing(activeListingId)}>
          <div>
            <h3 className="font-extrabold text-slate-950">{activeListing?.title}</h3>
            <p className="mt-1 text-xs font-bold text-teal-700">اضغط لعرض الإعلان</p>
          </div>
          <ChevronLeft size={18} />
        </button>

        <div className="space-y-3 p-4">
          {thread.map((message) => {
            const mine = message.senderId === user.id
            return (
              <div key={message.id} className={`flex ${mine ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${mine ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <p>{message.text}</p>
                  <span className={`mt-1 block text-[11px] font-bold ${mine ? 'text-teal-100' : 'text-slate-400'}`}>{message.createdAt}</span>
                </div>
              </div>
            )
          })}
        </div>

        <form
          className="flex items-center gap-2 border-t border-slate-100 p-3"
          onSubmit={(event) => {
            event.preventDefault()
            if (!draft.trim()) return
            setLocalMessages((items) => [
              ...items,
              { id: Date.now(), senderId: user.id, receiverId: 2, listingId: activeListingId, text: draft, createdAt: 'الآن' }
            ])
            setDraft('')
          }}
        >
          <input className="input h-12" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="اكتب رسالتك..." />
          <button className="btn-primary h-12 w-12 shrink-0 p-0" aria-label="إرسال">
            <Send size={18} />
          </button>
        </form>
      </section>
    </div>
  )
}

function ProfilePage({ user, listings, savedIds, onLogout, onOpenListing }) {
  const myListings = listings.filter((listing) => listing.userId === user.id)
  const saved = listings.filter((listing) => savedIds.includes(listing.id))

  return (
    <div className="space-y-4 pt-4">
      <section className="rounded-3xl bg-slate-950 p-5 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
            <CircleUserRound size={36} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold">{user.name}</h1>
              <BadgeCheck size={18} className="text-teal-200" />
            </div>
            <p className="mt-1 text-sm text-slate-300">{user.phone} · {user.city}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Metric label="إعلاناتي" value={myListings.length} />
          <Metric label="محفوظة" value={saved.length} />
          <Metric label="التقييم" value={user.rating} />
        </div>
      </section>

      <ProfileSection title="توثيق المستخدم">
        <div className="flex items-center justify-between rounded-2xl bg-teal-50 p-4 text-teal-900">
          <div className="flex items-center gap-3">
            <UserRoundCheck size={22} />
            <div>
              <p className="font-extrabold">الحساب موثق</p>
              <p className="mt-1 text-xs font-bold text-teal-700">رقم الجوال والمدينة مؤكدان</p>
            </div>
          </div>
          <BadgeCheck size={22} />
        </div>
      </ProfileSection>

      <ProfileSection title="إعلاناتي">
        <CompactListingList listings={myListings} onOpenListing={onOpenListing} />
      </ProfileSection>

      <ProfileSection title="الإعلانات المحفوظة">
        <CompactListingList listings={saved} onOpenListing={onOpenListing} />
      </ProfileSection>

      <ProfileSection title="التقييمات">
        <div className="rounded-2xl bg-white p-4">
          <div className="mb-2 flex items-center gap-1 text-amber-600">
            {[1, 2, 3, 4, 5].map((item) => (
              <Star key={item} size={17} fill="currentColor" />
            ))}
          </div>
          <p className="text-sm leading-6 text-slate-600">بائع سريع في الرد، ووصف المنتجات واضح ودقيق.</p>
        </div>
      </ProfileSection>

      <button className="btn-danger w-full" onClick={onLogout}>
        <LogOut size={19} />
        تسجيل خروج
      </button>
    </div>
  )
}

function CompactListingList({ listings, onOpenListing }) {
  if (!listings.length) return <EmptyState text="لا توجد عناصر هنا حتى الآن." />

  return (
    <div className="space-y-2">
      {listings.map((listing) => (
        <button key={listing.id} className="flex w-full items-center gap-3 rounded-2xl bg-white p-2 text-right" onClick={() => onOpenListing(listing.id)}>
          <img src={listing.imageUrl} alt={listing.title} className="h-16 w-16 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold text-slate-950">{listing.title}</p>
            <p className="mt-1 text-xs font-bold text-teal-700">{formatPrice(listing.price)}</p>
          </div>
          <ChevronLeft size={17} className="text-slate-400" />
        </button>
      ))}
    </div>
  )
}

function BottomNav({ activePage, setActivePage }) {
  const items = [
    { id: 'profile', label: 'حسابي', icon: CircleUserRound },
    { id: 'chat', label: 'المحادثات', icon: MessageCircle },
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'add', label: 'إضافة', icon: Plus },
    { id: 'profile', label: 'محفوظة', icon: Bookmark }
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-slate-200 bg-white/95 px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2 backdrop-blur md:bottom-6 md:rounded-b-[32px]">
      <div className="grid grid-cols-5 gap-1.5">
        {items.map((item) => {
          const Icon = item.icon
          const active = activePage === item.id
          return (
            <button
              key={item.id}
              className={`flex h-[60px] flex-col items-center justify-center gap-1 rounded-[18px] bg-transparent text-[11px] font-extrabold transition active:scale-95 ${
                active ? 'text-teal-700' : 'text-slate-500'
              } ${item.id === 'home' ? '-translate-y-2' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <span
                className={`grid h-10 w-10 place-items-center rounded-full transition ${
                  active ? 'bg-teal-700 text-white shadow-[0_10px_22px_rgba(15,118,110,0.22)]' : ''
                }`}
              >
                <Icon size={21} strokeWidth={2.2} />
              </span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-slate-800">{label}</span>
      {children}
    </label>
  )
}

function Pill({ children }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-600">{children}</span>
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 text-center">
      <p className="text-lg font-extrabold">{value}</p>
      <p className="mt-1 text-xs font-bold text-slate-300">{label}</p>
    </div>
  )
}

function ProfileSection({ title, children }) {
  return (
    <section>
      <h2 className="mb-2 text-base font-extrabold text-slate-950">{title}</h2>
      {children}
    </section>
  )
}

function EmptyState({ text }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center">
      <X size={24} className="mx-auto text-slate-400" />
      <p className="mt-2 text-sm font-bold text-slate-500">{text}</p>
    </div>
  )
}
