
const noop = () => {};

export const times = (n = 0, mapFn = noop) => {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(mapFn(i));
  }
  return arr;
};
