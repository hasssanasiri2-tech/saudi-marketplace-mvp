const categories = [
  ['cars', 'سيارات'],
  ['electronics', 'إلكترونيات'],
  ['furniture', 'أثاث'],
  ['games', 'ألعاب'],
  ['realestate', 'عقارات'],
  ['misc', 'متفرقات'],
  ['motorcycles', 'دراجات'],
  ['fashion', 'ملابس'],
  ['kids', 'أطفال'],
  ['sports', 'رياضة'],
  ['books', 'كتب'],
  ['tools', 'معدات'],
  ['home_appliances', 'أجهزة منزلية'],
  ['beauty', 'عناية'],
  ['services', 'خدمات'],
  ['jobs', 'وظائف'],
  ['tickets', 'تذاكر'],
  ['antiques', 'تحف']
]

const cities = [
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

let listings = [
  ['آيفون 15 برو 256GB', 3490, 'electronics', 'الرياض', 'مستعمل ممتاز', 'الجهاز نظيف جدًا، استخدام سنة، مع الكرتون والشاحن.', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80'],
  ['كامري 2021 فل كامل', 83500, 'cars', 'جدة', 'نظيف', 'ممشاها 78 ألف، صيانة وكالة، فحص دوري جديد.', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80'],
  ['كنب زاوية مودرن', 1450, 'furniture', 'الدمام', 'شبه جديد', 'كنب مريح بلون رمادي فاتح، استعمال بسيط وحالته ممتازة.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80'],
  ['بلايستيشن 5 مع يدين', 1690, 'games', 'الخبر', 'مستعمل ممتاز', 'نسخة الأقراص، معه يدين وشريطين. البيع بسبب عدم الاستخدام.', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80'],
  ['شقة للإيجار حي السلامة', 42000, 'realestate', 'جدة', 'متاح', 'ثلاث غرف وصالة، مطبخ راكب، قريبة من الخدمات.', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80']
].map((item, index) => ({ id: index + 1, title: item[0], price: item[1], category: item[2], city: item[3], status: item[4], description: item[5], image: item[6] }))

const saved = new Set()
let selectedCategory = 'الكل'
let currentListing = listings[0]
const defaultAccounts = [
  { username: 'noura', password: '123456', fullName: 'نورة العتيبي', phone: '0501234567', city: 'الرياض' }
]

function getAccounts() {
  const savedAccounts = JSON.parse(localStorage.getItem('saree_accounts') || '[]')
  const merged = [...defaultAccounts]
  savedAccounts.forEach((account) => {
    if (!merged.some((item) => item.username === account.username)) merged.push(account)
  })
  return merged
}

function saveAccount(account) {
  const savedAccounts = JSON.parse(localStorage.getItem('saree_accounts') || '[]')
  localStorage.setItem('saree_accounts', JSON.stringify([...savedAccounts, account]))
  renderSavedAccounts()
}

function loginWithAccount(account) {
  const displayName = account.fullName || account.username
  document.querySelector('#profileName').textContent = `${displayName} ✓`
  document.querySelector('#profileMeta').textContent = `${account.phone || 'رقم غير مضاف'} · ${account.city || 'الرياض'}`
  document.querySelector('#welcomeText').textContent = `مرحبًا ${displayName}، يسعدنا وجودك في سريع.`
  document.querySelector('#login').classList.add('hidden')
  document.querySelector('#signup').classList.add('hidden')
  document.querySelector('#app').classList.remove('hidden')
}

const pageTitle = document.querySelector('#pageTitle')
const titles = { homePage: 'الإعلانات القريبة', addPage: 'إضافة إعلان', detailsPage: 'تفاصيل الإعلان', chatPage: 'المحادثات', profilePage: 'حسابي', savedPage: 'المحفوظات' }

function renderSavedAccounts() {
  const accounts = getAccounts()
  const panel = document.querySelector('#savedAccountsPanel')
  const list = document.querySelector('#savedAccountsList')
  panel.classList.toggle('hidden', accounts.length === 0)
  list.innerHTML = accounts.map((account) => `
    <button type="button" data-account="${account.username}">
      <span>${account.fullName || account.username}</span>
      <small>@${account.username}</small>
    </button>
  `).join('')
  list.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      const account = getAccounts().find((item) => item.username === button.dataset.account)
      if (!account) return
      document.querySelector('#nameInput').value = account.username
      document.querySelector('#loginPassword').value = account.password
      document.querySelector('#loginError').classList.add('hidden')
      document.querySelector('#loginSuccess').textContent = `تم اختيار حساب ${account.fullName || account.username}. اضغط دخول.`
      document.querySelector('#loginSuccess').classList.remove('hidden')
    })
  })
}

document.querySelector('#loginForm').addEventListener('submit', (event) => {
  event.preventDefault()
  const username = document.querySelector('#nameInput').value.trim()
  const password = document.querySelector('#loginPassword').value
  const account = getAccounts().find((item) => item.username === username && item.password === password)
  document.querySelector('#loginError').classList.toggle('hidden', Boolean(account))
  if (!account) return
  loginWithAccount(account)
})

document.querySelector('#nameInput').addEventListener('input', (event) => {
  const username = event.target.value.trim() || 'ضيفنا'
  document.querySelector('#welcomeText').textContent = `مرحبًا ${username}، يسعدنا وجودك في سريع.`
})

document.querySelector('#createAccount').addEventListener('click', () => {
  document.querySelector('#loginError').classList.add('hidden')
  document.querySelector('#loginSuccess').classList.add('hidden')
  document.querySelector('#login').classList.add('hidden')
  document.querySelector('#signup').classList.remove('hidden')
})

document.querySelector('#forgotPassword').addEventListener('click', () => {
  alert('سيتم إرسال رابط استعادة كلمة المرور في النسخة التالية من الـ MVP.')
})

document.querySelectorAll('.password-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const input = document.querySelector(`#${button.dataset.target}`)
    const isHidden = input.type === 'password'
    input.type = isHidden ? 'text' : 'password'
    button.textContent = isHidden ? '🙈' : '👁'
    button.setAttribute('aria-label', isHidden ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور')
  })
})

document.querySelector('#backToLogin').addEventListener('click', () => {
  document.querySelector('#signup').classList.add('hidden')
  document.querySelector('#login').classList.remove('hidden')
})

document.querySelector('#signupForm').addEventListener('submit', (event) => {
  event.preventDefault()
  const fullName = document.querySelector('#signupName').value.trim()
  const username = document.querySelector('#signupUsername').value.trim()
  const phone = document.querySelector('#signupPhone').value.trim()
  const city = document.querySelector('#signupCity').value
  const password = document.querySelector('#signupPassword').value
  const exists = getAccounts().some((account) => account.username === username)
  document.querySelector('#signupError').classList.toggle('hidden', !exists)
  if (exists) return
  const account = { fullName, username, phone, city, password }
  saveAccount(account)
  document.querySelector('#nameInput').value = username
  document.querySelector('#loginPassword').value = ''
  document.querySelector('#loginError').classList.add('hidden')
  document.querySelector('#loginSuccess').classList.remove('hidden')
  document.querySelector('#signup').classList.add('hidden')
  document.querySelector('#login').classList.remove('hidden')
})

document.querySelector('#logout').addEventListener('click', () => {
  document.querySelector('#app').classList.add('hidden')
  document.querySelector('#login').classList.remove('hidden')
})

document.querySelectorAll('.bottom-nav button').forEach((button) => {
  button.addEventListener('click', () => showPage(button.dataset.page))
})

document.querySelector('.quick-add').addEventListener('click', () => showPage('addPage'))

function showPage(id) {
  document.querySelectorAll('.page').forEach((page) => page.classList.remove('active'))
  document.querySelector(`#${id}`).classList.add('active')
  document.querySelectorAll('.bottom-nav button').forEach((button) => button.classList.toggle('active', button.dataset.page === id))
  pageTitle.textContent = titles[id]
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function money(value) {
  return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(value)
}

function renderCategories() {
  const categoryIcons = {
    cars: '<svg viewBox="0 0 24 24"><path d="M4 15h16l-2-5H6l-2 5Z"/><path d="M8 15v2"/><path d="M16 15v2"/></svg>',
    electronics: '<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
    furniture: '<svg viewBox="0 0 24 24"><path d="M5 11V8a3 3 0 0 1 6 0v3"/><path d="M13 11V8a3 3 0 0 1 6 0v3"/><path d="M4 11h16v7H4z"/><path d="M6 18v2"/><path d="M18 18v2"/></svg>',
    games: '<svg viewBox="0 0 24 24"><path d="M6 12h4"/><path d="M8 10v4"/><path d="M15 13h.01"/><path d="M18 11h.01"/><path d="M7 7h10a5 5 0 0 1 4.8 6.4l-1 3.5a2.5 2.5 0 0 1-4.4.8L14 15h-4l-2.4 2.7a2.5 2.5 0 0 1-4.4-.8l-1-3.5A5 5 0 0 1 7 7Z"/></svg>',
    realestate: '<svg viewBox="0 0 24 24"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
    misc: '<svg viewBox="0 0 24 24"><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>',
    motorcycles: '<svg viewBox="0 0 24 24"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M9 17h3l3-6h3"/><path d="m7 12 3 5"/><path d="M14 11h-3"/></svg>',
    fashion: '<svg viewBox="0 0 24 24"><path d="M8 4 4 7l3 4v9h10v-9l3-4-4-3"/><path d="M9 4a3 3 0 0 0 6 0"/></svg>',
    kids: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/><path d="M9 14l3 3 3-3"/></svg>',
    sports: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18"/><path d="M3 12h18"/></svg>',
    books: '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4v15.5"/><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5"/></svg>',
    tools: '<svg viewBox="0 0 24 24"><path d="m14.7 6.3 3-3a4 4 0 0 1-5 5l-7.4 7.4a2 2 0 1 0 3 3l7.4-7.4a4 4 0 0 1 5-5l-3 3"/></svg>',
    home_appliances: '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8"/><circle cx="12" cy="14" r="4"/></svg>',
    beauty: '<svg viewBox="0 0 24 24"><path d="M12 3c4 4 6 7 6 11a6 6 0 0 1-12 0c0-4 2-7 6-11Z"/><path d="M9 15c1.5 1 4.5 1 6 0"/></svg>',
    services: '<svg viewBox="0 0 24 24"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>',
    jobs: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/></svg>',
    tickets: '<svg viewBox="0 0 24 24"><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4Z"/><path d="M13 5v14"/></svg>',
    antiques: '<svg viewBox="0 0 24 24"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10l-1 9a4 4 0 0 1-8 0Z"/><path d="M7 8H4a3 3 0 0 0 3 3"/><path d="M17 8h3a3 3 0 0 1-3 3"/></svg>'
  }
  document.querySelector('#categories').innerHTML = categories.slice(0, 4).map(([id, name]) => `
    <button data-cat="${id}">
      <span class="chip-icon">${categoryIcons[id]}</span>
      <span class="chip-label">${name}</span>
    </button>
  `).join('')
  document.querySelectorAll('#categories button').forEach((button) => {
    button.addEventListener('click', () => {
      selectedCategory = selectedCategory === button.dataset.cat ? 'الكل' : button.dataset.cat
      renderListings()
    })
  })
  renderAllCategories(categoryIcons)
}

function renderAllCategories(categoryIcons) {
  document.querySelector('#allCategories').innerHTML = categories.map(([id, name]) => `
    <button data-cat="${id}">
      <span class="chip-icon">${categoryIcons[id] || categoryIcons.misc}</span>
      <span class="chip-label">${name}</span>
    </button>
  `).join('')
  document.querySelectorAll('#allCategories button').forEach((button) => {
    button.addEventListener('click', () => {
      selectedCategory = selectedCategory === button.dataset.cat ? 'الكل' : button.dataset.cat
      document.querySelector('#categorySheet').classList.add('hidden')
      renderListings()
    })
  })
}

function renderCityOptions() {
  const cityOptions = cities.map((city) => `<option>${city}</option>`).join('')
  document.querySelector('#filterCity').innerHTML = `<option>الكل</option>${cityOptions}`
  document.querySelector('#newCity').innerHTML = cityOptions
  document.querySelector('#signupCity').innerHTML = cityOptions
}

function renderListings() {
  const query = document.querySelector('#searchInput').value.trim()
  const city = document.querySelector('#filterCity').value
  const category = document.querySelector('#filterCategory').value
  const price = document.querySelector('#filterPrice').value
  document.querySelectorAll('#categories button').forEach((button) => button.classList.toggle('active', selectedCategory === button.dataset.cat))
  document.querySelectorAll('#allCategories button').forEach((button) => button.classList.toggle('active', selectedCategory === button.dataset.cat))
  const shown = listings.filter((listing) => {
    const categoryFilter = selectedCategory !== 'الكل' ? selectedCategory : category
    return (!query || listing.title.includes(query) || listing.description.includes(query))
      && (city === 'الكل' || listing.city === city)
      && (categoryFilter === 'الكل' || listing.category === categoryFilter)
      && (price === 'الكل' || listing.price <= Number(price))
  })
  document.querySelector('#count').textContent = `${shown.length} إعلان`
  document.querySelector('#savedCount').textContent = saved.size
  renderSavedPage()
  document.querySelector('#listings').innerHTML = shown.map((listing) => `
    <article class="card">
      <img src="${listing.image}" alt="${listing.title}">
      <div class="card-body">
        <div class="card-top">
          <button class="open" data-id="${listing.id}"><h4>${listing.title}</h4><p class="price">${money(listing.price)}</p></button>
          <button class="save" data-save="${listing.id}">${saved.has(listing.id) ? '✓' : '♡'}</button>
        </div>
        <div class="meta"><span>${listing.city}</span><span>${listing.status}</span></div>
      </div>
    </article>
  `).join('') || '<div class="panel">لا توجد إعلانات مطابقة للفلاتر الحالية.</div>'
  document.querySelectorAll('.open').forEach((button) => button.addEventListener('click', () => openDetails(Number(button.dataset.id))))
  document.querySelectorAll('.save').forEach((button) => button.addEventListener('click', () => {
    const id = Number(button.dataset.save)
    saved.has(id) ? saved.delete(id) : saved.add(id)
    renderListings()
  }))
}

function renderSavedPage() {
  const savedListings = listings.filter((listing) => saved.has(listing.id))
  const count = document.querySelector('#savedPageCount')
  const list = document.querySelector('#savedPageList')
  if (!count || !list) return
  count.textContent = `${savedListings.length} إعلان`
  list.innerHTML = savedListings.map((listing) => `
    <article class="card">
      <img src="${listing.image}" alt="${listing.title}">
      <div class="card-body">
        <div class="card-top">
          <button class="open" data-id="${listing.id}"><p class="price">${money(listing.price)}</p><h4>${listing.title}</h4></button>
          <button class="save" data-save="${listing.id}">✓</button>
        </div>
        <div class="meta"><span>${listing.city}</span><span>${listing.status}</span></div>
      </div>
    </article>
  `).join('') || '<div class="panel">لا توجد إعلانات محفوظة حتى الآن.</div>'
  list.querySelectorAll('.open').forEach((button) => button.addEventListener('click', () => openDetails(Number(button.dataset.id))))
  list.querySelectorAll('.save').forEach((button) => button.addEventListener('click', () => {
    saved.delete(Number(button.dataset.save))
    renderListings()
  }))
}

function openDetails(id) {
  currentListing = listings.find((listing) => listing.id === id)
  document.querySelector('#detailsPage').innerHTML = `
    <button class="icon" onclick="showPage('homePage')">‹</button>
    <img class="details-img" src="${currentListing.image}" alt="${currentListing.title}">
    <h1>${currentListing.title}</h1>
    <p class="price">${money(currentListing.price)}</p>
    <span class="pill">${currentListing.city}</span><span class="pill">${currentListing.status}</span>
    <div class="panel"><strong>الوصف</strong><p>${currentListing.description}</p></div>
    <div class="seller"><div><strong>نورة العتيبي ✓</strong><p>الرياض · بائع موثق</p></div><strong>★ 4.8</strong></div>
    <div class="actions"><button class="primary" onclick="showPage('chatPage')">مراسلة البائع</button><button class="primary" onclick="saved.add(currentListing.id); renderListings()">♡</button></div>
  `
  showPage('detailsPage')
}

document.querySelectorAll('#searchInput,#filterCity,#filterCategory,#filterPrice').forEach((input) => input.addEventListener('input', renderListings))
document.querySelector('#topSearchInput').addEventListener('input', (event) => {
  document.querySelector('#searchInput').value = event.target.value
  renderListings()
})

document.querySelector('#moreCategories').addEventListener('click', () => {
  document.querySelector('#categorySheet').classList.remove('hidden')
})

document.querySelector('#closeCategories').addEventListener('click', () => {
  document.querySelector('#categorySheet').classList.add('hidden')
})

document.querySelector('#addForm').addEventListener('submit', (event) => {
  event.preventDefault()
  const listing = {
    id: Date.now(),
    title: document.querySelector('#newTitle').value,
    price: Number(document.querySelector('#newPrice').value),
    category: document.querySelector('#newCategory').value,
    city: document.querySelector('#newCity').value,
    status: 'جديد',
    description: document.querySelector('#newDesc').value,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'
  }
  listings = [listing, ...listings]
  event.target.reset()
  openDetails(listing.id)
})

document.querySelector('#chatForm').addEventListener('submit', (event) => {
  event.preventDefault()
  const input = document.querySelector('#chatInput')
  if (!input.value.trim()) return
  document.querySelector('.messages').insertAdjacentHTML('beforeend', `<p class="bubble mine">${input.value}<small>الآن</small></p>`)
  input.value = ''
})

renderCityOptions()
renderCategories()
renderSavedAccounts()
renderListings()
