const Poster = require("../models/Poster");

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

    // 🔍 Search across title, category, seller name
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { "seller.name": { $regex: search, $options: "i" } }
          ]
        }
      });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    const posters = await Poster.aggregate(pipeline);

    res.json(posters);
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

    res.json(poster);
  } catch (error) {
    res.status(500).json({ message: "Failed to load poster" });
  }
};

