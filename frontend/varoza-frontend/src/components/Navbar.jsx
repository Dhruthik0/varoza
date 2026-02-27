import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart = [] } = useCart() || {};
  const navigate = useNavigate();
  const loginAs = localStorage.getItem("loginAs");

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("loginAs");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-20 backdrop-blur-md bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="text-xl font-extrabold tracking-widest text-purple-500 hover:scale-105 transition"
        >
          VAROZA
        </Link>

        {/* RIGHT SIDE */}
        <div className="relative flex items-center gap-4 text-gray-300">

          {user ? (
            <>
              {/* USERNAME */}
              <span className="text-purple-400 font-medium">
                {user.name}
              </span>

              {/* MENU ICON */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md hover:bg-white/10 transition"
              >
                <div className="w-5 h-[2px] bg-white mb-1"></div>
                <div className="w-5 h-[2px] bg-white mb-1"></div>
                <div className="w-5 h-[2px] bg-white"></div>
              </button>

              {/* DROPDOWN */}
              {menuOpen && (
                <div className="absolute right-0 top-14 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4 space-y-3 animate-fadeIn">

                  {/* Explore */}
                  <Link
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition"
                  >
                    Explore
                  </Link>

                  {/* Buyer Links */}
                  {loginAs !== "seller" && user.role !== "admin" && (
                    <>
                      <Link
                        to="/cart"
                        onClick={() => setMenuOpen(false)}
                        className="flex justify-between items-center px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition"
                      >
                        <span>Cart</span>
                        {cart.length > 0 && (
                          <span className="bg-purple-600 text-xs px-2 py-0.5 rounded-full text-white">
                            {cart.length}
                          </span>
                        )}
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition"
                      >
                        My Orders
                      </Link>
                    </>
                  )}

                  {/* Seller */}
                  {loginAs === "seller" && (
                    <Link
                      to="/seller"
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition"
                    >
                      Seller Dashboard
                    </Link>
                  )}

                  {/* Customer Service */}
                  <a
                    href="https://wa.me/917892403563"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition"
                  >
                    Customer Service
                  </a>

                  {/* Admin */}
                  {user.role === "admin" && (
                    <>
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2 rounded-lg text-purple-400 hover:bg-white/10 hover:text-purple-300 transition"
                      >
                        Admin Dashboard
                      </Link>

                      <Link
                        to="/admin/analytics"
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2 rounded-lg text-purple-400 hover:bg-white/10 hover:text-purple-300 transition"
                      >
                        Analytics
                      </Link>

                      <Link
                        to="/admin/withdrawals"
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2 rounded-lg text-purple-400 hover:bg-white/10 hover:text-purple-300 transition"
                      >
                        Withdrawals
                      </Link>
                    </>
                  )}

                  {/* Divider */}
                  <div className="border-t border-white/10 my-2"></div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                  >
                    Logout
                  </button>

                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-white">
                Login
              </Link>
              <Link to="/register" className="hover:text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}