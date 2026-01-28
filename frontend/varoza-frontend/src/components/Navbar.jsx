


import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  // ✅ SAFETY FIX
  const { cart = [] } = useCart() || {};

  const navigate = useNavigate();
  const loginAs = localStorage.getItem("loginAs"); // buyer | seller | null

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
          className="text-xl font-extrabold tracking-widest text-purple-500"
        >
          VAROZA
        </Link>

        {/* NAV LINKS */}
        <div className="flex gap-6 items-center text-gray-300">

          {user ? (
            <>
              {/* 🌍 EXPLORE */}
              <Link to="/" className="hover:text-white">
                Explore
              </Link>

              

              {/* 🛒 BUYER LINKS */}
              {loginAs !== "seller" && user.role !== "admin" && (
                <>
                  <Link to="/cart" className="relative hover:text-white">
                    Cart
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-3 bg-purple-600 text-xs px-2 py-0.5 rounded-full text-white">
                        {cart.length}
                      </span>
                    )}
                  </Link>

                  <Link to="/orders" className="hover:text-white">
                    My Orders
                  </Link>
                </>
              )}

              {/* 🧑‍🎨 SELLER DASHBOARD */}
              {loginAs === "seller" && (
                <Link to="/seller" className="hover:text-white">
                  Seller Dashboard
                </Link>
              )}
              {/* 🆘 CUSTOMER SERVICE (NEW) */}
              <a
                href="https://wa.me/917892403563"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Customer Service
              </a>

              {/* 🔐 ADMIN LINKS */}
              {user.role === "admin" && (
                <>
                  <Link
                    to="/admin"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Admin Dashboard
                  </Link>

                  <Link
                    to="/admin/analytics"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Analytics
                  </Link>

                  <Link
                    to="/admin/withdrawals"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Withdrawals
                  </Link>
                </>
              )}

              {/* USER NAME */}
              <span className="text-purple-400 font-medium">
                {user.name}
              </span>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-500"
              >
                Logout
              </button>
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
