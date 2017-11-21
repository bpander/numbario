import createSkinnyReducer from 'lib/createSkinnyReducer';

const { reducer, update } = createSkinnyReducer('layout/UPDATE', {
  viewportWidth: window.innerWidth,
  viewportHeight: window.innerHeight,
});
export default reducer;

export const actions = {
  setSize: (viewportWidth, viewportHeight) => {
    return update({ viewportWidth, viewportHeight });
  },
};
