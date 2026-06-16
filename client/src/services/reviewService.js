import api from "./api";

export const reviewService = {
  create: (payload) => api.post("/reviews", payload).then((res) => res.data),
  byCar: (carId) => api.get(`/reviews/car/${carId}`).then((res) => res.data),
};
