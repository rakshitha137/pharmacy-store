import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "./Layout.css";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef(null);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 10);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSearch]);

  return (
    <div className="site-shell">
      <Header onOpenSearch={openSearch} />
      <main className="site-main">{children}</main>
      <Footer />

      {searchOpen ? (
        <div className="search-overlay" role="dialog" aria-modal="true">
          <button
            type="button"
            className="search-overlay__backdrop"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          />
          <div className="search-overlay__panel">
            <div className="search-overlay__head">
              <div className="search-overlay__title">Search catalog</div>
              <button
                type="button"
                className="search-overlay__close"
                onClick={() => setSearchOpen(false)}
              >
                Close
              </button>
            </div>
            <form
              className="search-overlay__form"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const q = String(fd.get("q") || "").trim();
                setSearchOpen(false);
                navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
              }}
            >
              <label className="sr-only" htmlFor="global-search">
                Search query
              </label>
              <input
                ref={inputRef}
                id="global-search"
                name="q"
                className="search-overlay__input"
                placeholder="Search by medicine, brand, or use-case…"
                autoComplete="off"
              />
              <button type="submit" className="search-overlay__submit">
                Search
              </button>
            </form>
            <p className="search-overlay__hint">
              Tip: press <kbd>/</kbd> anywhere to open search.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
