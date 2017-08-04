
const noop = () => {};

export const deleteAt = (array = [], index, quantity = 1) => {
  const copy = [ ...array ];
  copy.splice(index, quantity);
  return copy;
};

export const shuffle = array => {
  const copy = [ ...array ];
  return copy.sort(() => Math.random() - 0.5);
};

export const times = (n = 0, mapFn = noop) => {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(mapFn(i));
  }
  return arr;
};
