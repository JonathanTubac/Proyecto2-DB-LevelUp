import { fetchWithAuth } from './fetchWithAuth';

export const getUsers = async ({ page = 1, limit = 10, rol } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (rol) params.append('rol', rol);

  return await fetchWithAuth(`/users?${params}`);
};

export const getUserById = async (id) => {
  return await fetchWithAuth(`/users/${id}`);
};

export const updateUser = async (id, data) => {
  return await fetchWithAuth(`/users/${id}`, {
    method: 'PUT',
    body:   JSON.stringify(data),
  });
};

export const deactivateUser = async (id) => {
  return await fetchWithAuth(`/users/${id}`, {
    method: 'DELETE',
  });
};  