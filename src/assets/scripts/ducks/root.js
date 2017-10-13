import { batchActions } from 'redux-batched-actions';
import { createSelector } from 'reselect';
import * as numbers from 'ducks/numbers';
import * as user from 'ducks/user';

const noop = x => x;

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
    user.incrementStreak()(noop, getState),
  ]));
};

export const setDifficulty = difficulty => batchActions([
  numbers.newGame(difficulty),
  user.update({ difficulty, streak: 0 }),
]);

// Selectors
export const getTilePositions = createSelector([
  state => numbers.getLeaves(state.numbers),
  state => numbers.getOpenStream(state.numbers),
  state => state.numbers.stream,
  state => state.layout.viewportWidth,
], (
  leaves,
  openStream,
  stream,
  viewportWidth,
) => {
  const usableInventory = leaves.filter(l => !l.isUsed && !openStream.includes(l.index));
  return [
    ...usableInventory.map(leaf => {
      const x = 0;
      const y = 0;
      return { type: 'operand', data: leaf, x, y };
    }),
    ...openStream.map(token => {
      const x = 0;
      const y = 0;
      if (typeof token === 'string') {
        return { type: 'operator', data: token, x, y };
      }
      return { type: 'operand', data: leaves[token], x, y };
    }),
  ];
});
