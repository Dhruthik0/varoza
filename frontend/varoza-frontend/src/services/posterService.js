const API = "http://localhost:5001/api/posters";

export const getApprovedPosters = async (search = "") => {
  const url = search
    ? `${API}/approved?search=${encodeURIComponent(search)}`
    : `${API}/approved`;

  const res = await fetch(url);
  return res.json();
};
