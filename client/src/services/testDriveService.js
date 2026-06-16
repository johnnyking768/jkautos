import api from "./api";

export const testDriveService = {
  create: (payload) => api.post("/test-drives", payload).then((res) => res.data),
  mine: () => api.get("/test-drives/my").then((res) => res.data),
  admin: (params = {}) => api.get("/test-drives/admin", { params }).then((res) => res.data),
  setStatus: (id, status) => api.put(`/test-drives/${id}/status`, { status }).then((res) => res.data),
};
