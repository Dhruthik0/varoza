import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
  }).format(amount || 0);
};

export default function AdminWithdrawals() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    if (!user?.token) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/withdrawals`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      const data = await res.json().catch(() => []);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load withdrawal requests");
      }

      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load withdrawals", err);
      toast.error(err.message || "Failed to load withdrawal requests");
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  const markPaid = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/withdrawals/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ requestId: id })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Approval failed");
      }

      toast.success("Withdrawal marked as paid");
      loadRequests();
    } catch (err) {
      toast.error(err.message || "Failed to approve withdrawal");
    }
  };

  const reject = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/withdrawals/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ requestId: id })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Rejection failed");
      }

      toast.success("Withdrawal rejected");
      loadRequests();
    } catch (err) {
      toast.error(err.message || "Failed to reject withdrawal");
    }
  };

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  if (loading) {
    return (
      <div className="varoza-container py-16">
        <div className="rounded-3xl border border-black/10 bg-white/80 p-10 text-center card-shadow">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#58181F]">
            Loading withdrawal requests...
          </p>
        </div>
      </div>
    );
  }

  const pendingCount = requests.filter((req) => req.status === "pending").length;

  return (
    <div className="varoza-container py-8 md:py-12">
      <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 card-shadow md:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.26em] text-[#58181F]">Admin Control Room</p>
        <h1 className="mt-2 font-['Cinzel'] text-3xl font-semibold tracking-[0.08em] text-black md:text-4xl">
          Withdrawals
        </h1>
        <p className="mt-3 max-w-2xl text-base text-black/70">
          Review payout requests, verify details, and settle seller balances cleanly.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <StatCard label="Total Requests" value={requests.length} />
          <StatCard label="Pending Requests" value={pendingCount} accent="text-[#58181F]" />
        </div>
      </div>

      <section className="mt-8 rounded-3xl border border-black/10 bg-white/85 p-6 card-shadow md:p-8">
        {requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/20 bg-[#fffaf2] px-5 py-6 text-sm font-semibold text-black/60">
            No withdrawal requests.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <article key={request._id} className="rounded-2xl border border-black/10 bg-[#fff8ed] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-lg font-black text-black">{request.seller?.name || "Unknown Seller"}</p>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] ${
                      request.status === "pending"
                        ? "border-black/25 bg-white text-black"
                        : request.status === "paid"
                        ? "border-[#58181F]/40 bg-[#F7E7CE] text-[#58181F]"
                        : "border-black/20 bg-black/5 text-black/70"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-sm text-black/70">
                  <p className="font-semibold">Email: {request.seller?.email || "-"}</p>
                  <p>Amount: {formatCurrency(request.amount)}</p>
                  <p>UPI: {request.upiId || "-"}</p>
                </div>

                {request.status === "pending" && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => markPaid(request._id)}
                      className="rounded-full bg-black px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.13em] text-white transition hover:bg-[#58181F]"
                    >
                      Mark Paid
                    </button>

                    <button
                      type="button"
                      onClick={() => reject(request._id)}
                      className="rounded-full border border-[#58181F]/45 px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.13em] text-[#58181F] transition hover:bg-[#58181F] hover:text-white"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, accent = "text-black" }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#fff9ef] p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-black/55">{label}</p>
      <p className={`mt-2 text-2xl font-black ${accent}`}>{value}</p>
    </div>
  );
}
