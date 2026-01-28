// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";

// export default function MyOrders() {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("http://localhost:5001/api/orders/my-orders", {
//       headers: {
//         Authorization: `Bearer ${user.token}`
//       }
//     })
//       .then(res => res.json())
//       .then(data => {
//         setOrders(data);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center text-gray-400 mt-32">
//         Loading your orders...
//       </div>
//     );
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="text-center text-gray-400 mt-32">
//         You have no orders
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-6 py-16">
//       <h1 className="text-3xl text-purple-400 mb-10">
//         My Orders
//       </h1>

//       <div className="space-y-6">
//         {orders.map(order => (
//           <div
//             key={order._id}
//             className="bg-black/60 p-6 rounded-xl border border-white/10"
//           >
//             <h2 className="text-xl text-white font-semibold">
//               {order.poster?.title}
//             </h2>

//             <p className="text-gray-400 mt-1">
//               Amount: ₹{order.totalAmount}
//             </p>

//             <p className="text-gray-400 mt-1">
//               Address: {order.deliveryAddress}
//             </p>

//             <p className="text-gray-400 mt-1">
//               Phone: {order.phoneNumber}
//             </p>

//             <p className="mt-3 font-semibold text-purple-400">
//               Status: {order.paymentStatus}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    fetch("http://localhost:5001/api/orders/my-orders", {
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
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl text-purple-400 mb-10">
        My Orders
      </h1>

      <div className="space-y-6">
        {orders.map(order => {
          const status = getStatusLabel(order.paymentStatus);

          return (
            <div
              key={order._id}
              className="bg-black/60 p-6 rounded-xl border border-white/10"
            >
              <h2 className="text-xl text-white font-semibold">
                {order.poster?.title}
              </h2>

              <p className="text-gray-400 mt-1">
                Amount: ₹{order.totalAmount}
              </p>

              <p className="text-gray-400 mt-1">
                Address: {order.deliveryAddress}
              </p>

              <p className="text-gray-400 mt-1">
                Phone: {order.phoneNumber}
              </p>

              <p className={`mt-3 font-semibold ${status.color}`}>
                Status: {status.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
