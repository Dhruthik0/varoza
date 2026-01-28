
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
