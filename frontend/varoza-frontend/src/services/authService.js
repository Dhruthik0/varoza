const API = `${import.meta.env.VITE_API_URL}/api/auth`;

const parseResponse = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || fallbackMessage);
  }
  return data;
};

const withNetworkGuard = async (requestFn) => {
  try {
    return await requestFn();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Cannot reach backend at ${import.meta.env.VITE_API_URL}. Make sure backend is running.`
      );
    }
    throw error;
  }
};

export const loginUser = async ({ email, password, role }) => {
  return withNetworkGuard(async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });

    return parseResponse(res, "Login failed");
  });
};

export const registerUser = async (data) => {
  return withNetworkGuard(async () => {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return parseResponse(res, "Registration failed");
  });
};

export const googleAuth = async ({ credential, role = "buyer" }) => {
  return withNetworkGuard(async () => {
    const res = await fetch(`${API}/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential, role }),
    });

    return parseResponse(res, "Google authentication failed");
  });
};
