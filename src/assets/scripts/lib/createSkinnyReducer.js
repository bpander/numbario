
export default function createSkinnyReducer(updateAction = '', initialState = {}) {
  const reducer = (state = initialState, { type, payload } = {}) => {
    if (type !== updateAction) {
      return state;
    }
    const sanitizedUpdates = {};
    Object.keys(payload)
      .filter(key => state.hasOwnProperty(key))
      .forEach(key => { sanitizedUpdates[key] = payload[key]; });

    return { ...state, ...sanitizedUpdates };
  };
  const update = updates => ({ type: updateAction, payload: updates });
  return { reducer, update };
}
