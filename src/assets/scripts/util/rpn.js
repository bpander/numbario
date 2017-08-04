import { deleteAt } from 'util/arrays';

/* Utility functions for dealing with Reverse Polish Notation (or RPN) */

const OPERAND = '0';
const OPERATOR = '1';
const operators = [ '+', '-', '*', '/' ];

export const getRpnCombinations = length => {
  const combos = [];
  const recurse = (n, operandQueue = n, operatorQueue = -1, combo = '') => {
    if (operandQueue <= 0 && operatorQueue <= 0) {
      combos.push(combo);
      return;
    }
    if (operandQueue > 0) {
      recurse(n - 1, operandQueue - 1, operatorQueue + 1, combo + OPERAND);
    }
    if (operatorQueue > 0) {
      recurse(n - 1, operandQueue, operatorQueue - 1, combo + OPERATOR);
    }
  };
  recurse(length);
  return combos;
};

const solve = (n1, n2, operator) => {
  switch (operator) {
    case '+': return n1 + n2;
    case '-': return n1 - n2;
    case '*': return n1 * n2;
    case '/': return n1 / n2;
  }
  throw new Error(`Unrecognized operator: ${operator}.`);
};

const solveRpn = (sequence = [], isSuccessful = () => {}) => {
  const stack = [];
  const steps = [];
  let success;
  let solution;
  for (let i = 0; i < sequence.length; i++) {
    const token = sequence[i];
    if (typeof token === 'number') {
      stack.push(token);
      continue;
    }
    const n1 = stack.pop();
    const n2 = stack.pop();
    solution = solve(n1, n2, token);
    success = isSuccessful(solution);

    const isConclusive = success === true || success === false;
    steps.push([ n1, token, n2 ]);
    if (isConclusive) {
      break;
    }
    stack.push(solution);
  }
  return { solution, success, steps };
};

const findSolution = (numbers, isSuccessful, rpnMasks) => {
  let result;

  const recurse = (numbersSlice, mask, stack = []) => {
    if (!mask.length) {
      result = solveRpn(stack, isSuccessful);
      return result.success;
    }
    const runningNumbers = [ ...numbersSlice ];
    for (let i = 0; i < mask.length; i++) {
      const token = mask[i];
      if (token === OPERAND) {
        stack.push(runningNumbers.shift());
      } else if (token === OPERATOR) {
        return operators.some(operator => {
          return recurse(runningNumbers, mask.slice(i + 1), stack.concat(operator));
        });
      }
    }
  };

  rpnMasks.some(mask => recurse(numbers, mask));
  return result;
};

export const createSolver = rpnMasks => (list, isSuccessful) => {
  let result;
  const listSorted = [ ...list ].sort((a, b) => a - b);
  const recurse = (listSlice, n, combo = []) => {
    if (!listSlice.length) {
      result = findSolution(combo, isSuccessful, rpnMasks);
      return result.success;
    }
    return listSlice.some((currentDigit, i) => {
      const newList = deleteAt(listSlice, i);
      return recurse(newList, currentDigit, combo.concat(currentDigit));
    });
  };
  recurse(listSorted);
  return result;
};

