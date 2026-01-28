// export default function SellerPosterCard({ poster }) {
//   return (
//     <div className="bg-black/60 rounded-xl overflow-hidden border border-white/10">
//       <img
//         src={poster.imageUrl}
//         alt={poster.title}
//         className="h-48 w-full object-cover"
//       />

//       <div className="p-4">
//         <h3 className="text-lg font-semibold text-white">
//           {poster.title}
//         </h3>

//         <p className="text-gray-400 text-sm">
//           ₹{poster.price}
//         </p>

//         <p
//           className={`mt-2 text-sm ${
//             poster.approved ? "text-green-400" : "text-yellow-400"
//           }`}
//         >
//           {poster.approved ? "Approved" : "Pending Approval"}
//         </p>
//       </div>
//     </div>
//   );
// }
export default function SellerPosterCard({ poster }) {
  return (
    <div className="bg-black/60 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/40 transition">
      
      {/* IMAGE */}
      <img
        src={poster.imageUrl}
        alt={poster.title}
        className="h-52 w-full object-cover"
      />

      {/* CONTENT */}
      <div className="p-4 space-y-1">
        <h3 className="text-lg font-semibold text-white truncate">
          {poster.title}
        </h3>

        {/* CATEGORY */}
        {poster.category && (
          <p className="text-xs uppercase tracking-wider text-gray-500">
            {poster.category}
          </p>
        )}

        {/* PRICE */}
        <p className="text-purple-400 font-bold">
          ₹{poster.price}
        </p>

        {/* STATUS BADGE */}
        <span
          className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
            poster.approved
              ? "bg-green-600/20 text-green-400"
              : "bg-yellow-600/20 text-yellow-400"
          }`}
        >
          {poster.approved ? "Approved" : "Pending Approval"}
        </span>
      </div>
    </div>
  );
}
