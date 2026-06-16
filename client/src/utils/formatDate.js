import { format } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "Not scheduled";
  return format(new Date(date), "dd MMM yyyy");
};
