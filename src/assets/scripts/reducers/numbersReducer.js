import { createSelector } from 'reselect';
import * as actions from 'actions/numbersActions';
import { Difficulty } from 'config';
import { shuffle, times } from 'util/arrays';
import { randomInt } from 'util/numbers';
import * as streams from 'lib/streams';
import { createSolver, getRpnCombinations } from 'lib/rpn';

const initialState = {
  inventory: [],
  stream: [],
  target: null,
};

const rpnMasks = getRpnCombinations(6);

export default function numbersReducer(state = initialState, { type, payload } = {}) {
  switch (type) {
    case actions.NEW_GAME: {
      const solve = createSolver(shuffle(rpnMasks));
      const isValid = getValidator(randomInt(...getTargetRange(payload.difficulty)));
      let result = { success: false };
      let inventory;
      while (!result.success) {
        inventory = getNewNumbers(payload.difficulty);
        result = solve(inventory, isValid);
      }
      return {
        ...state,
        inventory,
        target: result.solution,
        stream: [],
      };
    }

    case actions.STREAM_PUSH:
      return { ...state, stream: state.stream.concat(payload.token) };
  }
  return state;
}

const getNewNumbers = difficulty => {
  const smallSet = [ 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10 ];
  switch (difficulty) {
    case Difficulty.EASY:
      return [
        10,
        ...times(5, () => smallSet.splice(randomInt(0, smallSet.length - 1), 1)[0]),
      ];
  }
  throw new Error(`Unrecognized difficulty: ${difficulty}.`);
};

const getTargetRange = difficulty => {
  switch (difficulty) {
    case Difficulty.EASY: return [ 11, 100 ];
  }
  throw new Error(`Unrecognized difficulty: ${difficulty}.`);
};

const getValidator = target => n => {
  const isWholeNumber = n === Math.trunc(n);
  if (!isWholeNumber) {
    return false;
  }
  if (target === n) {
    return true;
  }
};

export const getLeaves = createSelector([
  state => state.stream,
  state => state.inventory,
], (
  stream,
  inventory,
) => streams.evaluateStream(stream, inventory).filter(leaf => !leaf.isUsed));

export const isOperatorIndex = createSelector([
  state => state.stream,
], (
  stream,
) => streams.getLocalIndex(stream, stream.length) === streams.OPERATOR_INDEX);

export const getOpenStream = createSelector([
  state => state.stream,
], (
  stream,
) => {
  const numOperations = Math.trunc(stream.length / streams.BIT_DEPTH);
  const lastClosedIndex = streams.BIT_DEPTH * numOperations;
  return stream.slice(lastClosedIndex);
});
