/* Utility functions for dealing with Reverse Polish Notation (or RPN) */

export const OPERAND = '0';
export const OPERATOR = '1';
export const operators = [ '+', '-', '*', '/' ];

export const AUGEND_INDEX = 0;
export const ADDEND_INDEX = 1;
export const OPERATOR_INDEX = 2;

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

export const solve = (n1, n2, operator) => {
  switch (operator) {
    case '+': return n1 + n2;
    case '-': return n1 - n2;
    case '*': return n1 * n2;
    case '/': return n1 / n2;
  }
  throw new Error(`Unrecognized operator: ${operator}.`);
};

export const solveRpn = (sequence = []) => {
  const stack = [];
  const steps = [];
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

    steps.push([ n1, n2, token ]);
    stack.push(solution);
  }
  return { solution, steps };
};
