import { batchActions } from 'redux-batched-actions';
import { Route } from 'config';
import * as layout from 'ducks/layout';
import * as numbers from 'ducks/numbers';
import * as router from 'ducks/router';
import * as user from 'ducks/user';

const noop = x => x;

export const giveUp = () => batchActions([
  router.push(Route.INTERSTITIAL),
  user.update({ didGiveUp: true }),
]);

export const newGame = () => (dispatch, getState) => {
  const { difficulty } = getState().user;
  return dispatch(batchActions([
    layout.updateBackground()(noop, getState),
    numbers.newGame(difficulty),
    user.update({ didGiveUp: false, streak: 0 }),
    router.push(Route.MAIN_GAME),
  ]));
};

export const newRound = () => (dispatch, getState) => {
  const { difficulty } = getState().user;
  return dispatch(batchActions([
    layout.updateBackground()(noop, getState),
    numbers.newGame(difficulty),
    user.incrementStreak()(noop, getState),
    router.push(Route.MAIN_GAME),
  ]));
};

export const setDifficulty = difficulty => batchActions([
  numbers.newGame(difficulty),
  user.update({ difficulty, streak: 0 }),
]);
