import { batchActions } from 'redux-batched-actions';
import * as numbers from 'ducks/numbers';
import * as user from 'ducks/user';

export const giveUp = () => batchActions([
  user.update({ didGiveUp: true }),
]);

export const newGame = () => (dispatch, getState) => {
  const { difficulty } = getState().user;
  return dispatch(batchActions([
    numbers.newGame(difficulty),
    user.update({ didGiveUp: false, streak: 0 }),
  ]));
};

export const newRound = () => (dispatch, getState) => {
  const { difficulty } = getState().user;
  return dispatch(batchActions([
    numbers.newGame(difficulty),
  ]));
};

export const setDifficulty = difficulty => batchActions([
  numbers.newGame(difficulty),
  user.update({ difficulty, streak: 0 }),
]);
