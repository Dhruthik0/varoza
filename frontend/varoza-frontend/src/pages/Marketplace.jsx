
import { useEffect, useState } from "react";
import PosterCard from "../components/PosterCard";

export default function Marketplace() {
  const [posters, setPosters] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPosters = async (query = "") => {
    setLoading(true);
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/posters/approved?search=${encodeURIComponent(
        query
      )}`
    );
    const data = await res.json();
    setPosters(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  return (
    <div className="relative z-10">

      {/* 🔥 HERO TEXT (TIGHT SPACING) */}
      <div className="flex flex-col items-center justify-center text-center mt-10 mb-10">
        <h1 className="glow-text text-6xl md:text-7xl font-extrabold tracking-widest text-purple-500">
          VAROZA
        </h1>

        <p className="fade-in-delayed mt-2 text-lg md:text-xl text-gray-400 italic tracking-wide">
          where the walls whisper
        </p>
      </div>

      {/* 🔍 SEARCH BAR */}
      {/* <div className="max-w-7xl mx-auto px-6 mb-10">
        <input
          type="text"
          placeholder="Search by title, category, or seller..."
          className="w-full px-5 py-3 rounded-xl bg-black/50 text-white border border-white/10"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            fetchPosters(e.target.value);
          }}
        />
      </div> */}
            {/* 🔍 SEARCH BAR + CUSTOM POSTER BUTTON */}
      <div className="max-w-7xl mx-auto px-6 mb-10 flex gap-4">
        <input
          type="text"
          placeholder="Search by title, category, or seller..."
          className="w-full px-5 py-3 rounded-xl bg-black/50 text-white border border-white/10"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            fetchPosters(e.target.value);
          }}
        />

        {/* 🟢 CUSTOM POSTERS BUTTON */}
        <a
  href="https://wa.me/917899251692"
  target="_blank"
  rel="noopener noreferrer"
  className="relative px-6 py-3 rounded-xl font-semibold text-white whitespace-nowrap
             bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600
             bg-[length:200%_200%]
             shadow-[0_0_20px_rgba(168,85,247,0.6)]
             hover:shadow-[0_0_35px_rgba(168,85,247,0.9)]
             hover:scale-105
             transition-all duration-500
             animate-gradient"
>
  ✨ Custom Posters
</a>

      </div>


      {/* ⏳ LOADING */}
      {loading && (
        <p className="text-center text-gray-400 mt-20">
          Searching posters...
        </p>
      )}

      {/* 🖼️ POSTER GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {posters.map((poster) => (
            <PosterCard key={poster._id} poster={poster} />
          ))}
        </div>
      </div>

      {/* ❌ EMPTY STATE */}
      {!loading && posters.length === 0 && (
        <p className="text-center text-gray-400 mt-20">
          No posters found
        </p>
      )}

      {/* 👨‍💻 BUILT BY */}
<div className=" mt-1 mb-20 text-center text-gray-400 ">
  Built by{" "}
  <a
    href="https://wa.me/917892403563"
    target="_blank"
    rel="noopener noreferrer"
    className="text-purple-400 hover:text-purple-300 font-semibold"
  >
    Dhruthik
  </a>
</div>

    </div>
    
  );
}
