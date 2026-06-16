import api from "./api";

export const installmentService = {
  plans: () => api.get("/installments/plans").then((res) => res.data),
  calculate: (payload) => api.post("/installments/calculate", payload).then((res) => res.data),
  apply: (payload) => api.post("/installments/apply", payload).then((res) => res.data),
  mine: () => api.get("/installments/my").then((res) => res.data),
};
