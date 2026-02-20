
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { optimizeImage } from "../utils/optimizeImage";

const storedUser = JSON.parse(localStorage.getItem("user"));
const token = storedUser?.token;

export default function Cart() {
  const {
    cart = [],
    subTotal,
    discountAmount,
    shippingCharge,
    setShippingCharge,
    setCoupon,
    finalTotal,
    addToCart,
    decreaseQuantity,
    removeFromCart
  } = useCart();

  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // 🚚 FETCH SHIPPING
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/shipping/public`)
      .then(res => res.json())
      .then(data => {
        setShippingCharge(data.shippingCharge || 0);
      })
      .catch(() => setShippingCharge(0));
  }, []);

  // 🎟 APPLY COUPON
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/coupon/validate/public`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ code: couponCode })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setDiscountPercent(data.discountPercent);

      // ✅ REQUIRED LINE (GLOBAL STATE)
      setCoupon({
        code: couponCode,
        discountPercent: data.discountPercent
      });

    } catch (err) {
      alert(err.message || "Invalid coupon");
      setDiscountPercent(0);
      setCoupon(null);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-32">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl text-purple-400 mb-8">Your Cart</h1>

      {/* CART ITEMS */}
      <div className="space-y-4">
        {cart.map(item => (
          <div
            key={item._id}
            className="flex items-center justify-between bg-black/60 p-4 rounded-xl border border-white/10"
          >

            <div className="flex items-center gap-4">
              <img
                  src={optimizeImage(item.imageUrl, 400)}
                  alt={item.title}
                  className="w-20 h-20 rounded-lg object-cover"
                  loading="lazy"
                />

              <div>
                <p className="text-white font-semibold">{item.title}</p>
                <p className="text-gray-400 text-sm">₹{item.price}</p>
                <p className="text-gray-300 text-sm">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>


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

      {/* COUPON */}
      <div className="mt-8 bg-black/60 p-4 rounded-xl border border-white/10">
        <p className="text-gray-300 mb-2">Apply Coupon</p>
        <div className="flex gap-2">
          <input
            value={couponCode}
            onChange={e => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 px-3 py-2 rounded bg-black/40 text-white border border-white/10"
          />
          <button
            onClick={applyCoupon}
            className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
          >
            Apply
          </button>
        </div>

        {discountPercent > 0 && (
          <p className="text-green-400 text-sm mt-2">
            Coupon applied: {discountPercent}% off
          </p>
        )}
      </div>

      {/* TOTAL */}
      <div className="mt-10 space-y-2 text-gray-300">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subTotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹{shippingCharge}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount</span>
          <span>- ₹{discountAmount}</span>
        </div>
        <div className="flex justify-between text-white text-xl font-semibold mt-2">
          <span>Total</span>
          <span>₹{finalTotal}</span>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
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
 