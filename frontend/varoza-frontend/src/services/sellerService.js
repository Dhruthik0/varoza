const API = `${import.meta.env.VITE_API_URL}/api/seller`;

export const getMyPosters = async (token) => {
  const res = await fetch(`${API}/my-posters`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const getEarnings = async (token) => {
  const res = await fetch(`${API}/earnings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const uploadPoster = async (data, token) => {
  const res = await fetch(`${API}/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
export const getWithdrawals = async (token) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/seller/withdrawals`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
};
