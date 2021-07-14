/**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/ /**
     * Creates a buffer with the contents of some TypedArray.
     */
export function makeBufferWithContents(
device,
dataArray,
usage)
{
  const buffer = device.createBuffer({
    mappedAtCreation: true,
    size: dataArray.byteLength,
    usage });

  const mappedBuffer = buffer.getMappedRange();
  const constructor = dataArray.constructor;
  new constructor(mappedBuffer).set(dataArray);
  buffer.unmap();
  return buffer;
}
//# sourceMappingURL=buffer.js.map