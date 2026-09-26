import "dotenv/config";
import mongoose from "mongoose";
import { Product } from "./models/Product.js";
import { CATALOG } from "./data/seedCatalog.js";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);

let upserted = 0;
for (const item of CATALOG) {
  const result = await Product.updateOne(
    { slug: item.slug },
    { $set: item },
    { upsert: true }
  );
  if (result.upsertedCount) upserted += 1;
}

const total = await Product.countDocuments();
console.log(`Seed complete. Upserted ${upserted} new docs. Total products: ${total}.`);

await mongoose.disconnect();
process.exit(0);
