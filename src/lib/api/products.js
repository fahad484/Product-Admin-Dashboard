import api from '../axios';

export async function getProducts({ limit, skip, sortBy, order, signal } = {}) {
  const response = await api.get('/products', {
    params: { limit, skip, sortBy, order },
    signal,
  });
  return response.data;
}

export async function searchProducts({ q, limit, skip, signal } = {}) {
  const response = await api.get('/products/search', {
    params: { q, limit, skip },
    signal,
  });
  return response.data;
}

export async function getProductsByCategory({ category, limit, skip, sortBy, order, signal } = {}) {
  const response = await api.get(`/products/category/${category}`, {
    params: { limit, skip, sortBy, order },
    signal,
  });
  return response.data;
}

export async function getProduct(id) {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export async function addProduct(data) {
  const response = await api.post('/products/add', data);
  return response.data;
}

export async function updateProduct(id, data) {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}
