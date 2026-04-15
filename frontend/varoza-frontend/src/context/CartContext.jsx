
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const FREE_SHIPPING_THRESHOLD = 200;

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("varoza_cart");
    return stored ? JSON.parse(stored) : [];
  });

  const [coupon, setCoupon] = useState(null); 
  const [shippingCharge, setShippingCharge] = useState(0);

  useEffect(() => {
    localStorage.setItem("varoza_cart", JSON.stringify(cart));
  }, [cart]);

  // ➕ ADD / INCREASE
  const addToCart = (poster) => {
    setCart((prev) => {
      const existing = prev.find((p) => p._id === poster._id);
      if (existing) {
        return prev.map((p) =>
          p._id === poster._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...poster, quantity: 1 }];
    });
  };

  // ➖ DECREASE
  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p._id === id ? { ...p, quantity: p.quantity - 1 } : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p._id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
    localStorage.removeItem("varoza_cart");
  };

  // 💰 SUBTOTAL
  const subTotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  // 🧠 BUY X GET Y CALCULATION
  const calculateBuyXGetYDiscount = (cart, buyQty, freeQty) => {
    let prices = [];

    cart.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        prices.push(Number(item.price));
      }
    });

    prices.sort((a, b) => a - b); // lowest first

    const groupSize = buyQty + freeQty;
    const totalGroups = Math.floor(prices.length / groupSize);
    const totalFreeItems = totalGroups * freeQty;

    return prices
      .slice(0, totalFreeItems)
      .reduce((sum, price) => sum + price, 0);
  };

  // 🎟 DISCOUNT LOGIC (UPDATED)
  let discountAmount = 0;

  if (coupon?.type === "PERCENTAGE") {
    discountAmount = (subTotal * coupon.discountPercent) / 100;
  }

  if (coupon?.type === "BUY_X_GET_Y") {
    discountAmount = calculateBuyXGetYDiscount(
      cart,
      coupon.buyQuantity,
      coupon.freeQuantity
    );
  }

  const qualifiesForFreeShipping = subTotal >= FREE_SHIPPING_THRESHOLD;
  const effectiveShippingCharge = qualifiesForFreeShipping ? 0 : shippingCharge;
  const amountForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subTotal);

  // 💵 FINAL TOTAL
  const finalTotal =
    subTotal - discountAmount + effectiveShippingCharge;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        subTotal,
        discountAmount,
        finalTotal,
        coupon,
        setCoupon,
        shippingCharge: effectiveShippingCharge,
        baseShippingCharge: shippingCharge,
        setShippingCharge,
        qualifiesForFreeShipping,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountForFreeShipping
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


export const useCart = () => {
  return useContext(CartContext);
};
