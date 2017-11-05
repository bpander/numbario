import { createSelector } from 'reselect';
import { Difficulty } from 'config';
import { chunk, last, times } from 'util/arrays';
import { isBetween, isWholeNumber, randomInt } from 'util/numbers';
import { configureCecil } from 'lib/cecil';
import createSkinnyReducer from 'lib/createSkinnyReducer';
import { solve } from 'lib/rpn';
import * as streams from 'lib/streams';


const { reducer, update } = createSkinnyReducer('numbers/UPDATE', {
  answer: [],
  inventory: [],
  stream: [],
  target: null,
  shouldSolveLastStep: false,
});
export default reducer;

// Selectors
export const getLeaves = createSelector([
  state => state.stream,
  state => state.inventory,
  state => state.shouldSolveLastStep,
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
});

export const isOperatorIndex = createSelector([
  state => state.stream,
], stream => streams.getLocalIndex(stream, stream.length) === streams.OPERATOR_INDEX);

export const getOpenStream = createSelector([
  state => state.stream,
  state => state.shouldSolveLastStep,
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

const getValidator = difficulty => result => {
  const { solution, steps } = result;
  const hasNonWholeNumber = steps.some(step => !isWholeNumber(solve(...step)));
  if (hasNonWholeNumber) {
    return false;
  }
  switch (difficulty) {
    case Difficulty.EASY: return isBetween(solution, 11, 99);
    case Difficulty.NORMAL: return isBetween(solution, 101, 499);
    case Difficulty.HARD: return isBetween(solution, 101, 999);
  }
};

// Action Creators
export const newGame = difficulty => {
  const result = cecil({
    numbersGenerator: getNumbersGenerator(difficulty),
    validator: getValidator(difficulty),
  });

  return update({
    inventory:  result.numbers,
    answer:     result.steps,
    target:     result.solution,
    stream:     [],
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
  const isStreamSolvable = stream.length > 0 && stream.length % streams.BIT_DEPTH === 0;
  if (isStreamSolvable && !numbers.shouldSolveLastStep) {
    setTimeout(() => {
      dispatch(update({ shouldSolveLastStep: true }));
    }, 400);
  }
  return dispatch(update({ stream, shouldSolveLastStep: false }));
};
