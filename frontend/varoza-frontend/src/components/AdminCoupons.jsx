import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function AdminCoupons() {
  const { user } = useAuth();

  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  const [code, setCode] = useState("");
  const [type, setType] = useState("PERCENTAGE");
  const [discountPercent, setDiscountPercent] = useState("");
  const [buyQuantity, setBuyQuantity] = useState("");
  const [freeQuantity, setFreeQuantity] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCoupons = useCallback(async () => {
    if (!user?.token) {
      return;
    }

    setLoadingCoupons(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/coupons`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      const data = await res.json().catch(() => []);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load coupons");
      }

      setCoupons(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load coupons");
    } finally {
      setLoadingCoupons(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const createCoupon = async () => {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      toast.error("Enter coupon code");
      return;
    }

    const body = {
      code: normalizedCode,
      type
    };

    if (type === "PERCENTAGE") {
      if (!discountPercent) {
        toast.error("Enter discount percent");
        return;
      }
      body.discountPercent = Number(discountPercent);
    }

    if (type === "BUY_X_GET_Y") {
      if (!buyQuantity || !freeQuantity) {
        toast.error("Enter buy and free quantities");
        return;
      }
      body.buyQuantity = Number(buyQuantity);
      body.freeQuantity = Number(freeQuantity);
    }

    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to create coupon");
      }

      toast.success("Coupon added");
      setCode("");
      setDiscountPercent("");
      setBuyQuantity("");
      setFreeQuantity("");
      setType("PERCENTAGE");
      fetchCoupons();
    } catch (error) {
      toast.error(error.message || "Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  const toggleCoupon = async (couponCode, isActive) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/coupon/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ code: couponCode, isActive })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to update coupon");
      }

      toast.success(`Coupon ${isActive ? "enabled" : "disabled"}`);
      fetchCoupons();
    } catch (error) {
      toast.error(error.message || "Failed to update coupon");
    }
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-[#fff9ef] p-4 md:p-5">
      <h3 className="font-['Cinzel'] text-xl font-semibold tracking-[0.05em] text-[#58181F]">Coupons</h3>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input
          placeholder="Coupon Code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm font-semibold text-black outline-none focus:border-[#58181F]"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm font-semibold text-black outline-none focus:border-[#58181F]"
        >
          <option value="PERCENTAGE">Percentage</option>
          <option value="BUY_X_GET_Y">Buy X Get Y</option>
        </select>

        {type === "PERCENTAGE" ? (
          <input
            placeholder="Discount %"
            type="number"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            className="rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm font-semibold text-black outline-none focus:border-[#58181F]"
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Buy"
              type="number"
              value={buyQuantity}
              onChange={(e) => setBuyQuantity(e.target.value)}
              className="rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm font-semibold text-black outline-none focus:border-[#58181F]"
            />
            <input
              placeholder="Free"
              type="number"
              value={freeQuantity}
              onChange={(e) => setFreeQuantity(e.target.value)}
              className="rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm font-semibold text-black outline-none focus:border-[#58181F]"
            />
          </div>
        )}

        <button
          type="button"
          onClick={createCoupon}
          disabled={saving}
          className="rounded-full bg-black px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.13em] text-white transition hover:bg-[#58181F] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Add Coupon"}
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {loadingCoupons ? (
          <div className="rounded-xl border border-dashed border-black/20 bg-white px-4 py-5 text-sm font-semibold text-black/60">
            Loading coupons...
          </div>
        ) : coupons.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/20 bg-white px-4 py-5 text-sm font-semibold text-black/60">
            No coupons added.
          </div>
        ) : (
          coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="flex flex-col justify-between gap-3 rounded-xl border border-black/10 bg-white p-4 sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-base font-black text-black">{coupon.code}</p>
                {coupon.type === "PERCENTAGE" && (
                  <p className="text-sm font-semibold text-black/65">{coupon.discountPercent}% off</p>
                )}
                {coupon.type === "BUY_X_GET_Y" && (
                  <p className="text-sm font-semibold text-black/65">
                    Buy {coupon.buyQuantity} get {coupon.freeQuantity} free
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => toggleCoupon(coupon.code, !coupon.isActive)}
                className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] transition ${
                  coupon.isActive
                    ? "border border-black bg-black text-white hover:bg-[#58181F]"
                    : "border border-black/20 bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                {coupon.isActive ? "Enabled" : "Disabled"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
