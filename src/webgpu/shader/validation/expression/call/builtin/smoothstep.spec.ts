const builtin = 'smoothstep';
export const description = `
Validation tests for the ${builtin}() builtin.
`;

import { makeTestGroup } from '../../../../../../common/framework/test_group.js';
import { keysOf, objectsToRecord } from '../../../../../../common/util/data_tables.js';
import {
  Type,
  concreteTypeOf,
  elementTypeOf,
  isConvertibleToFloatType,
  kAllScalarsAndVectors,
  kConvertableToFloatScalarsAndVectors,
  scalarTypeOf,
} from '../../../../../util/conversion.js';
import { ShaderValidationTest } from '../../../shader_validation_test.js';

import {
  kConstantAndOverrideStages,
  stageSupportsType,
  validateConstOrOverrideBuiltinEval,
} from './const_override_validation.js';

export const g = makeTestGroup(ShaderValidationTest);

const kValuesTypes = objectsToRecord(kConvertableToFloatScalarsAndVectors);
const kArgumentTypes = objectsToRecord(kAllScalarsAndVectors);

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
      .expand('value1', u => [-1000, -10, 0, 10, 1000])
      .expand('value2', u => [-1000, -10, 0, 10, 1000])
  )
  .beforeAllSubcases(t => {
    if (scalarTypeOf(kValuesTypes[t.params.type]) === Type.f16) {
      t.selectDeviceOrSkipTestCase('shader-f16');
    }
  })
  .fn(t => {
    const type = kValuesTypes[t.params.type];

    // We expect to fail if low == high as it results in a DBZ
    const expectedResult = t.params.value1 !== t.params.value2;

    validateConstOrOverrideBuiltinEval(
      t,
      builtin,
      expectedResult,
      [type.create(t.params.value1), type.create(t.params.value2), type.create(0)],
      t.params.stage,
      /* returnType */ concreteTypeOf(type, [Type.f32])
    );
  });

g.test('argument_types')
  .desc(
    `
Validates that scalar and vector arguments are rejected by ${builtin}() if not float type or vecN<float type>
`
  )
  .params(u => u.combine('type', keysOf(kArgumentTypes)))
  .beforeAllSubcases(t => {
    if (scalarTypeOf(kArgumentTypes[t.params.type]) === Type.f16) {
      t.selectDeviceOrSkipTestCase('shader-f16');
    }
  })
  .fn(t => {
    const type = kArgumentTypes[t.params.type];
    validateConstOrOverrideBuiltinEval(
      t,
      builtin,
      /* expectedResult */ isConvertibleToFloatType(elementTypeOf(type)),
      [type.create(0), type.create(1), type.create(2)],
      'constant',
      /* returnType */ concreteTypeOf(type, [Type.f32])
    );
  });

const kTests = {
  valid: {
    src: `_ = ${builtin}(0.0, 42.0, 0.5);`,
    pass: true,
  },
  alias: {
    src: `_ = ${builtin}(f32_alias(0), f32_alias(42), f32_alias(0.5));`,
    pass: true,
  },
  bool: {
    src: `_ = ${builtin}(false, false, false);`,
    pass: false,
  },
  i32: {
    src: `_ = ${builtin}(1i, 2i, 1i);`,
    pass: false,
  },
  u32: {
    src: `_ = ${builtin}(1u, 2u, 1u);`,
    pass: false,
  },
  f32: {
    src: `_ = ${builtin}(1.0f, 2.0f, 1.0f);`,
    pass: true,
  },
  f16: {
    src: `_ = ${builtin}(1h, 2h, 1h);`,
    pass: true,
  },
  mixed_aint_afloat: {
    src: `_ = ${builtin}(1.0, 2, 1);`,
    pass: true,
  },
  mixed_f32_afloat: {
    src: `_ = ${builtin}(1.0f, 2.0, 1.0);`,
    pass: true,
  },
  mixed_f16_afloat: {
    src: `_ = ${builtin}(1.0h, 2.0, 1.0);`,
    pass: true,
  },
  vec_bool: {
    src: `_ = ${builtin}(vec2<bool>(false, true), vec2<bool>(false, true), vec2<bool>(false, true));`,
    pass: false,
  },
  vec_i32: {
    src: `_ = ${builtin}(vec2<i32>(1, 1), vec2<i32>(1, 1), vec2<i32>(1, 1));`,
    pass: false,
  },
  vec_u32: {
    src: `_ = ${builtin}(vec2<u32>(1, 1), vec2<u32>(1, 1), vec2<u32>(1, 1));`,
    pass: false,
  },
  vec_f32: {
    src: `_ = ${builtin}(vec2<f32>(0, 0), vec2<f32>(1, 1), vec2<f32>(1, 1));`,
    pass: true,
  },
  matrix: {
    src: `_ = ${builtin}(mat2x2(1, 1, 1, 1), mat2x2(1, 1, 1, 1), mat2x2(1, 1, 1, 1));`,
    pass: false,
  },
  atomic: {
    src: ` _ = ${builtin}(a, a, a);`,
    pass: false,
  },
  array: {
    src: `var a: array<bool, 5>;
            _ = ${builtin}(a, a, a);`,
    pass: false,
  },
  array_runtime: {
    src: `_ = ${builtin}(k.arry, k.arry, k.arry);`,
    pass: false,
  },
  struct: {
    src: `var a: A;
            _ = ${builtin}(a, a, a);`,
    pass: false,
  },
  enumerant: {
    src: `_ = ${builtin}(read_write, read_write, read_write);`,
    pass: false,
  },
  ptr: {
    src: `var<function> a = 1.0;
            let p: ptr<function, f32> = &a;
            _ = ${builtin}(p, p, p);`,
    pass: false,
  },
  ptr_deref: {
    src: `var<function> a = 1.0;
            let p: ptr<function, f32> = &a;
            _ = ${builtin}(*p, *p, *p);`,
    pass: true,
  },
  sampler: {
    src: `_ = ${builtin}(s, s, s);`,
    pass: false,
  },
  texture: {
    src: `_ = ${builtin}(t, t, t);`,
    pass: false,
  },
  no_args: {
    src: `_ = ${builtin}();`,
    pass: false,
  },
  too_few_args: {
    src: `_ = ${builtin}(1.0, 2.0);`,
    pass: false,
  },
  too_many_args: {
    src: `_ = ${builtin}(1.0, 2.0, 3.0, 4.0);`,
    pass: false,
  },
};

g.test('arguments')
  .desc(`Test that ${builtin} is validated correctly when called with different arguments.`)
  .params(u => u.combine('test', keysOf(kTests)))
  .beforeAllSubcases(t => {
    if (t.params.test.includes('f16')) {
      t.selectDeviceOrSkipTestCase('shader-f16');
    }
  })
  .fn(t => {
    const src = kTests[t.params.test].src;
    const enables = t.params.test.includes('f16') ? 'enable f16;' : '';
    const code = `
  ${enables}
  alias f32_alias = f32;

  @group(0) @binding(0) var s: sampler;
  @group(0) @binding(1) var t: texture_2d<f32>;

  var<workgroup> a: atomic<u32>;

  struct A {
    i: bool,
  }
  struct B {
    arry: array<u32>,
  }
  @group(0) @binding(3) var<storage> k: B;

  @vertex
  fn main() -> @builtin(position) vec4<f32> {
    ${src}
    return vec4<f32>(.4, .2, .3, .1);
  }`;
    t.expectCompileResult(kTests[t.params.test].pass, code);
  });
