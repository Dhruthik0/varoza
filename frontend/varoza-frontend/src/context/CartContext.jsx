import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("varoza_cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("varoza_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (poster) => {
    setCart((prev) => {
      if (prev.find((p) => p._id === poster._id)) return prev;
      return [...prev, poster];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p._id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("varoza_cart");
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
