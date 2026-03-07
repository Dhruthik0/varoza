import toast from "react-hot-toast";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  getPendingSellers,
  approveSeller,
  getPendingPosters,
  approvePoster,
  rejectPoster,
  getPendingOrders,
  approveOrderPayment
} from "../services/adminService";
import { AuthContext } from "../context/AuthContext";
import { buildOptimizedSrcSet, optimizeImage } from "../utils/optimizeImage";

const REJECTED_POSTERS_STORAGE_KEY = "varoza-admin-rejected-poster-ids";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
  }).format(amount || 0);
};

const getRejectedPosterIdSet = () => {
  if (typeof window === "undefined") {
    return new Set();
  }

  try {
    const saved = JSON.parse(localStorage.getItem(REJECTED_POSTERS_STORAGE_KEY) || "[]");
    return new Set(Array.isArray(saved) ? saved : []);
  } catch {
    return new Set();
  }
};

const persistRejectedPosterId = (posterId) => {
  const next = getRejectedPosterIdSet();
  next.add(posterId);
  localStorage.setItem(REJECTED_POSTERS_STORAGE_KEY, JSON.stringify(Array.from(next)));
};

const clearRejectedPosterIds = () => {
  localStorage.removeItem(REJECTED_POSTERS_STORAGE_KEY);
};

const extractErrorMessage = (error, fallback) => {
  if (error?.message) {
    return error.message;
  }

  return fallback;
};

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  const [pendingSellers, setPendingSellers] = useState([]);
  const [pendingPosters, setPendingPosters] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [hiddenPostersCount, setHiddenPostersCount] = useState(() => getRejectedPosterIdSet().size);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user?.token) {
      return;
    }

    setLoading(true);
    try {
      const [sellers, posters, orders] = await Promise.all([
        getPendingSellers(user.token),
        getPendingPosters(user.token),
        getPendingOrders(user.token)
      ]);

      const rejectedPosterIds = getRejectedPosterIdSet();

      setPendingSellers(Array.isArray(sellers) ? sellers : []);
      setPendingPosters(
        (Array.isArray(posters) ? posters : []).filter((poster) => !rejectedPosterIds.has(poster._id))
      );
      setPendingOrders(Array.isArray(orders) ? orders : []);
      setHiddenPostersCount(rejectedPosterIds.size);
    } catch (err) {
      console.error("Admin load error", err);
      toast.error("Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSellerApprove = async (sellerId) => {
    try {
      await approveSeller(sellerId, user.token);
      toast.success("Seller approved");
      loadData();
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to approve seller"));
    }
  };

  const handlePosterApprove = async (posterId) => {
    try {
      await approvePoster(posterId, user.token);
      toast.success("Poster approved");
      loadData();
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to approve poster"));
    }
  };

  const handlePosterReject = async (posterId) => {
    try {
      await rejectPoster(posterId, user.token);
      toast.success("Poster rejected");
      loadData();
    } catch (error) {
      // Backend reject endpoint may not exist yet. Keep UI functional via local hide.
      if (error?.status === 404 || error?.status === 405) {
        persistRejectedPosterId(posterId);
        setPendingPosters((prev) => prev.filter((poster) => poster._id !== posterId));
        setHiddenPostersCount(getRejectedPosterIdSet().size);
        toast.success("Poster removed from pending list");
        return;
      }

      toast.error(extractErrorMessage(error, "Failed to reject poster"));
    }
  };

  const handleRestoreHiddenPosters = () => {
    clearRejectedPosterIds();
    setHiddenPostersCount(0);
    toast.success("Hidden poster list cleared");
    loadData();
  };

  const handlePaymentApprove = async (orderId) => {
    try {
      await approveOrderPayment(orderId, user.token);
      toast.success("Payment approved and delivery started");
      loadData();
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to approve payment"));
    }
  };

  if (loading) {
    return (
      <div className="varoza-container py-16">
        <div className="rounded-3xl border border-black/10 bg-white/80 p-10 text-center card-shadow">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#58181F]/80">
            Admin Control Room
          </p>
          <p className="mt-3 text-2xl font-black text-black">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="varoza-container py-8 md:py-12">
      <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 card-shadow md:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.26em] text-[#58181F]">Admin Control Room</p>
        <h1 className="mt-2 font-['Cinzel'] text-3xl font-semibold tracking-[0.08em] text-black md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-base text-black/70">
          Review all pending approvals and keep the Varoza marketplace quality high.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Pending Sellers" value={pendingSellers.length} accent="text-[#58181F]" />
          <SummaryCard label="Pending Posters" value={pendingPosters.length} accent="text-[#58181F]" />
          <SummaryCard label="Pending Payments" value={pendingOrders.length} accent="text-[#58181F]" />
          <SummaryCard label="Locally Rejected Posters" value={hiddenPostersCount} accent="text-black" />
        </div>
      </div>

      <section className="mt-8 rounded-3xl border border-black/10 bg-white/85 p-6 card-shadow md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-['Cinzel'] text-2xl font-semibold tracking-[0.05em] text-[#58181F]">Pending Sellers</h2>
          <span className="rounded-full border border-[#58181F]/30 bg-[#F7E7CE] px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#58181F]">
            {pendingSellers.length} requests
          </span>
        </div>

        {pendingSellers.length === 0 ? (
          <EmptyState message="No pending sellers right now." />
        ) : (
          <div className="mt-5 space-y-3">
            {pendingSellers.map((seller) => (
              <div
                key={seller._id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-black/10 bg-[#fff8ed] p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="text-xl font-black text-black">{seller.name}</p>
                  <p className="text-sm font-semibold text-black/60">{seller.email}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSellerApprove(seller._id)}
                  className="rounded-full border border-black bg-black px-5 py-2.5 text-sm font-bold uppercase tracking-[0.13em] text-white transition hover:bg-[#58181F]"
                >
                  Approve Seller
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-3xl border border-black/10 bg-white/85 p-6 card-shadow md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-['Cinzel'] text-2xl font-semibold tracking-[0.05em] text-[#58181F]">Pending Posters</h2>
          {hiddenPostersCount > 0 && (
            <button
              type="button"
              onClick={handleRestoreHiddenPosters}
              className="rounded-full border border-black/20 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-black transition hover:bg-black hover:text-white"
            >
              Restore Hidden Posters
            </button>
          )}
        </div>

        {pendingPosters.length === 0 ? (
          <EmptyState message="No pending posters right now." />
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {pendingPosters.map((poster) => (
              <article key={poster._id} className="overflow-hidden rounded-2xl border border-black/10 bg-[#fffdf9]">
                <img
                  src={optimizeImage(poster.imageUrl, 700)}
                  srcSet={buildOptimizedSrcSet(poster.imageUrl, [280, 420, 560, 700])}
                  sizes="(max-width: 768px) 92vw, (max-width: 1280px) 44vw, 30vw"
                  alt={poster.title}
                  className="h-56 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />

                <div className="space-y-3 p-4">
                  <p className="text-xl font-black text-black">{poster.title}</p>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-black/55">
                    by {poster.seller?.name || "Unknown Seller"}
                  </p>
                  <p className="text-base font-bold text-black/75">Price: {formatCurrency(poster.price)}</p>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handlePosterApprove(poster._id)}
                      className="flex-1 rounded-full bg-black px-3 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-[#58181F]"
                    >
                      Approve Poster
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePosterReject(poster._id)}
                      className="flex-1 rounded-full border border-[#58181F]/45 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#58181F] transition hover:bg-[#58181F] hover:text-white"
                    >
                      Reject Poster
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-3xl border border-black/10 bg-white/85 p-6 card-shadow md:p-8">
        <h2 className="font-['Cinzel'] text-2xl font-semibold tracking-[0.05em] text-[#58181F]">Pending Payments</h2>

        {pendingOrders.length === 0 ? (
          <EmptyState message="No pending payment verification requests." />
        ) : (
          <div className="mt-5 space-y-5">
            {pendingOrders.map((order) => (
              <article key={order._id} className="rounded-2xl border border-black/10 bg-[#fff8ed] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#58181F]">
                    Buyer: {order.buyer?.name || "Unknown"}
                  </p>
                  <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-black/70">
                    {order.paymentStatus}
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-black/65">{order.buyer?.email}</p>
                <p className="mt-3 text-sm text-black/75">Address: {order.deliveryAddress}</p>
                <p className="text-sm text-black/75">Phone: {order.phoneNumber}</p>

                <div className="mt-4 space-y-3">
                  {(order.items || []).map((item, index) => (
                    <div key={index} className="rounded-xl border border-black/10 bg-white px-4 py-3">
                      <p className="text-base font-black text-black">{item.poster?.title || "Poster"}</p>
                      <a
                        href={item.poster?.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-sm font-bold text-[#58181F] underline"
                      >
                        View / Download Original Poster
                      </a>

                      <div className="mt-2 grid gap-1 text-sm text-black/70 sm:grid-cols-2">
                        <p>Price: {formatCurrency(item.price)}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p className="font-semibold text-black">Item Total: {formatCurrency(item.price * item.quantity)}</p>
                        <p>Seller Earning: {formatCurrency(item.sellerEarning)}</p>
                        <p>Admin Margin: {formatCurrency(item.adminMargin)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {order.couponCode && (
                  <p className="mt-4 text-sm font-semibold text-[#58181F]">Coupon Used: {order.couponCode}</p>
                )}

                {order.discountAmount > 0 && (
                  <p className="text-sm font-semibold text-[#58181F]">Discount: -{formatCurrency(order.discountAmount)}</p>
                )}

                <p className="mt-3 text-lg font-black text-black">Total Amount: {formatCurrency(order.totalAmount)}</p>

                {order.paymentStatus === "verification_pending" && (
                  <button
                    type="button"
                    onClick={() => handlePaymentApprove(order._id)}
                    className="mt-4 rounded-full bg-black px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-[#58181F]"
                  >
                    Approve Payment & Start Delivery
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#fff9ef] p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-black/55">{label}</p>
      <p className={`mt-2 text-3xl font-black ${accent}`}>{value}</p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-black/20 bg-[#fffaf2] px-5 py-6 text-sm font-semibold text-black/60">
      {message}
    </div>
  );
}
