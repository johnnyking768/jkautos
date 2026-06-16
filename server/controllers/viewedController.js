const asyncHandler = require("express-async-handler");
const { all, insert, remove, update, findById } = require("../utils/db");

const addRecentlyViewed = asyncHandler(async (req, res) => {
  const car = await findById("cars", req.params.carId);
  if (!car) {
    res.status(404);
    throw new Error("Car not found");
  }

  const rows = await all("recently_viewed");
  const existing = rows.find((row) => row.user_id === req.user.id && row.car_id === req.params.carId);
  const viewed = existing
    ? await update("recently_viewed", existing.id, { viewed_at: new Date().toISOString() })
    : await insert("recently_viewed", {
        user_id: req.user.id,
        car_id: req.params.carId,
        viewed_at: new Date().toISOString(),
      });

  const mine = (await all("recently_viewed"))
    .filter((row) => row.user_id === req.user.id)
    .sort((a, b) => new Date(b.viewed_at) - new Date(a.viewed_at));

  await Promise.all(mine.slice(20).map((row) => remove("recently_viewed", row.id)));
  res.status(201).json({ viewed });
});

const getRecentlyViewed = asyncHandler(async (req, res) => {
  const cars = await all("cars");
  const viewed = (await all("recently_viewed"))
    .filter((row) => row.user_id === req.user.id)
    .sort((a, b) => new Date(b.viewed_at) - new Date(a.viewed_at))
    .slice(0, Number(req.query.limit) || 10)
    .map((row) => ({ ...row, car: cars.find((car) => car.id === row.car_id) }))
    .filter((row) => row.car);

  res.json({ viewed });
});

module.exports = { addRecentlyViewed, getRecentlyViewed };
