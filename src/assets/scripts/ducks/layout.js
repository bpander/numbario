import createSkinnyReducer from 'lib/createSkinnyReducer';

const { reducer } = createSkinnyReducer('layout/UPDATE', {
  viewportWidth: window.innerWidth,
  viewportHeight: window.innerHeight,
});
export default reducer;
