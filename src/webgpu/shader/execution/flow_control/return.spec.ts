export const description = `
Flow control tests for return statements.
`;

import { makeTestGroup } from '../../../../common/framework/test_group.js';
import { GPUTest } from '../../../gpu_test.js';

import { runFlowControlTest } from './harness.js';

export const g = makeTestGroup(GPUTest);

g.test('return')
  .desc("Test that flow control does not execute after a 'return' statement")
  .fn(t => {
    runFlowControlTest(
      t,
      f => `
  ${f.expect_order(0)}
  return;
  ${f.expect_not_reached()}
`
    );
  });

g.test('return_conditional_true')
  .desc("Test that flow control does not execute after a 'return' statement in a if (true) block")
  .fn(t => {
    runFlowControlTest(
      t,
      f => `
  ${f.expect_order(0)}
  if (${f.value(true)}) {
    return;
  }
  ${f.expect_not_reached()}
`
    );
  });

g.test('return_conditional_false')
  .desc("Test that flow control does not execute after a 'return' statement in a if (false) block")
  .fn(t => {
    runFlowControlTest(
      t,
      f => `
  ${f.expect_order(0)}
  if (${f.value(false)}) {
    return;
  }
  ${f.expect_order(1)}
`
    );
  });
