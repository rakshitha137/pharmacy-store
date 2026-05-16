import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/product/ProductGrid.jsx";
import Button from "../components/ui/Button.jsx";
import { CATEGORIES } from "../data/products.js";
import { fetchProducts } from "../services/productsService.js";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import "./Products.css";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const q = searchParams.get("q") || "";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addItem } = useCart();
  const { toast } = useToast();

  const filters = useMemo(() => ({ category, q }), [category, q]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError("");
      try {
        const res = await fetchProducts(filters);
        const list = Array.isArray(res?.data) ? res.data : res;
        if (!cancelled) setItems(Array.isArray(list) ? list : []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const onAdd = useCallback(
    (product) => {
      addItem(product, 1);
      toast({
        title: "Added to cart",
        message: `${product.name} — 1 unit`,
        variant: "success",
      });
    },
    [addItem, toast]
  );

  const setCategory = (next) => {
    const params = new URLSearchParams(searchParams);
    if (next === "all") params.delete("category");
    else params.set("category", next);
    setSearchParams(params);
  };

  return (
    <div className="products-page">
      <div className="products-page__hero">
        <div className="products-page__hero-inner">
          <h1 className="products-page__title">Pharmacy catalog</h1>
          <p className="products-page__lead">
            Filter by category, search instantly, and add to cart — all offline-first
            until your MongoDB API is connected.
          </p>
        </div>
      </div>

      <div className="products-page__bar">
        <div className="products-page__filters" role="tablist" aria-label="Categories">
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`cat-pill ${active ? "is-active" : ""}`}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        <form
          className="products-page__search"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const nextQ = String(fd.get("q") || "").trim();
            const params = new URLSearchParams(searchParams);
            if (nextQ) params.set("q", nextQ);
            else params.delete("q");
            setSearchParams(params);
          }}
        >
          <label className="sr-only" htmlFor="products-q">
            Search products
          </label>
          <input
            id="products-q"
            name="q"
            defaultValue={q}
            className="products-page__input"
            placeholder="Search medicines, brands, tags…"
          />
          <Button type="submit" variant="primary" size="md">
            Search
          </Button>
        </form>
      </div>

      <div className="products-page__content">
        {loading ? <div className="products-page__state">Loading catalog…</div> : null}
        {!loading && error ? (
          <div className="products-page__state products-page__state--error">
            {error}
          </div>
        ) : null}
        {!loading && !error && items.length === 0 ? (
          <div className="products-page__state">No products match your filters.</div>
        ) : null}
        {!loading && !error && items.length > 0 ? (
          <ProductGrid products={items} onAdd={onAdd} />
        ) : null}
      </div>
    </div>
  );
}
