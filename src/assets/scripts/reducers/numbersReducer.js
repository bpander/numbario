import * as actions from 'actions/numbersActions';
import { times } from 'util/arrays';
import { randomInt } from 'util/numbers';


const initialState = {
  inventory: [],
  stream: [],
  target: null,
};

export default function numbersReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.NEW_GAME: {
      const inventory = getNewNumbers(action.difficulty);
      return {
        ...state,
        inventory,
        target: getTarget(inventory),
      };
    }
  }
  return state;
}

const getNewNumbers = difficulty => {
  const smallSet = [ 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10 ];
  switch (difficulty) {
    case 'easy':
      return [
        10,
        ...times(5, () => smallSet.splice(randomInt(0, smallSet.length - 1), 1)[0]),
      ];
  }
  throw new Error(`Unrecognized difficulty: ${difficulty}.`);
};

const getTarget = (numbers = []) => {
  // TODO: Use rpn stuff
};
