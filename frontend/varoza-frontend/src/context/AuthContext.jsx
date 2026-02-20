

// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);

//   // 🔁 Restore user from localStorage on refresh
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("loginAs");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // ✅ THIS IS WHAT MyOrders, Payment, Checkout USE
// export function useAuth() {
//   return useContext(AuthContext);
// }

// // ✅ Backward compatibility (Navbar / older code)
// export { AuthContext };
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ✅ ADDED
  const [authLoading, setAuthLoading] = useState(true);

  // 🔁 Restore user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // ✅ ADDED
    setAuthLoading(false);

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
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ THIS IS WHAT MyOrders, Payment, Checkout 
export function useAuth() {
  return useContext(AuthContext);
}

// ✅ Backward compatibility (Navbar / older code)
export { AuthContext };
