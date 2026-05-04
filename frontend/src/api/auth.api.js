const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const loginRequest = async ({ email, password }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Error al iniciar sesión');
    return data;
};

export const registerRequest = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Error al registrarse');
  return json;
};

export const logoutRequest = async (refreshToken) => {
    await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    });
};