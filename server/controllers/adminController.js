const asyncHandler = require("express-async-handler");
const { all, insert, update } = require("../utils/db");

const groupCount = (rows, field) =>
  rows.reduce((acc, row) => {
    const key = row[field] || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

const toSeries = (counts, nameKey = "name") =>
  Object.entries(counts).map(([name, value]) => ({ [nameKey]: name, value, count: value }));

const getAdminStats = asyncHandler(async (_req, res) => {
  const [cars, users, inspections, messages] = await Promise.all([
    all("cars"),
    all("users"),
    all("inspections"),
    all("messages"),
  ]);

  const soldCars = cars.filter((car) => car.status === "sold");
  const monthLabels = Array.from({ length: 12 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - index));
    return date.toLocaleString("en", { month: "short" });
  });

  const monthlySales = monthLabels.map((month, index) => ({
    month,
    sold: soldCars.filter((_, soldIndex) => soldIndex % 12 === index).length,
    revenue: soldCars
      .filter((_, soldIndex) => soldIndex % 12 === index)
      .reduce((sum, car) => sum + Number(car.discounted_price || car.price), 0),
  }));

  res.json({
    stats: {
      totalCars: cars.length,
      available: cars.filter((car) => car.status === "available").length,
      sold: soldCars.length,
      reserved: cars.filter((car) => car.status === "reserved").length,
      pendingInspections: inspections.filter((row) => row.status === "pending").length,
      unreadInquiries: messages.filter((row) => !row.is_read).length,
      totalCustomers: users.filter((user) => user.role === "user").length,
      totalRevenue: soldCars.reduce((sum, car) => sum + Number(car.discounted_price || car.price), 0),
    },
    carsByBrand: toSeries(groupCount(cars, "brand"), "brand"),
    carsByBodyType: toSeries(groupCount(cars, "body_type"), "body_type"),
    monthlySales,
    recentInspections: inspections.slice(0, 5),
    recentInquiries: messages.slice(0, 5),
    recentCars: cars.slice(0, 4),
  });
});

const getCustomers = asyncHandler(async (_req, res) => {
  const [users, saved, inspections, messages] = await Promise.all([
    all("users"),
    all("saved_cars"),
    all("inspections"),
    all("messages"),
  ]);

  const customers = users
    .filter((user) => user.role === "user")
    .map((user) => ({
      ...user,
      password: undefined,
      saves: saved.filter((row) => row.user_id === user.id).length,
      inspections: inspections.filter((row) => row.user_id === user.id).length,
      messages: messages.filter((row) => row.user_id === user.id).length,
    }));

  res.json({ customers });
});

const toggleCustomer = asyncHandler(async (req, res) => {
  const users = await all("users");
  const user = users.find((entry) => entry.id === req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("Customer not found");
  }
  const updated = await update("users", user.id, { is_active: !user.is_active });
  const { password, ...safeUser } = updated;
  res.json({ user: safeUser });
});

const getSales = asyncHandler(async (_req, res) => {
  const soldCars = (await all("cars")).filter((car) => car.status === "sold");
  const revenueByBrand = soldCars.reduce((acc, car) => {
    acc[car.brand] = (acc[car.brand] || 0) + Number(car.discounted_price || car.price);
    return acc;
  }, {});

  res.json({
    sales: soldCars,
    totalRevenue: soldCars.reduce((sum, car) => sum + Number(car.discounted_price || car.price), 0),
    revenueByBrand: Object.entries(revenueByBrand).map(([brand, revenue]) => ({ brand, revenue })),
    monthlyRevenue: soldCars.map((car, index) => ({
      month: new Date(car.sold_at || car.updated_at).toLocaleString("en", { month: "short" }),
      revenue: Number(car.discounted_price || car.price),
      index,
    })),
  });
});

const createPlan = asyncHandler(async (req, res) => {
  const plan = await insert("installment_plans", { ...req.body, is_active: req.body.is_active ?? true });
  res.status(201).json({ plan });
});

const updatePlan = asyncHandler(async (req, res) => {
  const plan = await update("installment_plans", req.params.id, req.body);
  if (!plan) {
    res.status(404);
    throw new Error("Plan not found");
  }
  res.json({ plan });
});

module.exports = { getAdminStats, getCustomers, toggleCustomer, getSales, createPlan, updatePlan };
