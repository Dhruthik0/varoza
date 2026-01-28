import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function PosterDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/posters/${id}`
        );
        const data = await res.json();
        setPoster(data);
      } catch (error) {
        console.error("Failed to load poster", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoster();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-32">
        Loading poster...
      </div>
    );
  }

  if (!poster || poster.message) {
    return (
      <div className="text-center text-red-400 mt-32">
        Poster not found
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(poster);
    setAdded(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-12">

        {/* 🖼 POSTER IMAGE */}
        <img
          src={poster.imageUrl}
          alt={poster.title}
          className="rounded-xl w-full object-cover"
        />

        {/* 📄 POSTER DETAILS */}
        <div>
          <h1 className="text-4xl font-extrabold text-purple-400 mb-4">
            {poster.title}
          </h1>

          <p className="text-gray-400 mb-2">
            Category: {poster.category}
          </p>

          <p className="text-gray-400 mb-6">
            Seller: {poster.seller?.name}
          </p>

          <p className="text-3xl font-bold text-white mb-8">
            ₹{poster.finalPrice ?? poster.price}
          </p>

          {/* 🛒 ADD TO CART */}
          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`px-8 py-4 rounded-xl transition ${
              added
                ? "bg-green-600 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {added ? "Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
