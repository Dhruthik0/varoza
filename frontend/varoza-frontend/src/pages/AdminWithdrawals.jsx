// import { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// export default function AdminWithdrawals() {
//   const { user } = useContext(AuthContext);
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadRequests = async () => {
//     try {
//       const res = await fetch(
//         "http://localhost:5001/api/admin/withdrawals",
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`
//           }
//         }
//       );

//       const data = await res.json();
//       setRequests(data);
//     } catch (err) {
//       console.error("Failed to load withdrawals", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markPaid = async (id) => {
//     await fetch(
//       "http://localhost:5001/api/admin/withdrawals/approve",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`
//         },
//         body: JSON.stringify({ requestId: id })
//       }
//     );

//     loadRequests();
//   };

//   const reject = async (id) => {
//     await fetch(
//       "http://localhost:5001/api/admin/withdrawals/reject",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`
//         },
//         body: JSON.stringify({ requestId: id })
//       }
//     );

//     loadRequests();
//   };

//   useEffect(() => {
//     loadRequests();
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center text-gray-400 mt-32">
//         Loading withdrawal requests...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-6 py-16">
//       <h1 className="text-3xl text-purple-400 mb-10">
//         Withdrawal Requests
//       </h1>

//       {requests.length === 0 ? (
//         <p className="text-gray-400">
//           No withdrawal requests
//         </p>
//       ) : (
//         <div className="space-y-6">
//           {requests.map((r) => (
//             <div
//               key={r._id}
//               className="bg-black/60 p-6 rounded-xl border border-white/10"
//             >
//               <p className="text-white font-semibold">
//                 Seller: {r.seller?.name}
//               </p>

//               <p className="text-gray-400">
//                 Email: {r.seller?.email}
//               </p>

//               <p className="text-gray-300 mt-2">
//                 Amount: ₹{r.amount}
//               </p>

//               <p className="text-gray-300">
//                 UPI: {r.upiId}
//               </p>

//               <p className="text-yellow-400 mt-2">
//                 Status: {r.status}
//               </p>

//               {r.status === "pending" && (
//                 <div className="flex gap-4 mt-4">
//                   <button
//                     onClick={() => markPaid(r._id)}
//                     className="bg-green-600 px-4 py-2 rounded"
//                   >
//                     Mark Paid
//                   </button>

//                   <button
//                     onClick={() => reject(r._id)}
//                     className="bg-red-600 px-4 py-2 rounded"
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function AdminWithdrawals() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const res = await fetch(
        "http://localhost:5001/api/admin/withdrawals",
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Failed to load withdrawals", err);
      toast.error("Failed to load withdrawal requests");
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (id) => {
    try {
      const res = await fetch(
        "http://localhost:5001/api/admin/withdrawals/approve",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({ requestId: id })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Approval failed");
      }

      toast.success("Withdrawal marked as PAID");
      loadRequests();
    } catch (err) {
      toast.error(err.message || "Failed to approve withdrawal");
    }
  };

  const reject = async (id) => {
    try {
      const res = await fetch(
        "http://localhost:5001/api/admin/withdrawals/reject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({ requestId: id })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Rejection failed");
      }

      toast.success("Withdrawal rejected");
      loadRequests();
    } catch (err) {
      toast.error(err.message || "Failed to reject withdrawal");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-32">
        Loading withdrawal requests...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl text-purple-400 mb-10">
        Withdrawal Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-gray-400">
          No withdrawal requests
        </p>
      ) : (
        <div className="space-y-6">
          {requests.map((r) => (
            <div
              key={r._id}
              className="bg-black/60 p-6 rounded-xl border border-white/10"
            >
              <p className="text-white font-semibold">
                Seller: {r.seller?.name}
              </p>

              <p className="text-gray-400">
                Email: {r.seller?.email}
              </p>

              <p className="text-gray-300 mt-2">
                Amount: ₹{r.amount}
              </p>

              <p className="text-gray-300">
                UPI: {r.upiId}
              </p>

              <p className="text-yellow-400 mt-2">
                Status: {r.status}
              </p>

              {r.status === "pending" && (
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => markPaid(r._id)}
                    className="bg-green-600 px-4 py-2 rounded"
                  >
                    Mark Paid
                  </button>

                  <button
                    onClick={() => reject(r._id)}
                    className="bg-red-600 px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
