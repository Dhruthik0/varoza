export const MARKETPLACE_CATEGORY_OPTIONS = [
  { id: "movie", label: "Movie" },
  { id: "music-bands", label: "Music / Bands" },
  { id: "anime", label: "Anime" },
  { id: "motivational-quotes", label: "Motivational / Quotes" },
  { id: "aesthetic-minimal-art", label: "Aesthetic / Minimal Art" },
  { id: "split-design", label: "Split Design" },
  { id: "cars-bikes", label: "Cars / Bikes" },
  { id: "gaming", label: "Gaming" },
  { id: "others", label: "Others" }
];

const normalizeCategoryValue = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9/\s-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const resolveCategoryId = (value = "") => {
  const normalized = normalizeCategoryValue(value);
  if (!normalized) return "others";

  const matched = MARKETPLACE_CATEGORY_OPTIONS.find(
    (category) =>
      category.id === normalized ||
      normalizeCategoryValue(category.label) === normalized
  );

  return matched ? matched.id : "others";
};

export const LEGACY_HASH_TO_CATEGORY_ID = {
  anime: "anime",
  cars: "cars-bikes",
  devotional: "others",
  "web-series": "movie",
  "dc-marvel": "movie",
  kannada: "movie",
  split: "split-design",
  "split-posters": "split-design"
};
