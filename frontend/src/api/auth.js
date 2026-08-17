const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function parseResponse(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail || "Authentication request failed."
    );
  }

  return data;
}

const fetchOptions = {
  credentials: "include",
};

export async function registerUser({
  name,
  email,
  password,
}) {
  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }
  );

  return parseResponse(response);
}

export async function loginUser({
  email,
  password,
}) {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  return parseResponse(response);
}

export async function googleLogin(credential) {
  const response = await fetch(
    `${API_BASE_URL}/auth/google`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        credential,
      }),
    }
  );

  return parseResponse(response);
}

export async function getCurrentUser() {
  const response = await fetch(
    `${API_BASE_URL}/auth/me`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return parseResponse(response);
}

export async function logoutUser() {
  const response = await fetch(
    `${API_BASE_URL}/auth/logout`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.detail || "Unable to sign out."
    );
  }
}