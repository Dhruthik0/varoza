
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";

// export default function Cart() {
//   const { cart = [], totalAmount } = useCart();
//   const navigate = useNavigate();

//   if (cart.length === 0) {
//     return (
//       <div className="text-center text-gray-400 mt-32">
//         Your cart is empty
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-6 py-16">
//       <h1 className="text-3xl text-purple-400 mb-8">
//         Your Cart
//       </h1>

//       {/* 🛒 CART ITEMS */}
//       <div className="space-y-4">
//         {cart.map((item) => (
//           <div
//             key={item._id}
//             className="flex items-center justify-between bg-black/60 p-4 rounded-xl border border-white/10"
//           >
//             {/* LEFT: IMAGE + INFO */}
//             <div className="flex items-center gap-4">
//               <img
//                 src={item.imageUrl}
//                 alt={item.title}
//                 className="w-20 h-20 rounded-lg object-cover"
//               />

//               <div>
//                 <p className="text-white font-semibold">
//                   {item.title}
//                 </p>
//                 <p className="text-gray-400 text-sm">
//                   ₹{item.price}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* 💰 TOTAL + CHECKOUT */}
//       <div className="mt-10 flex justify-between items-center">
//         <p className="text-xl text-white">
//           Total: ₹{totalAmount}
//         </p>

//         <button
//           onClick={() => navigate("/checkout")}
//           className="bg-purple-600 px-8 py-4 rounded-xl hover:bg-purple-700"
//         >
//           Proceed to Checkout
//         </button>
//       </div>
//     </div>
//   );
// }
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cart = [],
    totalAmount,
    addToCart,
    decreaseQuantity,
    removeFromCart
  } = useCart();

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-32">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl text-purple-400 mb-8">
        Your Cart
      </h1>

      {/* 🛒 CART ITEMS */}
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between bg-black/60 p-4 rounded-xl border border-white/10"
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-20 h-20 rounded-lg object-cover"
              />

              <div>
                <p className="text-white font-semibold">
                  {item.title}
                </p>
                <p className="text-gray-400 text-sm">
                  ₹{item.price}
                </p>
                <p className="text-gray-300 text-sm">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => decreaseQuantity(item._id)}
                className="px-3 py-1 bg-gray-700 rounded"
              >
                −
              </button>

              <button
                onClick={() => addToCart(item)}
                className="px-3 py-1 bg-gray-700 rounded"
              >
                +
              </button>

              <button
                onClick={() => removeFromCart(item._id)}
                className="px-4 py-1 bg-red-600 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 💰 TOTAL */}
      <div className="mt-10 flex justify-between items-center">
        <p className="text-xl text-white">
          Total: ₹{totalAmount}
        </p>

        <button
          onClick={() => navigate("/checkout")}
          className="bg-purple-600 px-8 py-4 rounded-xl hover:bg-purple-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
