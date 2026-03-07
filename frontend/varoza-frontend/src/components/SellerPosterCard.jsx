import { Link } from "react-router-dom";
import { buildOptimizedSrcSet, optimizeImage } from "../utils/optimizeImage";


export default function SellerPosterCard({ poster }) {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0
    }).format(Number(value || 0));

  return (
    <article className="group overflow-hidden rounded-[1.35rem] border border-black/10 bg-white card-shadow transition duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={optimizeImage(poster.imageUrl, 600)}
          srcSet={buildOptimizedSrcSet(poster.imageUrl, [220, 320, 420, 520, 600])}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 23vw"
          alt={poster.title}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

        {poster.category && (
          <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/85 px-3 py-1 text-[0.64rem] font-extrabold uppercase tracking-[0.14em] text-black">
            {poster.category}
          </span>
        )}

        <span
          className={`absolute bottom-3 left-3 inline-flex rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] ${
            poster.approved
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {poster.approved ? "Approved" : "Pending"}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <h3 className="min-h-[3.3rem] text-lg font-extrabold leading-snug text-black">{poster.title}</h3>

        <div className="flex items-center justify-between">
          <p className="text-xl font-extrabold text-[#58181F]">₹{formatCurrency(poster.price)}</p>

          {poster.approved ? (
            <Link
              to={`/poster/${poster._id}`}
              className="rounded-full border border-black/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-black transition hover:bg-black hover:text-white"
            >
              Open
            </Link>
          ) : (
            <span className="rounded-full border border-black/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-black/45">
              Awaiting
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
