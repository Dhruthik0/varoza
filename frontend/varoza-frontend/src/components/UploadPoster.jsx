import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function UploadPoster({ onUpload }) {
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file)); // 🔥 preview
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !price || !category || !image) {
      setError("Please fill all fields and select an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", Number(price));
      formData.append("category", category);
      formData.append("image", image); // 🔥 real file

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/seller/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`
          },
          body: formData
        }
      );

      const text = await res.text();
let data;

try {
  data = JSON.parse(text);
} catch {
  throw new Error("Server error during upload");
}


      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setSuccess("Poster uploaded successfully (pending approval)");
      onUpload?.();

      // reset form
      setTitle("");
      setPrice("");
      setCategory("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-black/60 p-6 rounded-xl border border-white/10 mb-12"
    >
      <h3 className="text-xl text-purple-400 mb-4">
        Upload New Poster
      </h3>

      {error && (
        <p className="mb-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {success && (
        <p className="mb-4 text-sm text-green-400">
          {success}
        </p>
      )}

      <input
        placeholder="Title(Do mention the poster size -A4,A3...)"
        className="w-full mb-3 p-3 rounded bg-black/40 text-white"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Category"
        className="w-full mb-3 p-3 rounded bg-black/40 text-white"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price (₹)"
        className="w-full mb-4 p-3 rounded bg-black/40 text-white"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* 🖼️ FILE PICKER */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4 text-gray-300"
      />

      {/* 🔍 PREVIEW */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mb-4 rounded-xl max-h-64 object-contain border border-white/10"
        />
      )}

      <button
        disabled={loading}
        className="bg-purple-600 px-6 py-3 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
