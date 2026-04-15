import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { buildOptimizedSrcSet, optimizeImage } from "../utils/optimizeImage";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(Number(value || 0));

export default function Cart() {
  const {
    cart = [],
    subTotal,
    discountAmount,
    shippingCharge,
    baseShippingCharge,
    setShippingCharge,
    setCoupon,
    finalTotal,
    qualifiesForFreeShipping,
    freeShippingThreshold,
    amountForFreeShipping,
    addToCart,
    decreaseQuantity,
    removeFromCart
  } = useCart();

  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/shipping/public`)
      .then((res) => res.json())
      .then((data) => {
        setShippingCharge(data.shippingCharge || 0);
      })
      .catch(() => setShippingCharge(0));
  }, [setShippingCharge]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/coupon/validate/public`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUser?.token || ""}`
        },
        body: JSON.stringify({ code: couponCode })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (data.type === "PERCENTAGE") {
        setDiscountPercent(data.discountPercent);
        setCoupon({
          code: couponCode,
          type: "PERCENTAGE",
          discountPercent: data.discountPercent
        });
        return;
      }

      if (data.type === "BUY_X_GET_Y") {
        setDiscountPercent(0);
        setCoupon({
          code: couponCode,
          type: "BUY_X_GET_Y",
          buyQuantity: data.buyQuantity,
          freeQuantity: data.freeQuantity
        });
      }
    } catch (err) {
      alert(err.message || "Invalid coupon");
      setDiscountPercent(0);
      setCoupon(null);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="varoza-container py-16 text-center">
        <div className="mx-auto max-w-xl rounded-2xl border border-black/10 bg-white p-8 card-shadow">
          <h1 className="font-['Cinzel'] text-3xl font-bold text-black">Your cart is empty</h1>
          <p className="mt-3 text-black/65">Add posters to continue checkout.</p>
          <Link to="/marketplace" className="action-button mt-6 inline-flex px-6 py-3 text-sm uppercase tracking-[0.16em]">
            Browse Posters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="varoza-container py-8 md:py-12">
      <h1 className="font-['Cinzel'] text-3xl font-bold tracking-wide text-black md:text-5xl">Your Cart</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {cart.map((item) => (
            <article key={item._id} className="rounded-2xl border border-black/10 bg-white p-4 card-shadow sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={optimizeImage(item.imageUrl, 500)}
                    srcSet={buildOptimizedSrcSet(item.imageUrl, [120, 180, 240, 320, 420, 500])}
                    sizes="(max-width: 640px) 80px, 96px"
                    alt={item.title}
                    className="h-24 w-20 rounded-xl border border-black/10 object-cover sm:h-28 sm:w-24"
                    loading="lazy"
                    decoding="async"
                  />

                  <div>
                    <h2 className="text-lg font-extrabold text-black">{item.title}</h2>
                    <p className="mt-1 text-black/65">Rs. {formatCurrency(item.price)}</p>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-black/55">Quantity: {item.quantity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    className="h-10 w-10 rounded-full border border-black/20 bg-[#F7E7CE] text-lg font-bold text-black"
                  >
                    -
                  </button>

                  <button
                    onClick={() => addToCart(item)}
                    className="h-10 w-10 rounded-full border border-black/20 bg-[#F7E7CE] text-lg font-bold text-black"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="rounded-full bg-[#58181F] px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="rounded-2xl border border-black/10 bg-white p-5 card-shadow sm:p-6">
          <h2 className="font-['Cinzel'] text-2xl font-bold text-black">Order Summary</h2>

          <div className="mt-5 rounded-xl border border-black/10 bg-[#F7E7CE] p-4">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-black/55">Apply Coupon</p>
            <div className="mt-3 flex gap-2">
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="Enter coupon code"
                className="h-11 flex-1 rounded-lg border border-black/15 bg-white px-3 text-black outline-none"
              />
              <button
                onClick={applyCoupon}
                className="rounded-lg bg-black px-4 text-sm font-bold uppercase tracking-[0.12em] text-white"
              >
                Apply
              </button>
            </div>

            {discountPercent > 0 && (
              <p className="mt-2 text-sm font-semibold text-[#58181F]">Coupon applied: {discountPercent}% off</p>
            )}
          </div>

          {baseShippingCharge > 0 && (
            <div
              className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${
                qualifiesForFreeShipping
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-[#58181F]/20 bg-[#58181F]/5 text-[#58181F]"
              }`}
            >
              {qualifiesForFreeShipping
                ? `Free shipping unlocked on orders ₹${formatCurrency(freeShippingThreshold)} and above.`
                : `Add ₹${formatCurrency(amountForFreeShipping)} more to get free shipping.`}
            </div>
          )}

          <div className="mt-6 space-y-2 text-base text-black/75">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {formatCurrency(subTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              {qualifiesForFreeShipping && baseShippingCharge > 0 ? (
                <span className="font-semibold text-emerald-700">
                  <span className="mr-2 text-black/45 line-through">Rs. {formatCurrency(baseShippingCharge)}</span>
                  Rs. 0
                </span>
              ) : (
                <span>Rs. {formatCurrency(shippingCharge)}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>- Rs. {formatCurrency(discountAmount)}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-black/10 pt-3 text-xl font-extrabold text-black">
              <span>Total</span>
              <span>Rs. {formatCurrency(finalTotal)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="action-button mt-6 h-12 w-full text-sm uppercase tracking-[0.16em]"
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}
