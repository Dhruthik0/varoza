import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function SellerWithdrawals() {
  const { user } = useContext(AuthContext);

  const [withdrawals, setWithdrawals] = useState([]);
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch(
        "https://varoza-backend.onrender.com/api/seller/withdrawals",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await res.json();
      setWithdrawals(data || []);
    } catch (err) {
      console.error("Failed to load withdrawals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const submitWithdrawal = async () => {
    
    if (!upiId.trim()) return alert("Enter UPI ID");
    if (!amount || Number(amount) < 500)
      return alert("Minimum withdrawal is ₹500");
    console.log("WITHDRAW CLICKED", { upiId, amount });

    try {
      setSubmitting(true);

      const res = await fetch(
        "https://varoza-backend.onrender.com/api/seller/withdraw",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            upiId,
            amount: Number(amount),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Withdrawal failed");
      }

      setUpiId("");
      setAmount("");
      toast.success("Withdrawal request sent to admin");
      fetchWithdrawals();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="mt-12 text-gray-400">Loading withdrawals...</p>;
  }

  return (
    <div className="mt-16">
      <h2 className="text-xl text-purple-400 mb-4">
        Withdrawal Requests
      </h2>

      {/* 🔹 REQUEST FORM */}
      <div className="bg-black/60 p-5 rounded-xl border border-white/10 mb-6">
        <p className="text-gray-300 mb-3">
          Request withdrawal (min ₹500)
        </p>

        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-3 px-4 py-2 rounded bg-black/80 text-white border border-white/10"
        />

        <input
          type="text"
          placeholder="UPI ID (e.g. name@upi)"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-black/80 text-white border border-white/10"
        />

        <button
          onClick={submitWithdrawal}
          disabled={submitting}
          className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Request Withdrawal"}
        </button>
      </div>

      {/* 🔹 REQUEST STATUS LIST */}
      {withdrawals.length === 0 ? (
        <p className="text-gray-400">No withdrawal requests yet</p>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((req) => (
            <div
              key={req._id}
              className="bg-black/60 p-4 rounded-xl border border-white/10"
            >
              <p className="text-white font-semibold">
                ₹{req.amount}
              </p>

              <p className="text-gray-400 text-sm">
                UPI: {req.upiId}
              </p>

              <p
                className={`mt-2 font-semibold ${
                  req.status === "paid"
                    ? "text-green-400"
                    : req.status === "rejected"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                Status: {req.status.toUpperCase()}
              </p>

              <p className="text-gray-500 text-xs mt-1">
                {new Date(req.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
