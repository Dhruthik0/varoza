const Poster = require("../models/Poster");
const { mapRawToCategoryLabel } = require("../utils/categories");

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.getApprovedPosters = async (req, res) => {
  try {
    const search = req.query.search?.trim();

    // Base condition: approved posters only
    const matchStage = {
      approved: true
    };

    // Aggregation pipeline (correct way)
    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "seller",
          foreignField: "_id",
          as: "seller"
        }
      },
      { $unwind: "$seller" }
    ];

    // 🔍 Search across title, category, seller name, and price
    if (search) {
      const regexSafeSearch = escapeRegex(search);
      const searchConditions = [
        { title: { $regex: regexSafeSearch, $options: "i" } },
        { category: { $regex: regexSafeSearch, $options: "i" } },
        { "seller.name": { $regex: regexSafeSearch, $options: "i" } }
      ];

      const numericCandidate = search.replace(/[₹,\s]/g, "");
      if (/^\d+(\.\d+)?$/.test(numericCandidate)) {
        const numericPrice = Number(numericCandidate);
        searchConditions.push({ price: numericPrice });
        searchConditions.push({
          $expr: {
            $regexMatch: {
              input: { $toString: "$price" },
              regex: regexSafeSearch
            }
          }
        });
      }

      pipeline.push({
        $match: {
          $or: searchConditions
        }
      });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    const posters = await Poster.aggregate(pipeline);
    const normalizedPosters = posters.map((poster) => ({
      ...poster,
      category: mapRawToCategoryLabel(poster.category, poster.title)
    }));

    res.json(normalizedPosters);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
};

exports.getPosterById = async (req, res) => {
  try {
    const poster = await Poster.findOne({
      _id: req.params.id,
      approved: true,
    }).populate("seller", "name");

    if (!poster) {
      return res.status(404).json({ message: "Poster not found" });
    }

    const normalizedPoster = poster.toObject();
    normalizedPoster.category = mapRawToCategoryLabel(normalizedPoster.category, normalizedPoster.title);

    res.json(normalizedPoster);
  } catch (error) {
    res.status(500).json({ message: "Failed to load poster" });
  }
};
