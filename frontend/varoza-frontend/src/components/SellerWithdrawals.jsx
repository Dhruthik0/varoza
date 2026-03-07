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

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2
    }).format(Number(value || 0));

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/seller/withdrawals`,
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
        `${import.meta.env.VITE_API_URL}/api/seller/withdraw`,
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
    return <p className="mt-12 text-sm font-semibold uppercase tracking-[0.14em] text-black/55">Loading withdrawals...</p>;
  }

  return (
    <div id="seller-withdrawals" className="mt-14 scroll-mt-32">
      <h2 className="font-['Cinzel'] text-2xl font-bold text-[#58181F] md:text-[1.9rem]">Withdrawal Requests</h2>
      <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-black/50">Minimum request ₹500</p>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="section-panel card-shadow overflow-hidden">
          <div className="border-b border-black/10 bg-gradient-to-r from-[#fffdf8] to-[#f7e7ce] px-5 py-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-black/55">Create Request</p>
          </div>
          <div className="p-5">
            <label className="text-xs font-extrabold uppercase tracking-[0.2em] text-black/55">Amount (₹)</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-black/15 bg-[#fffdf8] px-4 text-black outline-none transition focus:border-[#58181F]"
            />

            <label className="mt-4 block text-xs font-extrabold uppercase tracking-[0.2em] text-black/55">UPI ID</label>
            <input
              type="text"
              placeholder="name@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-black/15 bg-[#fffdf8] px-4 text-black outline-none transition focus:border-[#58181F]"
            />

            <button
              onClick={submitWithdrawal}
              disabled={submitting}
              className="action-button mt-5 px-6 py-3 text-xs uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Request Withdrawal"}
            </button>
          </div>
        </div>

        <div className="section-panel card-shadow overflow-hidden">
          <div className="border-b border-black/10 bg-white px-5 py-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-black/55">Request History</p>
          </div>

          {withdrawals.length === 0 ? (
            <p className="p-5 text-sm font-semibold uppercase tracking-[0.14em] text-black/55">No withdrawal requests yet</p>
          ) : (
            <div className="h-[340px] space-y-3 overflow-y-auto p-5">
              {withdrawals.map((req) => (
                <div key={req._id} className="rounded-2xl border border-black/10 bg-[#fffdf8] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xl font-extrabold text-black">₹{formatCurrency(req.amount)}</p>
                    <p
                      className={`rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] ${
                        req.status === "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : req.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {req.status}
                    </p>
                  </div>

                  <p className="mt-2 text-sm text-black/65">UPI: {req.upiId}</p>
                  <p className="mt-1 text-xs font-semibold tracking-[0.06em] text-black/45">
                    {new Date(req.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
