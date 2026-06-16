import api from "./api";

export const messageService = {
  create: (payload) => api.post("/messages", payload).then((res) => res.data),
  mine: () => api.get("/messages/my").then((res) => res.data),
  admin: (params = {}) => api.get("/messages/admin", { params }).then((res) => res.data),
  reply: (id, reply) => api.put(`/messages/${id}/reply`, { reply }).then((res) => res.data),
};
