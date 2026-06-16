const asyncHandler = require("express-async-handler");
const { all, insert, remove } = require("../utils/db");

const getCompareList = asyncHandler(async (req, res) => {
  const cars = await all("cars");
  const compare = (await all("compare_list"))
    .filter((row) => row.user_id === req.user.id)
    .map((row) => cars.find((car) => car.id === row.car_id))
    .filter(Boolean);
  res.json({ cars: compare });
});

const toggleCompare = asyncHandler(async (req, res) => {
  const rows = (await all("compare_list")).filter((row) => row.user_id === req.user.id);
  const existing = rows.find((row) => row.car_id === req.params.carId);

  if (existing) {
    await remove("compare_list", existing.id);
    return res.json({ added: false });
  }

  if (rows.length >= 3) {
    res.status(400);
    throw new Error("You can compare up to 3 cars");
  }

  await insert("compare_list", { user_id: req.user.id, car_id: req.params.carId });
  res.status(201).json({ added: true });
});

const clearCompare = asyncHandler(async (req, res) => {
  const rows = (await all("compare_list")).filter((row) => row.user_id === req.user.id);
  await Promise.all(rows.map((row) => remove("compare_list", row.id)));
  res.json({ message: "Compare list cleared" });
});

module.exports = { getCompareList, toggleCompare, clearCompare };
