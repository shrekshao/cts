export const description = `
Tests for GPUCanvasContext.getCurrentTexture.
`;

import { SkipTestCase } from '../../../common/framework/fixture.js';
import { makeTestGroup } from '../../../common/framework/test_group.js';
import { timeout } from '../../../common/util/timeout.js';
import { assert, unreachable } from '../../../common/util/util.js';
import { GPUTest } from '../../gpu_test.js';
import { kAllCanvasTypes, createCanvas, CanvasType } from '../../util/create_elements.js';

class GPUContextTest extends GPUTest {
  initCanvasContext(canvasType: CanvasType = 'onscreen'): GPUCanvasContext {
    const canvas = createCanvas(this, canvasType, 2, 2);
    const ctx = canvas.getContext('webgpu');
    assert(ctx instanceof GPUCanvasContext, 'Failed to get WebGPU context from canvas');

    ctx.configure({
      device: this.device,
      format: 'rgba8unorm',
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
    });

    return ctx;
  }

  // Request a new "frame" based on the WebGPU canvas type.
  requestNewFrameOnCanvasType(canvasType: CanvasType, ctx: GPUCanvasContext, fn: () => void) {
    switch (canvasType) {
      case 'onscreen':
        requestAnimationFrame(fn);
        break;
      case 'offscreen': {
        (ctx.canvas as OffscreenCanvas).transferToImageBitmap();
        // The beginning of frameCheck runs immediately (in the same task), so this
        // verifies the state has changed synchronously.
        void fn();
        break;
      }
      default:
        unreachable();
    }
  }
}

export const g = makeTestGroup(GPUContextTest);

g.test('configured')
  .desc(
    `Checks that calling getCurrentTexture requires the context to be configured first, and
  that each call to configure causes getCurrentTexture to return a new texture.`
  )
  .params(u =>
    u //
      .combine('canvasType', kAllCanvasTypes)
  )
  .fn(t => {
    const canvas = createCanvas(t, t.params.canvasType, 2, 2);
    const ctx = canvas.getContext('webgpu');
    assert(ctx instanceof GPUCanvasContext, 'Failed to get WebGPU context from canvas');

    // Calling getCurrentTexture prior to configuration should throw an exception.
    t.shouldThrow(true, () => {
      ctx.getCurrentTexture();
    });

    // Once the context has been configured getCurrentTexture can be called.
    ctx.configure({
      device: t.device,
      format: 'rgba8unorm',
    });

    let prevTexture = ctx.getCurrentTexture();

    // Calling configure again with different values will change the texture returned.
    ctx.configure({
      device: t.device,
      format: 'bgra8unorm',
    });

    let currentTexture = ctx.getCurrentTexture();
    t.expect(prevTexture !== currentTexture);
    prevTexture = currentTexture;

    // Calling configure again with the same values will still change the texture returned.
    ctx.configure({
      device: t.device,
      format: 'bgra8unorm',
    });

    currentTexture = ctx.getCurrentTexture();
    t.expect(prevTexture !== currentTexture);
    prevTexture = currentTexture;

    // Calling getCurrentTexture after calling unconfigure should throw an exception.
    ctx.unconfigure();

    t.shouldThrow(true, () => {
      ctx.getCurrentTexture();
    });
  });

g.test('single_frames')
  .desc(`Checks that the value of getCurrentTexture is consistent within a single frame.`)
  .params(u =>
    u //
      .combine('canvasType', kAllCanvasTypes)
  )
  .fn(t => {
    const ctx = t.initCanvasContext(t.params.canvasType);
    const frameTexture = ctx.getCurrentTexture();

    // Calling getCurrentTexture a second time returns the same texture.
    t.expect(frameTexture === ctx.getCurrentTexture());

    const encoder = t.device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: frameTexture.createView(),
          clearValue: [1.0, 0.0, 0.0, 1.0],
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    });
    pass.end();
    t.device.queue.submit([encoder.finish()]);

    // Calling getCurrentTexture after performing some work on the texture returns the same texture.
    t.expect(frameTexture === ctx.getCurrentTexture());

    // Ensure that getCurrentTexture does not clear the texture.
    t.expectSingleColor(frameTexture, frameTexture.format, {
      size: [frameTexture.width, frameTexture.height, 1],
      exp: { R: 1, G: 0, B: 0, A: 1 },
    });

    frameTexture.destroy();

    // Calling getCurrentTexture after destroying the texture still returns the same texture.
    t.expect(frameTexture === ctx.getCurrentTexture());
  });

g.test('multiple_frames')
  .desc(`Checks that the value of getCurrentTexture differs across multiple frames.`)
  .params(u =>
    u //
      .combine('canvasType', kAllCanvasTypes)
      .beginSubcases()
      .combine('clearTexture', [true, false])
  )
  .beforeAllSubcases(t => {
    const { canvasType } = t.params;
    if (canvasType === 'offscreen' && !('transferToImageBitmap' in OffscreenCanvas.prototype)) {
      throw new SkipTestCase('transferToImageBitmap not supported');
    }
  })
  .fn(t => {
    const { canvasType, clearTexture } = t.params;

    return new Promise(resolve => {
      const ctx = t.initCanvasContext(canvasType);
      let prevTexture: GPUTexture | undefined;
      let frameCount = 0;

      function frameCheck() {
        const currentTexture = ctx.getCurrentTexture();

        if (prevTexture) {
          // Ensure that each frame a new texture object is returned.
          t.expect(currentTexture !== prevTexture);

          // Ensure that texture contents are transparent black.
          t.expectSingleColor(currentTexture, currentTexture.format, {
            size: [currentTexture.width, currentTexture.height, 1],
            exp: { R: 0, G: 0, B: 0, A: 0 },
          });
        }

        if (clearTexture) {
          // Clear the texture to test that texture contents don't carry over from frame to frame.
          const encoder = t.device.createCommandEncoder();
          const pass = encoder.beginRenderPass({
            colorAttachments: [
              {
                view: currentTexture.createView(),
                clearValue: [1.0, 0.0, 0.0, 1.0],
                loadOp: 'clear',
                storeOp: 'store',
              },
            ],
          });
          pass.end();
          t.device.queue.submit([encoder.finish()]);
        }

        prevTexture = currentTexture;

        if (frameCount++ < 5) {
          t.requestNewFrameOnCanvasType(canvasType, ctx, frameCheck);
        } else {
          resolve();
        }
      }

      void frameCheck();
    });
  });

g.test('resize')
  .desc(`Checks the value of getCurrentTexture differs when the canvas is resized.`)
  .params(u =>
    u //
      .combine('canvasType', kAllCanvasTypes)
  )
  .fn(t => {
    const ctx = t.initCanvasContext(t.params.canvasType);
    let prevTexture = ctx.getCurrentTexture();

    // Trigger a resize by changing the width.
    ctx.canvas.width = 4;

    // When the canvas resizes the texture returned by getCurrentTexture should immediately begin
    // returning a new texture matching the update dimensions.
    let currentTexture = ctx.getCurrentTexture();
    t.expect(prevTexture !== currentTexture);
    t.expect(currentTexture.width === ctx.canvas.width);
    t.expect(currentTexture.height === ctx.canvas.height);

    // The width and height of the previous texture should remain unchanged.
    t.expect(prevTexture.width === 2);
    t.expect(prevTexture.height === 2);
    prevTexture = currentTexture;

    // Ensure that texture contents are transparent black.
    t.expectSingleColor(currentTexture, currentTexture.format, {
      size: [currentTexture.width, currentTexture.height, 1],
      exp: { R: 0, G: 0, B: 0, A: 0 },
    });

    // Trigger a resize by changing the height.
    ctx.canvas.height = 4;

    // Check to ensure the texture is resized again.
    currentTexture = ctx.getCurrentTexture();
    t.expect(prevTexture !== currentTexture);
    t.expect(currentTexture.width === ctx.canvas.width);
    t.expect(currentTexture.height === ctx.canvas.height);
    t.expect(prevTexture.width === 4);
    t.expect(prevTexture.height === 2);
    prevTexture = currentTexture;

    // Ensure that texture contents are transparent black.
    t.expectSingleColor(currentTexture, currentTexture.format, {
      size: [currentTexture.width, currentTexture.height, 1],
      exp: { R: 0, G: 0, B: 0, A: 0 },
    });

    // Simply setting the canvas width and height values to their current values should not trigger
    // a change in the texture.
    ctx.canvas.width = 4;
    ctx.canvas.height = 4;

    currentTexture = ctx.getCurrentTexture();
    t.expect(prevTexture === currentTexture);
  });

g.test('expiry')
  .desc(
    `
Test automatic WebGPU canvas texture expiry on all canvas types with the following requirements:
- getCurrentTexture returns the same texture object within the same frame, throughout:
  - after previous frame update the rendering
  - before current frame update the rendering
  - in a microtask off the current frame task
- getCurrentTexture returns a new texture object and the old texture object becomes invalid as soon as possible after HTML update the rendering.
  `
  )
  .params(u =>
    u //
      .combine('canvasType', kAllCanvasTypes)
      .combine('prevFrameCallsite', ['requestPostAnimationFrame', 'requestAnimationFrame'] as const)
  )
  .fn(t => {
    const { canvasType, prevFrameCallsite } = t.params;
    const ctx = t.initCanvasContext(t.params.canvasType);
    // Create a bindGroupLayout to test invalid texture view usage later.
    const bgl = t.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          texture: {},
        },
      ],
    });

    // The fn is called immediately after previous frame updating the rendering.
    // Polyfill by calling the callback by setTimeout, in the requestAnimationFrame callback (for onscreen canvas)
    // or after transferToImageBitmap (for offscreen canvas).
    function requestPostAnimationFrame(fn: () => void) {
      t.requestNewFrameOnCanvasType(canvasType, ctx, () => {
        timeout(fn);
      });
    }

    function checkGetCurrentTexture() {
      // Call getCurrentTexture on previous frame.
      const prevTexture = ctx.getCurrentTexture();

      // Call getCurrentTexture immediately after the frame, the texture object should stay the same.
      queueMicrotask(() => {
        t.expect(prevTexture === ctx.getCurrentTexture());
      });

      // Call getCurrentTexture immediately after this frame updating the rendering.
      // It should return a new texture object.
      timeout(() => {
        t.expect(prevTexture !== ctx.getCurrentTexture());

        // prevTexture expired and is invalid, but createView should still succeed.
        const prevTextureView = prevTexture.createView();
        // Using the invalid view should fail.
        t.expectValidationError(() => {
          t.device.createBindGroup({
            layout: bgl,
            entries: [{ binding: 0, resource: prevTextureView }],
          });
        });
      });
    }

    switch (prevFrameCallsite) {
      case 'requestPostAnimationFrame':
        requestPostAnimationFrame(checkGetCurrentTexture);
        break;
      case 'requestAnimationFrame':
        requestAnimationFrame(checkGetCurrentTexture);
        break;
      default:
        break;
    }
  });
