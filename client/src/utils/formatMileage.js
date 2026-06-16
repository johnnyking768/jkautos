export const formatMileage = (value = 0) =>
  `${new Intl.NumberFormat("en-NG").format(Number(value || 0))} km`;
