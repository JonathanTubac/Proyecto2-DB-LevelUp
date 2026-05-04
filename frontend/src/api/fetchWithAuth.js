const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('accessToken');

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  // token expirado
  if (res.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');

    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshRes.ok) {
      localStorage.clear();
      window.location.href = '/login';
      return;
    }

    const { data } = await refreshRes.json();
    localStorage.setItem('accessToken',  data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    // reintenta con el nuevo token
    return fetchWithAuth(endpoint, options);
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Error en la petición');
  return data;
};