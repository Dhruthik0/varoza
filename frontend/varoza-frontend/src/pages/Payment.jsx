import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Payment() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // ✅ HARD-CODED VALUES
  const UPI_ID = "D26@slc";
  const QR_IMAGE = "/upi-qr.jpg"; // place QR inside public/upi-qr.png

  const markPaid = async () => {
    try {
      setLoading(true);

      await fetch("https://varoza-backend.onrender.com/api/orders/mark-paid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
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
      <div className="text-center text-gray-400 mt-32">
        Please login to continue
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl text-purple-400 mb-6">
        Complete Payment
      </h1>

      {/* ✅ QR CODE */}
      <img
        src={QR_IMAGE}
        alt="UPI QR"
        className="mx-auto mb-6 rounded-xl w-64"
      />

      {/* ✅ UPI ID */}
      <p className="text-gray-300 mb-6">
        UPI ID: <b>{UPI_ID}</b>
      </p>

      {/* CONFIRM PAYMENT */}
      <button
        onClick={markPaid}
        disabled={loading}
        className="bg-green-600 px-8 py-4 rounded-xl hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "I have paid"}
      </button>

      <p className="text-gray-400 text-sm mt-4">
        Admin will verify your payment shortly
      </p>
    </div>
  );
}
