import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PENDING_PAYMENT_STORAGE_KEY = "varoza_pending_payment";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(Number(value || 0));

const getPaymentContextFromStorage = () => {
  try {
    const raw = localStorage.getItem(PENDING_PAYMENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.orderId) return null;
    return parsed;
  } catch {
    return null;
  }
};

export default function Payment() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [paymentContext, setPaymentContext] = useState(() => {
    if (location.state?.orderId) {
      return location.state;
    }
    return getPaymentContextFromStorage();
  });

  const UPI_ID = "D26@slc";
  const QR_IMAGE = "/upi-qr.jpg";

  useEffect(() => {
    if (location.state?.orderId) {
      setPaymentContext(location.state);
      localStorage.setItem(PENDING_PAYMENT_STORAGE_KEY, JSON.stringify(location.state));
    }
  }, [location.state]);

  useEffect(() => {
    if (!user?.token || paymentContext?.orderId) return;

    let active = true;

    const fetchPendingOrder = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) return;

        const pendingOrder = data.find(
          (order) =>
            order?.paymentStatus === "verification_pending" ||
            order?.paymentStatus === "pending"
        );

        if (!pendingOrder?._id || !active) return;

        const derivedContext = {
          orderId: pendingOrder._id,
          totalAmount: Number(pendingOrder.totalAmount || 0),
          createdAt: pendingOrder.createdAt
        };

        setPaymentContext(derivedContext);
        localStorage.setItem(PENDING_PAYMENT_STORAGE_KEY, JSON.stringify(derivedContext));
      } catch {
        // no-op
      }
    };

    fetchPendingOrder();

    return () => {
      active = false;
    };
  }, [paymentContext?.orderId, user?.token]);

  const payableAmount = useMemo(
    () => Number(paymentContext?.totalAmount || 0),
    [paymentContext?.totalAmount]
  );

  const markPaid = async () => {
    if (!paymentContext?.orderId) {
      alert("No pending order found for payment.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/mark-paid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ orderId: paymentContext.orderId })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit payment");
      }

      localStorage.removeItem(PENDING_PAYMENT_STORAGE_KEY);
      alert(data?.message || "Payment submitted. Waiting for admin approval.");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to submit payment");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="varoza-container py-16 text-center">
        <p className="text-lg font-semibold text-black/65">Please login to continue</p>
      </div>
    );
  }

  return (
    <div className="varoza-container py-8 md:py-12">
      <div className="mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white p-6 text-center card-shadow sm:p-8">
        <h1 className="font-['Cinzel'] text-3xl font-bold text-black md:text-4xl">Complete Payment</h1>
        <p className="mt-2 text-black/65">Scan the QR below and complete your payment.</p>

        <div className="mx-auto mt-5 max-w-md rounded-xl border border-[#58181F]/15 bg-[#F7E7CE] p-4 text-left">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-black/55">Final Amount Payable</p>
          <p className="mt-1 text-3xl font-extrabold text-black">₹ {formatCurrency(payableAmount)}</p>
          {paymentContext?.orderId ? (
            <p className="mt-1 text-xs font-semibold text-black/50">Order ID: {paymentContext.orderId}</p>
          ) : (
            <p className="mt-1 text-xs font-semibold text-[#58181F]">
              Pending order details not found. Please go to checkout and try again.
            </p>
          )}
        </div>

        <img
          src={QR_IMAGE}
          alt="UPI QR"
          className="mx-auto mt-6 w-64 max-w-full rounded-2xl border border-black/10"
          loading="lazy"
          decoding="async"
        />

        <p className="mt-5 text-base text-black/70">
          UPI ID: <b>{UPI_ID}</b>
        </p>

        <button
          onClick={markPaid}
          disabled={loading || !paymentContext?.orderId}
          className="action-button mt-6 h-12 w-full text-sm uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Submitting..." : "I have paid"}
        </button>

        <p className="mt-4 text-sm text-black/55">Admin will verify your payment shortly.</p>

        <Link to="/marketplace" className="mt-5 inline-block text-sm font-bold uppercase tracking-[0.14em] text-[#58181F]">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
