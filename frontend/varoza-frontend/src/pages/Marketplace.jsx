import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PosterCard from "../components/PosterCard";
import { buildOptimizedSrcSet, optimizeImage } from "../utils/optimizeImage";
import {
  LEGACY_HASH_TO_CATEGORY_ID,
  MARKETPLACE_CATEGORY_OPTIONS,
  resolveCategoryId
} from "../constants/categories";

const ALL_POSTERS_PER_PAGE = 20;
const CATEGORY_POSTERS_PER_PAGE = 10;
const SUPPORT_EMAIL = "varoza-@outlook.com";

export default function Marketplace() {
  const [posters, setPosters] = useState([]);
  const [search, setSearch] = useState("");
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [showAllPosters, setShowAllPosters] = useState(false);
  const [activeExploreCategoryId, setActiveExploreCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const scrollToSection = useCallback((id) => {
    const target = document.getElementById(id);
    if (!target) return false;

    const headerOffset = window.innerWidth < 768 ? 100 : 120;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(top, 0),
      behavior: "smooth"
    });

    return true;
  }, []);

  const focusSection = useCallback(
    (id) => {
      // Run twice so repeated clicks on the same target still land correctly.
      scrollToSection(id);
      setTimeout(() => {
        scrollToSection(id);
      }, 180);
    },
    [scrollToSection]
  );

  const fetchPosters = async (query = "") => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posters/approved?search=${encodeURIComponent(
          query
        )}`
      );

      if (!res.ok) {
        throw new Error("Failed to load posters");
      }

      const data = await res.json();
      setPosters(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setPosters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  const openSearchPanelWithFocus = useCallback(() => {
    setSearchPanelOpen(true);

    let attempts = 0;

    const intervalId = setInterval(() => {
      attempts += 1;

      const section = document.getElementById("search");
      const input = document.getElementById("marketplace-search-input");

      if (section) {
        scrollToSection("search");
      }

      if (input) {
        input.focus({ preventScroll: true });
        clearInterval(intervalId);
        return;
      }

      if (attempts >= 14) {
        clearInterval(intervalId);
      }
    }, 75);

    return () => clearInterval(intervalId);
  }, [scrollToSection]);

  useEffect(() => {
    if (!location.hash) return undefined;

    const id = location.hash.replace("#", "");

    if (id === "all-posters") {
      if (!showAllPosters) {
        setShowAllPosters(true);
      }
      return undefined;
    }

    if (id === "search") {
      return undefined;
    }

    const resolvedId = LEGACY_HASH_TO_CATEGORY_ID[id] || id;
    if (!document.getElementById(resolvedId)) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      scrollToSection(resolvedId);
    }, 150);

    return () => clearTimeout(timeout);
  }, [location.hash, scrollToSection, showAllPosters]);

  useEffect(() => {
    if (location.hash !== "#all-posters" || !showAllPosters) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      scrollToSection("all-posters");
    }, 160);

    return () => clearTimeout(timeout);
  }, [location.hash, showAllPosters, scrollToSection]);

  useEffect(() => {
    const handler = () => {
      openSearchPanelWithFocus();
    };

    window.addEventListener("varoza-open-search", handler);
    return () => {
      window.removeEventListener("varoza-open-search", handler);
    };
  }, [openSearchPanelWithFocus]);

  const sections = useMemo(() => {
    const grouped = MARKETPLACE_CATEGORY_OPTIONS.map((category) => ({
      id: category.id,
      label: category.label,
      items: []
    }));
    const groupedById = new Map(grouped.map((section) => [section.id, section]));

    posters.forEach((poster) => {
      const categoryId = resolveCategoryId(poster.category);
      const targetSection = groupedById.get(categoryId) || groupedById.get("others");
      targetSection.items.push(poster);
    });

    return grouped.filter((section) => section.items.length > 0);
  }, [posters]);

  const collectionCards = sections.slice(0, 6);
  const newArrivals = posters.slice(0, 12);
  const featuredRows = sections;
  const selectedExploreSection = useMemo(
    () => sections.find((section) => section.id === activeExploreCategoryId) || null,
    [sections, activeExploreCategoryId]
  );
  const postersForPagination = selectedExploreSection ? selectedExploreSection.items : posters;
  const postersPerPage = selectedExploreSection ? CATEGORY_POSTERS_PER_PAGE : ALL_POSTERS_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(postersForPagination.length / postersPerPage));
  const paginationTokens = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  }, [currentPage, totalPages]);

  const paginatedPosters = useMemo(() => {
    const start = (currentPage - 1) * postersPerPage;
    return postersForPagination.slice(start, start + postersPerPage);
  }, [currentPage, postersForPagination, postersPerPage]);
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!activeExploreCategoryId) return;

    const exists = sections.some((section) => section.id === activeExploreCategoryId);
    if (!exists) {
      setActiveExploreCategoryId(null);
      setCurrentPage(1);
    }
  }, [sections, activeExploreCategoryId]);

  const handleViewAllClick = () => {
    setShowAllPosters(true);
    setActiveExploreCategoryId(null);
    setCurrentPage(1);

    const nextUrl = `${window.location.pathname}${window.location.search}#all-posters`;
    window.history.replaceState(null, "", nextUrl);

    setTimeout(() => {
      focusSection("all-posters");
    }, 120);
  };

  const handleCategoryExploreClick = (categoryId) => {
    setShowAllPosters(true);
    setActiveExploreCategoryId(categoryId);
    setCurrentPage(1);

    const nextUrl = `${window.location.pathname}${window.location.search}#all-posters`;
    window.history.replaceState(null, "", nextUrl);

    setTimeout(() => {
      focusSection("all-posters");
    }, 120);
  };

  const handleCollectionClick = (event, categoryId) => {
    event.preventDefault();

    const nextUrl = `${window.location.pathname}${window.location.search}#${categoryId}`;
    window.history.replaceState(null, "", nextUrl);
    focusSection(categoryId);
  };

  return (
    <div className="pb-0">
      <section className="varoza-container pt-4 md:pt-6">
        <div
          className="section-panel card-shadow overflow-hidden bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/marketplace-hero-bg.jpeg')",
            backgroundSize: "100% 100%"
          }}
        >
          <div className="bg-gradient-to-r from-[#fffdf8]/90 via-[#fffdf8]/65 to-[#fffdf8]/20 px-5 py-5 sm:px-8 md:py-7">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-[#58181F]">Poster Marketplace</p>
              <h1 className="mt-3 font-['Cinzel'] text-[1.95rem] font-bold leading-tight text-black md:text-[2.65rem]">
                Curated Posters
                <span className="block text-[#58181F]">for Every Vibe</span>
              </h1>
              <p className="mt-3 max-w-xl text-base text-black/70 md:text-[1.05rem]">
                Premium wall posters with fast delivery and clean prints. Discover new drops, shop by category,
                and create your own custom design.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/marketplace#new-arrivals" className="action-button px-6 py-3 text-sm">
                  Shop New Arrival
                </Link>
                <a
                  href="https://wa.me/917899251692"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="outline-button px-6 py-3 text-sm"
                >
                  Custom Poster
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="search" className={`varoza-container ${searchPanelOpen ? "mt-8" : "mt-0"}`}>
        <div
          className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.2,0.9,0.22,1)] ${
            searchPanelOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="section-panel card-shadow p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.26em] text-[#58181F]">
                Quick Search
              </p>
              <button
                type="button"
                onClick={() => setSearchPanelOpen(false)}
                className="rounded-full border border-black/20 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-black/70 transition hover:bg-black hover:text-white"
              >
                Close
              </button>
            </div>

            <div
              className={`mt-3 transition-all duration-500 ${
                searchPanelOpen ? "translate-x-0 opacity-100" : "-translate-x-24 opacity-0"
              }`}
            >
              <input
                id="marketplace-search-input"
                type="text"
                placeholder="Search by poster name, category, seller, or price..."
                className="h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-black outline-none transition focus:border-[#58181F]"
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  fetchPosters(value);
                }}
              />
            </div>

            <div
              className={`mt-3 transition-all delay-150 duration-500 ${
                searchPanelOpen ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
              }`}
            >
              <a
                href="https://wa.me/917899251692"
                target="_blank"
                rel="noopener noreferrer"
                className="maroon-pill inline-flex h-12 w-full items-center justify-center rounded-xl px-5 text-sm font-bold tracking-wide sm:w-auto"
              >
                Get Custom Poster
              </a>
            </div>
          </div>
        </div>
      </section>

      {loading && (
        <p className="mt-14 text-center text-base font-semibold text-black/60">Loading posters...</p>
      )}

      {!loading && error && (
        <p className="mt-14 text-center text-base font-semibold text-[#58181F]">{error}</p>
      )}

      {!loading && !error && posters.length > 0 && (
        <>
          <section id="collections" className="varoza-container mt-14">
            <div className="text-center">
              <h2 className="sticker-heading">Collections</h2>
              <p className="sticker-subtitle">Hand picked collection for you</p>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {collectionCards.map((section) => (
                <Link
                  key={section.id}
                  to={`/marketplace#${section.id}`}
                  onClick={(event) => handleCollectionClick(event, section.id)}
                  className="group overflow-hidden rounded-2xl border border-black/10 bg-white card-shadow"
                >
                  <div className="relative">
                    <img
                      src={optimizeImage(section.items[0]?.imageUrl, 900)}
                      srcSet={buildOptimizedSrcSet(section.items[0]?.imageUrl, [320, 480, 640, 780, 900])}
                      sizes="(max-width: 640px) 46vw, (max-width: 1024px) 46vw, 30vw"
                      alt={section.label}
                      className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/60" />
                    <p className="absolute bottom-3 left-3 right-3 text-2xl font-extrabold uppercase leading-none tracking-wide text-white drop-shadow-lg sm:text-3xl md:bottom-4 md:left-4 md:right-4 md:text-4xl">
                      {section.label}
                    </p>
                  </div>
                  <div className="flex items-center justify-between px-3 py-3 text-base font-semibold text-black sm:px-4 sm:py-4 sm:text-lg md:text-xl">
                    <span>{section.label}</span>
                    <span aria-hidden>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section id="new-arrivals" className="varoza-container mt-16">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="sticker-heading">New Arrival</h2>
                <p className="sticker-subtitle">Hurry stock are limited</p>
              </div>

              <button
                type="button"
                onClick={handleViewAllClick}
                className="action-button px-6 py-3 text-sm"
              >
                View all
              </button>
            </div>

            <div className="h-scroll mt-8 flex gap-3 overflow-x-auto pb-3 sm:gap-4">
              {newArrivals.map((poster) => (
                <div key={poster._id} className="w-[176px] min-w-[176px] sm:w-[220px] sm:min-w-[220px] md:w-[260px] md:min-w-[260px]">
                  <PosterCard poster={poster} />
                </div>
              ))}
            </div>
          </section>

          {showAllPosters && (
            <section id="all-posters" className="varoza-container mt-14">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="sticker-heading">
                    {selectedExploreSection ? `${selectedExploreSection.label} Posters` : "All Posters"}
                  </h2>
                  <p className="sticker-subtitle">
                    Showing {paginatedPosters.length} of {postersForPagination.length} posters
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedExploreSection && (
                    <button
                      type="button"
                      onClick={handleViewAllClick}
                      className="outline-button px-5 py-2 text-xs uppercase tracking-[0.14em]"
                    >
                      View all posters
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="outline-button px-5 py-2 text-xs uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Previous
                  </button>

                  <div className="hidden items-center gap-1 md:flex">
                    {paginationTokens.map((token, index) =>
                      token === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-2 text-xs font-bold uppercase tracking-[0.16em] text-black/45"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={`page-${token}`}
                          type="button"
                          onClick={() => setCurrentPage(token)}
                          className={`h-9 min-w-9 rounded-full border px-3 text-xs font-bold uppercase tracking-[0.14em] transition ${
                            currentPage === token
                              ? "border-black bg-black text-white"
                              : "border-black/20 bg-white text-black/75 hover:border-black hover:bg-black hover:text-white"
                          }`}
                        >
                          {token}
                        </button>
                      )
                    )}
                  </div>

                  <span className="rounded-full border border-black/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-black/70 md:hidden">
                    Page {currentPage} / {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="outline-button px-5 py-2 text-xs uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {paginatedPosters.map((poster) => (
                  <PosterCard key={poster._id} poster={poster} />
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-black/10 pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="outline-button px-5 py-2 text-xs uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Previous
                </button>

                <div className="hidden items-center gap-1 md:flex">
                  {paginationTokens.map((token, index) =>
                    token === "..." ? (
                      <span
                        key={`bottom-ellipsis-${index}`}
                        className="px-2 text-xs font-bold uppercase tracking-[0.16em] text-black/45"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={`bottom-page-${token}`}
                        type="button"
                        onClick={() => setCurrentPage(token)}
                        className={`h-9 min-w-9 rounded-full border px-3 text-xs font-bold uppercase tracking-[0.14em] transition ${
                          currentPage === token
                            ? "border-black bg-black text-white"
                            : "border-black/20 bg-white text-black/75 hover:border-black hover:bg-black hover:text-white"
                        }`}
                      >
                        {token}
                      </button>
                    )
                  )}
                </div>

                <span className="rounded-full border border-black/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-black/70 md:hidden">
                  Page {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="outline-button px-5 py-2 text-xs uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Next
                </button>
              </div>
            </section>
          )}

          {featuredRows.map((section) => (
            <section key={section.id} id={section.id} className="varoza-container mt-14">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="sticker-heading">{section.label}</h2>
                  <p className="sticker-subtitle">Premium {section.label} posters</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCategoryExploreClick(section.id)}
                  className="outline-button px-6 py-3 text-sm"
                >
                  Explore
                </button>
              </div>

              <div className="h-scroll mt-8 flex gap-3 overflow-x-auto pb-3 sm:gap-4">
                {section.items.slice(0, 12).map((poster) => (
                  <div key={poster._id} className="w-[176px] min-w-[176px] sm:w-[220px] sm:min-w-[220px] md:w-[260px] md:min-w-[260px]">
                    <PosterCard poster={poster} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </>
      )}

      {!loading && !error && posters.length === 0 && (
        <p className="mt-14 text-center text-lg font-semibold text-black/70">No posters found</p>
      )}

      <section className="mt-16">
        <div className="footer-wave-wrap" aria-hidden>
          <svg viewBox="0 0 2880 120" className="footer-wave footer-wave-primary" preserveAspectRatio="none">
            <path d="M0,70 C60,50 120,50 180,70 C240,90 300,90 360,70 C420,50 480,50 540,70 C600,90 660,90 720,70 C780,50 840,50 900,70 C960,90 1020,90 1080,70 C1140,50 1200,50 1260,70 C1320,90 1380,90 1440,70 L1440,120 L0,120 Z" fill="#000000" />
            <path d="M1440,70 C1500,50 1560,50 1620,70 C1680,90 1740,90 1800,70 C1860,50 1920,50 1980,70 C2040,90 2100,90 2160,70 C2220,50 2280,50 2340,70 C2400,90 2460,90 2520,70 C2580,50 2640,50 2700,70 C2760,90 2820,90 2880,70 L2880,120 L1440,120 Z" fill="#000000" />
          </svg>
          <svg viewBox="0 0 2880 120" className="footer-wave footer-wave-secondary" preserveAspectRatio="none">
            <path d="M0,78 C80,62 160,62 240,78 C320,94 400,94 480,78 C560,62 640,62 720,78 C800,94 880,94 960,78 C1040,62 1120,62 1200,78 C1280,94 1360,94 1440,78 L1440,120 L0,120 Z" fill="#141414" />
            <path d="M1440,78 C1520,62 1600,62 1680,78 C1760,94 1840,94 1920,78 C2000,62 2080,62 2160,78 C2240,94 2320,94 2400,78 C2480,62 2560,62 2640,78 C2720,94 2800,94 2880,78 L2880,120 L1440,120 Z" fill="#141414" />
          </svg>
        </div>

        <footer className="-mt-px bg-black text-white">
          <div className="varoza-container grid gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 md:gap-14 md:py-14">
            <div>
              <h3 className="text-4xl font-['Cinzel'] font-semibold tracking-[0.08em] text-[#F7E7CE]">Contact info</h3>
              <p className="mt-5 text-[1.7rem] font-semibold text-white/90">Support</p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-2 inline-block text-xl font-bold text-white underline-offset-4 transition hover:text-[#F7E7CE] hover:underline"
              >
                Mail : {SUPPORT_EMAIL}
              </a>
            </div>

            <div className="md:justify-self-end md:text-left">
              <h3 className="text-4xl font-['Cinzel'] font-semibold tracking-[0.08em] text-[#F7E7CE]">Quick links</h3>
              <div className="mt-5 space-y-3 text-lg text-white/85">
                <Link to="/about" className="block w-fit transition hover:underline hover:underline-offset-4">
                  About Us
                </Link>
                <Link to="/faqs" className="block w-fit transition hover:underline hover:underline-offset-4">
                  FAQs
                </Link>
                <a
                  href="https://www.instagram.com/varoza.posters/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-fit transition hover:underline hover:underline-offset-4"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 py-4 text-center">
            <p className="text-sm font-semibold tracking-[0.08em] text-white/80">
              Created by{" "}
              <a
                href="https://wa.me/917892403563"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F7E7CE] underline-offset-4 transition hover:underline"
              >
                Dhruthik
              </a>
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
}
