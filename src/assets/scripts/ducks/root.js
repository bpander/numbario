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
const gutter = 10;
const tileWidth = 40; // TODO: Make dynamic
const getInitialWidth = createSelector([
  state => state.numbers.inventory,
], (
  inventory,
) => {
  return tileWidth * inventory.length + gutter * (inventory.length - 1);
});

export const getTilePositions = createSelector([
  state => numbers.getLeaves(state.numbers),
  state => numbers.getOpenStream(state.numbers),
  state => state.numbers.stream,
  state => state.layout.viewportWidth,
  getInitialWidth,
], (
  leaves,
  openStream,
  stream,
  viewportWidth,
  initialWidth,
) => {
  const usableInventory = leaves.filter(l => !l.isUsed && !openStream.includes(l.index));
  const step = (!openStream.length) ? [] : openStream;

  let leftEdge = (viewportWidth - initialWidth) / 2;
  let lastRightEdge = leftEdge;
  const inventoryPositions = usableInventory.map(leaf => {
    const x = lastRightEdge;
    const y = 500;
    lastRightEdge = lastRightEdge + tileWidth + gutter;
    return { type: 'operand', data: leaf, x, y };
  });
  const stepWidth = step.length * tileWidth + (step.length - 1) * gutter;
  leftEdge = (viewportWidth - stepWidth) / 2;
  lastRightEdge = leftEdge;
  const stepPositions = step.map(token => {
    const x = lastRightEdge;
    const y = 300;
    lastRightEdge = lastRightEdge + tileWidth + gutter;
    if (typeof token === 'string') {
      return { type: 'operator', data: { value: token }, x, y };
    }
    return { type: 'operand', data: leaves[token], x, y };
  });
  return [
    ...inventoryPositions,
    ...stepPositions,
  ];
});
