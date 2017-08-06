
const noop = () => {};

export const chunk = (arr = [], size = 1) => {
  return times(Math.ceil(arr.length / size), i => {
    const start = i * size;
    return arr.slice(start, start + size);
  });
};

export const deleteAt = (arr = [], index, quantity = 1) => {
  const copy = [ ...arr ];
  copy.splice(index, quantity);
  return copy;
};

export const last = (arr = []) => arr[arr.length - 1];

export const shuffle = arr => {
  const copy = [ ...arr ];
  return copy.sort(() => Math.random() - 0.5);
};

export const times = (n = 0, mapFn = noop) => {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(mapFn(i));
  }
  return arr;
};
