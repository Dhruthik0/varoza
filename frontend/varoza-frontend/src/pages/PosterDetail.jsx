import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { buildOptimizedSrcSet, optimizeImage } from "../utils/optimizeImage";
import { getApprovedPosters } from "../services/posterService";
import { resolveCategoryId } from "../constants/categories";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(Number(value || 0));

export default function PosterDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const relatedScrollRef = useRef(null);

  const [poster, setPoster] = useState(null);
  const [relatedPosters, setRelatedPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchPosterAndRelated = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posters/${id}`);
        const data = await res.json();

        if (!isActive) {
          return;
        }

        setPoster(data);

        if (!data || data.message) {
          setRelatedPosters([]);
          return;
        }

        try {
          const approvedPosters = await getApprovedPosters();
          if (!isActive) {
            return;
          }

          const currentCategoryId = resolveCategoryId(data.category);
          const similar = (Array.isArray(approvedPosters) ? approvedPosters : [])
            .filter(
              (item) =>
                item?._id !== data?._id &&
                resolveCategoryId(item?.category) === currentCategoryId
            )
            .slice(0, 5);

          setRelatedPosters(similar);
        } catch (relatedError) {
          console.error("Failed to load related posters", relatedError);
          setRelatedPosters([]);
        }
      } catch (error) {
        console.error("Failed to load poster", error);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    setAdded(false);
    fetchPosterAndRelated();

    return () => {
      isActive = false;
    };
  }, [id]);

  const finalPrice = Number(poster?.finalPrice ?? poster?.price ?? 0);
  const oldPrice = useMemo(
    () => Math.max(Math.round(finalPrice * 2.4), finalPrice + 50),
    [finalPrice]
  );

  const handleAddToCart = () => {
    addToCart(poster);
    setAdded(true);
  };

  if (loading) {
    return <div className="mt-24 text-center text-lg font-semibold text-black/60">Loading poster...</div>;
  }

  if (!poster || poster.message) {
    return <div className="mt-24 text-center text-lg font-semibold text-[#58181F]">Poster not found</div>;
  }

  return (
    <div className="varoza-container py-8 md:py-12">
      <div className="grid gap-8 overflow-hidden rounded-2xl border border-black/10 bg-white p-5 card-shadow md:grid-cols-2 md:p-8">
        <div>
          <img
            src={optimizeImage(poster.imageUrl, 1400)}
            srcSet={buildOptimizedSrcSet(poster.imageUrl, [360, 520, 720, 960, 1200, 1400])}
            sizes="(max-width: 768px) 92vw, (max-width: 1280px) 48vw, 42vw"
            alt={poster.title}
            className="w-full rounded-2xl border border-black/10 object-cover"
            decoding="async"
          />
        </div>

        <div className="min-w-0 flex flex-col">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#58181F]">{poster.category || "Poster"}</p>
          <h1 className="mt-3 max-w-full break-words font-['Cinzel'] text-3xl font-bold leading-tight text-black [overflow-wrap:anywhere] md:text-5xl">
            {poster.title}
          </h1>

          <p className="mt-3 text-base text-black/65">Sold by {poster.seller?.name || "Varoza"}</p>

          <div className="mt-6 rounded-xl border border-black/10 bg-[#F7E7CE] p-4">
            <p className="text-xl font-semibold text-black/50 line-through">₹ {formatCurrency(oldPrice)}</p>
            <p className="coolvetica-rg text-4xl text-black">From ₹ {formatCurrency(finalPrice)}</p>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-black/60">Premium poster print</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`h-12 rounded-full px-6 text-sm font-bold uppercase tracking-[0.16em] transition ${
                added
                  ? "cursor-not-allowed bg-[#58181F]/50 text-white"
                  : "bg-black text-white hover:bg-[#58181F]"
              }`}
            >
              {added ? "Added to Cart" : "Add to Cart"}
            </button>

            <Link
              to="/cart"
              className="inline-flex h-12 items-center rounded-full border-2 border-black px-6 text-sm font-bold uppercase tracking-[0.16em] transition hover:bg-black hover:text-white"
            >
              Go to Cart
            </Link>
          </div>

          <p className="mt-8 text-sm text-black/65">
            Matte finish print with vivid colors. Packed safely for delivery.
          </p>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-black/10 bg-white p-5 card-shadow md:p-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-['Cinzel'] text-2xl font-semibold tracking-[0.06em] text-[#58181F] md:text-3xl">
            You May Also Like
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/marketplace#${resolveCategoryId(poster.category)}`}
              className="rounded-full border border-black/20 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.15em] text-black transition hover:bg-black hover:text-white"
            >
              View Category
            </Link>
          </div>
        </div>

        {relatedPosters.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-black/20 bg-[#fffaf2] px-4 py-4 text-sm font-semibold text-black/65">
            No similar posters available in this category yet.
          </p>
        ) : (
          <div
            ref={relatedScrollRef}
            className="h-scroll mt-5 flex gap-4 overflow-x-auto pb-2 scroll-smooth"
          >
            {relatedPosters.map((item) => {
              const relatedPrice = Number(item?.finalPrice ?? item?.price ?? 0);
              return (
                <Link
                  key={item._id}
                  to={`/poster/${item._id}`}
                  className="w-[110px] flex-none overflow-hidden rounded-xl border border-black/10 bg-[#fffdf8] transition hover:-translate-y-1 sm:w-[120px] md:w-[132px]"
                >
                  <img
                    src={optimizeImage(item.imageUrl, 820)}
                    srcSet={buildOptimizedSrcSet(item.imageUrl, [100, 140, 180, 220, 280, 360])}
                    sizes="(max-width: 640px) 110px, (max-width: 1024px) 120px, 132px"
                    alt={item.title}
                    className="aspect-[3/4] w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="p-2">
                    <p className="max-h-[1.9rem] overflow-hidden text-[0.72rem] font-black leading-tight text-black [overflow-wrap:anywhere]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[0.5rem] font-bold uppercase tracking-[0.11em] text-black/55">
                      {item?.seller?.name || "Varoza"}
                    </p>
                    <p className="coolvetica-rg mt-1 text-[0.95rem] leading-none text-black">From ₹ {formatCurrency(relatedPrice)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
