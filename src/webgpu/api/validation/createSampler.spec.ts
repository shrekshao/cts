export const description = `
createSampler validation tests.
`;

import { poptions, params } from '../../../common/framework/params_builder.js';
import { makeTestGroup } from '../../../common/framework/test_group.js';

import { ValidationTest } from './validation_test.js';

export const g = makeTestGroup(ValidationTest);

g.test('lodMinAndMaxClamp')
  .desc('test different combinations of min and max clamp values')
  .params(
    params()
      .combine(poptions('lodMinClamp', [-4e-30, -1, 0, 0.5, 1, 10, 4e30]))
      .combine(poptions('lodMaxClamp', [-4e-30, -1, 0, 0.5, 1, 10, 4e30]))
  )
  .fn(async t => {
    t.expectValidationError(() => {
      t.device.createSampler({
        lodMinClamp: t.params.lodMinClamp,
        lodMaxClamp: t.params.lodMaxClamp,
      });
    }, t.params.lodMinClamp > t.params.lodMaxClamp || t.params.lodMinClamp < 0 || t.params.lodMaxClamp < 0);
  });

g.test('maxAnisotropy')
  .desc('test different maxAnisotropy values and combinations with min/mag/mipmapFilter')
  .params(
    params()
      .combine(poptions('maxAnisotropy', [0, 1, 2, 4, 16, 32, 1024]))
      .combine(poptions('minFilter', ['nearest', 'linear']))
      .combine(poptions('magFilter', ['nearest', 'linear']))
      .combine(poptions('mipmapFilter', ['nearest', 'linear']))
  )
  .fn(async t => {
    t.expectValidationError(() => {
      t.device.createSampler({
        minFilter: t.params.minFilter as GPUFilterMode,
        magFilter: t.params.magFilter as GPUFilterMode,
        mipmapFilter: t.params.mipmapFilter as GPUFilterMode,
        maxAnisotropy: t.params.maxAnisotropy,
      });
    }, t.params.maxAnisotropy < 1 || (t.params.maxAnisotropy > 1 && !(t.params.minFilter === 'linear' && t.params.magFilter === 'linear' && t.params.mipmapFilter === 'linear') ));
  });
