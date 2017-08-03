
export const randomInt = (min = 0, max = 100) => {
  const delta = max - min;
  return Math.round(Math.random() * delta) + min;
};
