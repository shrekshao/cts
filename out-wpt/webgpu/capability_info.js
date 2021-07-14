/**
 * AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
 **/ // TODO: The generated Typedoc for this file is hard to navigate because it's alphabetized.
// Consider using namespaces or renames to fix this?

import { keysOf, makeTable, numericKeysOf } from '../common/util/data_tables.js';
import { assertTypeTrue } from '../common/util/types.js';
import { assert, unreachable } from '../common/util/util.js';

import { GPUConst } from './constants.js';

// Queries

/** Maximum number of queries in GPUQuerySet, by spec. */
export const kMaxQueryCount = 8192;
/** Per-GPUQueryType info. */

export const kQueryTypeInfo = {
  // Occlusion query does not require any features.
  occlusion: { feature: undefined },
  'pipeline-statistics': { feature: 'pipeline-statistics-query' },
  timestamp: { feature: 'timestamp-query' },
};

/** List of all GPUQueryType values. */
export const kQueryTypes = keysOf(kQueryTypeInfo);

// Buffers

/** Required alignment of a GPUBuffer size, by spec. */
export const kBufferSizeAlignment = 4;

/** Per-GPUBufferUsage info. */
export const kBufferUsageInfo = {
  [GPUConst.BufferUsage.MAP_READ]: {},
  [GPUConst.BufferUsage.MAP_WRITE]: {},
  [GPUConst.BufferUsage.COPY_SRC]: {},
  [GPUConst.BufferUsage.COPY_DST]: {},
  [GPUConst.BufferUsage.INDEX]: {},
  [GPUConst.BufferUsage.VERTEX]: {},
  [GPUConst.BufferUsage.UNIFORM]: {},
  [GPUConst.BufferUsage.STORAGE]: {},
  [GPUConst.BufferUsage.INDIRECT]: {},
  [GPUConst.BufferUsage.QUERY_RESOLVE]: {},
};

/** List of all GPUBufferUsage values. */
export const kBufferUsages = numericKeysOf(kBufferUsageInfo);

// Textures

// Definitions for use locally. To access the table entries, use `kTextureFormatInfo`.

// Note that we repeat the header multiple times in order to make it easier to read.
const kRegularTextureFormatInfo = makeTable(
  [
    'renderable',
    'multisample',
    'color',
    'depth',
    'stencil',
    'storage',
    'copySrc',
    'copyDst',
    'bytesPerBlock',
    'blockWidth',
    'blockHeight',
    'feature',
  ],
  [, , true, false, false, , true, true, , 1, 1],
  {
    // 8-bit formats
    r8unorm: [true, true, , , , false, , , 1],
    r8snorm: [false, false, , , , false, , , 1],
    r8uint: [true, true, , , , false, , , 1],
    r8sint: [true, true, , , , false, , , 1],
    // 16-bit formats
    r16uint: [true, true, , , , false, , , 2],
    r16sint: [true, true, , , , false, , , 2],
    r16float: [true, true, , , , false, , , 2],
    rg8unorm: [true, true, , , , false, , , 2],
    rg8snorm: [false, false, , , , false, , , 2],
    rg8uint: [true, true, , , , false, , , 2],
    rg8sint: [true, true, , , , false, , , 2],
    // 32-bit formats
    r32uint: [true, true, , , , true, , , 4],
    r32sint: [true, true, , , , true, , , 4],
    r32float: [true, true, , , , true, , , 4],
    rg16uint: [true, true, , , , false, , , 4],
    rg16sint: [true, true, , , , false, , , 4],
    rg16float: [true, true, , , , false, , , 4],
    rgba8unorm: [true, true, , , , true, , , 4],
    'rgba8unorm-srgb': [true, true, , , , false, , , 4],
    rgba8snorm: [false, false, , , , true, , , 4],
    rgba8uint: [true, true, , , , true, , , 4],
    rgba8sint: [true, true, , , , true, , , 4],
    bgra8unorm: [true, true, , , , false, , , 4],
    'bgra8unorm-srgb': [true, true, , , , false, , , 4],
    // Packed 32-bit formats
    rgb10a2unorm: [true, true, , , , false, , , 4],
    rg11b10ufloat: [false, false, , , , false, , , 4],
    rgb9e5ufloat: [false, false, , , , false, , , 4],
    // 64-bit formats
    rg32uint: [true, true, , , , true, , , 8],
    rg32sint: [true, true, , , , true, , , 8],
    rg32float: [true, true, , , , true, , , 8],
    rgba16uint: [true, true, , , , true, , , 8],
    rgba16sint: [true, true, , , , true, , , 8],
    rgba16float: [true, true, , , , true, , , 8],
    // 128-bit formats
    rgba32uint: [true, true, , , , true, , , 16],
    rgba32sint: [true, true, , , , true, , , 16],
    rgba32float: [true, true, , , , true, , , 16],
  }
);

const kTexFmtInfoHeader = [
  'renderable',
  'multisample',
  'color',
  'depth',
  'stencil',
  'storage',
  'copySrc',
  'copyDst',
  'bytesPerBlock',
  'blockWidth',
  'blockHeight',
  'feature',
];
const kSizedDepthStencilFormatInfo = makeTable(
  kTexFmtInfoHeader,
  [true, true, false, , , false, false, false, , 1, 1],
  {
    depth32float: [, , , true, false, , , , 4],
    depth16unorm: [, , , true, false, , , , 2],
    stencil8: [, , , false, true, , , , 1],
  }
);

const kUnsizedDepthStencilFormatInfo = makeTable(
  kTexFmtInfoHeader,
  [true, true, false, , , false, false, false, undefined, 1, 1],
  {
    depth24plus: [, , , true, false, , ,],
    'depth24plus-stencil8': [, , , true, true, , ,],
    // These should really be sized formats; see below TODO about multi-aspect formats.
    'depth24unorm-stencil8': [, , , true, true, , , , , , , 'depth24unorm-stencil8'],
    'depth32float-stencil8': [, , , true, true, , , , , , , 'depth32float-stencil8'],
  }
);

const kCompressedTextureFormatInfo = makeTable(
  kTexFmtInfoHeader,
  [false, false, true, false, false, false, true, true, , 4, 4],
  {
    'bc1-rgba-unorm': [, , , , , , , , 8, 4, 4, 'texture-compression-bc'],
    'bc1-rgba-unorm-srgb': [, , , , , , , , 8, 4, 4, 'texture-compression-bc'],
    'bc2-rgba-unorm': [, , , , , , , , 16, 4, 4, 'texture-compression-bc'],
    'bc2-rgba-unorm-srgb': [, , , , , , , , 16, 4, 4, 'texture-compression-bc'],
    'bc3-rgba-unorm': [, , , , , , , , 16, 4, 4, 'texture-compression-bc'],
    'bc3-rgba-unorm-srgb': [, , , , , , , , 16, 4, 4, 'texture-compression-bc'],
    'bc4-r-unorm': [, , , , , , , , 8, 4, 4, 'texture-compression-bc'],
    'bc4-r-snorm': [, , , , , , , , 8, 4, 4, 'texture-compression-bc'],
    'bc5-rg-unorm': [, , , , , , , , 16, 4, 4, 'texture-compression-bc'],
    'bc5-rg-snorm': [, , , , , , , , 16, 4, 4, 'texture-compression-bc'],
    'bc6h-rgb-ufloat': [, , , , , , , , 16, 4, 4, 'texture-compression-bc'],
    'bc6h-rgb-float': [, , , , , , , , 16, 4, 4, 'texture-compression-bc'],
    'bc7-rgba-unorm': [, , , , , , , , 16, 4, 4, 'texture-compression-bc'],
    'bc7-rgba-unorm-srgb': [, , , , , , , , 16, 4, 4, 'texture-compression-bc'],
  }
);

// Definitions for use locally. To access the table entries, use `kTextureFormatInfo`.

// TODO: Consider generating the exports below programmatically by filtering the big list, instead
// of using these local constants? Requires some type magic though.
const kColorTextureFormatInfo = { ...kRegularTextureFormatInfo, ...kCompressedTextureFormatInfo };
const kEncodableTextureFormatInfo = {
  ...kRegularTextureFormatInfo,
  ...kSizedDepthStencilFormatInfo,
};
const kSizedTextureFormatInfo = {
  ...kRegularTextureFormatInfo,
  ...kSizedDepthStencilFormatInfo,
  ...kCompressedTextureFormatInfo,
};
const kDepthStencilFormatInfo = {
  ...kSizedDepthStencilFormatInfo,
  ...kUnsizedDepthStencilFormatInfo,
};
const kUncompressedTextureFormatInfo = {
  ...kRegularTextureFormatInfo,
  ...kSizedDepthStencilFormatInfo,
  ...kUnsizedDepthStencilFormatInfo,
};
const kAllTextureFormatInfo = {
  ...kUncompressedTextureFormatInfo,
  ...kCompressedTextureFormatInfo,
};

/** A "regular" texture format (uncompressed, sized, single-plane color formats). */

export const kRegularTextureFormats = keysOf(kRegularTextureFormatInfo);
export const kSizedDepthStencilFormats = keysOf(kSizedDepthStencilFormatInfo);
export const kUnsizedDepthStencilFormats = keysOf(kUnsizedDepthStencilFormatInfo);
export const kCompressedTextureFormats = keysOf(kCompressedTextureFormatInfo);

export const kColorTextureFormats = keysOf(kColorTextureFormatInfo);
export const kEncodableTextureFormats = keysOf(kEncodableTextureFormatInfo);
export const kSizedTextureFormats = keysOf(kSizedTextureFormatInfo);
export const kDepthStencilFormats = keysOf(kDepthStencilFormatInfo);
export const kUncompressedTextureFormats = keysOf(kUncompressedTextureFormatInfo);

/** Per-GPUTextureFormat info. */
// Exists just for documentation. Otherwise could be inferred by `makeTable`.
// TODO: Refactor this to separate per-aspect data for multi-aspect formats. In particular:
// - bytesPerBlock only makes sense on a per-aspect basis. But this table can't express that.
//   So we put depth24unorm-stencil8 and depth32float-stencil8 to be unsized formats for now.

/** Per-GPUTextureFormat info. */
export const kTextureFormatInfo = kAllTextureFormatInfo;
/** List of all GPUTextureFormat values. */
export const kTextureFormats = keysOf(kAllTextureFormatInfo);

/** Valid GPUTextureFormats for `copyExternalImageToTexture`, by spec. */
export const kValidTextureFormatsForCopyIB2T = [
  'rgba8unorm',
  'rgba8unorm-srgb',
  'bgra8unorm',
  'bgra8unorm-srgb',
  'rgb10a2unorm',
  'rg8unorm',
];

/** Per-GPUTextureDimension info. */
export const kTextureDimensionInfo = {
  '1d': {},
  '2d': {},
  '3d': {},
};

/** List of all GPUTextureDimension values. */
export const kTextureDimensions = keysOf(kTextureDimensionInfo);

/** Per-GPUTextureAspect info. */
export const kTextureAspectInfo = {
  all: {},
  'depth-only': {},
  'stencil-only': {},
};

/** List of all GPUTextureAspect values. */
export const kTextureAspects = keysOf(kTextureAspectInfo);

const kDepthStencilFormatCapabilityInBufferTextureCopy = {
  // kUnsizedDepthStencilFormats
  depth24plus: {
    CopyB2T: [],
    CopyT2B: [],
    texelAspectSize: { 'depth-only': -1, 'stencil-only': -1 },
  },

  'depth24plus-stencil8': {
    CopyB2T: ['stencil-only'],
    CopyT2B: ['stencil-only'],
    texelAspectSize: { 'depth-only': -1, 'stencil-only': 1 },
  },

  // kSizedDepthStencilFormats
  depth16unorm: {
    CopyB2T: ['all', 'depth-only'],
    CopyT2B: ['all', 'depth-only'],
    texelAspectSize: { 'depth-only': 2, 'stencil-only': -1 },
  },

  depth32float: {
    CopyB2T: [],
    CopyT2B: ['all', 'depth-only'],
    texelAspectSize: { 'depth-only': 4, 'stencil-only': -1 },
  },

  'depth24unorm-stencil8': {
    CopyB2T: ['stencil-only'],
    CopyT2B: ['depth-only', 'stencil-only'],
    texelAspectSize: { 'depth-only': 4, 'stencil-only': 1 },
  },

  'depth32float-stencil8': {
    CopyB2T: ['stencil-only'],
    CopyT2B: ['depth-only', 'stencil-only'],
    texelAspectSize: { 'depth-only': 4, 'stencil-only': 1 },
  },

  stencil8: {
    CopyB2T: ['all', 'stencil-only'],
    CopyT2B: ['all', 'stencil-only'],
    texelAspectSize: { 'depth-only': -1, 'stencil-only': 1 },
  },
};

/**
 * Computes whether a copy between a depth/stencil texture aspect and a buffer is supported, by spec.
 */
export function depthStencilBufferTextureCopySupported(type, format, aspect) {
  const supportedAspects = kDepthStencilFormatCapabilityInBufferTextureCopy[format][type];
  return supportedAspects.includes(aspect);
}

/**
 * Returns the byte size of the depth or stencil aspect of the specified depth/stencil format,
 * or -1 if none.
 */
export function depthStencilFormatAspectSize(format, aspect) {
  const texelAspectSize =
    kDepthStencilFormatCapabilityInBufferTextureCopy[format].texelAspectSize[aspect];
  assert(texelAspectSize > 0);
  return texelAspectSize;
}

/**
 * Returns true iff a texture can be created with the provided GPUTextureDimension
 * (defaulting to 2d) and GPUTextureFormat, by spec.
 */
export function textureDimensionAndFormatCompatible(dimension, format) {
  const info = kAllTextureFormatInfo[format];
  return !(
    (dimension === '1d' || dimension === '3d') &&
    (info.blockWidth > 1 || info.depth || info.stencil)
  );
}

/** Per-GPUTextureUsage info. */
export const kTextureUsageInfo = {
  [GPUConst.TextureUsage.COPY_SRC]: {},
  [GPUConst.TextureUsage.COPY_DST]: {},
  [GPUConst.TextureUsage.SAMPLED]: {},
  [GPUConst.TextureUsage.STORAGE]: {},
  [GPUConst.TextureUsage.RENDER_ATTACHMENT]: {},
};

/** List of all GPUTextureUsage values. */
export const kTextureUsages = numericKeysOf(kTextureUsageInfo);

// Texture View

/** Per-GPUTextureViewDimension info. */

/** Per-GPUTextureViewDimension info. */
export const kTextureViewDimensionInfo = {
  '1d': { storage: true },
  '2d': { storage: true },
  '2d-array': { storage: true },
  cube: { storage: false },
  'cube-array': { storage: false },
  '3d': { storage: true },
};

/** List of all GPUTextureDimension values. */
export const kTextureViewDimensions = keysOf(kTextureViewDimensionInfo);

// Vertex formats

/** Per-GPUVertexFormat info. */
// Exists just for documentation. Otherwise could be inferred by `makeTable`.

/** Per-GPUVertexFormat info. */
export const kVertexFormatInfo = makeTable(['bytesPerComponent', 'type', 'componentCount'], [, ,], {
  // 8 bit components
  uint8x2: [1, 'uint', 2],
  uint8x4: [1, 'uint', 4],
  sint8x2: [1, 'sint', 2],
  sint8x4: [1, 'sint', 4],
  unorm8x2: [1, 'unorm', 2],
  unorm8x4: [1, 'unorm', 4],
  snorm8x2: [1, 'snorm', 2],
  snorm8x4: [1, 'snorm', 4],
  // 16 bit components
  uint16x2: [2, 'uint', 2],
  uint16x4: [2, 'uint', 4],
  sint16x2: [2, 'sint', 2],
  sint16x4: [2, 'sint', 4],
  unorm16x2: [2, 'unorm', 2],
  unorm16x4: [2, 'unorm', 4],
  snorm16x2: [2, 'snorm', 2],
  snorm16x4: [2, 'snorm', 4],
  float16x2: [2, 'float', 2],
  float16x4: [2, 'float', 4],
  // 32 bit components
  float32: [4, 'float', 1],
  float32x2: [4, 'float', 2],
  float32x3: [4, 'float', 3],
  float32x4: [4, 'float', 4],
  uint32: [4, 'uint', 1],
  uint32x2: [4, 'uint', 2],
  uint32x3: [4, 'uint', 3],
  uint32x4: [4, 'uint', 4],
  sint32: [4, 'sint', 1],
  sint32x2: [4, 'sint', 2],
  sint32x3: [4, 'sint', 3],
  sint32x4: [4, 'sint', 4],
});

/** List of all GPUVertexFormat values. */
export const kVertexFormats = keysOf(kVertexFormatInfo);

// Typedefs for bindings

/**
 * Classes of `PerShaderStage` binding limits. Two bindings with the same class
 * count toward the same `PerShaderStage` limit(s) in the spec (if any).
 */

export const kBindableResources = [
  'uniformBuf',
  'storageBuf',
  'filtSamp',
  'nonFiltSamp',
  'compareSamp',
  'sampledTex',
  'sampledTexMS',
  'storageTex',
  'errorBuf',
  'errorSamp',
  'errorTex',
];

assertTypeTrue();

// Bindings

/** Dynamic buffer offsets require offset to be divisible by 256, by spec. */
export const kMinDynamicBufferOffsetAlignment = 256;

/** Maximum number of bindings per GPUBindGroup(Layout), by spec. */
export const kMaxBindingsPerBindGroup = 16;

/** Default `PerShaderStage` binding limits, by spec. */
export const kPerStageBindingLimits = {
  uniformBuf: { class: 'uniformBuf', max: 12 },
  storageBuf: { class: 'storageBuf', max: 8 },
  sampler: { class: 'sampler', max: 16 },
  sampledTex: { class: 'sampledTex', max: 16 },
  storageTex: { class: 'storageTex', max: 8 },
};

/**
 * Default `PerPipelineLayout` binding limits, by spec.
 */
export const kPerPipelineBindingLimits = {
  uniformBuf: { class: 'uniformBuf', maxDynamic: 8 },
  storageBuf: { class: 'storageBuf', maxDynamic: 4 },
  sampler: { class: 'sampler', maxDynamic: 0 },
  sampledTex: { class: 'sampledTex', maxDynamic: 0 },
  storageTex: { class: 'storageTex', maxDynamic: 0 },
};

const kBindingKind = {
  uniformBuf: {
    resource: 'uniformBuf',
    perStageLimitClass: kPerStageBindingLimits.uniformBuf,
    perPipelineLimitClass: kPerPipelineBindingLimits.uniformBuf,
  },
  storageBuf: {
    resource: 'storageBuf',
    perStageLimitClass: kPerStageBindingLimits.storageBuf,
    perPipelineLimitClass: kPerPipelineBindingLimits.storageBuf,
  },
  filtSamp: {
    resource: 'filtSamp',
    perStageLimitClass: kPerStageBindingLimits.sampler,
    perPipelineLimitClass: kPerPipelineBindingLimits.sampler,
  },
  nonFiltSamp: {
    resource: 'nonFiltSamp',
    perStageLimitClass: kPerStageBindingLimits.sampler,
    perPipelineLimitClass: kPerPipelineBindingLimits.sampler,
  },
  compareSamp: {
    resource: 'compareSamp',
    perStageLimitClass: kPerStageBindingLimits.sampler,
    perPipelineLimitClass: kPerPipelineBindingLimits.sampler,
  },
  sampledTex: {
    resource: 'sampledTex',
    perStageLimitClass: kPerStageBindingLimits.sampledTex,
    perPipelineLimitClass: kPerPipelineBindingLimits.sampledTex,
  },
  sampledTexMS: {
    resource: 'sampledTexMS',
    perStageLimitClass: kPerStageBindingLimits.sampledTex,
    perPipelineLimitClass: kPerPipelineBindingLimits.sampledTex,
  },
  storageTex: {
    resource: 'storageTex',
    perStageLimitClass: kPerStageBindingLimits.storageTex,
    perPipelineLimitClass: kPerPipelineBindingLimits.storageTex,
  },
};

// Binding type info

const kValidStagesAll = {
  validStages:
    GPUConst.ShaderStage.VERTEX | GPUConst.ShaderStage.FRAGMENT | GPUConst.ShaderStage.COMPUTE,
};

const kValidStagesStorageWrite = {
  validStages: GPUConst.ShaderStage.FRAGMENT | GPUConst.ShaderStage.COMPUTE,
};

/** Binding type info (including class limits) for the specified GPUBufferBindingLayout. */
export function bufferBindingTypeInfo(d) {
  switch (d.type ?? 'uniform') {
    case 'uniform':
      return {
        usage: GPUConst.BufferUsage.UNIFORM,
        ...kBindingKind.uniformBuf,
        ...kValidStagesAll,
      };
    case 'storage':
      return {
        usage: GPUConst.BufferUsage.STORAGE,
        ...kBindingKind.storageBuf,
        ...kValidStagesStorageWrite,
      };
    case 'read-only-storage':
      return {
        usage: GPUConst.BufferUsage.STORAGE,
        ...kBindingKind.storageBuf,
        ...kValidStagesAll,
      };
  }
}
/** List of all GPUBufferBindingType values. */
export const kBufferBindingTypes = ['uniform', 'storage', 'read-only-storage'];
assertTypeTrue();

/** Binding type info (including class limits) for the specified GPUSamplerBindingLayout. */
export function samplerBindingTypeInfo(d) {
  switch (d.type ?? 'filtering') {
    case 'filtering':
      return { ...kBindingKind.filtSamp, ...kValidStagesAll };
    case 'non-filtering':
      return { ...kBindingKind.nonFiltSamp, ...kValidStagesAll };
    case 'comparison':
      return { ...kBindingKind.compareSamp, ...kValidStagesAll };
  }
}
/** List of all GPUSamplerBindingType values. */
export const kSamplerBindingTypes = ['filtering', 'non-filtering', 'comparison'];
assertTypeTrue();

/** Binding type info (including class limits) for the specified GPUTextureBindingLayout. */
export function sampledTextureBindingTypeInfo(d) {
  if (d.multisampled) {
    return {
      usage: GPUConst.TextureUsage.SAMPLED,
      ...kBindingKind.sampledTexMS,
      ...kValidStagesAll,
    };
  } else {
    return { usage: GPUConst.TextureUsage.SAMPLED, ...kBindingKind.sampledTex, ...kValidStagesAll };
  }
}
/** List of all GPUTextureSampleType values. */
export const kTextureSampleTypes = ['float', 'unfilterable-float', 'depth', 'sint', 'uint'];

assertTypeTrue();

/** Binding type info (including class limits) for the specified GPUStorageTextureBindingLayout. */
export function storageTextureBindingTypeInfo(d) {
  switch (d.access) {
    case 'read-only':
      return {
        usage: GPUConst.TextureUsage.STORAGE,
        ...kBindingKind.storageTex,
        ...kValidStagesAll,
      };
    case 'write-only':
      return {
        usage: GPUConst.TextureUsage.STORAGE,
        ...kBindingKind.storageTex,
        ...kValidStagesStorageWrite,
      };
  }
}
/** List of all GPUStorageTextureAccess values. */
export const kStorageTextureAccessValues = ['read-only', 'write-only'];
assertTypeTrue();

/** GPUBindGroupLayoutEntry, but only the "union" fields, not the common fields. */

/** Binding type info (including class limits) for the specified BGLEntry. */
export function texBindingTypeInfo(e) {
  if (e.texture !== undefined) return sampledTextureBindingTypeInfo(e.texture);
  if (e.storageTexture !== undefined) return storageTextureBindingTypeInfo(e.storageTexture);
  unreachable();
}
/** BindingTypeInfo (including class limits) for the specified BGLEntry. */
export function bindingTypeInfo(e) {
  if (e.buffer !== undefined) return bufferBindingTypeInfo(e.buffer);
  if (e.texture !== undefined) return sampledTextureBindingTypeInfo(e.texture);
  if (e.sampler !== undefined) return samplerBindingTypeInfo(e.sampler);
  if (e.storageTexture !== undefined) return storageTextureBindingTypeInfo(e.storageTexture);
  unreachable('GPUBindGroupLayoutEntry has no BindingLayout');
}

/**
 * Generate a list of possible buffer-typed BGLEntry values.
 *
 * Note: Generates different `type` options, but not `hasDynamicOffset` options.
 */
export function bufferBindingEntries(includeUndefined) {
  return [
    ...(includeUndefined ? [{ buffer: { type: undefined } }] : []),
    { buffer: { type: 'uniform' } },
    { buffer: { type: 'storage' } },
    { buffer: { type: 'read-only-storage' } },
  ];
}
/** Generate a list of possible sampler-typed BGLEntry values. */
export function samplerBindingEntries(includeUndefined) {
  return [
    ...(includeUndefined ? [{ sampler: { type: undefined } }] : []),
    { sampler: { type: 'comparison' } },
    { sampler: { type: 'filtering' } },
    { sampler: { type: 'non-filtering' } },
  ];
}
/**
 * Generate a list of possible texture-typed BGLEntry values.
 *
 * Note: Generates different `multisampled` options, but not `sampleType` or `viewDimension` options.
 */
export function textureBindingEntries(includeUndefined) {
  return [
    ...(includeUndefined ? [{ texture: { multisampled: undefined } }] : []),
    { texture: { multisampled: false } },
    { texture: { multisampled: true } },
  ];
}
/**
 * Generate a list of possible storageTexture-typed BGLEntry values.
 *
 * Note: Generates different `access` options, but not `format` or `viewDimension` options.
 */
export function storageTextureBindingEntries(format) {
  return [
    { storageTexture: { access: 'read-only', format } },
    { storageTexture: { access: 'write-only', format } },
  ];
}
/** Generate a list of possible texture-or-storageTexture-typed BGLEntry values. */
export function sampledAndStorageBindingEntries(
  includeUndefined,
  storageTextureFormat = 'rgba8unorm'
) {
  return [
    ...textureBindingEntries(includeUndefined),
    ...storageTextureBindingEntries(storageTextureFormat),
  ];
}
/**
 * Generate a list of possible BGLEntry values of every type, but not variants with different:
 * - buffer.hasDynamicOffset
 * - texture.sampleType
 * - texture.viewDimension
 * - storageTexture.viewDimension
 */
export function allBindingEntries(includeUndefined, storageTextureFormat = 'rgba8unorm') {
  return [
    ...bufferBindingEntries(includeUndefined),
    ...samplerBindingEntries(includeUndefined),
    ...sampledAndStorageBindingEntries(includeUndefined, storageTextureFormat),
  ];
}

// Shader stages

/** List of all GPUShaderStage values. */
export const kShaderStages = [
  GPUConst.ShaderStage.VERTEX,
  GPUConst.ShaderStage.FRAGMENT,
  GPUConst.ShaderStage.COMPUTE,
];

/** List of all possible combinations of GPUShaderStage values. */
export const kShaderStageCombinations = [0, 1, 2, 3, 4, 5, 6, 7];

/**
 * List of all possible texture sampleCount values.
 *
 * - TODO: Update with all possible sample counts when defined
 * - TODO: Switch existing tests to use kTextureSampleCounts
 */
export const kTextureSampleCounts = [1, 4];

// Pipeline limits

/**
 * Maximum number of color attachments to a render pass.
 *
 * - TODO: Update maximum color attachments when defined in the spec.
 */
export const kMaxColorAttachments = 4;

/** `maxVertexBuffers` per GPURenderPipeline, by spec. */
export const kMaxVertexBuffers = 8;
/** `maxVertexAttributes` per GPURenderPipeline, by spec. */
export const kMaxVertexAttributes = 16;
/** `maxVertexBufferArrayStride` in a vertex buffer in a GPURenderPipeline, by spec. */
export const kMaxVertexBufferArrayStride = 2048;
