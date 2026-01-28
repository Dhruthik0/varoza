// import { useEffect, useState, useContext } from "react";
// import {
//   getPendingSellers,
//   approveSeller,
//   getPendingPosters,
//   approvePoster,
//   getPendingOrders,
//   markOrderDelivering
// } from "../services/adminService";
// import { AuthContext } from "../context/AuthContext";

// export default function AdminDashboard() {
//   const { user } = useContext(AuthContext);

//   const [pendingSellers, setPendingSellers] = useState([]);
//   const [pendingPosters, setPendingPosters] = useState([]);
//   const [pendingOrders, setPendingOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const sellers = await getPendingSellers(user.token);
//       const posters = await getPendingPosters(user.token);
//       const orders = await getPendingOrders(user.token);

//       setPendingSellers(sellers);
//       setPendingPosters(posters);
//       setPendingOrders(orders);
//     } catch (err) {
//       console.error("Admin load error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center text-gray-400 mt-32">
//         Loading admin data...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-12">
//       <h1 className="text-3xl font-bold text-purple-400 mb-12">
//         Admin Dashboard
//       </h1>

//       {/* ================= SELLER APPROVAL ================= */}
//       <section className="mb-16">
//         <h2 className="text-xl text-white mb-4">
//           Pending Sellers
//         </h2>

//         {pendingSellers.length === 0 ? (
//           <p className="text-gray-400">No pending sellers</p>
//         ) : (
//           pendingSellers.map((seller) => (
//             <div
//               key={seller._id}
//               className="flex justify-between items-center bg-black/60 p-4 rounded-xl mb-3"
//             >
//               <div>
//                 <p className="text-white font-semibold">
//                   {seller.name}
//                 </p>
//                 <p className="text-gray-400 text-sm">
//                   {seller.email}
//                 </p>
//               </div>

//               <button
//                 onClick={async () => {
//                   await approveSeller(seller._id, user.token);
//                   loadData();
//                 }}
//                 className="bg-green-600 px-4 py-2 rounded"
//               >
//                 Approve
//               </button>
//             </div>
//           ))
//         )}
//       </section>

//       {/* ================= POSTER APPROVAL ================= */}
//       <section className="mb-16">
//         <h2 className="text-xl text-white mb-4">
//           Pending Posters
//         </h2>

//         {pendingPosters.length === 0 ? (
//           <p className="text-gray-400">No pending posters</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {pendingPosters.map((poster) => (
//               <div
//                 key={poster._id}
//                 className="bg-black/60 rounded-xl overflow-hidden"
//               >
//                 <img
//                   src={poster.imageUrl}
//                   alt={poster.title}
//                   className="h-48 w-full object-cover"
//                 />

//                 <div className="p-4">
//                   <p className="text-white font-semibold">
//                     {poster.title}
//                   </p>

//                   <p className="text-gray-400 text-sm">
//                     ₹{poster.price}
//                   </p>

//                   <button
//                     onClick={async () => {
//                       await approvePoster(poster._id, user.token);
//                       loadData();
//                     }}
//                     className="mt-4 w-full bg-green-600 py-2 rounded"
//                   >
//                     Approve Poster
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* ================= ORDERS & DELIVERY ================= */}
//       <section>
//         <h2 className="text-xl text-white mb-4">
//           Orders (Payment Verified)
//         </h2>

//         {pendingOrders.length === 0 ? (
//           <p className="text-gray-400">No orders yet</p>
//         ) : (
//           <div className="space-y-6">
//             {pendingOrders.map((order) => (
//               <div
//                 key={order._id}
//                 className="bg-black/60 p-6 rounded-xl border border-white/10"
//               >
//                 <p className="text-white font-semibold">
//                   Poster: {order.poster?.title}
//                 </p>

//                 <p className="text-gray-400 text-sm">
//                   Buyer: {order.buyer?.name} ({order.buyer?.email})
//                 </p>

//                 {/* ✅ ADDRESS & PHONE */}
//                 <p className="text-gray-300 mt-2">
//                   Address: {order.address}
//                 </p>

//                 <p className="text-gray-300">
//                   Phone: {order.phone}
//                 </p>

//                 <p className="text-purple-400 mt-2">
//                   Amount: ₹{order.totalAmount}
//                 </p>

//                 <p className="text-yellow-400 mt-1">
//                   Delivery Status: {order.deliveryStatus}
//                 </p>

//                 {order.deliveryStatus === "processing" && (
//                   <button
//                     onClick={async () => {
//                       await markOrderDelivering(order._id, user.token);
//                       loadData();
//                     }}
//                     className="mt-4 bg-blue-600 px-4 py-2 rounded"
//                   >
//                     Mark as Delivering
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }
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
                <p className="text-white font-semibold">
                  Poster: {order.poster?.title}
                </p>

                <p className="text-gray-400 text-sm">
                  Buyer: {order.buyer?.name} ({order.buyer?.email})
                </p>

                <p className="text-gray-300 mt-2">
                  Address: {order.deliveryAddress}
                </p>

                <p className="text-gray-300">
                  Phone: {order.phoneNumber}
                </p>

                <p className="text-purple-400 mt-2">
                  Amount: ₹{order.totalAmount}
                </p>

                <p className="text-yellow-400 mt-1 font-semibold">
                  Status: {order.paymentStatus}
                </p>

                {order.paymentStatus === "verification_pending" && (
                  <button
                    onClick={async () => {
                            await approveOrderPayment(order._id, user.token);
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
