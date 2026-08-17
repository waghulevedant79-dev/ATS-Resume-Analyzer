const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function getErrorMessage(data, status) {
  // Keep known, user-safe validation messages where useful.
  if (status === 400) {
    if (
      typeof data === "object" &&
      data?.detail &&
      typeof data.detail === "string"
    ) {
      return data.detail;
    }

    return "We couldn't process that request. Please check your input and try again.";
  }

  if (status === 401) {
    return "Your session has expired. Please sign in again.";
  }

  if (status === 403) {
    return "You don't have permission to use this feature.";
  }

  if (status === 404) {
    return "We couldn't find the requested information. Please try again.";
  }

  if (status === 422) {
    return "Some of the information provided is invalid. Please check your input.";
  }

  if (status === 429) {
    return "The service is busy right now. Please wait a moment and try again.";
  }

  if (status >= 500) {
    return "Something went wrong while processing your request. Please try again in a moment.";
  }

  return "We couldn't complete your request. Please try again in a moment.";
}

export async function apiRequest(path, options = {}) {
  let response;

  try {
    const headers = {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    };

    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch {
    // Never expose backend/server/network details to the user.
    throw new Error(
      "Something went wrong while processing your request. Please try again in a moment.",
    );
  }

  const contentType = response.headers.get("content-type") || "";

  let data;

  try {
    data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(data, response.status));
  }

  return data;
}
