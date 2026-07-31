// src/utils/nameUtils.js

const TITLES = ["mr", "mrs", "ms", "miss", "dr", "prof"];

const capitalize = (word) => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

const clean = (word) => {
  return word.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, "");
};

/**
 * Formats a name for greetings.
 *
 * Examples:
 * John Smith         -> John
 * JOHN SMITH         -> John
 * Dr. JOHN SMITH     -> Dr. John
 * dr john smith      -> Dr. John
 * Mr RITU BAFNA      -> Mr. Ritu
 * ...JOHN...         -> John
 */
export const formatGreetingName = (name) => {
  if (!name?.trim()) return "";

  const parts = name.trim().split(/\s+/);

  const first = clean(parts[0]);

  if (TITLES.includes(first.toLowerCase()) && parts.length > 1) {
    return `${capitalize(first)}. ${capitalize(clean(parts[1]))}`;
  }

  return capitalize(first);
};