const MARKETPLACE_CATEGORIES = [
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

const CATEGORY_LABELS = MARKETPLACE_CATEGORIES.map((category) => category.label);

const CATEGORY_KEYWORDS = {
  movie: [
    "movie",
    "movies",
    "film",
    "cinema",
    "hollywood",
    "bollywood",
    "tollywood",
    "kollywood",
    "sandalwood",
    "web series",
    "webseries",
    "series",
    "dc",
    "marvel",
    "superhero",
    "kannada"
  ],
  "music-bands": [
    "music",
    "band",
    "bands",
    "singer",
    "song",
    "songs",
    "album",
    "rapper",
    "dj",
    "kpop"
  ],
  anime: ["anime", "manga", "otaku", "naruto", "one piece", "aot", "demon slayer"],
  "motivational-quotes": [
    "motivational",
    "motivation",
    "quote",
    "quotes",
    "inspiration",
    "inspirational",
    "success",
    "mindset"
  ],
  "aesthetic-minimal-art": [
    "aesthetic",
    "minimal",
    "minimalist",
    "collage",
    "art",
    "abstract",
    "clean design"
  ],
  "split-design": [
    "split",
    "split design",
    "split poster",
    "split posters",
    "multi panel",
    "triptych",
    "diptych"
  ],
  "cars-bikes": [
    "car",
    "cars",
    "bike",
    "bikes",
    "automobile",
    "vehicle",
    "motorcycle",
    "racing",
    "f1"
  ],
  gaming: [
    "game",
    "gaming",
    "gamer",
    "gta",
    "pubg",
    "bgmi",
    "valorant",
    "cod",
    "fortnite",
    "playstation",
    "xbox"
  ],
  others: ["other", "misc", "devotional", "god", "spiritual", "mythology", "religious"]
};

const normalizeText = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9/\s-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeSellerCategoryInput = (value = "") => {
  const normalized = normalizeText(value);
  if (!normalized) return null;

  for (const category of MARKETPLACE_CATEGORIES) {
    const normalizedLabel = normalizeText(category.label);
    if (normalized === category.id || normalized === normalizedLabel) {
      return category.label;
    }
  }

  return null;
};

const mapRawToCategoryId = (rawCategory = "", title = "") => {
  const normalizedCategory = normalizeText(rawCategory);
  const normalizedTitle = normalizeText(title);

  if (normalizedCategory) {
    for (const category of MARKETPLACE_CATEGORIES) {
      if (
        normalizedCategory === category.id ||
        normalizedCategory === normalizeText(category.label)
      ) {
        return category.id;
      }
    }
  }

  for (const category of MARKETPLACE_CATEGORIES) {
    const keywords = CATEGORY_KEYWORDS[category.id] || [];
    if (
      keywords.some((keyword) => normalizedCategory.includes(normalizeText(keyword)))
    ) {
      return category.id;
    }
  }

  for (const category of MARKETPLACE_CATEGORIES) {
    const keywords = CATEGORY_KEYWORDS[category.id] || [];
    if (
      keywords.some((keyword) => normalizedTitle.includes(normalizeText(keyword)))
    ) {
      return category.id;
    }
  }

  return "others";
};

const mapRawToCategoryLabel = (rawCategory = "", title = "") => {
  const categoryId = mapRawToCategoryId(rawCategory, title);
  const matched = MARKETPLACE_CATEGORIES.find((category) => category.id === categoryId);
  return matched ? matched.label : "Others";
};

module.exports = {
  MARKETPLACE_CATEGORIES,
  CATEGORY_LABELS,
  normalizeSellerCategoryInput,
  mapRawToCategoryId,
  mapRawToCategoryLabel
};
