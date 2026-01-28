// import { useCart } from "../context/CartContext";

// export default function Checkout() {
//   const { totalAmount, clearCart } = useCart();

//   return (
//     <div className="max-w-xl mx-auto px-6 py-16 text-center">
//       <h1 className="text-3xl text-purple-400 mb-6">
//         Complete Payment
//       </h1>

//       <p className="text-gray-400 mb-4">
//         Pay ₹{totalAmount} using UPI
//       </p>

//       {/* ADMIN QR (STATIC FOR NOW) */}
//       <img
//         src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=admin@upi"
//         className="mx-auto mb-6"
//       />

//       <p className="text-gray-300 mb-6">
//         UPI ID: <b>admin@upi</b>
//       </p>

//       <button
//         onClick={() => {
//           alert("Payment marked as pending verification");
//           clearCart();
//         }}
//         className="bg-green-600 px-8 py-4 rounded-xl hover:bg-green-700"
//       >
//         I have paid
//       </button>
//     </div>
//   );
// }
// import { useState } from "react";
// import { useCart } from "../context/CartContext";

// export default function Checkout() {
//   const { cart, totalAmount } = useCart();

//   const [address, setAddress] = useState("");
//   const [phone, setPhone] = useState("");

//   if (cart.length === 0) {
//     return (
//       <div className="text-center text-gray-400 mt-32">
//         Your cart is empty
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-xl mx-auto px-6 py-16">
//       <h1 className="text-3xl text-purple-400 mb-8">
//         Delivery Details
//       </h1>

//       <input
//         className="w-full mb-4 p-4 rounded bg-black/50 text-white"
//         placeholder="Delivery Address"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//       />

//       <input
//         className="w-full mb-6 p-4 rounded bg-black/50 text-white"
//         placeholder="Phone Number"
//         value={phone}
//         onChange={(e) => setPhone(e.target.value)}
//       />

//       <button
//         disabled={!address || !phone}
//         className="w-full bg-purple-600 py-4 rounded-xl hover:bg-purple-700 disabled:opacity-50"
//       >
//         Proceed to Pay ₹{totalAmount}
//       </button>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const submitOrder = async () => {
    if (!address || !phone) {
      alert("Please enter delivery details");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5001/api/orders/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({
            cartItems: cart,
            address,
            phone
          })
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      clearCart();
      navigate("/payment");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl text-purple-400 mb-8">
        Delivery Details
      </h1>

      <textarea
        placeholder="Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full p-4 mb-4 rounded bg-black/40 text-white"
      />

      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full p-4 mb-6 rounded bg-black/40 text-white"
      />

      <button
        onClick={submitOrder}
        disabled={loading}
        className="w-full bg-purple-600 py-4 rounded-xl hover:bg-purple-700"
      >
        {loading
          ? "Processing..."
          : `Proceed to Pay ₹${totalAmount}`}
      </button>
    </div>
  );
}
