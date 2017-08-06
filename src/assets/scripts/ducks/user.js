import { Difficulty } from 'config';
import createSkinnyReducer from 'lib/createSkinnyReducer';

const { reducer } = createSkinnyReducer('user/UPDATE', {
  difficulty: Difficulty.EASY,
  streak: 0,
  bests: {
    [Difficulty.EASY]: 0,
    [Difficulty.NORMAL]: 0,
    [Difficulty.HARD]: 0,
  },
  isFirstTime: true,
});
export default reducer;
