
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const getStatusLabel = (status) => {
    switch (status) {
      case "verification_pending":
        return { text: "Waiting for admin approval", color: "text-yellow-400" };
      case "delivering":
        return { text: "Delivery started", color: "text-blue-400" };
      case "paid":
        return { text: "Payment approved", color: "text-green-400" };
      case "rejected":
        return { text: "Payment rejected", color: "text-red-400" };
      default:
        return { text: status, color: "text-gray-400" };
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-32">
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-32">
        You have no orders
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl text-purple-400 mb-10">
        My Orders
      </h1>

      <div className="space-y-8">
        {orders.map(order => {
          const status = getStatusLabel(order.paymentStatus);

          return (
            <div
              key={order._id}
              className="bg-black/60 p-6 rounded-xl border border-white/10"
            >
              {/* ITEMS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-black/40 p-4 rounded-lg border border-white/5"
                  >
                    <h2 className="text-white font-semibold">
                      {item.poster?.title}
                    </h2>

                    <p className="text-gray-400 text-sm mt-1">
                      Price: ₹{item.price}
                    </p>

                    <p className="text-gray-400 text-sm">
                      Quantity: {item.quantity}
                    </p>

                    <p className="text-gray-400 text-sm">
                      Item Total: ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* ORDER SUMMARY */}
              <div className="mt-6 border-t border-white/10 pt-4 space-y-2">
                {order.couponCode && (
                  <p className="text-gray-400">
                    Coupon Used: {order.couponCode}
                  </p>
                )}

                {order.discountAmount > 0 && (
                  <p className="text-gray-400">
                    Discount: -₹{order.discountAmount}
                  </p>
                )}

                <p className="text-gray-400">
                  Shipping Charge: ₹{order.shippingCharge || 0}
                </p>

                <p className="text-gray-400 font-semibold">
                  Total Amount: ₹{order.totalAmount}
                </p>

                <p className="text-gray-400">
                  Address: {order.deliveryAddress}
                </p>

                <p className="text-gray-400">
                  Phone: {order.phoneNumber}
                </p>

                <p className={`mt-3 font-semibold ${status.color}`}>
                  Status: {status.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}