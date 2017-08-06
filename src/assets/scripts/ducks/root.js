import { batchActions } from 'redux-batched-actions';
import * as numbers from 'ducks/numbers';
import * as user from 'ducks/user';

export const setDifficulty = difficulty => batchActions([
  numbers.newGame(difficulty),
  user.update({ difficulty }),
]);
