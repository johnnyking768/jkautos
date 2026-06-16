import api from "./api";

export const adminService = {
  stats: () => api.get("/admin/stats").then((res) => res.data),
  customers: () => api.get("/admin/customers").then((res) => res.data),
  toggleCustomer: (id) => api.put(`/admin/customers/${id}/toggle`).then((res) => res.data),
  sales: () => api.get("/admin/sales").then((res) => res.data),
  createPlan: (payload) => api.post("/admin/installments/plans", payload).then((res) => res.data),
  updatePlan: (id, payload) => api.put(`/admin/installments/plans/${id}`, payload).then((res) => res.data),
};
