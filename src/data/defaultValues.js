export const relationships = ['Daughter', 'Son', 'Mom', 'Dad', 'Cousin', 'Friend', 'Uncle', 'Aunt', 'Grandpa', 'Grandma'];
export const BASE_CURRENCY = 'NPR';
export const DEFAULT_CURRENCY = 'USD';

export const supportedCurrencies = [
  { code: 'USD', label: 'USD - US Dollar' },
  { code: 'GBP', label: 'GBP - British Pound' },
  { code: 'EUR', label: 'EUR - Euro' },
  { code: 'AUD', label: 'AUD - Australian Dollar' },
  { code: 'CAD', label: 'CAD - Canadian Dollar' },
  { code: 'JPY', label: 'JPY - Japanese Yen' }
];

// export const fallbackExchangeRates = {
//   USD: 0.0073,
//   GBP: 0.0055,
//   EUR: 0.0063,
//   AUD: 0.011,
//   CAD: 0.01,
//   JPY: 1.05
// };

export const currencySymbols = {
  USD: '$',
  GBP: '£',
  EUR: '€',
  AUD: 'A$',
  CAD: 'C$',
  JPY: '¥'
};

export const zeroDecimalCurrencies = new Set(['JPY']);

export function formatConvertedAmount(amountNpr, currencyCode, exchangeRates) {
  const rate = exchangeRates[currencyCode];

  if (rate == null) {
    return `${currencySymbols[currencyCode] ?? `${currencyCode} `}—`;
  }
  const amount = amountNpr * rate;
  const fractionDigits = zeroDecimalCurrencies.has(currencyCode) ? 0 : 2;

  return `${currencySymbols[currencyCode] ?? `${currencyCode} `}${amount.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  })}`;
}
