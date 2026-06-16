const asyncHandler = require("express-async-handler");
const { randomUUID } = require("crypto");
const { all, insert, update, remove, findById } = require("../utils/db");

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const truthy = (value) => value === true || value === "true";

const queryNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const applyFilters = (cars, query, includeAll = false) => {
  let result = includeAll ? [...cars] : cars.filter((car) => car.status === "available");
  const exactFields = ["brand", "body_type", "condition", "fuel_type", "transmission", "drivetrain", "color", "seats"];

  exactFields.forEach((field) => {
    if (query[field]) {
      const requested = String(query[field]).toLowerCase().split(",");
      result = result.filter((car) => requested.includes(String(car[field]).toLowerCase()));
    }
  });

  if (query.is_featured) result = result.filter((car) => Boolean(car.is_featured) === truthy(query.is_featured));
  if (query.installment_available) {
    result = result.filter((car) => Boolean(car.installment_available) === truthy(query.installment_available));
  }

  [
    ["price", "min_price", "max_price"],
    ["year", "min_year", "max_year"],
    ["mileage", "min_mileage", "max_mileage"],
  ].forEach(([field, minKey, maxKey]) => {
    const min = queryNumber(query[minKey]);
    const max = queryNumber(query[maxKey]);
    if (min !== null) result = result.filter((car) => Number(car[field]) >= min);
    if (max !== null) result = result.filter((car) => Number(car[field]) <= max);
  });

  if (query.search) {
    const term = String(query.search).toLowerCase();
    result = result.filter((car) =>
      [car.title, car.brand, car.model, car.description, car.body_type].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }

  const sorters = {
    oldest: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    price_asc: (a, b) => Number(a.discounted_price || a.price) - Number(b.discounted_price || b.price),
    price_desc: (a, b) => Number(b.discounted_price || b.price) - Number(a.discounted_price || a.price),
    mileage_asc: (a, b) => Number(a.mileage) - Number(b.mileage),
    popular: (a, b) => Number(b.views) - Number(a.views),
    newest: (a, b) => new Date(b.created_at) - new Date(a.created_at),
  };

  result.sort(sorters[query.sort] || sorters.newest);
  return result;
};

const paginate = (items, query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 100);
  const start = (page - 1) * limit;
  return {
    page,
    limit,
    total: items.length,
    totalPages: Math.max(Math.ceil(items.length / limit), 1),
    items: items.slice(start, start + limit),
  };
};

const getCars = asyncHandler(async (req, res) => {
  const filtered = applyFilters(await all("cars"), req.query, req.user?.role === "admin");
  const page = paginate(filtered, req.query);
  res.json({ cars: page.items, total: page.total, page: page.page, totalPages: page.totalPages });
});

const getFeaturedCars = asyncHandler(async (_req, res) => {
  const cars = (await all("cars"))
    .filter((car) => car.status === "available" && car.is_featured)
    .sort((a, b) => Number(b.views) - Number(a.views))
    .slice(0, 8);
  res.json({ cars });
});

const getBrands = asyncHandler(async (_req, res) => {
  const counts = (await all("cars")).reduce((acc, car) => {
    if (car.status === "available") acc[car.brand] = (acc[car.brand] || 0) + 1;
    return acc;
  }, {});

  const brands = Object.entries(counts)
    .map(([brand, count]) => ({ brand, count }))
    .sort((a, b) => a.brand.localeCompare(b.brand));

  res.json({ brands });
});

const getCarBySlug = asyncHandler(async (req, res) => {
  const cars = await all("cars");
  const car = cars.find((entry) => entry.slug === req.params.slug || entry.id === req.params.slug);

  if (!car) {
    res.status(404);
    throw new Error("Car not found");
  }

  const updated = await update("cars", car.id, { views: Number(car.views || 0) + 1 });
  const reviews = (await all("reviews"))
    .filter((review) => review.car_id === car.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  const users = await all("users");
  const decoratedReviews = reviews.map((review) => ({
    ...review,
    user: users.find((user) => user.id === review.user_id)?.name || "JK Autos customer",
  }));

  const similar = cars
    .filter((entry) => entry.id !== car.id && entry.status === "available")
    .filter((entry) => entry.brand === car.brand || entry.body_type === car.body_type)
    .slice(0, 4);

  const is_saved = req.user
    ? (await all("saved_cars")).some((entry) => entry.user_id === req.user.id && entry.car_id === car.id)
    : false;

  res.json({ car: updated || car, reviews: decoratedReviews, similar, is_saved });
});

const createCar = asyncHandler(async (req, res) => {
  const title = req.body.title || `${req.body.year} ${req.body.brand} ${req.body.model}`;
  const slug = req.body.slug || `${slugify(title)}-${randomUUID().slice(0, 8)}`;
  const car = await insert("cars", {
    ...req.body,
    title,
    slug,
    added_by: req.user.id,
    views: 0,
    saves: 0,
    status: req.body.status || "available",
    images: req.body.images || [],
  });
  res.status(201).json({ car });
});

const updateCar = asyncHandler(async (req, res) => {
  const car = await update("cars", req.params.id, req.body);
  if (!car) {
    res.status(404);
    throw new Error("Car not found");
  }
  res.json({ car });
});

const deleteCar = asyncHandler(async (req, res) => {
  await remove("cars", req.params.id);
  res.json({ message: "Car deleted" });
});

const updateStatus = asyncHandler(async (req, res) => {
  const patch = { status: req.body.status };
  if (req.body.status === "sold") patch.sold_at = new Date().toISOString();
  const car = await update("cars", req.params.id, patch);

  if (!car) {
    res.status(404);
    throw new Error("Car not found");
  }

  const saved = (await all("saved_cars")).filter((entry) => entry.car_id === car.id);
  await Promise.all(
    saved.map((entry) =>
      insert("notifications", {
        user_id: entry.user_id,
        title: "Saved car status changed",
        message: `${car.title} is now ${car.status}.`,
        type: car.status === "sold" ? "warning" : "info",
        link: `/cars/${car.slug}`,
        is_read: false,
      })
    )
  );

  res.json({ car });
});

const getAdminCars = asyncHandler(async (req, res) => {
  const filtered = applyFilters(await all("cars"), req.query, true);
  const page = paginate(filtered, req.query);
  res.json({ cars: page.items, total: page.total, page: page.page, totalPages: page.totalPages });
});

const getCarById = async (id) => findById("cars", id);

module.exports = {
  getCars,
  getFeaturedCars,
  getBrands,
  getCarBySlug,
  createCar,
  updateCar,
  deleteCar,
  updateStatus,
  getAdminCars,
  getCarById,
};
