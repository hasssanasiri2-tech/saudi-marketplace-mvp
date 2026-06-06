import React, { useEffect, useMemo, useState } from 'react'
import { supabase, supabaseConfigError } from './lib/supabase'
import {
  Bell,
  Bookmark,
  BookmarkCheck,
  Camera,
  Car,
  ChevronLeft,
  CircleUserRound,
  Compass,
  Eye,
  EyeOff,
  Heart,
  Home,
  Laptop,
  LogOut,
  MapPin,
  MessageCircle,
  Package,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Shirt,
  Sofa,
  Star,
  Tag,
  Wallet,
  X
} from 'lucide-react'

const brandColor = '#0f766e'

const defaultUser = {
  id: 'guest',
  name: 'مستخدم سريع',
  phone: '0500000000',
  city: 'الرياض',
  rating: 4.8,
  verified: true
}

const cities = ['الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'أبها', 'تبوك']

const categoryOptions = [
  { id: 'all', name: 'الكل', icon: Package },
  { id: 'cars', name: 'سيارات', icon: Car },
  { id: 'electronics', name: 'إلكترونيات', icon: Laptop },
  { id: 'furniture', name: 'أثاث', icon: Sofa },
  { id: 'fashion', name: 'ملابس', icon: Shirt }
]

const decorativeShapes = [
  { id: 1, name: 'زخرفة هندسية' },
  { id: 2, name: 'نقش إسلامي' },
  { id: 3, name: 'زهرة عربية' },
  { id: 4, name: 'أوراق متداخلة' },
  { id: 5, name: 'كثبان وهلال' },
  { id: 6, name: 'موج البحر' },
  { id: 7, name: 'قوس معماري' },
  { id: 8, name: 'خط عربي فني' },
  { id: 9, name: 'تكرار هندسي' },
  { id: 10, name: 'دوامات ناعمة' },
  { id: 11, name: 'جبال متدرجة' },
  { id: 12, name: 'أشكال طبيعية' },
  { id: 13, name: 'طيات متداخلة' },
  { id: 14, name: 'فسيفساء عربية' },
  { id: 15, name: 'خطوط رملية' }
]

const seedListings = [
  {
    id: 101,
    userId: 'guest',
    title: 'آيفون 15 برو 256GB',
    description: 'جهاز نظيف جدًا، استخدام خفيف، مع الكرتون والشاحن الأصلي.',
    price: 3490,
    category: 'electronics',
    city: 'الرياض',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80',
    status: 'ممتاز',
    createdAt: '2026-05-18'
  },
  {
    id: 102,
    userId: 'guest',
    title: 'كامري 2021 فل كامل',
    description: 'ممشى قليل، صيانة وكالة، السيارة جاهزة للاستخدام.',
    price: 83500,
    category: 'cars',
    city: 'جدة',
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80',
    status: 'نظيف',
    createdAt: '2026-05-17'
  },
  {
    id: 103,
    userId: 'guest',
    title: 'كنب زاوية مودرن',
    description: 'كنب مريح بلون رمادي فاتح، مناسب للصالة وحالته ممتازة.',
    price: 1450,
    category: 'furniture',
    city: 'الدمام',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    status: 'شبه جديد',
    createdAt: '2026-05-16'
  },
  {
    id: 104,
    userId: 'guest',
    title: 'جاكيت شتوي فاخر',
    description: 'جاكيت عملي بحالة ممتازة ومناسب للسفر والشتاء.',
    price: 220,
    category: 'fashion',
    city: 'الخبر',
    imageUrl: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80',
    status: 'ممتاز',
    createdAt: '2026-05-15'
  }
]

function normalizeListing(listing) {
  return {
    ...listing,
    userId: listing.userId || listing.user_id || defaultUser.id,
    createdAt: listing.createdAt || listing.created_at || new Date().toISOString(),
    imageUrl: listing.imageUrl || listing.image_url
  }
}

function formatPrice(value) {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0
  }).format(Number(value || 0))
}

function categoryName(id) {
  return categoryOptions.find((category) => category.id === id)?.name || 'متنوع'
}

function shapeImageSrc(id) {
  return `/home-shapes/shape-${String(id).padStart(2, '0')}.png`
}

const profileGifSrc = '/profile/arab-man.gif'
const profileStillSrc = '/profile/arab-man-clean.png'
const profileNavSrc = '/profile/arab-man-nav.png'

export default function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState(defaultUser)
  const [activePage, setActivePage] = useState('home')
  const [selectedListingId, setSelectedListingId] = useState(seedListings[0].id)
  const [listings, setListings] = useState(seedListings)
  const [savedIds, setSavedIds] = useState([])
  const [filters, setFilters] = useState({ query: '', category: 'all' })
  const [homeShapeId, setHomeShapeId] = useState(() => Number(window.localStorage.getItem('homeShapeId')) || 2)

  useEffect(() => {
    if (supabaseConfigError) return
    fetchListings()
  }, [])

  useEffect(() => {
    window.localStorage.setItem('homeShapeId', String(homeShapeId))
  }, [homeShapeId])

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      if (supabaseConfigError) {
        setAuthLoading(false)
        return
      }

      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(data.session)
      await loadProfile(data.session)
      if (mounted) setAuthLoading(false)
    }

    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      loadProfile(nextSession)
      if (!nextSession) setActivePage('home')
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  async function loadProfile(activeSession) {
    if (!activeSession?.user) {
      setUser(defaultUser)
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, phone, city')
      .eq('id', activeSession.user.id)
      .maybeSingle()

    if (error) console.log(error)

    setUser({
      ...defaultUser,
      id: activeSession.user.id,
      email: activeSession.user.email,
      name: data?.name || activeSession.user.user_metadata?.name || defaultUser.name,
      phone: data?.phone || activeSession.user.user_metadata?.phone || defaultUser.phone,
      city: data?.city || activeSession.user.user_metadata?.city || defaultUser.city
    })
  }

  async function fetchListings() {
    if (supabaseConfigError) return

    const { data, error } = await supabase.from('listings').select('*')
    if (error) {
      console.log(error)
      return
    }
    if (data?.length) setListings(data.map(normalizeListing))
  }

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const query = filters.query.trim()
      const matchesQuery =
        !query ||
        listing.title?.includes(query) ||
        listing.description?.includes(query) ||
        listing.city?.includes(query)
      const matchesCategory = filters.category === 'all' || listing.category === filters.category
      return matchesQuery && matchesCategory
    })
  }, [filters, listings])

  const selectedListing = listings.find((listing) => listing.id === selectedListingId) || listings[0]

  function openListing(id) {
    setSelectedListingId(id)
    setActivePage('details')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toggleSaved(id) {
    setSavedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  async function publishListing(payload) {
    const row = {
      title: payload.title,
      price: Number(payload.price),
      category: payload.category,
      city: payload.city,
      description: payload.description,
      image_url: payload.image_url,
      user_id: user.id
    }

    const { data, error } = await supabase.from('listings').insert(row).select().single()
    if (error) throw error

    const newListing = normalizeListing(data || { ...row, id: Date.now() })
    setListings((items) => [newListing, ...items])
    setSelectedListingId(newListing.id)
    setActivePage('details')
  }

  async function logout() {
    await supabase.auth.signOut()
    setSession(null)
    setUser(defaultUser)
    setActivePage('home')
  }

  async function handleAuthReady(nextSession) {
    setSession(nextSession)
    await loadProfile(nextSession)
  }

  if (supabaseConfigError) {
    return <SupabaseConfigError message={supabaseConfigError} />
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5" dir="rtl">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-soft">
          <p className="text-sm font-extrabold text-teal-300">جاري تحميل الحساب...</p>
        </div>
      </div>
    )
  }

  if (!session) return <AuthPage onAuthReady={handleAuthReady} />

  return (
    <div className="min-h-screen bg-slate-950" dir="rtl">
      <div className="mx-auto min-h-screen w-full max-w-md bg-slate-900 text-slate-100 shadow-soft md:my-5 md:min-h-[880px] md:overflow-hidden md:rounded-[28px]">
        <main className="safe-bottom px-4 pb-6">
          {activePage === 'home' && (
            <HomePage
              filters={filters}
              listings={filteredListings}
              savedIds={savedIds}
              setActivePage={setActivePage}
              setFilters={setFilters}
              onOpenListing={openListing}
              onToggleSaved={toggleSaved}
              user={user}
            />
          )}
          {activePage === 'add' && <AddListingPage onPublish={publishListing} userCity={user.city} />}
          {activePage === 'explore' && (
            <ExplorePage
              listings={listings}
              savedIds={savedIds}
              onOpenListing={openListing}
              onToggleSaved={toggleSaved}
            />
          )}
          {activePage === 'details' && selectedListing && (
            <DetailsPage
              listing={selectedListing}
              isSaved={savedIds.includes(selectedListing.id)}
              onBack={() => setActivePage('home')}
              onToggleSaved={() => toggleSaved(selectedListing.id)}
            />
          )}
          {activePage === 'chat' && <MessagesPage />}
          {activePage === 'saved' && (
            <SavedPage
              listings={listings.filter((listing) => savedIds.includes(listing.id))}
              onOpenListing={openListing}
            />
          )}
          {activePage === 'profile' && (
            <ProfilePage
              user={user}
              listings={listings}
              savedIds={savedIds}
              homeShapeId={homeShapeId}
              onLogout={logout}
              onOpenListing={openListing}
              onSelectHomeShape={setHomeShapeId}
              onOpenStudio={() => setActivePage('add')}
            />
          )}
        </main>
        <BottomNav activePage={activePage} setActivePage={setActivePage} homeShapeId={homeShapeId} />
      </div>
    </div>
  )
}

function AuthPage({ onAuthReady }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: defaultUser.city,
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResendingConfirmation, setIsResendingConfirmation] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const isLogin = mode === 'login'
  const isSignup = mode === 'signup'
  const isForgot = mode === 'forgot'
  const title = isSignup ? 'إنشاء حساب' : isForgot ? 'استعادة كلمة المرور' : 'تسجيل الدخول'
  const subtitle = isSignup
    ? 'أكمل بياناتك للبدء في البيع والشراء.'
    : isForgot
      ? 'أدخل بريدك الإلكتروني وسنرسل رابط إعادة التعيين.'
      : 'مرحبًا بك في سريع.'

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setMessage('')
    setErrorMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setErrorMessage('')
    setIsSubmitting(true)
    const email = form.email.trim()

    try {
      if (isForgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin
        })
        if (error) throw error
        setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.')
        return
      }

      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: form.password,
          options: {
            data: {
              name: form.name,
              phone: form.phone,
              city: form.city
            }
          }
        })
        if (error) throw error

        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            name: form.name,
            phone: form.phone,
            city: form.city
          })
          if (profileError) throw profileError
        }

        if (data.session) await onAuthReady(data.session)
        else setMessage('تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتفعيل الحساب.')
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: form.password
      })

      if (error) {
        if (error.message?.toLowerCase().includes('email not confirmed')) {
          throw new Error('يرجى تأكيد بريدك الإلكتروني أولاً.')
        }
        throw error
      }

      await onAuthReady(data.session)
    } catch (error) {
      setErrorMessage(error.message || 'تعذر إتمام العملية. حاول مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResendConfirmation() {
    setMessage('')
    setErrorMessage('')
    const email = form.email.trim()

    if (!email) {
      setErrorMessage('اكتب بريدك الإلكتروني أولاً لإعادة إرسال رابط التفعيل.')
      return
    }

    setIsResendingConfirmation(true)
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email })
      if (error) throw error
      setMessage('تم إرسال رابط التفعيل مرة أخرى. تحقق من بريدك الإلكتروني.')
    } catch (error) {
      setErrorMessage(error.message || 'تعذر إعادة إرسال رابط التفعيل.')
    } finally {
      setIsResendingConfirmation(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-8" dir="rtl">
      <section className="w-full max-w-md overflow-hidden rounded-[30px] border border-white/10 bg-slate-900 shadow-[0_26px_80px_rgba(2,6,23,0.6)]">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.28),transparent_40%),linear-gradient(180deg,rgba(15,118,110,0.18),rgba(15,23,42,0))] p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold text-teal-300">سريع</p>
              <h1 className="mt-2 text-3xl font-extrabold leading-tight text-white">{title}</h1>
            </div>
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-teal-600 text-white">
              <Package size={28} />
            </div>
          </div>
          <p className="text-sm leading-7 text-slate-300">{subtitle}</p>
        </div>

        <form className="space-y-4 p-6 pt-2" onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <AuthField label="الاسم">
                <input required className="auth-input" value={form.name} autoComplete="name" onChange={(event) => updateForm('name', event.target.value)} placeholder="اسمك" />
              </AuthField>
              <AuthField label="رقم الجوال">
                <input required className="auth-input" value={form.phone} inputMode="tel" autoComplete="tel" onChange={(event) => updateForm('phone', event.target.value)} placeholder="05xxxxxxxx" />
              </AuthField>
              <AuthField label="المدينة">
                <select className="auth-input" value={form.city} onChange={(event) => updateForm('city', event.target.value)}>
                  {cities.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </AuthField>
            </>
          )}

          <AuthField label="البريد الإلكتروني">
            <input required type="email" className="auth-input" value={form.email} autoComplete="email" onChange={(event) => updateForm('email', event.target.value)} placeholder="name@example.com" />
          </AuthField>

          {!isForgot && (
            <AuthField label="كلمة المرور">
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input pl-14"
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  minLength={6}
                  value={form.password}
                  onChange={(event) => updateForm('password', event.target.value)}
                  placeholder="كلمة المرور"
                />
                <button
                  className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300"
                  type="button"
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </AuthField>
          )}

          {isLogin && (
            <button className="text-sm font-extrabold text-teal-300" type="button" onClick={() => switchMode('forgot')}>
              نسيت كلمة المرور؟
            </button>
          )}

          {message && <p className="rounded-2xl border border-teal-400/20 bg-teal-400/10 p-3 text-sm font-bold text-teal-100">{message}</p>}
          {errorMessage && <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm font-bold text-rose-100">{errorMessage}</p>}

          <button className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-teal-600 px-5 py-3 text-sm font-extrabold text-white transition active:scale-[0.98] disabled:opacity-70" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'جاري الإرسال...' : isSignup ? 'إنشاء حساب' : isForgot ? 'إرسال رابط الاستعادة' : 'تسجيل الدخول'}
          </button>

          <div className="grid gap-2">
            {!isSignup && (
              <button className="btn-secondary border-white/10 bg-white/5 text-slate-100" type="button" onClick={() => switchMode('signup')}>
                إنشاء حساب جديد
              </button>
            )}
            {(isLogin || isSignup) && (
              <button className="btn-secondary border-white/10 bg-white/5 text-slate-100 disabled:opacity-70" type="button" disabled={isResendingConfirmation} onClick={handleResendConfirmation}>
                {isResendingConfirmation ? 'جاري إعادة الإرسال...' : 'إعادة إرسال رابط التفعيل'}
              </button>
            )}
            {!isLogin && (
              <button className="btn-secondary border-white/10 bg-white/5 text-slate-100" type="button" onClick={() => switchMode('login')}>
                العودة إلى تسجيل الدخول
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  )
}

function AuthField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-slate-200">{label}</span>
      {children}
    </label>
  )
}

function HomePage({ filters, setFilters, listings, savedIds, onOpenListing, onToggleSaved, setActivePage, user }) {
  const quickCategories = categoryOptions.slice(1, 5)

  return (
    <div className="space-y-5 pt-5">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-teal-300">أهلًا {user.name}</p>
          <h1 className="mt-1 text-2xl font-extrabold text-white">ماذا تبحث عنه؟</h1>
        </div>
        <button className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-slate-800 text-slate-100 shadow-sm" type="button" onClick={() => setActivePage('profile')} aria-label="الحساب">
          <CircleUserRound size={24} />
        </button>
      </header>

      <section className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-800 px-4 py-2 shadow-sm">
        <Search size={21} className="text-teal-300" />
        <input
          className="w-full bg-transparent py-3 text-sm font-bold text-slate-100 outline-none placeholder:text-slate-500"
          placeholder="ابحث عن سيارة، جوال، أثاث..."
          value={filters.query}
          onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
        />
      </section>

      <section className="grid grid-cols-4 gap-2">
        {quickCategories.map((category) => {
          const Icon = category.icon
          const active = filters.category === category.id
          return (
            <button
              key={category.id}
              className={`grid min-h-[76px] place-items-center gap-1 rounded-2xl border text-xs font-extrabold transition ${
                active ? 'border-teal-500 bg-teal-600 text-white' : 'border-white/10 bg-slate-800 text-slate-200'
              }`}
              type="button"
              onClick={() => setFilters((current) => ({ ...current, category: active ? 'all' : category.id }))}
            >
              <Icon size={22} />
              <span>{category.name}</span>
            </button>
          )
        })}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white">الإعلانات</h2>
          <span className="text-xs font-bold text-slate-400">{listings.length} إعلان</span>
        </div>
        {listings.length ? (
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
        ) : (
          <EmptyState text="لا توجد إعلانات مطابقة." />
        )}
      </section>
    </div>
  )
}

function ListingCard({ listing, isSaved, onOpen, onToggleSaved }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800 shadow-sm">
      <button className="block w-full text-right" type="button" onClick={onOpen}>
        <img src={listing.image_url || listing.imageUrl} alt={listing.title} className="aspect-square w-full object-cover" />
      </button>
      <div className="p-3">
        <div className="mb-2 flex items-start justify-between gap-2">
          <button className="min-w-0 text-right" type="button" onClick={onOpen}>
            <h3 className="line-clamp-2 min-h-10 text-sm font-extrabold leading-5 text-white">{listing.title}</h3>
          </button>
          <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-slate-200" type="button" onClick={onToggleSaved} aria-label="حفظ الإعلان">
            {isSaved ? <BookmarkCheck size={18} className="text-teal-300" /> : <Bookmark size={18} />}
          </button>
        </div>
        <p className="text-base font-extrabold text-teal-300">{formatPrice(listing.price)}</p>
        <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span>{listing.city}</span>
          <span>{categoryName(listing.category)}</span>
        </div>
      </div>
    </article>
  )
}

function AddListingPage({ onPublish, userCity }) {
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: 'electronics',
    city: userCity,
    description: '',
    image_url: ''
  })
  const [preview, setPreview] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const extension = file.name.split('.').pop() || 'jpg'
    const filePath = `${crypto.randomUUID()}.${extension}`
    setPreview(URL.createObjectURL(file))
    setErrorMessage('')
    setIsUploading(true)

    try {
      const { error } = await supabase.storage.from('listing-images').upload(filePath, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false
      })
      if (error) throw error
      const { data } = supabase.storage.from('listing-images').getPublicUrl(filePath)
      updateForm('image_url', data.publicUrl)
    } catch (error) {
      setPreview('')
      setErrorMessage(error.message || 'تعذر رفع الصورة.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form
      className="space-y-4 pt-5"
      onSubmit={async (event) => {
        event.preventDefault()
        if (isUploading) {
          setErrorMessage('انتظر حتى ينتهي رفع الصورة.')
          return
        }
        if (!form.image_url) {
          setErrorMessage('أضف صورة للإعلان أولًا.')
          return
        }
        setIsPublishing(true)
        setErrorMessage('')
        try {
          await onPublish(form)
        } catch (error) {
          setErrorMessage(error.message || 'تعذر نشر الإعلان.')
        } finally {
          setIsPublishing(false)
        }
      }}
    >
      <PageTitle title="إضافة إعلان" subtitle="صورة واضحة وتفاصيل مختصرة تكفي." />

      <label className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-teal-500/40 bg-slate-800 text-center">
        {preview ? (
          <img src={preview} alt="معاينة الإعلان" className="h-full w-full rounded-3xl object-cover" />
        ) : (
          <>
            <Camera size={34} className="text-teal-300" />
            <span className="mt-3 text-sm font-extrabold text-white">أضف صورة الإعلان</span>
            <span className="mt-1 text-xs font-bold text-slate-400">اختر صورة من المعرض أو الكاميرا</span>
          </>
        )}
        <input type="file" accept="image/*" className="hidden" disabled={isUploading || isPublishing} onChange={handleImageChange} />
      </label>

      {isUploading && <p className="text-sm font-bold text-teal-300">جاري رفع الصورة...</p>}
      {errorMessage && <p className="text-sm font-bold text-rose-300">{errorMessage}</p>}

      <Field label="عنوان الإعلان">
        <input required className="input" value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="مثال: آيفون 15 برو" />
      </Field>
      <Field label="السعر">
        <input required inputMode="numeric" className="input" value={form.price} onChange={(event) => updateForm('price', event.target.value)} placeholder="السعر بالريال" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="الفئة">
          <select className="input" value={form.category} onChange={(event) => updateForm('category', event.target.value)}>
            {categoryOptions.slice(1).map((category) => (
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
      <Field label="الوصف">
        <textarea required className="input min-h-28 resize-none leading-6" value={form.description} onChange={(event) => updateForm('description', event.target.value)} placeholder="اكتب حالة المنتج وأهم التفاصيل." />
      </Field>

      <button className="btn-primary w-full disabled:opacity-70" type="submit" disabled={isUploading || isPublishing}>
        {isPublishing ? 'جاري النشر...' : 'نشر الإعلان'}
      </button>
    </form>
  )
}

function ExplorePage({ listings, savedIds, onOpenListing, onToggleSaved }) {
  if (!listings.length) {
    return (
      <div className="pt-5">
        <PageTitle title="استكشف" subtitle="ستظهر العروض الجديدة هنا." />
        <EmptyState text="لا توجد عروض للاستكشاف حتى الآن." />
      </div>
    )
  }

  return (
    <div className="-mx-4 bg-slate-950">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur">
        <div>
          <h1 className="text-xl font-extrabold text-white">استكشف</h1>
          <p className="mt-1 text-xs font-bold text-slate-400">تصفح العروض الجديدة بسرعة</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-slate-900 text-slate-100">
          <Compass size={22} />
        </div>
      </header>

      <section className="snap-y snap-mandatory overflow-y-auto px-4 pb-3 pt-4">
        <div className="space-y-4">
          {listings.map((listing) => {
            const saved = savedIds.includes(listing.id)
            return (
              <article key={listing.id} className="relative min-h-[620px] snap-start overflow-hidden rounded-[28px] border border-white/10 bg-slate-900 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
                <button className="block h-full w-full text-right" type="button" onClick={() => onOpenListing(listing.id)}>
                  <img src={listing.image_url || listing.imageUrl} alt={listing.title} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
                  <div className="absolute bottom-0 right-0 left-0 p-4 pb-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-extrabold text-white backdrop-blur">
                        {categoryName(listing.category)}
                      </span>
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-extrabold text-white backdrop-blur">
                        {listing.city}
                      </span>
                    </div>
                    <h2 className="text-2xl font-extrabold leading-tight text-white">{listing.title}</h2>
                    <p className="mt-2 text-3xl font-extrabold text-teal-300">{formatPrice(listing.price)}</p>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-200">{listing.description}</p>
                  </div>
                </button>

                <div className="absolute bottom-28 left-4 grid gap-3">
                  <button
                    className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition active:scale-95"
                    type="button"
                    aria-label="حفظ العرض"
                    onClick={() => onToggleSaved(listing.id)}
                  >
                    {saved ? <BookmarkCheck size={22} className="text-teal-300" /> : <Bookmark size={22} />}
                  </button>
                  <button
                    className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition active:scale-95"
                    type="button"
                    aria-label="مراسلة البائع"
                  >
                    <MessageCircle size={22} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function DetailsPage({ listing, isSaved, onBack, onToggleSaved }) {
  return (
    <div className="space-y-4 pt-5">
      <button className="flex items-center gap-1 text-sm font-extrabold text-slate-300" type="button" onClick={onBack}>
        <ChevronLeft size={18} />
        رجوع
      </button>
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-800 shadow-sm">
        <img src={listing.image_url || listing.imageUrl} alt={listing.title} className="aspect-[16/11] w-full object-cover" />
        <div className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold leading-tight text-white">{listing.title}</h1>
              <p className="mt-2 text-xl font-extrabold text-teal-300">{formatPrice(listing.price)}</p>
            </div>
            <button className="icon-button" type="button" onClick={onToggleSaved} aria-label="حفظ الإعلان">
              {isSaved ? <BookmarkCheck size={21} className="text-teal-700" /> : <Bookmark size={21} />}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill>{listing.city}</Pill>
            <Pill>{categoryName(listing.category)}</Pill>
            <Pill>{listing.status || 'متاح'}</Pill>
          </div>
          <div>
            <h2 className="font-extrabold text-white">الوصف</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">{listing.description}</p>
          </div>
        </div>
      </section>
      <button className="btn-primary w-full" type="button">
        <MessageCircle size={19} />
        مراسلة البائع
      </button>
    </div>
  )
}

function MessagesPage() {
  return (
    <div className="pt-5">
      <PageTitle title="المحادثات" subtitle="ستظهر محادثاتك هنا." />
      <EmptyState text="لا توجد محادثات حتى الآن." />
    </div>
  )
}

function SavedPage({ listings, onOpenListing }) {
  return (
    <div className="pt-5">
      <PageTitle title="المحفوظات" subtitle="الإعلانات التي حفظتها للرجوع إليها لاحقًا." />
      <CompactListingList listings={listings} onOpenListing={onOpenListing} />
    </div>
  )
}

function ProfilePage({ user, listings, savedIds, onLogout, onOpenListing, onOpenStudio }) {
  const myListings = listings.filter((listing) => listing.userId === user.id)
  const saved = listings.filter((listing) => savedIds.includes(listing.id))

  return (
    <div className="profile-screen -mx-4 min-h-screen px-4 pb-4 pt-5 text-white">
      <header className="mb-5 flex items-center justify-between">
        <button className="profile-top-button" type="button" aria-label="الإعدادات">
          <Settings size={22} />
        </button>
        <h1 className="text-lg font-extrabold text-white">حسابي</h1>
        <button className="profile-top-button" type="button" aria-label="المحفظة">
          <Wallet size={22} />
        </button>
      </header>

      <section className="rounded-[30px] border border-[#232A34] bg-[linear-gradient(145deg,#151A21,#0B0F14)] p-5 text-center shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
        <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-[#060A0F] p-2 text-white">
          <div className="h-full w-full overflow-hidden rounded-full bg-[#060A0F]">
            <img className="h-full w-full object-contain p-1" src={profileStillSrc} alt="أيقونة الحساب" />
          </div>
        </div>

        <h2 className="mt-4 text-2xl font-extrabold">{user.name}</h2>
        <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-extrabold text-slate-100">
          <ShieldCheck size={15} />
          بائع موثوق
        </div>
        <div className="mt-3 flex items-center justify-center gap-1 text-amber-300">
          {[1, 2, 3, 4, 5].map((item) => (
            <Star key={item} size={14} fill="currentColor" />
          ))}
          <span className="mr-1 text-xs font-bold text-slate-300">4.8 · 36 مراجعة</span>
        </div>
        <p className="mt-2 text-sm font-bold text-slate-400">{user.city} · عضو منذ يناير 2022</p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <Metric label="إعلاناتي" value={myListings.length} />
          <Metric label="المفضلة" value={saved.length} />
          <Metric label="المتابعون" value={47} />
        </div>
      </section>

      <ProfileSection title="إعلاناتي" action="عرض الكل">
        <div className="grid min-h-44 place-items-center rounded-3xl border border-dashed border-[#232A34] bg-[#151A21]/60 p-5 text-center">
          <div>
            <Camera size={34} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-extrabold text-white">بإمكانك إضافة إعلان من الاستديو</p>
            <p className="mt-1 text-xs font-bold text-slate-400">اختر صورة من جهازك وابدأ إعلانك بسرعة.</p>
            <button className="mt-4 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-extrabold text-slate-950 transition active:scale-[0.98]" type="button" onClick={onOpenStudio}>
              فتح الاستديو
            </button>
          </div>
        </div>
      </ProfileSection>

      <section className="mt-5 space-y-2">
        <ProfileMenuItem icon={Heart} label="المفضلة" value={saved.length} onClick={() => {}} />
        <ProfileMenuItem icon={MessageCircle} label="الرسائل" />
        <ProfileMenuItem icon={MapPin} label="العنوان" value={user.city} />
        <ProfileMenuItem icon={Settings} label="الإعدادات" />
      </section>

      <button className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-extrabold text-white transition active:scale-[0.98]" type="button" onClick={onLogout}>
        <LogOut size={19} />
        تسجيل الخروج
      </button>
    </div>
  )
}

function ProfileListingCard({ listing, onOpenListing }) {
  const status = listing.status || 'متاح'
  const statusClass =
    status === 'مباع'
      ? 'bg-rose-500/12 text-rose-300 border-rose-400/20'
      : status === 'محجوز'
        ? 'bg-amber-400/12 text-amber-200 border-amber-300/20'
        : 'bg-slate-200/10 text-slate-200 border-white/15'

  return (
    <button className="overflow-hidden rounded-3xl border border-[#232A34] bg-[#151A21] text-right shadow-[0_16px_35px_rgba(0,0,0,0.26)] transition hover:border-white/20 active:scale-[0.98]" type="button" onClick={() => onOpenListing(listing.id)}>
      <div className="relative">
        <img src={listing.image_url || listing.imageUrl} alt={listing.title} className="h-32 w-full object-cover" />
        <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur">
          <Heart size={15} />
        </span>
        <span className={`absolute bottom-2 left-2 rounded-full border px-2 py-1 text-[10px] font-extrabold backdrop-blur ${statusClass}`}>
          {status}
        </span>
      </div>
      <div className="p-3">
        <p className="text-base font-extrabold text-slate-100">{formatPrice(listing.price)}</p>
        <p className="mt-1 truncate text-sm font-extrabold text-white">{listing.title}</p>
        <p className="mt-2 truncate text-xs font-bold text-slate-400">{listing.city}</p>
      </div>
    </button>
  )
}

function ProfileMenuItem({ icon: Icon, label, value, onClick }) {
  return (
    <button className="flex min-h-14 w-full items-center justify-between rounded-2xl border border-[#232A34] bg-[#151A21] px-4 text-right transition hover:border-white/20 hover:bg-[#18202A] active:scale-[0.99]" type="button" onClick={onClick}>
      <ChevronLeft size={18} className="text-slate-500" />
      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm font-extrabold text-white">{label}</p>
          {value !== undefined && <p className="mt-0.5 text-xs font-bold text-slate-400">{value}</p>}
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-slate-100">
          <Icon size={20} />
        </span>
      </div>
    </button>
  )
}

function CompactListingList({ listings, onOpenListing }) {
  if (!listings.length) return <EmptyState text="لا توجد عناصر هنا حتى الآن." />

  return (
    <div className="space-y-2">
      {listings.map((listing) => (
        <button key={listing.id} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-slate-800 p-2 text-right shadow-sm" type="button" onClick={() => onOpenListing(listing.id)}>
          <img src={listing.image_url || listing.imageUrl} alt={listing.title} className="h-16 w-16 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold text-white">{listing.title}</p>
            <p className="mt-1 text-xs font-bold text-teal-300">{formatPrice(listing.price)}</p>
          </div>
          <ChevronLeft size={17} className="text-slate-500" />
        </button>
      ))}
    </div>
  )
}

function BottomNav({ activePage, setActivePage, homeShapeId }) {
  const items = [
    { id: 'profile', label: 'حسابي', icon: CircleUserRound },
    { id: 'chat', label: 'رسائل', icon: Send },
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'explore', label: 'استكشف', icon: Compass },
    { id: 'saved', label: 'محفوظات', icon: Bookmark }
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-white/10 bg-slate-950/95 px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2 backdrop-blur md:bottom-5 md:rounded-b-[28px]">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon
          const active = activePage === item.id
          return (
            <button key={item.id} className={`flex h-[58px] flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-extrabold transition ${active ? 'bg-teal-500/15 text-teal-300' : 'text-slate-400'}`} type="button" onClick={() => setActivePage(item.id)}>
              {item.id === 'home' ? (
                <span className={`nav-home-mark ${active ? 'nav-home-mark-active' : ''}`}>
                  <img className="shape-medallion nav-home-image" src={shapeImageSrc(homeShapeId)} alt="" />
                </span>
              ) : item.id === 'profile' ? (
                <span className={`nav-profile-mark ${active ? 'nav-profile-mark-active' : ''}`}>
                  <img className={`nav-profile-image ${active ? 'nav-profile-image-active' : ''}`} src={profileNavSrc} alt="" />
                </span>
              ) : (
                <Icon size={21} strokeWidth={2.2} />
              )}
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function ShapeGallery({ shapes, selectedShapeId, onSelectShape }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-800/80 p-4">
      <div className="grid grid-cols-3 gap-4">
        {shapes.map((shape) => (
          <button
            key={shape.id}
            className={`rounded-3xl border p-2 text-center transition active:scale-[0.98] ${
              selectedShapeId === shape.id ? 'border-teal-300 bg-teal-500/10' : 'border-transparent'
            }`}
            type="button"
            onClick={() => onSelectShape(shape.id)}
          >
            <DecorativeShape shape={shape} />
          </button>
        ))}
      </div>
    </div>
  )
}

function DecorativeShape({ shape, size = 'md' }) {
  return (
    <div className="text-center">
      <img
        className={`shape-medallion ${size === 'sm' ? 'shape-medallion-sm' : ''}`}
        src={shapeImageSrc(shape.id)}
        alt=""
        aria-hidden="true"
      />
      {size !== 'sm' && <p className="mt-2 text-[11px] font-extrabold leading-4 text-slate-200">{shape.id}. {shape.name}</p>}
    </div>
  )
}

function PageTitle({ title, subtitle }) {
  return (
    <header>
      <h1 className="text-2xl font-extrabold text-white">{title}</h1>
      <p className="mt-1 text-sm font-bold text-slate-400">{subtitle}</p>
    </header>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-slate-200">{label}</span>
      {children}
    </label>
  )
}

function Pill({ children }) {
  return <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-extrabold text-slate-200">{children}</span>
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#232A34] bg-[#151A21] px-2 py-3 text-center">
      <p className="text-lg font-extrabold text-white">{value}</p>
      <p className="mt-1 text-xs font-bold text-slate-400">{label}</p>
    </div>
  )
}

function ProfileSection({ title, action, children }) {
  return (
    <section className="mt-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-extrabold text-white">{title}</h2>
        {action && <button className="text-xs font-extrabold text-slate-300" type="button">{action}</button>}
      </div>
      {children}
    </section>
  )
}

function EmptyState({ text }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-slate-800 p-6 text-center">
      <X size={24} className="mx-auto text-slate-500" />
      <p className="mt-2 text-sm font-bold text-slate-400">{text}</p>
    </div>
  )
}

function SupabaseConfigError({ message }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5" dir="rtl">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-6 text-center shadow-soft">
        <ShieldCheck size={32} className="mx-auto text-teal-300" />
        <h1 className="mt-4 text-lg font-extrabold text-white">تعذر الاتصال</h1>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-300">{message}</p>
      </div>
    </div>
  )
}
