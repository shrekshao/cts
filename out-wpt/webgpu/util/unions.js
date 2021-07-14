/**
 * AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
 **/ /**
 * Reifies a `GPUExtent3D` into a `Required<GPUExtent3DDict>`.
 */ export function standardizeExtent3D(v) {
  if (v instanceof Array) {
    return { width: v[0] ?? 1, height: v[1] ?? 1, depthOrArrayLayers: v[2] ?? 1 };
  } else {
    return {
      width: v.width ?? 1,
      height: v.height ?? 1,
      depthOrArrayLayers: v.depthOrArrayLayers ?? 1,
    };
  }
}
