import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Payment() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const UPI_ID = "D26@slc";
  const QR_IMAGE = "/upi-qr.jpg";

  const markPaid = async () => {
    try {
      setLoading(true);

      await fetch(`${import.meta.env.VITE_API_URL}/api/orders/mark-paid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      });

      alert("Payment submitted. Waiting for admin approval.");
    } catch (err) {
      console.error(err);
      alert("Failed to submit payment");
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
          disabled={loading}
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
