import createSkinnyReducer from 'lib/createSkinnyReducer';

const backgrounds = [
  'linear-gradient(135deg, #FBB03B, #C1555F)',
  'linear-gradient(135deg, red, blue)',
];

const { reducer, update } = createSkinnyReducer('layout/UPDATE', {
  viewportWidth: window.innerWidth,
  viewportHeight: window.innerHeight,
  background: backgrounds[0],
});
export default reducer;

export const updateBackground = () => (dispatch, getState) => {
  const { layout } = getState();
  const background = (layout.background === backgrounds[0])
    ? backgrounds[1]
    : backgrounds[0];
  return update({ background });
};
