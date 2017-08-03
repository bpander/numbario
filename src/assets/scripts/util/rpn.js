/* Utility functions for dealing with Reverse Polish Notation (or RPN) */

const OPERAND = '0';
const OPERATOR = '1';
const operators = [ '+', '-', '*', '/' ];

const rpnCombinations = length => {
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

const solveRpn = (sequence = [], isSuccessful = n => {}) => {
  const stack = [];
  const steps = [];
  let success = false;
  for (let i = 0; i < sequence.length; i++) {
    const token = sequence[i];
    if (typeof token === 'number') {
      stack.push(token);
      continue;
    }
    const n1 = stack.pop();
    const n2 = stack.pop();
    const result = solve(n1, n2, token);
    steps.push([ n1, token, n2 ]);
    if (isSuccessful(result)) {
      success = true;
      break;
    }
    stack.push(result);
  }
  return { success, steps };
};
