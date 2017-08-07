
export const isBetween = (n, min, max) => n >= min && n <= max;

export const isWholeNumber = n => n === Math.trunc(n);

export const randomInt = (min = 0, max = 100) => {
  const delta = max - min;
  return Math.round(Math.random() * delta) + min;
};
