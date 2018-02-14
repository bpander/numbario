import ReactGA from 'react-ga';
import { Difficulty } from 'config';
import createSkinnyReducer from 'lib/createSkinnyReducer';

const { reducer, update } = createSkinnyReducer('user/UPDATE', {
  difficulty: Difficulty.EASY,
  streak: {
    [Difficulty.EASY]: 0,
    [Difficulty.NORMAL]: 0,
    [Difficulty.HARD]: 0,
  },
  bests: {
    [Difficulty.EASY]: 0,
    [Difficulty.NORMAL]: 0,
    [Difficulty.HARD]: 0,
  },
  didGiveUp: false,
  isGivingUp: false,
  isFirstTime: true,
});
export default reducer;

export { update };

export const incrementStreak = () => (dispatch, getState) => {
  const { user } = getState();
  const streak = {
    ...user.streak,
    [user.difficulty]: user.streak[user.difficulty] + 1,
  };
  const bests = {
    ...user.bests,
    [user.difficulty]: Math.max(streak[user.difficulty], user.bests[user.difficulty]),
  };
  return dispatch(update({ streak, bests }));
};

export const confirmGiveUp = () => (dispatch, getState) => {
  const { user } = getState();
  ReactGA.event({
    category: 'Play',
    action: 'Gave up',
    label: user.difficulty,
  });
  dispatch(update({ didGiveUp: true, isGivingUp: false }));
};
