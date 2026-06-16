import api from "./api";

export const inspectionService = {
  create: (payload) => api.post("/inspections", payload).then((res) => res.data),
  mine: () => api.get("/inspections/my").then((res) => res.data),
  cancel: (id) => api.put(`/inspections/${id}/cancel`).then((res) => res.data),
  admin: (params = {}) => api.get("/inspections/admin", { params }).then((res) => res.data),
  setStatus: (id, payload) => api.put(`/inspections/${id}/status`, payload).then((res) => res.data),
};
