export const nameRegex = /^\p{L}+(?:[ '\u2019-]\p{L}+)*$/u;

export const isValidName = (name) => {
  return nameRegex.test(name.trim());
};