export const description = `
Test related to output to depth and stencil attachment.

More depth/stencil state tests are under operation,rendering,depth / stencil
`;

import { makeTestGroup } from '../../../../../common/framework/test_group.js';
import { kDepthStencilFormats, kTextureFormatInfo } from '../../../../capability_info.js';
import { GPUTest } from '../../../../gpu_test.js';

// class DepthStencilAttachmentTest extends GPUTest {

// }
// export const g = makeTestGroup(DepthStencilAttachmentTest);

const kVertexShader = `
@vertex fn main(
@builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4<f32> {
  var pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
      vec2<f32>(-1.0, -3.0),
      vec2<f32>(3.0, 1.0),
      vec2<f32>(-1.0, 1.0));
  return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
}
`;

export const g = makeTestGroup(GPUTest);

g.test('depth,attachment')
  .desc(
    'Tests pipeline behaves correctly with/without depth attachment when frag_depth is written.'
  )
  .params(u =>
    u
      .combine('hasFragDepthWritten', [false, true])
      .combine('hasDepthStencilAttachment', [false, true])

      // .filter(p => p.hasDepthStencilAttachment)
      // .beginSubcases()
      // .expand(
      //   'depthStencilFormat',
      //   // kDepthStencilFormats.filter(format => kTextureFormatInfo[format].depth)
      //   p => p.hasDepthStencilAttachment ?
      //     kDepthStencilFormats.filter(format => kTextureFormatInfo[format].depth) : ['depth24unorm']
      // )
      // .combine('depthStencilFormat', kDepthStencilFormats.filter(format => kTextureFormatInfo[format].depth))

      // .combine('depthStencilFormat', kDepthStencilFormats)
      // .filter(p => kTextureFormatInfo[p.depthStencilFormat].depth)

      .combine(
        'depthStencilFormat',
        kDepthStencilFormats.filter(format => kTextureFormatInfo[format].depth)
      )
  )
  .beforeAllSubcases(t => {
    // const { depthStencilFormat } = t.params;
    // t.selectDeviceForTextureFormatOrSkipTestCase(depthStencilFormat);
    t.selectDeviceForTextureFormatOrSkipTestCase(t.params.depthStencilFormat);
  })
  .fn(async t => {
    const { hasFragDepthWritten, hasDepthStencilAttachment, depthStencilFormat } = t.params;
    const fragmentShader = `
struct Output {
  ${hasFragDepthWritten ? '@builtin(frag_depth) depth: f32,' : ''}
  @location(0) color: vec4<f32>
}
@fragment fn main() -> Output {
  var o: Output;
  ${hasFragDepthWritten ? 'o.depth = 0.5;' : ''}
  o.color = vec4<f32>(0.0, 0.0, 0.0, 0.0);
  return o;
}
    `;
    const colorFormat = 'bgra8unorm';
    const colorAttachment = t.device.createTexture({
      format: colorFormat,
      size: { width: 1, height: 1, depthOrArrayLayers: 1 },
      usage: GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
    });
    const colorAttachmentView = colorAttachment.createView();

    // const depthStencilFormat: GPUTextureFormat = 'depth24plus-stencil8';
    const depthTexture = t.device.createTexture({
      size: { width: 1, height: 1 },
      format: depthStencilFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    const depthTextureView = depthTexture.createView();

    const pipeline = t.device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: t.device.createShaderModule({
          code: kVertexShader,
        }),
        entryPoint: 'main',
      },
      fragment: {
        module: t.device.createShaderModule({
          code: fragmentShader,
        }),
        entryPoint: 'main',
        targets: [{ format: colorFormat }],
      },
      depthStencil: hasDepthStencilAttachment
        ? {
            format: depthStencilFormat,
            depthWriteEnabled: true,
          }
        : undefined,
    });

    const encoder = t.device.createCommandEncoder();
    const depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
      view: depthTextureView,
      depthClearValue: 0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    };
    if (kTextureFormatInfo[depthStencilFormat].stencil) {
      depthStencilAttachment.stencilClearValue = 0;
      depthStencilAttachment.stencilLoadOp = 'clear';
      depthStencilAttachment.stencilStoreOp = 'store';
    }
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: colorAttachmentView,
          storeOp: 'store',
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: 'clear',
        },
      ],
      depthStencilAttachment: hasDepthStencilAttachment ? depthStencilAttachment : undefined,
    });
    pass.setPipeline(pipeline);
    pass.draw(1);
    pass.end();
    t.device.queue.submit([encoder.finish()]);

    // t.expectSinglePixelIn2DTexture(
    //   colorAttachment,
    //   colorFormat,
    //   { x: 0, y: 0 },
    //   { exp: new Uint8Array(_expected) }
    // );
  });
