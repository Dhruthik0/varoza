const CLOUDINARY_UPLOAD_SEGMENT = "/upload/";

const toPositiveInt = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.round(parsed);
};

const isCloudinaryTransformable = (url = "") => {
  return typeof url === "string" && url.includes(CLOUDINARY_UPLOAD_SEGMENT);
};

const buildTransform = (width, options = {}) => {
  const safeWidth = toPositiveInt(width, 600);
  const fit = options.fit || "c_limit";
  const quality = options.quality || "auto:good";
  const format = options.format || "auto";
  const dpr = options.dpr || "auto";
  const progressive = options.progressive === false ? "" : "fl_progressive,";

  return `${fit},w_${safeWidth},${progressive}q_${quality},f_${format},dpr_${dpr}`;
};

export const optimizeImage = (url, width = 600, options = {}) => {
  if (!isCloudinaryTransformable(url)) return url;

  const transform = buildTransform(width, options);
  return url.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${transform}/`);
};

export const buildOptimizedSrcSet = (url, widths = [320, 480, 640, 768, 960, 1200], options = {}) => {
  if (!isCloudinaryTransformable(url)) {
    return undefined;
  }

  const normalizedWidths = Array.from(
    new Set(widths.map((width) => toPositiveInt(width, 0)).filter((width) => width > 0))
  ).sort((a, b) => a - b);

  if (normalizedWidths.length === 0) {
    return undefined;
  }

  return normalizedWidths
    .map((width) => `${optimizeImage(url, width, options)} ${width}w`)
    .join(", ");
};
