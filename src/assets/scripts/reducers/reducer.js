
const initialState = {
  didFoo: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'foo':
      return { ...state, didFoo: true };
  }
  return state;
};
