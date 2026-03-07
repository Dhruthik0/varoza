import { useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAnalytics } from "../services/adminService";
import { AuthContext } from "../context/AuthContext";
import AdminCoupons from "../components/AdminCoupons";

export default function AdminAnalytics() {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [margin, setMargin] = useState("");
  const [updatingMargin, setUpdatingMargin] = useState(false);

  const [shippingCharge, setShippingCharge] = useState("");
  const [updatingShipping, setUpdatingShipping] = useState(false);

  const loadAnalytics = useCallback(async () => {
    if (!user?.token) {
      return;
    }

    setLoading(true);
    try {
      const data = await getAnalytics(user.token);
      setAnalytics(data || {});
    } catch (err) {
      console.error("Analytics error", err);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const updateMargin = async () => {
    if (!margin) {
      toast.error("Enter margin percentage");
      return;
    }

    setUpdatingMargin(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/set-margin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          marginPercentage: Number(margin)
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to update margin");
      }

      toast.success("Seller margin updated successfully");
      setMargin("");
      loadAnalytics();
    } catch (err) {
      toast.error(err.message || "Failed to update margin");
    } finally {
      setUpdatingMargin(false);
    }
  };

  const updateShipping = async () => {
    if (!shippingCharge) {
      toast.error("Enter shipping amount");
      return;
    }

    setUpdatingShipping(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/set-shipping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          shippingCharge: Number(shippingCharge)
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to update shipping charge");
      }

      toast.success("Shipping charge updated successfully");
      setShippingCharge("");
    } catch (err) {
      toast.error(err.message || "Failed to update shipping charge");
    } finally {
      setUpdatingShipping(false);
    }
  };

  if (loading) {
    return (
      <div className="varoza-container py-16">
        <div className="rounded-3xl border border-black/10 bg-white/80 p-10 text-center card-shadow">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#58181F]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="varoza-container py-8 md:py-12">
      <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 card-shadow md:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.26em] text-[#58181F]">Admin Control Room</p>
        <h1 className="mt-2 font-['Cinzel'] text-3xl font-semibold tracking-[0.08em] text-black md:text-4xl">
          Platform Analytics
        </h1>
        <p className="mt-3 max-w-2xl text-base text-black/70">
          Track marketplace performance and configure pricing controls from one place.
        </p>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Orders" value={analytics?.totalOrders ?? 0} accent="text-[#58181F]" />
          <StatCard label="Total Revenue" value={`₹${analytics?.totalRevenue ?? 0}`} accent="text-black" />
          <StatCard label="Admin Margin" value={`₹${analytics?.totalAdminMargin ?? 0}`} accent="text-[#58181F]" />
          <StatCard label="Seller Earnings" value={`₹${analytics?.totalSellerEarning ?? 0}`} accent="text-black" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-black/10 bg-white/85 p-6 card-shadow">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#58181F]">Pricing Control</p>
          <h2 className="mt-2 font-['Cinzel'] text-2xl font-semibold tracking-[0.05em] text-[#58181F]">
            Set Seller Margin (%)
          </h2>

          <input
            type="number"
            placeholder="Enter margin percentage"
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            className="mt-4 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base font-semibold text-black outline-none transition focus:border-[#58181F]"
          />

          <button
            type="button"
            onClick={updateMargin}
            disabled={updatingMargin}
            className="mt-4 rounded-full bg-black px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-[#58181F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updatingMargin ? "Updating..." : "Update Margin"}
          </button>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white/85 p-6 card-shadow">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#58181F]">Delivery Control</p>
          <h2 className="mt-2 font-['Cinzel'] text-2xl font-semibold tracking-[0.05em] text-[#58181F]">
            Set Shipping Charge (₹)
          </h2>

          <input
            type="number"
            placeholder="Enter shipping amount"
            value={shippingCharge}
            onChange={(e) => setShippingCharge(e.target.value)}
            className="mt-4 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base font-semibold text-black outline-none transition focus:border-[#58181F]"
          />

          <button
            type="button"
            onClick={updateShipping}
            disabled={updatingShipping}
            className="mt-4 rounded-full bg-black px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-[#58181F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updatingShipping ? "Updating..." : "Update Shipping"}
          </button>
        </section>
      </div>

      <section className="mt-8 rounded-3xl border border-black/10 bg-white/85 p-6 card-shadow">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#58181F]">Offers & Promotions</p>
        <h2 className="mt-2 font-['Cinzel'] text-2xl font-semibold tracking-[0.05em] text-[#58181F]">Coupon Controls</h2>

        <div className="mt-5">
          <AdminCoupons />
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, accent = "text-[#58181F]" }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#fff9ef] p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-black/55">{label}</p>
      <p className={`mt-2 text-2xl font-black ${accent}`}>{value}</p>
    </div>
  );
}
