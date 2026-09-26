import { Router } from "express";
import { Product, serializeProduct } from "../models/Product.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const category = req.query.category;
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

    const filter = {};
    if (category && category !== "all") {
      filter.category = String(category);
    }

    if (q) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { name: regex },
        { brand: regex },
        { tags: regex },
        { description: regex },
      ];
    }

    const docs = await Product.find(filter).sort({ name: 1 }).lean();
    const data = docs.map((d) => serializeProduct(d));
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load products" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const slug = String(req.params.slug || "").trim();
    const doc = await Product.findOne({ slug }).lean();
    if (!doc) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ data: serializeProduct(doc) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load product" });
  }
});

export default router;
