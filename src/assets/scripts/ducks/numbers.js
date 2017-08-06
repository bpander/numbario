import { createSelector } from 'reselect';
import { Difficulty } from 'config';
import { chunk, last, shuffle, times } from 'util/arrays';
import { isWholeNumber, randomInt } from 'util/numbers';
import createSkinnyReducer from 'lib/createSkinnyReducer';
import { createSolver, getRpnCombinations } from 'lib/rpn';
import * as streams from 'lib/streams';


const { reducer, update } = createSkinnyReducer('numbers/UPDATE', {
  answer: [],
  inventory: [],
  stream: [],
  target: null,
});
export default reducer;

// Selectors
export const getLeaves = createSelector([
  state => state.stream,
  state => state.inventory,
], (
  stream,
  inventory,
) => streams.evaluateStream(stream, inventory));

export const isOperatorIndex = createSelector([
  state => state.stream,
], stream => streams.getLocalIndex(stream, stream.length) === streams.OPERATOR_INDEX);

export const getOpenStream = createSelector([
  state => state.stream,
], stream => {
  const numOperations = Math.trunc(stream.length / streams.BIT_DEPTH);
  const lastClosedIndex = streams.BIT_DEPTH * numOperations;
  return stream.slice(lastClosedIndex);
});

export const getSteps = createSelector([
  state => state.stream,
  getLeaves,
], (
  stream,
  leaves,
) => {
  return chunk(stream, streams.BIT_DEPTH).map(ch => [
    (leaves[ch[streams.AUGEND_INDEX]] || {}).value,
    ch[streams.OPERATOR_INDEX],
    (leaves[ch[streams.ADDEND_INDEX]] || {}).value,
  ]);
});

// Utility
const rpnMasks = getRpnCombinations(6);

const getNewNumbers = difficulty => {
  const smallSet = [ 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10 ];
  switch (difficulty) {
    case Difficulty.EASY:
      return [
        10,
        ...times(5, () => smallSet.splice(randomInt(0, smallSet.length - 1), 1)[0]),
      ];

    case Difficulty.NORMAL:
      return [
        50,
        ...times(5, () => smallSet.splice(randomInt(0, smallSet.length - 1), 1)[0]),
      ];

    case Difficulty.HARD: {
      const largeSet = [ 25, 50, 75, 100 ];
      return [
        ...times(2, () => largeSet.splice(randomInt(0, largeSet.length - 1), 1)[0]),
        ...times(4, () => smallSet.splice(randomInt(0, smallSet.length - 1), 1)[0]),
      ];
    }
  }
  throw new Error(`Unrecognized difficulty: ${difficulty}.`);
};

const getTargetRange = difficulty => {
  switch (difficulty) {
    case Difficulty.EASY:   return [ 11,   99 ];
    case Difficulty.NORMAL: return [ 101, 499 ];
    case Difficulty.HARD:   return [ 101, 999 ];
  }
  throw new Error(`Unrecognized difficulty: ${difficulty}.`);
};

const getValidator = target => n => {
  if (!isWholeNumber(n)) {
    return false;
  }
  if (target === n) {
    return true;
  }
};

// Action Creators
export const newGame = difficulty => {
  const solve = createSolver(shuffle(rpnMasks));
  const isValid = getValidator(randomInt(...getTargetRange(difficulty)));
  let result = { success: false };
  let inventory;
  while (!result.success) {
    inventory = getNewNumbers(difficulty);
    result = solve(inventory, isValid);
  }
  return update({
    inventory,
    answer: result.steps,
    target: result.solution,
    stream: [],
  });
};

export const streamClear = () => update({ stream: [] });

export const streamPop = () => (dispatch, getState) => {
  const { numbers } = getState();
  const stream = numbers.stream.slice(0, -1);
  return dispatch(update({ stream }));
};

export const streamPush = token => (dispatch, getState) => {
  const { numbers } = getState();
  const stream = [ ...numbers.stream, token ];
  const leaves = getLeaves({ ...numbers, stream });
  const isValidStream = isWholeNumber(last(leaves).value);
  if (!isValidStream) {
    // TODO: Show not-whole-number error
    return;
  }
  return dispatch(update({ stream }));
};
