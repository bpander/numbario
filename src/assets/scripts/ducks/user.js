import { Difficulty } from 'config';
import createSkinnyReducer from 'lib/createSkinnyReducer';

const { reducer } = createSkinnyReducer('user/UPDATE', {
  difficulty: Difficulty.EASY,
  streak: 0,
  bests: [],
  isFirstTime: true,
});
export default reducer;
