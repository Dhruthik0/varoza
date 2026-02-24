import toast from "react-hot-toast";
import { useEffect, useState, useContext } from "react";
import {
  getPendingSellers,
  approveSeller,
  getPendingPosters,
  approvePoster,
  getPendingOrders,
  approveOrderPayment
} from "../services/adminService";
import { AuthContext } from "../context/AuthContext";
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
  }).format(amount || 0);
};
export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  const [pendingSellers, setPendingSellers] = useState([]);
  const [pendingPosters, setPendingPosters] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const sellers = await getPendingSellers(user.token);
      const posters = await getPendingPosters(user.token);
      const orders = await getPendingOrders(user.token);

      setPendingSellers(sellers);
      setPendingPosters(posters);
      setPendingOrders(orders);
    } catch (err) {
      console.error("Admin load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-32">
        Loading admin data...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-purple-400 mb-12">
        Admin Dashboard
      </h1>

      {/* ================= SELLER APPROVAL ================= */}
      <section className="mb-16">
        <h2 className="text-xl text-white mb-4">
          Pending Sellers
        </h2>

        {pendingSellers.length === 0 ? (
          <p className="text-gray-400">No pending sellers</p>
        ) : (
          pendingSellers.map((seller) => (
            <div
              key={seller._id}
              className="flex justify-between items-center bg-black/60 p-4 rounded-xl mb-3"
            >
              <div>
                <p className="text-white font-semibold">{seller.name}</p>
                <p className="text-gray-400 text-sm">{seller.email}</p>
              </div>

              <button
                onClick={async () => {
                  await approveSeller(seller._id, user.token);
                  toast.success("Seller approved");
                  loadData();
                }}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Approve
              </button>
            </div>
          ))
        )}
      </section>

      {/* ================= POSTER APPROVAL ================= */}
      <section className="mb-16">
        <h2 className="text-xl text-white mb-4">
          Pending Posters
        </h2>

        {pendingPosters.length === 0 ? (
          <p className="text-gray-400">No pending posters</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingPosters.map((poster) => (
              <div
                key={poster._id}
                className="bg-black/60 rounded-xl overflow-hidden"
              >
                <img
                  src={poster.imageUrl}
                  alt={poster.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4">
                  <p className="text-white font-semibold">
                    {poster.title}
                  </p>

                  <p className="text-gray-400 text-sm">
                    ₹{poster.price}
                  </p>

                  <button
                    onClick={async () => {
                      await approvePoster(poster._id, user.token);
                      toast.success("Poster approved");
                      loadData();
                    }}
                    className="mt-4 w-full bg-green-600 py-2 rounded"
                  >
                    Approve Poster
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= PAYMENT VERIFICATION ================= */}
      <section>
        <h2 className="text-xl text-white mb-6">
          Pending Payments
        </h2>

        {pendingOrders.length === 0 ? (
          <p className="text-gray-400">No pending payments</p>
        ) : (
          <div className="space-y-6">
            {pendingOrders.map((order) => (
              <div
                key={order._id}
                className="bg-black/60 p-6 rounded-xl border border-white/10"
              >
                {/* Buyer Info */}
                <p className="text-gray-400 text-sm">
                  Buyer: {order.buyer?.name} ({order.buyer?.email})
                </p>

                <p className="text-gray-300 mt-2">
                  Address: {order.deliveryAddress}
                </p>

                <p className="text-gray-300">
                  Phone: {order.phoneNumber}
                </p>

                {/* Items */}
                <div className="mt-4 space-y-3">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-black/40 p-3 rounded-lg border border-white/5"
                    >
                      <p className="text-white font-semibold">
                        {item.poster?.title}
                      </p>
                    <a
                        href={item.poster?.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-sm underline"
                      >
                        View / Download Original Poster
                      </a>
                      <p className="text-gray-400 text-sm">
                        Price: ₹{item.price}
                      </p>

                      <p className="text-gray-400 text-sm">
                        Quantity: {item.quantity}
                      </p>

                      <p className="text-purple-400 text-sm font-semibold">
                        Item Total: {formatCurrency(item.price * item.quantity)}
                      </p>

                      <p className="text-green-400 text-sm">
                        Seller Earning: {formatCurrency(item.sellerEarning)}
                      </p>

                      <p className="text-yellow-400 text-sm">
                        Admin Margin: {formatCurrency(item.adminMargin)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Coupon Info */}
                {order.couponCode && (
                  <p className="text-pink-400 mt-4">
                    Coupon Used: {order.couponCode}
                  </p>
                )}

                {order.discountAmount > 0 && (
                  <p className="text-red-400">
                    Discount: -{formatCurrency(order.discountAmount)}
                  </p>
                )}

                {/* Total */}
                <p className="text-purple-400 mt-3 text-lg font-semibold">
                  Total Amount:{formatCurrency(order.totalAmount)}
                </p>

                <p className="text-yellow-400 mt-1 font-semibold">
                  Status: {order.paymentStatus}
                </p>

                {order.paymentStatus === "verification_pending" && (
                  <button
                    onClick={async () => {
                      await approveOrderPayment(order._id, user.token);
                      toast.success("Payment approved & delivery started");
                      loadData();
                    }}
                    className="mt-4 bg-blue-600 px-4 py-2 rounded"
                  >
                    Approve Payment & Start Delivery
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}