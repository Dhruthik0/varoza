

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { useAuth } from "../context/AuthContext";

// export default function Checkout() {
//   const { cart, finalTotal, discountAmount, shippingCharge, coupon, clearCart } = useCart();
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
//         `${import.meta.env.VITE_API_URL}/api/orders/create`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${user?.token}` // ✅ CORRECT
//           },
//           body: JSON.stringify({
//             cartItems: cart.map(item => ({
//               _id: item._id,
//               price: item.price,
//               quantity: item.quantity
//             })),
//             address,
//             phone,
//             couponCode: coupon?.code || null
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
//       <h1 className="text-3xl text-purple-400 mb-8">Delivery Details</h1>

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
//         {loading ? "Processing..." : `Proceed to Pay ₹${finalTotal}`}
//       </button>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { cart, finalTotal, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pin, setPin] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const submitOrder = async () => {
    if (!addressLine1 || !city || !stateName || !pin || !phone) {
      alert("Please fill all required fields");
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      alert("PIN code must be exactly 6 digits");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    const formattedAddress = `
Address Line 1: ${addressLine1}
Address Line 2: ${addressLine2}
City: ${city}
State: ${stateName}
Pin: ${pin}
Phone: ${phone}
`;

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`
          },
          body: JSON.stringify({
            cartItems: cart.map(item => ({
              _id: item._id,
              price: item.price,
              quantity: item.quantity
            })),
            address: formattedAddress,
            phone,
            couponCode: coupon?.code || null
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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0f0f1a] to-black px-4 py-16">
    
    <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-10">
      
      <h1 className="text-3xl font-semibold text-white mb-8">
        Delivery Information
      </h1>

      {/* Address Line 1 */}
      <div className="mb-5">
        <label className="block text-sm text-gray-400 mb-2">
          Address Line 1 *
        </label>
        <input
          placeholder="House No, Street Name"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          className="w-full p-4 rounded-lg bg-black/40 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white transition"
        />
      </div>

      {/* Address Line 2 */}
      <div className="mb-5">
        <label className="block text-sm text-gray-400 mb-2">
          Address Line 2 (Optional)
        </label>
        <input
          placeholder="Apartment, Landmark, Area"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
          className="w-full p-4 rounded-lg bg-black/40 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white transition"
        />
      </div>

      {/* City + State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            City *
          </label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-4 rounded-lg bg-black/40 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            State *
          </label>
          <input
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            className="w-full p-4 rounded-lg bg-black/40 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white transition"
          />
        </div>
      </div>

      {/* PIN + Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            PIN Code *
          </label>
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            maxLength={6}
            className="w-full p-4 rounded-lg bg-black/40 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Phone Number *
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            maxLength={10}
            className="w-full p-4 rounded-lg bg-black/40 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white transition"
          />
        </div>
      </div>

      {/* Button */}
      <button
        onClick={submitOrder}
        disabled={loading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 text-white font-semibold shadow-lg"
      >
        {loading ? "Processing..." : `Proceed to Pay ₹${finalTotal}`}
      </button>

    </div>
  </div>
);
 }


