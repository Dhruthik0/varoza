
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminCoupons() {
  const { user } = useAuth();

  const [coupons, setCoupons] = useState([]);

  const [code, setCode] = useState("");
  const [type, setType] = useState("PERCENTAGE");
  const [discountPercent, setDiscountPercent] = useState("");
  const [buyQuantity, setBuyQuantity] = useState("");
  const [freeQuantity, setFreeQuantity] = useState("");

  const fetchCoupons = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/coupons`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );
    const data = await res.json();
    setCoupons(data || []);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const createCoupon = async () => {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) return alert("Enter coupon code");

    const body = {
      code: normalizedCode,
      type
    };

    // ✅ Percentage Coupon
    if (type === "PERCENTAGE") {
      if (!discountPercent)
        return alert("Enter discount percent");

      body.discountPercent = Number(discountPercent);
    }

    // ✅ Buy X Get Y Coupon
    if (type === "BUY_X_GET_Y") {
      if (!buyQuantity || !freeQuantity)
        return alert("Enter buy & free quantities");

      body.buyQuantity = Number(buyQuantity);
      body.freeQuantity = Number(freeQuantity);
    }

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/coupon`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(body)
      }
    );

    // Reset fields
    setCode("");
    setDiscountPercent("");
    setBuyQuantity("");
    setFreeQuantity("");
    setType("PERCENTAGE");

    fetchCoupons();
  };

  const toggleCoupon = async (code, isActive) => {
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/coupon/toggle`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ code, isActive })
      }
    );
    fetchCoupons();
  };

  return (
    <div className="bg-black/60 p-6 rounded-xl border border-white/10">
      <h2 className="text-xl text-purple-400 mb-4">
        Coupons
      </h2>

      {/* CREATE SECTION */}
      <div className="flex flex-wrap gap-3 mb-6">

        <input
          placeholder="CODE"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          className="px-3 py-2 bg-black/40 text-white rounded"
        />

        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="px-3 py-2 bg-black/40 text-white rounded"
        >
          <option value="PERCENTAGE">Percentage</option>
          <option value="BUY_X_GET_Y">Buy X Get Y</option>
        </select>

        {type === "PERCENTAGE" && (
          <input
            placeholder="%"
            type="number"
            value={discountPercent}
            onChange={e => setDiscountPercent(e.target.value)}
            className="px-3 py-2 bg-black/40 text-white rounded w-20"
          />
        )}

        {type === "BUY_X_GET_Y" && (
          <>
            <input
              placeholder="Buy"
              type="number"
              value={buyQuantity}
              onChange={e => setBuyQuantity(e.target.value)}
              className="px-3 py-2 bg-black/40 text-white rounded w-20"
            />
            <input
              placeholder="Free"
              type="number"
              value={freeQuantity}
              onChange={e => setFreeQuantity(e.target.value)}
              className="px-3 py-2 bg-black/40 text-white rounded w-20"
            />
          </>
        )}

        <button
          onClick={createCoupon}
          className="bg-purple-600 px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* LIST SECTION */}
      <div className="space-y-3">
        {coupons.map(c => (
          <div
            key={c.code}
            className="flex justify-between items-center bg-black/40 p-3 rounded"
          >
            <div>
              <p className="text-white font-semibold">{c.code}</p>

              {c.type === "PERCENTAGE" && (
                <p className="text-gray-400 text-sm">
                  {c.discountPercent}% off
                </p>
              )}

              {c.type === "BUY_X_GET_Y" && (
                <p className="text-gray-400 text-sm">
                  Buy {c.buyQuantity} Get {c.freeQuantity} Free
                </p>
              )}
            </div>

            <button
              onClick={() => toggleCoupon(c.code, !c.isActive)}
              className={`px-4 py-1 rounded ${
                c.isActive
                  ? "bg-green-600"
                  : "bg-gray-600"
              }`}
            >
              {c.isActive ? "Enabled" : "Disabled"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}