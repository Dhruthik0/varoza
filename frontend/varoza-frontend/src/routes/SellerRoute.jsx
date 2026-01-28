import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SellerRoute({ children }) {
  const { user } = useContext(AuthContext);
  const loginAs = localStorage.getItem("loginAs");

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but not in seller mode
  if (loginAs !== "seller") {
    return <Navigate to="/" replace />;
  }

  // ✅ Seller allowed
  return children;
}
