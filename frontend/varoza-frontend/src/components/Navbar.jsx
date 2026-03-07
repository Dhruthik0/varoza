import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16L21 21" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4 20c0-3.8 3.1-6 8-6s8 2.2 8 6" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M3 4h2l2.4 11h10.9l2-8.5H7" />
      <circle cx="10" cy="19" r="1.6" />
      <circle cx="17" cy="19" r="1.6" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart = [] } = useCart() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const rotatingPromoMessage = "BUY 2 GET 1 FREEE BUY 6 GET 3 FREEE LIMITED TIME OFFER GRAB IT NOWWW";

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const closeMenus = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  const requestMarketplaceSearchPanel = () => {
    window.dispatchEvent(new CustomEvent("varoza-open-search"));
  };

  const requestMarketplaceSearchPanelBurst = () => {
    // Fire a short burst so it still works right after route transition.
    requestMarketplaceSearchPanel();
    setTimeout(requestMarketplaceSearchPanel, 220);
    setTimeout(requestMarketplaceSearchPanel, 480);
  };

  const handleSearchClick = () => {
    closeMenus();

    if (location.pathname !== "/marketplace") {
      navigate("/marketplace");
      setTimeout(requestMarketplaceSearchPanelBurst, 80);
      return;
    }

    requestMarketplaceSearchPanelBurst();
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("loginAs");
    closeMenus();
    navigate("/login");
  };

  const requestSellerWithdrawalsScroll = () => {
    window.dispatchEvent(new CustomEvent("varoza-scroll-withdrawals"));
  };

  const requestSellerWithdrawalsScrollBurst = () => {
    requestSellerWithdrawalsScroll();
    setTimeout(requestSellerWithdrawalsScroll, 240);
    setTimeout(requestSellerWithdrawalsScroll, 520);
  };

  const handleFeaturedMenuLinkClick = (to) => {
    closeMenus();

    if (to === "/seller#seller-withdrawals") {
      requestSellerWithdrawalsScrollBurst();
    }
  };

  const showBuyerActions = Boolean(user) && user.role === "buyer";
  const showAdminOnlyMenu = Boolean(user) && user.role === "admin";
  const showSellerOnlyMenu = Boolean(user) && user.role === "seller";

  const featuredMenuLinks = showAdminOnlyMenu
    ? [
        {
          to: "/marketplace",
          title: "Marketplace",
          subtitle: "Browse live storefront"
        },
        {
          to: "/admin",
          title: "Admin Dashboard",
          subtitle: "Review sellers, posters, payments"
        },
        {
          to: "/admin/analytics",
          title: "Analytics",
          subtitle: "Revenue, margin and settings"
        },
        {
          to: "/admin/withdrawals",
          title: "Withdrawals",
          subtitle: "Approve or reject payout requests"
        }
      ]
    : showSellerOnlyMenu
    ? [
        {
          to: "/marketplace",
          title: "Marketplace",
          subtitle: "Browse approved posters"
        },
        {
          to: "/seller",
          title: "Seller Dashboard",
          subtitle: "Manage your uploads"
        },
        {
          to: "/seller#seller-withdrawals",
          title: "Withdrawals",
          subtitle: "Jump to payout requests"
        }
      ]
    : [
        {
          to: "/marketplace",
          title: "Marketplace Home",
          subtitle: "Fresh posters, curated daily"
        },
        {
          to: "/marketplace#collections",
          title: "Collections",
          subtitle: "Hand-picked categories"
        },
        {
          to: "/marketplace#new-arrivals",
          title: "New Arrivals",
          subtitle: "Latest premium drops"
        }
      ];

  const categoryShortcutLinks = [
    { label: "Movie", to: "/marketplace#movie" },
    { label: "Music / Bands", to: "/marketplace#music-bands" },
    { label: "Anime", to: "/marketplace#anime" },
    { label: "Motivational / Quotes", to: "/marketplace#motivational-quotes" },
    { label: "Aesthetic / Minimal Art", to: "/marketplace#aesthetic-minimal-art" },
    { label: "Split Design", to: "/marketplace#split-design" },
    { label: "Cars / Bikes", to: "/marketplace#cars-bikes" },
    { label: "Gaming", to: "/marketplace#gaming" },
    { label: "Others", to: "/marketplace#others" }
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-black/10 bg-white/95 backdrop-blur-md">
      <div className="bg-black py-2 text-[0.72rem] font-bold tracking-[0.2em] text-white sm:text-xs">
        <div className="varoza-container flex items-center">
          <div className="relative h-5 w-full overflow-hidden">
            <p className="promo-message-scroll absolute top-1/2 whitespace-nowrap text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white">
              {rotatingPromoMessage}
              <span aria-hidden className="mx-8">•</span>
              {rotatingPromoMessage}
            </p>
          </div>
        </div>
      </div>

      <nav className="relative">
        <div className="varoza-container flex h-16 items-center justify-between md:h-20">
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => {
              setMenuOpen((prev) => !prev);
              setAccountOpen(false);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/15 text-black transition hover:bg-black hover:text-white"
          >
            <span className="space-y-[4px]">
              <span className="block h-[1.5px] w-5 bg-current" />
              <span className="block h-[1.5px] w-5 bg-current" />
              <span className="block h-[1.5px] w-5 bg-current" />
            </span>
          </button>

          <Link
            to="/marketplace"
            className="text-center font-['Cinzel'] text-2xl font-semibold tracking-[0.18em] text-black md:text-[2rem]"
            onClick={closeMenus}
          >
            VAROZA
          </Link>

          <div className="flex items-center gap-2 text-black">
            <button
              type="button"
              aria-label="Search posters"
              onClick={handleSearchClick}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/15 transition hover:bg-black hover:text-white"
            >
              <SearchIcon />
            </button>

            {user ? (
              <button
                type="button"
                aria-label="Open account menu"
                onClick={() => {
                  setAccountOpen((prev) => !prev);
                  setMenuOpen(false);
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/15 transition hover:bg-black hover:text-white"
              >
                <UserIcon />
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-full border border-black/20 px-4 py-2 text-sm font-bold transition hover:bg-black hover:text-white sm:inline"
              >
                Login
              </Link>
            )}

            <Link
              to={user ? "/cart" : "/login"}
              aria-label="View cart"
              onClick={closeMenus}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/15 transition hover:bg-black hover:text-white"
            >
              <CartIcon />
              {showBuyerActions && cart.length > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#58181F] px-1 text-[0.7rem] font-bold text-white">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {menuOpen && (
          <div className="absolute inset-x-0 top-full max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-black/10 bg-gradient-to-b from-[#fffdf8] via-[#f7e7ce] to-[#f2dcbf] shadow-[0_28px_55px_rgba(0,0,0,0.2)] md:max-h-[calc(100vh-5.5rem)]">
            <div className="varoza-container py-5 md:py-7">
              <div className={`grid gap-4 ${showSellerOnlyMenu || showAdminOnlyMenu ? "" : "lg:grid-cols-[1.1fr_0.9fr]"}`}>
                <div className="rounded-2xl border border-black/10 bg-white/90 p-4 md:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[#58181F]">
                      {showAdminOnlyMenu ? "Admin Menu" : showSellerOnlyMenu ? "Seller Menu" : "Explore Menu"}
                    </p>
                    <span className="rounded-full border border-black/20 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-black/70">
                      {showAdminOnlyMenu ? "Control Center" : showSellerOnlyMenu ? "Quick Links" : "Trend Picks"}
                    </span>
                  </div>

                  <div
                    className={`grid gap-3 ${
                      showSellerOnlyMenu || showAdminOnlyMenu ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3"
                    }`}
                  >
                    {featuredMenuLinks.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => handleFeaturedMenuLinkClick(item.to)}
                        className="group rounded-xl border border-black/10 bg-[#fff8ec] p-4 transition hover:-translate-y-0.5 hover:border-black/35 hover:bg-white"
                      >
                        <p className="text-base font-extrabold text-black">{item.title}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-black/55">
                          {item.subtitle}
                        </p>
                        <p className="mt-3 text-sm font-bold text-[#58181F] group-hover:underline">
                          Open section →
                        </p>
                      </Link>
                    ))}
                  </div>

                  {!showSellerOnlyMenu && !showAdminOnlyMenu && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <a
                        href="https://wa.me/917899251692"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeMenus}
                        className="rounded-xl border border-black/15 bg-black px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#58181F]"
                      >
                        Custom Poster Request
                      </a>

                      {showBuyerActions ? (
                        <Link
                          to="/orders"
                          onClick={closeMenus}
                          className="rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-black transition hover:bg-[#f7e7ce]"
                        >
                          Track My Orders
                        </Link>
                      ) : (
                        <Link
                          to={user ? "/cart" : "/login"}
                          onClick={closeMenus}
                          className="rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-black transition hover:bg-[#f7e7ce]"
                        >
                          {user ? "Open Cart" : "Login / Register"}
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {!showSellerOnlyMenu && !showAdminOnlyMenu && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-[#58181F]/30 bg-[#58181F] p-5 text-white">
                      <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#f7e7ce]">
                        Varoza Picks
                      </p>
                      <h3 className="mt-2 font-['Cinzel'] text-2xl font-semibold tracking-[0.08em]">
                        Bold Walls, Better Stories
                      </h3>
                      <p className="mt-2 text-sm text-[#f8ede3]">
                        Build your setup with statement posters, then get a custom design when you want something personal.
                      </p>
                      <a
                        href="https://wa.me/917892403563"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeMenus}
                        className="mt-4 inline-flex rounded-full border border-white/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-[#58181F]"
                      >
                        Customer Support
                      </a>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white/90 p-4">
                      <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-black/65">
                        Category Shortcuts
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {categoryShortcutLinks.map((shortcut) => (
                          <Link
                            key={shortcut.to}
                            to={shortcut.to}
                            onClick={closeMenus}
                            className="rounded-full border border-black/15 bg-[#fff7eb] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-black transition hover:border-black hover:bg-black hover:text-white"
                          >
                            {shortcut.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {accountOpen && user && (
          <div className="absolute right-4 top-[5.25rem] w-[18.5rem] rounded-2xl border border-black/10 bg-white p-4 card-shadow md:top-[6.2rem]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#58181F]">Signed in as</p>
            <p className="mt-1 text-lg font-extrabold text-black">{user.name}</p>
            <p className="mt-1 text-sm text-black/65">{location.pathname === "/marketplace" ? "Browsing Marketplace" : "VAROZA Account"}</p>

            <div className="mt-4 space-y-2">
              {showBuyerActions && (
                <Link
                  to="/orders"
                  onClick={closeMenus}
                  className="block rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold transition hover:bg-[#F7E7CE]"
                >
                  Track My Orders
                </Link>
              )}

              <a
                href="https://wa.me/917892403563"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold transition hover:bg-[#F7E7CE]"
                onClick={closeMenus}
              >
                Customer Support
              </a>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg bg-black px-3 py-2 text-sm font-bold text-white transition hover:bg-[#58181F]"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
