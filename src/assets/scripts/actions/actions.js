
export const foo = () => dispatch => {
  setTimeout(() => dispatch({ type: 'foo', payload: 'bar' }), 500);
};
