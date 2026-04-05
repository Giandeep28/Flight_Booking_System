/**
 * Format a monetary amount with correct currency (Amadeus/Duffel may return USD, EUR, etc.).
 */
export function formatMoney(amount, currencyCode = 'INR', locale = undefined) {
  const n = typeof amount === 'number' ? amount : parseFloat(amount);
  if (Number.isNaN(n)) return '—';
  const code = (currencyCode || 'INR').toString().toUpperCase();
  try {
    return new Intl.NumberFormat(locale || 'en-IN', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${code} ${n.toFixed(0)}`;
  }
}
