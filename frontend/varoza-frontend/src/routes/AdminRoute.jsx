import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  // ⏳ Auth not loaded yet
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Only admin allowed
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

