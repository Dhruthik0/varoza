import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(Number(value || 0));

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          cartItems: cart.map((item) => ({
            _id: item._id,
            price: item.price,
            quantity: item.quantity
          })),
          address: formattedAddress,
          phone,
          couponCode: coupon?.code || null
        })
      });

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

  const inputClass =
    "h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-black outline-none transition focus:border-[#58181F]";

  return (
    <div className="varoza-container py-8 md:py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border border-black/10 bg-white p-5 card-shadow sm:p-8">
        <h1 className="font-['Cinzel'] text-3xl font-bold text-black md:text-4xl">Delivery Details</h1>
        <p className="mt-2 text-black/65">Fill your shipping details to place the order.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold uppercase tracking-[0.14em] text-black/60">Address line 1 *</label>
            <input
              placeholder="House no, street, locality"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold uppercase tracking-[0.14em] text-black/60">Address line 2</label>
            <input
              placeholder="Apartment, landmark (optional)"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-[0.14em] text-black/60">City *</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-[0.14em] text-black/60">State *</label>
              <input value={stateName} onChange={(e) => setStateName(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-[0.14em] text-black/60">PIN code *</label>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-[0.14em] text-black/60">Phone number *</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="mt-7 rounded-xl border border-black/10 bg-[#F7E7CE] p-4">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-black/60">Payable amount</p>
          <p className="mt-1 text-3xl font-extrabold text-black">Rs. {formatCurrency(finalTotal)}</p>
        </div>

        <button
          onClick={submitOrder}
          disabled={loading}
          className="action-button mt-6 h-12 w-full text-sm uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}
