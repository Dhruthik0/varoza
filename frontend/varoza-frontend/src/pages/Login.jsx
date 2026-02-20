import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAs, setLoginAs] = useState("buyer");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ THIS IS THE KEY FIX
      // data MUST contain: token, name, role
      login(data);

      // store mode (buyer / seller)
      localStorage.setItem("loginAs", loginAs);

      // redirect
      navigate(loginAs === "seller" ? "/seller" : "/");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-black/60 backdrop-blur-xl p-10 rounded-2xl w-full max-w-md border border-white/10"
      >
        <h2 className="text-2xl font-bold text-purple-400 mb-6">
          Login
        </h2>

        {error && (
          <p className="text-red-400 mb-4 text-sm">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded bg-yellow-100 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 rounded bg-yellow-100 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* LOGIN MODE */}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setLoginAs("buyer")}
            className={`flex-1 py-2 rounded ${
              loginAs === "buyer"
                ? "bg-purple-600 text-white"
                : "bg-black/40 border border-white/10"
            }`}
          >
            Buyer
          </button>

          <button
            type="button"
            onClick={() => setLoginAs("seller")}
            className={`flex-1 py-2 rounded ${
              loginAs === "seller"
                ? "bg-purple-600 text-white"
                : "bg-black/40 border border-white/10"
            }`}
          >
            Seller
          </button>
        </div>

        <button className="w-full py-3 bg-purple-600 rounded text-white font-semibold hover:bg-purple-700 transition">
          Login
        </button>
      </form>
    </div>
  );
}
