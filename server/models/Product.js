import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    form: { type: String, required: true, trim: true },
    packSize: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    requiresPrescription: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
    description: { type: String, required: true },
    image: { type: String, required: true },
    highlights: { type: [String], default: [] },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export function serializeProduct(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    ...o,
    _id: String(o._id),
  };
}

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
