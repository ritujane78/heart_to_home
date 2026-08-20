export const formatMoney = (amount, currency, exchangeRate = 1) => {
  const convertedAmount = amount * exchangeRate;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(convertedAmount);
};