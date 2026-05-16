import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const CartContext = createContext(null);

function normalizeCartItem(product, quantity) {
  return {
    productId: product._id,
    slug: product.slug,
    name: product.name,
    image: product.image,
    price: product.price,
    mrp: product.mrp,
    requiresPrescription: Boolean(product.requiresPrescription),
    quantity: Math.max(1, Math.min(99, Number(quantity) || 1)),
  };
}

function cartTotals(items) {
  const subtotal = items.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0
  );
  const savings = items.reduce(
    (sum, line) => sum + Math.max(0, (line.mrp - line.price) * line.quantity),
    0
  );
  const delivery = subtotal >= 499 || subtotal === 0 ? 0 : 49;
  const total = subtotal + delivery;
  return { subtotal, savings, delivery, total, count: items.length };
}

export function CartProvider({ children }) {
  const [rawItems, setRawItems] = useLocalStorage("carerx-cart", []);

  const items = Array.isArray(rawItems) ? rawItems : [];

  const addItem = useCallback((product, quantity = 1) => {
    setRawItems((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const idx = list.findIndex((x) => x.productId === product._id);
      const nextLine = normalizeCartItem(product, quantity);
      if (idx === -1) return [...list, nextLine];
      const copy = [...list];
      const merged = normalizeCartItem(product, copy[idx].quantity + quantity);
      copy[idx] = merged;
      return copy;
    });
  }, [setRawItems]);

  const updateQuantity = useCallback(
    (productId, quantity) => {
      setRawItems((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        return list
          .map((line) =>
            line.productId === productId
              ? { ...line, quantity: Math.max(1, Math.min(99, Number(quantity) || 1)) }
              : line
          )
          .filter((line) => line.quantity > 0);
      });
    },
    [setRawItems]
  );

  const removeItem = useCallback(
    (productId) => {
      setRawItems((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        return list.filter((line) => line.productId !== productId);
      });
    },
    [setRawItems]
  );

  const clearCart = useCallback(() => {
    setRawItems([]);
  }, [setRawItems]);

  const totals = useMemo(() => cartTotals(items), [items]);

  const value = useMemo(
    () => ({
      items,
      totals,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, totals, addItem, updateQuantity, removeItem, clearCart]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
