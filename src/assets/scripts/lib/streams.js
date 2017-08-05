import { solve } from 'lib/rpn';
import { times } from 'util/arrays';

const AUGEND_INDEX = 0;
const OPERATOR_INDEX = 1;
const ADDEND_INDEX = 2;
const BIT_DEPTH = 3;

export const evaluateStream = (stream, inventory) => {
  const leaves = [ ...inventory ];
  const numOperations = Math.trunc(stream.length / BIT_DEPTH);

  times(numOperations, i => {
    const start = i * BIT_DEPTH;
    const augend = leaves[stream[start + AUGEND_INDEX]];
    const addend = leaves[stream[start + ADDEND_INDEX]];
    const operator = stream[start + OPERATOR_INDEX];
    leaves.push(solve(augend, addend, operator));
  });

  return leaves;
};
