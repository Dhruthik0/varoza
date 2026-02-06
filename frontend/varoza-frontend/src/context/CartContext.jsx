
// import { createContext, useContext, useEffect, useState } from "react";

// const CartContext = createContext();

// export function CartProvider({ children }) {
//   const [cart, setCart] = useState(() => {
//     const stored = localStorage.getItem("varoza_cart");
//     return stored ? JSON.parse(stored) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem("varoza_cart", JSON.stringify(cart));
//   }, [cart]);

//   // ✅ ADD OR INCREASE QUANTITY
//   const addToCart = (poster) => {
//     setCart((prev) => {
//       const existing = prev.find((p) => p._id === poster._id);

//       if (existing) {
//         return prev.map((p) =>
//           p._id === poster._id
//             ? { ...p, quantity: p.quantity + 1 }
//             : p
//         );
//       }

//       return [...prev, { ...poster, quantity: 1 }];
//     });
//   };

//   // ➖ DECREASE QUANTITY (REMOVE IF 0)
//   const decreaseQuantity = (id) => {
//     setCart((prev) =>
//       prev
//         .map((p) =>
//           p._id === id
//             ? { ...p, quantity: p.quantity - 1 }
//             : p
//         )
//         .filter((p) => p.quantity > 0)
//     );
//   };

//   // ❌ REMOVE COMPLETELY
//   const removeFromCart = (id) => {
//     setCart((prev) => prev.filter((p) => p._id !== id));
//   };

//   const clearCart = () => {
//     setCart([]);
//     localStorage.removeItem("varoza_cart");
//   };

//   // 💰 FIXED TOTAL
//   const totalAmount = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         decreaseQuantity,
//         removeFromCart,
//         clearCart,
//         totalAmount
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export const useCart = () => useContext(CartContext);

// import { createContext, useContext, useEffect, useState } from "react";

// const CartContext = createContext();
// const [coupon, setCoupon] = useState(null); 
// const [shippingCharge, setShippingCharge] = useState(0);

// export function CartProvider({ children }) {
//   const [cart, setCart] = useState(() => {
//     const stored = localStorage.getItem("varoza_cart");
//     return stored ? JSON.parse(stored) : [];
//   });

//   const [coupon, setCoupon] = useState(null); // { code, discountPercent }
//   const [shippingCharge, setShippingCharge] = useState(0);

//   useEffect(() => {
//     localStorage.setItem("varoza_cart", JSON.stringify(cart));
//   }, [cart]);

//   // ➕ ADD / INCREASE QUANTITY
//   const addToCart = (poster) => {
//     setCart((prev) => {
//       const existing = prev.find((p) => p._id === poster._id);//
//       if (existing) {
//         return prev.map((p) =>
//           p._id === poster._id
//             ? { ...p, quantity: p.quantity + 1 }
//             : p
//         );
//       }//
//       return [...prev, { ...poster, quantity: 1 }];
//     });
//   };

//   // ➖ DECREASE QUANTITY
//   const decreaseQuantity = (id) => {
//     setCart((prev) =>
//       prev
//         .map((p) =>
//           p._id === id ? { ...p, quantity: p.quantity - 1 } : p
//         )
//         .filter((p) => p.quantity > 0)
//     );
//   };
// //
//   const removeFromCart = (id) => {
//     setCart((prev) => prev.filter((p) => p._id !== id));
//   };

//   const clearCart = () => {
//     setCart([]);
//     setCoupon(null);
//     localStorage.removeItem("varoza_cart");
//   };

//   // 💰 CALCULATIONS
//   const subTotal = cart.reduce(
//   (sum, item) =>
//     sum +
//     Number(item.price || 0) *
//     Number(item.quantity || 1),
//   0
// );

// const discountAmount = coupon
//   ? (subTotal * coupon.discountPercent) / 100
//   : 0;

// const finalTotal =
//   Number(subTotal) -
//   Number(discountAmount) +
//   Number(shippingCharge);


//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         decreaseQuantity,
//         removeFromCart,
//         clearCart,
//         subTotal,
//         discountAmount,
//         finalTotal,
//         coupon,
//         setCoupon,
//         shippingCharge,
//         setShippingCharge
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export const useCart = () => useContext(CartContext);
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("varoza_cart");
    return stored ? JSON.parse(stored) : [];
  });

  const [coupon, setCoupon] = useState(null); // { code, discountPercent }
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

  // 💰 CALCULATIONS (SINGLE SOURCE OF TRUTH)
  const subTotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const discountAmount = coupon
    ? (subTotal * coupon.discountPercent) / 100
    : 0;

  const finalTotal =
    subTotal - discountAmount + shippingCharge;

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
        shippingCharge,
        setShippingCharge
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ✅ ONLY PLACE useContext IS CALLED
export const useCart = () => {
  return useContext(CartContext);
};
