import * as actions from 'actions/numbersActions';
import { Difficulty } from 'config';
import { shuffle, times } from 'util/arrays';
import { randomInt } from 'util/numbers';
import { createSolver, getRpnCombinations } from 'util/rpn';

const initialState = {
  inventory: [],
  stream: [],
  target: null,
};

const rpnMasks = getRpnCombinations(6);

export default function numbersReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.NEW_GAME: {
      const solve = createSolver(shuffle(rpnMasks));
      const isValid = getValidator(randomInt(...getTargetRange(action.difficulty)));
      let result = { success: false };
      let inventory;
      while (!result.success) {
        inventory = getNewNumbers(action.difficulty);
        result = solve(inventory, isValid);
      }
      return {
        ...state,
        inventory,
        target: result.solution,
        stream: [],
      };
    }
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
