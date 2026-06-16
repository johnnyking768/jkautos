import api from "./api";

export const viewedService = {
  add: (carId) => api.post(`/viewed/${carId}`).then((res) => res.data),
  mine: (limit = 10) => api.get("/viewed", { params: { limit } }).then((res) => res.data),
};
