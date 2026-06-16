import { createContext, useMemo, useState } from "react";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const value = useMemo(() => ({ cart, setCart }), [cart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
