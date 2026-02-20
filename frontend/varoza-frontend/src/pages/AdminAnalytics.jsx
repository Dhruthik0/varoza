
import { useEffect, useState, useContext } from "react";
import { getAnalytics } from "../services/adminService";
import { AuthContext } from "../context/AuthContext";
import AdminCoupons from "../components/AdminCoupons";

export default function AdminAnalytics() {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [margin, setMargin] = useState("");
  const [updating, setUpdating] = useState(false);
  const [shippingCharge, setShippingCharge] = useState("");
const [updatingShipping, setUpdatingShipping] = useState(false);


  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getAnalytics(user.token);
        setAnalytics(data);
      } catch (err) {
        console.error("Analytics error", err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const updateMargin = async () => {
    if (!margin) return alert("Enter margin percentage");

    setUpdating(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/set-margin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          marginPercentage: Number(margin)
        })
      });

      alert("Seller margin updated successfully");
      setMargin("");
    } catch (err) {
      alert("Failed to update margin");
    } finally {
      setUpdating(false);
    }
  };

  const updateShipping = async () => {
  if (!shippingCharge) return alert("Enter shipping amount");

  setUpdatingShipping(true);
  try {
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/set-shipping`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          shippingCharge: Number(shippingCharge)
        })
      }
    );

    alert("Shipping charge updated successfully");
    setShippingCharge("");
  } catch (err) {
    alert("Failed to update shipping charge");
  } finally {
    setUpdatingShipping(false);
  }
};


  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-32">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-purple-400 mb-12">
        Platform Analytics
      </h1>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatCard label="Total Orders" value={analytics.totalOrders} />
        <StatCard
          label="Total Revenue"
          value={`₹${analytics.totalRevenue}`}
          color="text-green-400"
        />
        <StatCard
          label="Admin Margin"
          value={`₹${analytics.totalAdminMargin}`}
          color="text-yellow-400"
        />
        <StatCard
          label="Seller Earnings"
          value={`₹${analytics.totalSellerEarning}`}
          color="text-blue-400"
        />
      </div>

      {/* ================= MARGIN CONTROL ================= */}
      <div className="bg-black/60 p-6 rounded-xl max-w-md border border-white/10">
        <h2 className="text-xl text-white mb-4">
          Set Seller Margin (%)
        </h2>

        <input
          type="number"
          placeholder="Enter margin percentage"
          value={margin}
          onChange={(e) => setMargin(e.target.value)}
          className="w-full p-3 rounded bg-black/40 text-white mb-4"
        />

        <button
          onClick={updateMargin}
          disabled={updating}
          className="w-full bg-purple-600 py-3 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {updating ? "Updating..." : "Update Margin"}
        </button>
      </div>

      {/* ================= SHIPPING CONTROL ================= */}
<div className="bg-black/60 p-6 rounded-xl max-w-md border border-white/10 mt-10">
  <h2 className="text-xl text-white mb-4">
    Set Shipping Charge (₹)
  </h2>

  <input
    type="number"
    placeholder="Enter shipping amount"
    value={shippingCharge}
    onChange={(e) => setShippingCharge(e.target.value)}
    className="w-full p-3 rounded bg-black/40 text-white mb-4"
  />

  <button
    onClick={updateShipping}
    disabled={updatingShipping}
    className="w-full bg-purple-600 py-3 rounded hover:bg-purple-700 disabled:opacity-50"
  >
    {updatingShipping ? "Updating..." : "Update Shipping"}
  </button>
</div>


      {/* ================= COUPONS SECTION (ADDED SPACING ONLY) ================= */}
      <div className="mt-16">
        <AdminCoupons />
      </div>
    </div>
  );
}

function StatCard({ label, value, color = "text-purple-400" }) {
  return (
    <div className="bg-black/60 p-6 rounded-xl border border-white/10">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}
