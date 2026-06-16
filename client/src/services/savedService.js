import api from "./api";

export const savedService = {
  toggle: (carId) => api.post(`/saved/${carId}`).then((res) => res.data),
  mine: () => api.get("/saved").then((res) => res.data),
};
