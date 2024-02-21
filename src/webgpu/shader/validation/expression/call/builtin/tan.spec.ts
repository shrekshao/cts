const builtin = 'tan';
export const description = `
Validation tests for the ${builtin}() builtin.
`;

import { makeTestGroup } from '../../../../../../common/framework/test_group.js';
import { keysOf, objectsToRecord } from '../../../../../../common/util/data_tables.js';
import {
  TypeF16,
  TypeF32,
  elementType,
  kAllFloatScalarsAndVectors,
  kAllConcreteIntegerScalarsAndVectors,
  kAllAbstractIntegerScalarAndVectors,
  TypeAbstractFloat,
} from '../../../../../util/conversion.js';
import { fpTraitsFor } from '../../../../../util/floating_point.js';
import { ShaderValidationTest } from '../../../shader_validation_test.js';

import {
  fullRangeForType,
  kConstantAndOverrideStages,
  minusThreePiToThreePiRangeForType,
  stageSupportsType,
  unique,
  validateConstOrOverrideBuiltinEval,
} from './const_override_validation.js';

export const g = makeTestGroup(ShaderValidationTest);

const kValuesTypes = objectsToRecord([
  ...kAllAbstractIntegerScalarAndVectors,
  ...kAllFloatScalarsAndVectors,
]);

g.test('values')
  .desc(
    `
Validates that constant evaluation and override evaluation of ${builtin}() rejects invalid values
`
  )
  .params(u =>
    u
      .combine('stage', kConstantAndOverrideStages)
      .combine('type', keysOf(kValuesTypes))
      .filter(u => stageSupportsType(u.stage, kValuesTypes[u.type]))
      .beginSubcases()
      .expand('value', u =>
        unique(
          minusThreePiToThreePiRangeForType(kValuesTypes[u.type]),
          fullRangeForType(kValuesTypes[u.type])
        )
      )
  )
  .beforeAllSubcases(t => {
    if (elementType(kValuesTypes[t.params.type]) === TypeF16) {
      t.selectDeviceOrSkipTestCase('shader-f16');
    }
  })
  .fn(t => {
    const type = kValuesTypes[t.params.type];
    const fp = fpTraitsFor(
      // AbstractInt is converted to AbstractFloat before calling into the builtin
      elementType(type).kind === 'abstract-int' ? TypeAbstractFloat : elementType(type)
    );
    const smallestPositive = fp.constants().positive.min;
    const v = fp.quantize(Number(t.params.value));
    const expectedResult = Math.abs(Math.cos(v)) > smallestPositive;
    validateConstOrOverrideBuiltinEval(
      t,
      builtin,
      expectedResult,
      [type.create(t.params.value)],
      t.params.stage
    );
  });

const kIntegerArgumentTypes = objectsToRecord([TypeF32, ...kAllConcreteIntegerScalarsAndVectors]);

g.test('integer_argument')
  .desc(
    `
Validates that scalar and vector integer arguments are rejected by ${builtin}()
`
  )
  .params(u => u.combine('type', keysOf(kIntegerArgumentTypes)))
  .fn(t => {
    const type = kIntegerArgumentTypes[t.params.type];
    validateConstOrOverrideBuiltinEval(
      t,
      builtin,
      /* expectedResult */ type === TypeF32,
      [type.create(0)],
      'constant'
    );
  });
