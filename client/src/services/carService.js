import api from "./api";

export const carService = {
  getCars: (params = {}) => api.get("/cars", { params }).then((res) => res.data),
  getFeatured: () => api.get("/cars/featured").then((res) => res.data),
  getBrands: () => api.get("/cars/brands").then((res) => res.data),
  getSingle: (slug) => api.get(`/cars/${slug}`).then((res) => res.data),
  create: (payload) => api.post("/cars", payload).then((res) => res.data),
  update: (id, payload) => api.put(`/cars/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/cars/${id}`).then((res) => res.data),
  updateStatus: (id, status) => api.patch(`/cars/${id}/status`, { status }).then((res) => res.data),
  adminAll: (params = {}) => api.get("/cars/admin/all", { params }).then((res) => res.data),
};
