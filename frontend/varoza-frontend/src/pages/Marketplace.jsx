// import PosterCard from "../components/PosterCard";

// const posters = [
//   {
//     id: 1,
//     title: "Naruto Sage Mode",
//     category: "Anime",
//     price: 499,
//     image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b"
//   },
//   {
//     id: 2,
//     title: "Spider-Man Noir",
//     category: "Marvel",
//     price: 599,
//     image: "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa"
//   },
//   {
//     id: 3,
//     title: "Batman Beyond",
//     category: "DC",
//     price: 549,
//     image: "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb"
//   },
//   {
//     id: 4,
//     title: "Itachi Uchiha",
//     category: "Anime",
//     price: 699,
//     image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
//   }
  
// ];

// export default function Marketplace() {
//   return (
//     <div className="relative z-10">

//       {/* 🔥 HERO TEXT (TIGHT SPACING) */}
//       <div className="flex flex-col items-center justify-center text-center mt-10 mb-12">
//         <h1 className="glow-text text-6xl md:text-7xl font-extrabold tracking-widest text-purple-500">
//           VAROZA
//         </h1>

//         <p className="fade-in-delayed mt-2 text-lg md:text-xl text-gray-400 italic tracking-wide">
//           where the walls whisper
//         </p>
//       </div>

//       {/* 🖼️ POSTERS – APPEAR IMMEDIATELY AFTER */}
//       <div className="max-w-6xl mx-auto px-6 pb-20">
//         <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//           {posters.map((poster) => (
//             <PosterCard key={poster.id} poster={poster} />
//           ))}
//         </div>
//       </div>

//     </div>
//   );
// }
import { useEffect, useState } from "react";
import PosterCard from "../components/PosterCard";

export default function Marketplace() {
  const [posters, setPosters] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPosters = async (query = "") => {
    setLoading(true);
    const res = await fetch(
      `http://localhost:5001/api/posters/approved?search=${encodeURIComponent(
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
      <div className="max-w-7xl mx-auto px-6 mb-10">
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
