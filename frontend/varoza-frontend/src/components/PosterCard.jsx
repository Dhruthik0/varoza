import { useNavigate } from "react-router-dom";
import { buildOptimizedSrcSet, optimizeImage } from "../utils/optimizeImage";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(Number(value || 0));

export default function PosterCard({ poster }) {
  const navigate = useNavigate();
  const finalPrice = Number(poster.finalPrice ?? poster.price ?? 0);
  const oldPrice = Math.max(Math.round(finalPrice * 2.4), finalPrice + 50);

  const openPoster = () => {
    navigate(`/poster/${poster._id}`);
  };

  return (
    <article
      onClick={openPoster}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPoster();
        }
      }}
      role="button"
      tabIndex={0}
      className="section-panel cursor-pointer overflow-hidden transition hover:-translate-y-1"
    >
      <div className="relative">
        <img
          src={optimizeImage(poster.imageUrl, 800)}
          srcSet={buildOptimizedSrcSet(poster.imageUrl, [240, 320, 480, 640, 800])}
          sizes="(max-width: 640px) 42vw, (max-width: 1024px) 31vw, 24vw"
          alt={poster.title}
          className="aspect-[3/4] w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <span className="tag-sale absolute bottom-2 left-2 text-sm md:bottom-3 md:left-3 md:text-base">Sale</span>
      </div>

      <div className="px-2.5 pb-3 pt-3 text-center sm:px-3 sm:pb-4 sm:pt-3.5 md:px-4 md:pb-5 md:pt-4">
        <h3 className="min-h-[2.9rem] text-[1.08rem] font-bold leading-tight tracking-wide text-black sm:min-h-[3.3rem] sm:text-[1.25rem] md:min-h-[4.2rem] md:text-[1.75rem]">
          {poster.title}
        </h3>

        <p className="mt-1 text-[0.63rem] font-bold uppercase tracking-[0.17em] text-black/55 sm:text-[0.72rem] md:text-sm md:tracking-[0.2em]">
          {poster.seller?.name || "Varoza"}
        </p>

        <p className="mt-2 text-xl font-semibold text-black/45 line-through sm:text-[1.35rem] md:mt-3 md:text-2xl">
          ₹ {formatCurrency(oldPrice)}
        </p>

        <p className="coolvetica-rg text-[2.1rem] leading-tight text-black sm:text-[2.4rem] md:text-4xl">
          From ₹ {formatCurrency(finalPrice)}
        </p>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            openPoster();
          }}
          className="outline-button mt-3 px-4 py-1.5 text-[0.68rem] uppercase tracking-[0.16em] sm:px-5 sm:py-2 sm:text-xs md:mt-4 md:px-6 md:text-sm md:tracking-[0.18em]"
        >
          Choose options
        </button>
      </div>
    </article>
  );
}
