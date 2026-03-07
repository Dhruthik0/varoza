import { useState, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { googleAuth, loginUser } from "../services/authService";

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
      <circle cx="12" cy="16" r="1" />
    </svg>
  );
}

const navigateByRole = (navigate, role) => {
  if (role === "admin") {
    navigate("/admin");
    return;
  }

  if (role === "seller") {
    navigate("/seller");
    return;
  }

  navigate("/marketplace");
};

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAs, setLoginAs] = useState("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const mode = loginAs === "seller" ? "seller" : "buyer";
      const data = await loginUser({ email, password, role: mode });
      login(data);
      localStorage.setItem("loginAs", data.role === "seller" ? "seller" : "buyer");
      navigateByRole(navigate, data.role);
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = useCallback(
    async (credential) => {
      setError("");
      setGoogleLoading(true);

      try {
        const mode = loginAs === "seller" ? "seller" : "buyer";
        const data = await googleAuth({ credential, role: mode });
        login(data);
        localStorage.setItem("loginAs", data.role === "seller" ? "seller" : "buyer");
        navigateByRole(navigate, data.role);
      } catch (err) {
        setError(err.message || "Google login failed");
      } finally {
        setGoogleLoading(false);
      }
    },
    [login, loginAs, navigate]
  );

  return (
    <div className="varoza-container flex min-h-[calc(100vh-9rem)] items-center justify-center py-10">
      <form onSubmit={handleSubmit} className="card-shadow w-full max-w-2xl rounded-2xl border border-black/10 bg-white p-6 sm:p-8 md:p-10">
        <div className="text-center">
          <h1 className="font-['Cinzel'] text-3xl font-bold text-black sm:text-4xl">Welcome Back</h1>
          <p className="mt-2 text-lg text-black/60">Login to your account</p>
        </div>

        <div className="mt-7 grid grid-cols-2 overflow-hidden rounded-xl border border-black/20 bg-[#F7E7CE]">
          <button
            type="button"
            onClick={() => setLoginAs("buyer")}
            className={`h-12 text-base font-bold transition ${
              loginAs === "buyer" ? "bg-white text-black" : "text-black/60 hover:bg-white/50"
            }`}
          >
            Login as Buyer
          </button>

          <button
            type="button"
            onClick={() => setLoginAs("seller")}
            className={`h-12 text-base font-bold transition ${
              loginAs === "seller" ? "bg-white text-black" : "text-black/60 hover:bg-white/50"
            }`}
          >
            Login as Seller
          </button>
        </div>

        {error && (
          <p className="mt-5 rounded-lg border border-[#58181F]/30 bg-[#58181F]/10 px-4 py-2 text-sm font-semibold text-[#58181F]">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-4">
          <label className="flex h-14 items-center gap-3 rounded-xl border border-black/15 bg-white px-4 text-black/70 focus-within:border-[#58181F]">
            <EmailIcon />
            <input
              type="email"
              placeholder="Email"
              className="h-full flex-1 border-0 bg-transparent text-black outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="flex h-14 items-center gap-3 rounded-xl border border-black/15 bg-white px-4 text-black/70 focus-within:border-[#58181F]">
            <LockIcon />
            <input
              type="password"
              placeholder="Password"
              className="h-full flex-1 border-0 bg-transparent text-black outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="text-sm font-semibold text-black/50">Forgot password?</span>
          </label>
        </div>

        <button type="submit" disabled={loading || googleLoading} className="action-button mt-6 h-14 w-full text-2xl disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="mt-5 text-center text-lg text-black/70">
          Don't have an account?{" "}
          <Link to="/register" className="font-extrabold text-black hover:text-[#58181F]">
            Sign up
          </Link>
        </p>

        <div className="mt-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-black/15" />
          <span className="text-black/60">or</span>
          <span className="h-px flex-1 bg-black/15" />
        </div>

        <div className="mt-6">
          <GoogleAuthButton
            onCredential={handleGoogleCredential}
            onError={(message) => setError(message)}
            disabled={googleLoading || loading}
          />
        </div>

        <div className="mt-7 border-t border-black/10 pt-5 text-center text-sm text-black/65">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </form>
    </div>
  );
}
