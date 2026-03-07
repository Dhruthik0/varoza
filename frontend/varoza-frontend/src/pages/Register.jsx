import { useState, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { googleAuth, registerUser } from "../services/authService";

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

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer"
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = useCallback(
    async (credential) => {
      setError("");
      setGoogleLoading(true);

      try {
        const data = await googleAuth({ credential, role: form.role });
        login(data);
        localStorage.setItem("loginAs", data.role === "seller" ? "seller" : "buyer");
        navigateByRole(navigate, data.role);
      } catch (err) {
        setError(err.message || "Google signup failed");
      } finally {
        setGoogleLoading(false);
      }
    },
    [form.role, login, navigate]
  );

  const fieldClass =
    "h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-black outline-none transition focus:border-[#58181F]";

  return (
    <div className="varoza-container flex min-h-[calc(100vh-9rem)] items-center justify-center py-10">
      <form onSubmit={submit} className="card-shadow w-full max-w-2xl rounded-2xl border border-black/10 bg-white p-6 sm:p-8 md:p-10">
        <div className="text-center">
          <h1 className="font-['Cinzel'] text-3xl font-bold text-black sm:text-4xl">Create Account</h1>
          <p className="mt-2 text-lg text-black/60">Join VAROZA marketplace</p>
        </div>

        {error && (
          <p className="mt-5 rounded-lg border border-[#58181F]/30 bg-[#58181F]/10 px-4 py-2 text-sm font-semibold text-[#58181F]">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-4">
          <input
            className={fieldClass}
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            className={fieldClass}
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            className={fieldClass}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-black/20 bg-[#F7E7CE]">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "buyer" })}
              className={`h-12 text-base font-bold transition ${
                form.role === "buyer" ? "bg-white text-black" : "text-black/60 hover:bg-white/50"
              }`}
            >
              Buyer Account
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "seller" })}
              className={`h-12 text-base font-bold transition ${
                form.role === "seller" ? "bg-white text-black" : "text-black/60 hover:bg-white/50"
              }`}
            >
              Seller Account
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading || googleLoading} className="action-button mt-7 h-14 w-full text-xl disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <div className="mt-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-black/15" />
          <span className="text-black/60">or</span>
          <span className="h-px flex-1 bg-black/15" />
        </div>

        <div className="mt-6">
          <GoogleAuthButton
            onCredential={handleGoogleCredential}
            onError={(message) => setError(message)}
            disabled={loading || googleLoading}
          />
        </div>

        <p className="mt-5 text-center text-lg text-black/70">
          Already have an account?{" "}
          <Link to="/login" className="font-extrabold text-black hover:text-[#58181F]">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
