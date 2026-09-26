import { apiRequest, isApiConfigured } from "./apiClient.js";
import { MOCK_PRODUCTS } from "../data/products.js";

/**
 * Product document shape (MongoDB-ready):
 * { _id, slug, name, category, brand, price, mrp, image, ... }
 */

export async function fetchProducts(filters = {}) {
  if (isApiConfigured()) {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.q) params.set("q", filters.q);
    const qs = params.toString();
    return apiRequest(`/products${qs ? `?${qs}` : ""}`);
  }

  let list = [...MOCK_PRODUCTS];
  if (filters.category && filters.category !== "all") {
    list = list.filter(
      (p) => p.category.toLowerCase() === String(filters.category).toLowerCase()
    );
  }
  if (filters.q) {
    const q = String(filters.q).toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  return { data: list };
}

export async function fetchProductBySlug(slug) {
  if (isApiConfigured()) {
    return apiRequest(`/products/${encodeURIComponent(slug)}`);
  }
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;
    throw err;
  }
  return { data: product };
}
