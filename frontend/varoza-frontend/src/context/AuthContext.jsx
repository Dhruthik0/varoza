// import { createContext, useEffect, useState } from "react";
// import { loginUser } from "../services/authService";

// export const AuthContext = createContext();

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Load user from localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem("user");
//     if (stored) {
//       setUser(JSON.parse(stored));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     const data = await loginUser({ email, password });

//     if (!data?.token) return false;

//     const userData = {
//       name: data.name,
//       role: data.role,
//       token: data.token,
//     };

//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);
//     return true;
//   };

//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("loginAs");
//     setUser(null);
//   };

//   if (loading) {
//     return <div className="text-white">Loading...</div>;
//   }

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔁 Restore user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("loginAs");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ THIS IS WHAT MyOrders, Payment, Checkout USE
export function useAuth() {
  return useContext(AuthContext);
}

// ✅ Backward compatibility (Navbar / older code)
export { AuthContext };
