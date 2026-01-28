import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const submit = async (e) => {
    e.preventDefault();

    const res = await registerUser(form);

    if (res.message) {
      alert(res.message);

      // ✅ Redirect to login after successful register
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-black/60 backdrop-blur-xl p-8 rounded-xl w-96 border border-white/10"
      >
        <h2 className="text-2xl text-purple-400 mb-6">Register</h2>

        <input
          className="w-full p-3 rounded bg-black/40 mb-3 text-white"
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          className="w-full p-3 rounded bg-black/40 mb-3 text-white"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <input
          type="password"
          className="w-full p-3 rounded bg-black/40 mb-3 text-white"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        <select
          className="w-full p-3 rounded bg-black/40 text-white"
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <button className="mt-6 w-full bg-purple-600 py-3 rounded hover:bg-purple-700 transition">
          Register
        </button>
      </form>
    </div>
  );
}
