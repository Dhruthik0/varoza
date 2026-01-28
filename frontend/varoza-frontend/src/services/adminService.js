const API = "https://varoza-backend.onrender.com/api/admin";

// 🧑‍🎨 SELLERS
export const getPendingSellers = async (token) => {
  const res = await fetch(`${API}/pending-sellers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const approveSeller = async (sellerId, token) => {
  const res = await fetch(`${API}/approve-seller`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sellerId }),
  });
  return res.json();
};

// 🖼️ POSTERS
export const getPendingPosters = async (token) => {
  const res = await fetch(`${API}/pending-posters`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const approvePoster = async (posterId, token) => {
  const res = await fetch(`${API}/approve-poster`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ posterId }),
  });
  return res.json();
};
export const getPendingOrders = async (token) => {
  const res = await fetch(`${API}/pending-orders`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
};



export const approveOrderPayment = async (orderId, token) => {
  const res = await fetch(
    "https://varoza-backend.onrender.com/api/admin/approve-order",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ orderId })
    }
  );

  if (!res.ok) {
    throw new Error("Failed to approve order");
  }

  return res.json();
};
export const getAnalytics = async (token) => {
  const res = await fetch(
    "https://varoza-backend.onrender.com/api/admin/analytics",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
};
