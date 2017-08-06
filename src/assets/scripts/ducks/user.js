import { Difficulty } from 'config';
import createSkinnyReducer from 'lib/createSkinnyReducer';

const { reducer, update } = createSkinnyReducer('user/UPDATE', {
  difficulty: Difficulty.EASY,
  streak: 0,
  bests: {
    [Difficulty.EASY]: 0,
    [Difficulty.NORMAL]: 0,
    [Difficulty.HARD]: 0,
  },
  didGiveUp: false,
  isFirstTime: true,
});
export default reducer;

export { update };

export const incrementStreak = () => (dispatch, getState) => {
  const { user } = getState();
  const streak = user.streak + 1;
  const bests = {
    ...user.bests,
    [user.difficulty]: Math.max(streak, user.bests[user.difficulty]),
  };
  return dispatch(update({ streak, bests }));
};
