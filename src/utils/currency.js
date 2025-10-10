// Currency formatting utilities
const currencySymbols = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  CAD: 'C$',
  JPY: '¥'
}

/**
 * Format amount with currency symbol and locale formatting
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'INR')
 * @param {string} locale - Locale for formatting (default: 'en-IN')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'INR', locale = 'en-IN') {
  const symbol = currencySymbols[currency] || currencySymbols.INR
  
  if (currency === 'INR' && locale === 'en-IN') {
    // Special formatting for Indian Rupees
    return `${symbol}${amount.toLocaleString('en-IN')}`
  }
  
  // Use Intl.NumberFormat for other currencies
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format amount for tooltips and charts (no symbol, just number)
 * @param {number} amount - The amount to format
 * @param {string} locale - Locale for formatting (default: 'en-IN')
 * @returns {string} Formatted number string
 */
export function formatAmount(amount, locale = 'en-IN') {
  return amount.toLocaleString(locale)
}

/**
 * Get currency symbol for a given currency code
 * @param {string} currency - Currency code (default: 'INR')
 * @returns {string} Currency symbol
 */
export function getCurrencySymbol(currency = 'INR') {
  return currencySymbols[currency] || currencySymbols.INR
}

/**
 * Format currency for display with symbol prefix
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'INR')
 * @returns {string} Formatted currency string with symbol
 */
export function formatCurrencyWithSymbol(amount, currency = 'INR') {
  const symbol = getCurrencySymbol(currency)
  return `${symbol}${amount.toLocaleString('en-IN')}`
}
