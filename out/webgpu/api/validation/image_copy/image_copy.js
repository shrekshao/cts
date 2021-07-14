/**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/import { kTextureFormatInfo } from '../../../capability_info.js';import { ValidationTest } from '../validation_test.js';

export class ImageCopyTest extends ValidationTest {
  testRun(
  textureCopyView,
  textureDataLayout,
  size,
  {
    method,
    dataSize,
    success,
    submit = false })








  {
    switch (method) {
      case 'WriteTexture':{
          const data = new Uint8Array(dataSize);

          this.expectValidationError(() => {
            this.device.queue.writeTexture(textureCopyView, data, textureDataLayout, size);
          }, !success);

          break;
        }
      case 'CopyB2T':{
          const buffer = this.device.createBuffer({
            size: dataSize,
            usage: GPUBufferUsage.COPY_SRC });


          const encoder = this.device.createCommandEncoder();
          encoder.copyBufferToTexture({ buffer, ...textureDataLayout }, textureCopyView, size);

          if (submit) {
            const cmd = encoder.finish();
            this.expectValidationError(() => {
              this.device.queue.submit([cmd]);
            }, !success);
          } else {
            this.expectValidationError(() => {
              encoder.finish();
            }, !success);
          }

          break;
        }
      case 'CopyT2B':{
          const buffer = this.device.createBuffer({
            size: dataSize,
            usage: GPUBufferUsage.COPY_DST });


          const encoder = this.device.createCommandEncoder();
          encoder.copyTextureToBuffer(textureCopyView, { buffer, ...textureDataLayout }, size);

          if (submit) {
            const cmd = encoder.finish();
            this.expectValidationError(() => {
              this.device.queue.submit([cmd]);
            }, !success);
          } else {
            this.expectValidationError(() => {
              encoder.finish();
            }, !success);
          }

          break;
        }}

  }

  // This is a helper function used for creating a texture when we don't have to be very
  // precise about its size as long as it's big enough and properly aligned.
  createAlignedTexture(
  format,
  copySize = { width: 1, height: 1, depthOrArrayLayers: 1 },
  origin = { x: 0, y: 0, z: 0 })
  {
    const info = kTextureFormatInfo[format];
    return this.device.createTexture({
      size: {
        width: Math.max(1, copySize.width + origin.x) * info.blockWidth,
        height: Math.max(1, copySize.height + origin.y) * info.blockHeight,
        depthOrArrayLayers: Math.max(1, copySize.depthOrArrayLayers + origin.z) },

      format,
      usage: GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST });

  }}


// For testing divisibility by a number we test all the values returned by this function:
function valuesToTestDivisibilityBy(number) {
  const values = [];
  for (let i = 0; i <= 2 * number; ++i) {
    values.push(i);
  }
  values.push(3 * number);
  return values;
}













// This is a helper function used for expanding test parameters for texel block alignment tests on offset
export function texelBlockAlignmentTestExpanderForOffset({ format }) {
  return valuesToTestDivisibilityBy(kTextureFormatInfo[format].bytesPerBlock);
}

// This is a helper function used for expanding test parameters for texel block alignment tests on rowsPerImage
export function texelBlockAlignmentTestExpanderForRowsPerImage({ format }) {
  return valuesToTestDivisibilityBy(kTextureFormatInfo[format].blockHeight);
}

// This is a helper function used for expanding test parameters for texel block alignment tests on origin and size
export function texelBlockAlignmentTestExpanderForValueToCoordinate({
  format,
  coordinateToTest })
{
  switch (coordinateToTest) {
    case 'x':
    case 'width':
      return valuesToTestDivisibilityBy(kTextureFormatInfo[format].blockWidth);

    case 'y':
    case 'height':
      return valuesToTestDivisibilityBy(kTextureFormatInfo[format].blockHeight);

    case 'z':
    case 'depthOrArrayLayers':
      return valuesToTestDivisibilityBy(1);}

}

// This is a helper function used for filtering test parameters
export function formatCopyableWithMethod({ format, method }) {
  if (method === 'CopyTextureToBuffer') {
    return kTextureFormatInfo[format].copySrc;
  } else {
    return kTextureFormatInfo[format].copyDst;
  }
}
//# sourceMappingURL=image_copy.js.map