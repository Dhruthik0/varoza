const API = `${import.meta.env.VITE_API_URL}/api/orders`;

export const createOrder = async (data, token) => {
  const res = await fetch(`${API}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
};
