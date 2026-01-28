// export default function PosterCard({ poster }) {
//   return (
//     <div className="group rounded-2xl overflow-hidden bg-black/30 backdrop-blur-md border border-white/10 hover:border-purple-500/40 transition-all duration-300">
      
//       {/* Image */}
//       <div className="relative overflow-hidden">
//         <img
//           src={poster.image}
//           alt={poster.title}
//           className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-110"
//         />

//         {/* Hover overlay */}
//         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//           <button className="px-5 py-2 rounded-full bg-purple-500 text-black font-semibold shadow-lg hover:bg-purple-400">
//             View Poster
//           </button>
//         </div>
//       </div>

//       {/* Info */}
//       <div className="p-4">
//         <h3 className="text-white font-semibold truncate">
//           {poster.title}
//         </h3>

//         <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
//           <span>{poster.category}</span>
//           <span className="text-purple-400 font-bold">
//             ₹{poster.price}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useNavigate } from "react-router-dom";

export default function PosterCard({ poster }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/poster/${poster._id}`)}
      className="bg-black/60 rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:scale-[1.02] transition"
    >
      <img
        src={poster.imageUrl}
        alt={poster.title}
        className="h-56 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="text-white font-semibold text-lg">
          {poster.title}
        </h3>

        <p className="text-gray-400 text-sm">
          {poster.category}
        </p>

        <p className="text-purple-400 font-bold mt-1">
          ₹{poster.price}
        </p>
      </div>
    </div>
  );
}
