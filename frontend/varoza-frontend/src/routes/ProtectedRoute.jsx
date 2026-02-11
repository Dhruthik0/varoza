// import { Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// export default function ProtectedRoute({ children }) {
//   const { user } = useContext(AuthContext);

//   // ❌ Not logged in
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // ✅ Logged in
//   return children;
// }
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useContext(AuthContext); // ✅ added authLoading

  // ✅ ADDED: wait until auth finishes restoring user
  if (authLoading) {
    return null; 
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in
  return children;
}
