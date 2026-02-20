import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminCoupons() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");

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
    if (!code || !discountPercent) return;

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/coupon`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          code: normalizedCode,
          discountPercent: Number(discountPercent),
          isActive: true 
        })
      }
    );

    setCode("");
    setDiscountPercent("");
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

      {/* CREATE */}
      <div className="flex gap-3 mb-6">
        <input
          placeholder="CODE"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          className="px-3 py-2 bg-black/40 text-white rounded"
        />
        <input
          placeholder="%"
          type="number"
          value={discountPercent}
          onChange={e => setDiscountPercent(e.target.value)}
          className="px-3 py-2 bg-black/40 text-white rounded w-20"
        />
        <button
          onClick={createCoupon}
          className="bg-purple-600 px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {coupons.map(c => (
          <div
            key={c.code}
            className="flex justify-between items-center bg-black/40 p-3 rounded"
          >
            <div>
              <p className="text-white font-semibold">{c.code}</p>
              <p className="text-gray-400 text-sm">
                {c.discountPercent}% off
              </p>
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
