const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001').replace(
  /\/$/,
  ''
);

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  let response;
  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    const err = new Error(
      'Could not reach the API. Check that the backend is running and VITE_API_BASE_URL is correct.'
    );
    err.status = 0;
    throw err;
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const message =
      data?.message ||
      (Array.isArray(data?.errors) && data.errors.length
        ? data.errors.join('; ')
        : `Request failed (${response.status})`);

    const err = new Error(message);
    err.status = response.status;
    err.errors = data?.errors || [];
    err.data = data;
    throw err;
  }

  return data;
}

export function formatApiError(err) {
  if (!err) return 'Something went wrong';
  if (Array.isArray(err.errors) && err.errors.length) {
    return `${err.message}: ${err.errors.join('; ')}`;
  }
  return err.message || 'Something went wrong';
}
