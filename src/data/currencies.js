export const BASE_CURRENCY = 'NPR';
export const DEFAULT_CURRENCY = 'USD';

export const supportedCurrencies = [
  { code: 'USD', label: 'USD - US Dollar' },
  { code: 'GBP', label: 'GBP - British Pound' },
  { code: 'NPR', label: 'NRS - Nepali Rupee' },
  { code: 'INR', label: 'INR - Indian Rupee' },
  { code: 'EUR', label: 'EUR - Euro' },
  { code: 'AUD', label: 'AUD - Australian Dollar' },
  { code: 'CAD', label: 'CAD - Canadian Dollar' },
  { code: 'JPY', label: 'JPY - Japanese Yen' }
];

export const fallbackExchangeRates = {
  NPR: 1,
  USD: 0.0073,
  GBP: 0.0055,
  INR: 0.625,
  EUR: 0.0063,
  AUD: 0.011,
  CAD: 0.01,
  JPY: 1.05
};

const currencySymbols = {
  USD: '$',
  GBP: '£',
  NPR: 'Rs ',
  INR: '₹',
  EUR: '€',
  AUD: 'A$',
  CAD: 'C$',
  JPY: '¥'
};

const zeroDecimalCurrencies = new Set(['NPR', 'INR', 'JPY']);

export function formatConvertedAmount(amountNpr, currencyCode, exchangeRates) {
  const rate = exchangeRates[currencyCode] ?? fallbackExchangeRates[currencyCode] ?? 1;
  const amount = amountNpr * rate;
  const fractionDigits = zeroDecimalCurrencies.has(currencyCode) ? 0 : 2;

  return `${currencySymbols[currencyCode] ?? `${currencyCode} `}${amount.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  })}`;
}
