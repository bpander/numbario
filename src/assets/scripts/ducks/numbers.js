import { createSelector } from 'reselect';
import { Difficulty } from 'config';
import { chunk, last, times } from 'util/arrays';
import { isBetween, isWholeNumber, randomInt } from 'util/numbers';
import { configureCecil } from 'lib/cecil';
import createSkinnyReducer from 'lib/createSkinnyReducer';
import * as rpn from 'lib/rpn';
import * as streams from 'lib/streams';
import * as user from 'ducks/user';

const getInitialState = () => ({
  answer: [],
  inventory: [],
  stream: [],
  target: null,
  shouldSolveLastStep: false,
});

const { reducer, update } = createSkinnyReducer('numbers/UPDATE', {
  [Difficulty.EASY]: getInitialState(),
  [Difficulty.NORMAL]: getInitialState(),
  [Difficulty.HARD]: getInitialState(),
});
export default reducer;

// Selectors
export const getLeaves = createSelector(d => d, d => createSelector([
  state => state[d].stream,
  state => state[d].inventory,
  state => state[d].shouldSolveLastStep,
], (
  stream,
  inventory,
  shouldSolveLastStep,
) => {
  let streamToSolve = stream;
  if (!shouldSolveLastStep) {
    const { BIT_DEPTH } = streams;
    const lastSolvableIndex = Math.ceil((stream.length - BIT_DEPTH) / BIT_DEPTH) * BIT_DEPTH;
    streamToSolve = stream.slice(0, lastSolvableIndex);
  }
  return streams.evaluateStream(streamToSolve, inventory);
}));

export const isOperatorIndex = createSelector(d => d, d => createSelector([
  state => state[d].stream,
], stream => streams.getLocalIndex(stream, stream.length) === streams.OPERATOR_INDEX));

export const getOpenStream = createSelector(d => d, d => createSelector([
  state => state[d].stream,
  state => state[d].shouldSolveLastStep,
], (
  stream,
  shouldSolveLastStep,
) => {
  const numOperations = Math.trunc(stream.length / streams.BIT_DEPTH);
  const lastClosedIndex = streams.BIT_DEPTH * numOperations;
  let openStream = stream.slice(lastClosedIndex);
  if (!openStream.length && !shouldSolveLastStep) {
    openStream = stream.slice(streams.BIT_DEPTH * -1);
  }
  return openStream;
}));

export const getSteps = createSelector(d => d, d => createSelector([
  state => state[d].stream,
  getLeaves(d),
], (
  stream,
  leaves,
) => {
  return chunk(stream, streams.BIT_DEPTH).map(ch => [
    (leaves[ch[streams.AUGEND_INDEX]] || {}).value,
    ch[streams.OPERATOR_INDEX],
    (leaves[ch[streams.ADDEND_INDEX]] || {}).value,
  ]);
}));

export const wasSuccessful = createSelector(d => d, d => createSelector([
  state => state[d].target,
  getLeaves(d),
], (
  target,
  leaves,
) => {
  return leaves.length > 0 && last(leaves).value === target;
}));

// Utility
const cecil = configureCecil(6);

const getNumbersGenerator = difficulty => {
  const smallSet = [ 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10 ];
  switch (difficulty) {
    case Difficulty.EASY:
      return () => [
        10,
        ...times(5, () => smallSet.splice(randomInt(0, smallSet.length - 1), 1)[0]),
      ];

    case Difficulty.NORMAL:
      return () => [
        50,
        ...times(5, () => smallSet.splice(randomInt(0, smallSet.length - 1), 1)[0]),
      ];

    case Difficulty.HARD: {
      const largeSet = [ 25, 50, 75, 100 ];
      return () => [
        ...times(2, () => largeSet.splice(randomInt(0, largeSet.length - 1), 1)[0]),
        ...times(4, () => smallSet.splice(randomInt(0, smallSet.length - 1), 1)[0]),
      ];
    }
  }
  throw new Error(`Unrecognized difficulty: ${difficulty}.`);
};

const isNoOpStep = step => {
  if (step[rpn.OPERATOR_INDEX] === '/' && step[rpn.ADDEND_INDEX] === 1) {
    return true;
  }
  if (step[rpn.OPERATOR_INDEX] === '*' && step.includes(1)) {
    return true;
  }
  return step[rpn.ADDEND_INDEX] === rpn.solve(...step);
};

const isValidTarget = (solution, difficulty) => {
  switch (difficulty) {
    case Difficulty.EASY: return isBetween(solution, 11, 99);
    case Difficulty.NORMAL: return isBetween(solution, 101, 499);
    case Difficulty.HARD: return isBetween(solution, 101, 999);
  }
};

const getValidator = difficulty => result => {
  const { solution, steps } = result;
  const hasNonWholeNumber = steps.some(step => !isWholeNumber(rpn.solve(...step)));
  if (hasNonWholeNumber) {
    return false;
  }

  if (steps.some(isNoOpStep)) {
    return false;
  }

  const hasNegative = steps.some(step => rpn.solve(...step) <= 0);
  if (hasNegative) {
    return false;
  }

  return isValidTarget(solution, difficulty);
};

// Action Creators
export const newGame = difficulty => {
  const result = cecil({
    numbersGenerator: getNumbersGenerator(difficulty),
    validator: getValidator(difficulty),
  });

  return update({
    [difficulty]: {
      ...getInitialState(),
      inventory:  result.numbers,
      answer:     result.steps,
      target:     result.solution,
    },
  });
};

export const streamClear = difficulty => (dispatch, getState) => {
  const { numbers } = getState();
  return dispatch(update({ [difficulty]: { ...numbers[difficulty], stream: [] } }));
};

export const streamPop = difficulty => (dispatch, getState) => {
  const { numbers } = getState();
  const stream = numbers[difficulty].stream.slice(0, -1);
  return dispatch(update({
    [difficulty]: {
      ...numbers[difficulty],
      stream,
      shouldSolveLastStep: true,
    },
  }));
};

export const streamPush = difficulty => token => (dispatch, getState) => {
  const { numbers } = getState();
  const stream = [ ...numbers[difficulty].stream, token ];
  const isStreamSolvable = stream.length > 0 && stream.length % streams.BIT_DEPTH === 0;
  if (isStreamSolvable) {
    setTimeout(() => {
      dispatch(update({
        [difficulty]: {
          ...getState().numbers[difficulty],
          shouldSolveLastStep: true,
        },
      }));
      const _wasSuccessful = wasSuccessful(difficulty)(getState().numbers);
      if (_wasSuccessful) {
        dispatch(user.incrementStreak());
      }
    }, 400);
  }
  return dispatch(update({
    [difficulty]: {
      ...numbers[difficulty],
      stream,
      shouldSolveLastStep: false,
    },
  }));
};
