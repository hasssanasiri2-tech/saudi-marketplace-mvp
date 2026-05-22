export function formatPrice(price) {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0
  }).format(price)
}

export function getRelativeDate(date) {
  const days = Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 86400000))
  return `قبل ${days} ${days === 1 ? 'يوم' : 'أيام'}`
}
