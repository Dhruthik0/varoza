import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { MARKETPLACE_CATEGORY_OPTIONS } from "../constants/categories";

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
      className="section-panel card-shadow mb-10 overflow-hidden"
    >
      <div className="border-b border-black/10 bg-gradient-to-r from-[#fffdf8] to-[#f7e7ce] px-5 py-4 md:px-6">
        <h3 className="font-['Cinzel'] text-2xl font-bold text-[#58181F] md:text-[1.9rem]">Upload New Poster</h3>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-black/50">
          Poster will be visible after admin approval
        </p>
      </div>

      {error && (
        <p className="mx-5 mb-0 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 md:mx-6">
          {error}
        </p>
      )}

      {success && (
        <p className="mx-5 mb-0 mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 md:mx-6">
          {success}
        </p>
      )}

      <div
        className={`grid gap-5 px-5 py-5 md:px-6 ${
          preview ? "lg:grid-cols-[1.2fr_0.8fr]" : "lg:grid-cols-1"
        }`}
      >
        <div>
          <label className="text-xs font-extrabold uppercase tracking-[0.2em] text-black/55">Poster title</label>
          <input
            placeholder="Mention poster size too (A4, A3...)"
            className="mt-2 h-12 w-full rounded-xl border border-black/15 bg-[#fffdf8] px-4 text-black outline-none transition focus:border-[#58181F]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-extrabold uppercase tracking-[0.2em] text-black/55">Category</label>
              <select
                className="mt-2 h-12 w-full rounded-xl border border-black/15 bg-[#fffdf8] px-4 text-black outline-none transition focus:border-[#58181F]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" className="text-black">
                  Select category
                </option>
                {MARKETPLACE_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.id} value={option.label} className="text-black">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-extrabold uppercase tracking-[0.2em] text-black/55">Price</label>
              <input
                type="number"
                placeholder="₹"
                className="mt-2 h-12 w-full rounded-xl border border-black/15 bg-[#fffdf8] px-4 text-black outline-none transition focus:border-[#58181F]"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-black/10 bg-[#fffdf8] p-4">
            <label className="text-xs font-extrabold uppercase tracking-[0.2em] text-black/55">Poster image</label>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-black/45">
              JPG / PNG recommended
            </p>

            <div className="mt-3 rounded-xl border border-dashed border-black/30 bg-white p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm font-semibold text-black/80 file:mr-4 file:rounded-lg file:border file:border-black/20 file:bg-[#f7e7ce] file:px-3 file:py-2 file:text-sm file:font-bold file:text-black hover:file:bg-[#f0dbb9]"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="action-button mt-5 px-8 py-3 text-sm uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Poster"}
          </button>
        </div>

        {preview && (
          <div className="rounded-2xl border border-black/10 bg-[#fffdf8] p-4 lg:max-w-[300px] lg:justify-self-end">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-black/55">Preview</p>
            <img
              src={preview}
              alt="Preview"
              className="mt-3 max-h-64 w-full rounded-xl border border-black/10 object-cover"
            />
          </div>
        )}
      </div>
    </form>
  );
}
