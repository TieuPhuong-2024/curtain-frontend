const vnd = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function formatVnd(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 'Liên hệ';
  return vnd.format(number);
}

export function formatNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '0';
  return new Intl.NumberFormat('vi-VN').format(number);
}

// Giá trong DB có thể là number hoặc object { type: fixed|range|discount|contact }
export function formatPrice(price) {
  if (price == null || price === '') return 'Liên hệ';
  if (typeof price === 'number' || typeof price === 'string') return formatVnd(price);
  if (typeof price !== 'object') return 'Liên hệ';

  switch (price.type) {
    case 'range':
      if (price.min == null && price.max == null) return 'Liên hệ';
      return `${price.min != null ? formatVnd(price.min) : '…'} – ${price.max != null ? formatVnd(price.max) : '…'}`;
    case 'discount':
      return price.new != null ? formatVnd(price.new) : 'Liên hệ';
    case 'fixed':
      return price.value != null ? formatVnd(price.value) : 'Liên hệ';
    case 'contact':
      return 'Liên hệ';
    default:
      return price.value != null ? formatVnd(price.value) : 'Liên hệ';
  }
}

export const priceTypeLabels = {
  fixed: 'Giá cố định',
  range: 'Khoảng giá',
  discount: 'Giá đã giảm',
  contact: 'Liên hệ',
};

export function formatDate(value, withTime = false) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date);
}

export function getInitial(email) {
  return email?.charAt(0)?.toUpperCase() || 'Q';
}
