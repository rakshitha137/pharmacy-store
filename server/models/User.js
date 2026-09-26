import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

export function serializeUser(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    _id: String(o._id),
    name: o.name,
    email: o.email,
    createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
  };
}

export const User = mongoose.models.User || mongoose.model("User", userSchema);
