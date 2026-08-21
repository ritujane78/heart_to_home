export const formatMoney = (amount, currency, exchangeRate = 1) => {
  const convertedAmount = amount * exchangeRate;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(convertedAmount);
};
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