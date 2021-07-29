export const description = `
TODO:
- Test pipeline outputs with different color targets, depth/stencil targets.
  - different scalar types in shader (f32, u32, i32) to targets with different format (f32 to unorm/float, u32 to uint)
  - different componentCounts of the output doesn't matter (e.g. f32, vec2<f32>, vec3<f32>, vec4<f32>)
    Extra components are discarded and missing components are filled to 0,0,1.
`;

import { makeTestGroup } from '../../../../common/framework/test_group.js';
import { GPUTest } from '../../../gpu_test.js';
import { unreachable } from '../../../../common/util/util.js';
import {
  // kTextureFormats,
  kRenderableColorTextureFormats,
  kTextureFormatInfo,
  SizedTextureFormat,
  TextureFormatInfo,
} from '../../../capability_info.js';

class F extends GPUTest {
  getExpectedType(format: GPUTextureFormat): GPUTextureSampleType {
    if (format.endsWith('sint')) {
      return 'sint';
    } else if (format.endsWith('uint')) {
      return 'uint';
    } else {
      return 'float';
    }
  }

  getFragmentShaderCode(sampleType: GPUTextureSampleType, componentCount: number): string {
    const v = ['0', '1', '0', '1'];

    let fragColorType;
    let suffix;
    switch (sampleType) {
        case 'sint':
        fragColorType = 'i32';
        suffix = '';
        break;
        case 'uint':
        fragColorType = 'u32';
        suffix = 'u';
        break;
        default:
        fragColorType = 'f32';
        suffix = '.0';
        break;
    }

    let outputType;
    let result;
    switch (componentCount) {
        case 1:
        outputType = fragColorType;
        result = `${v[0]}${suffix}`;
        break;
        case 2:
        outputType = `vec2<${fragColorType}>`;
        result = `${outputType}(${v[0]}${suffix}, ${v[1]}${suffix})`;
        break;
        case 3:
        outputType = `vec3<${fragColorType}>`;
        result = `${outputType}(${v[0]}${suffix}, ${v[1]}${suffix}, ${v[2]}${suffix})`;
        break;
        case 4:
        outputType = `vec4<${fragColorType}>`;
        result = `${outputType}(${v[0]}${suffix}, ${v[1]}${suffix}, ${v[2]}${suffix}, ${v[3]}${suffix})`;
        break;
        default:
        unreachable();
    }

    return `
    [[stage(fragment)]] fn main() -> [[location(0)]] ${outputType} {
        return ${result};
    }`;
  }
}

export const g = makeTestGroup(F);

g.test('color,component_count')
  .params(u =>
    u
      // .combine('format', kRenderableColorTextureFormats)
      .combine('format', ['rgba8unorm'] as SizedTextureFormat[])
      .beginSubcases()
      // .combine('componentCount', [1, 2, 3, 4])
      .combine('componentCount', [2])
      // .combine('componentCount', [4])
  )
  .fn(async t => {
    const { format, componentCount } = t.params;
    const info = kTextureFormatInfo[format];
    await t.selectDeviceOrSkipTestCase(info.feature);

    const sampleType = t.getExpectedType(format);

    const renderTarget = t.device.createTexture({
      format,
      size: { width: 1, height: 1, depthOrArrayLayers: 1 },
      usage: GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
    });

    const pipeline = t.device.createRenderPipeline({
      vertex: {
        module: t.device.createShaderModule({
          code: `
            [[stage(vertex)]] fn main(
              [[builtin(vertex_index)]] VertexIndex : u32
              ) -> [[builtin(position)]] vec4<f32> {
                var pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
                    vec2<f32>(-1.0, -3.0),
                    vec2<f32>(3.0, 1.0),
                    vec2<f32>(-1.0, 1.0));
                return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
              }
              `,
        }),
        entryPoint: 'main',
      },
      fragment: {
        module: t.device.createShaderModule({
          code: t.getFragmentShaderCode(sampleType, componentCount),
        }),
        entryPoint: 'main',
        targets: [{ format }],
      },
      primitive: { topology: 'triangle-list' },
      // layout: t.device.createPipelineLayout({ bindGroupLayouts: [] }),
    });

    const encoder = t.device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: renderTarget.createView(),
          storeOp: 'store',
          loadValue: { r: 1.0, g: 0.0, b: 0.0, a: 1.0 },
        },
      ],
    });
    pass.setPipeline(pipeline);
    pass.draw(3);
    pass.endPass();
    t.device.queue.submit([encoder.finish()]);

    // t.expectGPUBufferValuesEqual(dst, new Uint8Array([0x00, 0xff, 0x00, 0xff]));
    t.expectSinglePixelIn2DTexture(
      renderTarget,
      format,
      { x: 0, y: 0 },
      { exp: new Uint8Array([0x00, 0xff, 0x00, 0xff]) },
      // { exp: new Uint8Array([0x00, 0xff]) },
    );
  });