import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(Number(value || 0));

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
      .then((res) => res.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const getStatusLabel = (status) => {
    switch (status) {
      case "verification_pending":
        return { text: "Waiting for admin approval", classes: "bg-[#F7E7CE] text-black" };
      case "delivering":
        return { text: "Delivery started", classes: "bg-black text-white" };
      case "paid":
        return { text: "Payment approved", classes: "bg-[#58181F] text-white" };
      case "rejected":
        return { text: "Payment rejected", classes: "bg-red-100 text-red-700" };
      default:
        return { text: status, classes: "bg-black/10 text-black" };
    }
  };

  if (loading) {
    return <div className="mt-24 text-center text-lg font-semibold text-black/60">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="mt-24 text-center text-lg font-semibold text-black/60">You have no orders</div>;
  }

  return (
    <div className="varoza-container py-8 md:py-12">
      <h1 className="font-['Cinzel'] text-3xl font-bold tracking-wide text-black md:text-5xl">My Orders</h1>

      <div className="mt-8 space-y-6">
        {orders.map((order) => {
          const status = getStatusLabel(order.paymentStatus);

          return (
            <section key={order._id} className="rounded-2xl border border-black/10 bg-white p-5 card-shadow sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {order.items?.map((item, index) => (
                  <article key={index} className="rounded-xl border border-black/10 bg-[#F7E7CE] p-4">
                    <h2 className="text-lg font-extrabold text-black">{item.poster?.title}</h2>
                    <p className="mt-1 text-sm text-black/70">Price: Rs. {formatCurrency(item.price)}</p>
                    <p className="text-sm text-black/70">Quantity: {item.quantity}</p>
                    <p className="text-sm font-semibold text-black">Item Total: Rs. {formatCurrency(item.price * item.quantity)}</p>
                  </article>
                ))}
              </div>

              <div className="mt-5 border-t border-black/10 pt-4 text-sm text-black/75">
                {order.couponCode && <p>Coupon Used: {order.couponCode}</p>}
                {order.discountAmount > 0 && <p>Discount: -Rs. {formatCurrency(order.discountAmount)}</p>}
                <p>Shipping Charge: Rs. {formatCurrency(order.shippingCharge || 0)}</p>
                <p className="text-base font-extrabold text-black">Total Amount: Rs. {formatCurrency(order.totalAmount)}</p>
                <p className="mt-2">Address: {order.deliveryAddress}</p>
                <p>Phone: {order.phoneNumber}</p>
                <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${status.classes}`}>
                  {status.text}
                </p>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
