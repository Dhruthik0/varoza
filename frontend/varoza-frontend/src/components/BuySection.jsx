import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function BuySection({ posterId }) {
  const { user } = useContext(AuthContext);

  const confirmPayment = async () => {
    await fetch("https://varoza-backend.onrender.com/api/buyer/confirm-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({ posterId })
    });
    alert("Payment marked as successful!");
  };

  return (
    <div className="mt-8 bg-black/40 p-6 rounded-xl">
      <h3 className="text-lg text-purple-300 mb-4">Pay via UPI</h3>

      <img src="/upi-qr.png" className="w-48 mx-auto" />
      <p className="text-center mt-2 text-gray-400">
        UPI ID: varoza@upi
      </p>

      <button
        onClick={confirmPayment}
        className="btn-primary w-full mt-6"
      >
        I Have Paid
      </button>
    </div>
  );
}
