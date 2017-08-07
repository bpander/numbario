import * as rpn from 'lib/rpn';
import { pickRandom, shuffle } from 'util/arrays';

export const configureCecil = inventorySize => {
  const rpnMasks = rpn.getRpnCombinations(inventorySize);
  return ({ numbersGenerator, validator }) => {
    const maxIterations = 1e4;
    const numbers = numbersGenerator();
    const numbersShuffled = shuffle(numbers);
    let result;
    let i = 0;
    do {
      if (i++ >= maxIterations) {
        throw new Error('Max iterations exceeded.');
      }
      const numbersLeft = [ ...numbersShuffled ];
      const mask = pickRandom(rpnMasks);
      const sequence = mask.split('').map(token => {
        if (token === rpn.OPERATOR) {
          return pickRandom(rpn.operators);
        }
        return numbersLeft.shift();
      });
      result = rpn.solveRpn(sequence);
    } while (!validator(result));

    return { ...result, numbers };
  };
};
