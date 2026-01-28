
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { useAuth } from "../context/AuthContext";

// export default function Checkout() {
//   const { cart, totalAmount, clearCart } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [address, setAddress] = useState("");
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);

//   const submitOrder = async () => {
//     if (!address || !phone) {
//       alert("Please enter delivery details");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch(
//         "https://varoza-backend.onrender.com/api/orders/create",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${user.token}`
//           },
//           body: JSON.stringify({
//             cartItems: cart,
//             address,
//             phone
//           })
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message);

//       clearCart();
//       navigate("/payment");
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto px-6 py-16">
//       <h1 className="text-3xl text-purple-400 mb-8">
//         Delivery Details
//       </h1>

//       <textarea
//         placeholder="Delivery Address"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//         className="w-full p-4 mb-4 rounded bg-black/40 text-white"
//       />

//       <input
//         type="tel"
//         placeholder="Phone Number"
//         value={phone}
//         onChange={(e) => setPhone(e.target.value)}
//         className="w-full p-4 mb-6 rounded bg-black/40 text-white"
//       />

//       <button
//         onClick={submitOrder}
//         disabled={loading}
//         className="w-full bg-purple-600 py-4 rounded-xl hover:bg-purple-700"
//       >
//         {loading
//           ? "Processing..."
//           : `Proceed to Pay ₹${totalAmount}`}
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
        "https://varoza-backend.onrender.com/api/orders/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({
            cartItems: cart.map(item => ({
              _id: item._id,
              price: item.price,
              quantity: item.quantity
            })),
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

