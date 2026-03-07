import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Poster from "../models/Poster.js";

dotenv.config();

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Configure NEW Cloudinary (your active account)
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const OLD_CLOUD_NAME = process.env.OLD_CLOUD_NAME;
    console.log("OLD CLOUD NAME:", OLD_CLOUD_NAME);

    // 🔥 TEST MODE (migrate only 3 OLD posters first)
    const posters = await Poster.find({
      imageUrl: { $regex: OLD_CLOUD_NAME }
    });

    console.log(`Total OLD posters found (test batch): ${posters.length}`);

    let migratedCount = 0;
    const log = [];

    for (const poster of posters) {
      if (!poster.imageUrl) continue;

      console.log("Migrating:", poster._id);

      try {
        const upload = await cloudinary.uploader.upload(
          poster.imageUrl,
          {
            folder: "posters",
            overwrite: false,
          }
        );

        log.push({
          id: poster._id.toString(),
          oldUrl: poster.imageUrl,
          newUrl: upload.secure_url,
        });

        // Update DB
        poster.imageUrl = upload.secure_url;
        await poster.save();

        migratedCount++;
        console.log("Updated:", poster._id);
      } catch (err) {
        console.error("Failed:", poster._id, err.message);
      }
    }

    fs.writeFileSync(
      "migration-log.json",
      JSON.stringify(log, null, 2)
    );

    console.log(`Migration completed. Migrated ${migratedCount} posters.`);
    process.exit();
  } catch (err) {
    console.error("Fatal error:", err);
    process.exit(1);
  }
}

migrate();