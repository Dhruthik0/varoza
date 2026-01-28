import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Payment() {
  const { user } = useContext(AuthContext);
  const [upi, setUpi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.token) return;

    const fetchUpi = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/admin/upi", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
        setUpi(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load payment details");
      }
    };

    fetchUpi();
  }, [user]);

  const markPaid = async () => {
    try {
      setLoading(true);

      await fetch("http://localhost:5001/api/orders/mark-paid", {
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

  if (error) {
    return (
      <div className="text-center text-red-400 mt-32">
        {error}
      </div>
    );
  }

  if (!upi) {
    return (
      <div className="text-center text-gray-400 mt-32">
        Loading payment info...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl text-purple-400 mb-6">
        Complete Payment
      </h1>

      {/* QR CODE */}
      {upi.upiQrUrl && (
        <img
          src={upi.upiQrUrl}
          alt="UPI QR"
          className="mx-auto mb-6 rounded-xl w-64"
        />
      )}

      {/* UPI ID */}
      <p className="text-gray-300 mb-6">
        UPI ID: <b>{upi.upiId}</b>
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
