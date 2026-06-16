const asyncHandler = require("express-async-handler");
const { all, insert, remove, update, findById } = require("../utils/db");

const toggleSavedCar = asyncHandler(async (req, res) => {
  const car = await findById("cars", req.params.carId);
  if (!car) {
    res.status(404);
    throw new Error("Car not found");
  }

  const saved = (await all("saved_cars")).find(
    (entry) => entry.user_id === req.user.id && entry.car_id === req.params.carId
  );

  if (saved) {
    await remove("saved_cars", saved.id);
    await update("cars", car.id, { saves: Math.max(Number(car.saves || 1) - 1, 0) });
    return res.json({ saved: false, message: "Car removed from saved list" });
  }

  const row = await insert("saved_cars", { user_id: req.user.id, car_id: req.params.carId });
  await update("cars", car.id, { saves: Number(car.saves || 0) + 1 });

  if (car.discounted_price) {
    await insert("notifications", {
      user_id: req.user.id,
      title: "Price drop active",
      message: `${car.title} already has a discounted price on JK Autos.`,
      type: "success",
      link: `/cars/${car.slug}`,
      is_read: false,
    });
  }

  res.status(201).json({ saved: true, savedCar: row });
});

const getSavedCars = asyncHandler(async (req, res) => {
  const cars = await all("cars");
  const saved = (await all("saved_cars")).filter((entry) => entry.user_id === req.user.id);
  res.json({ cars: saved.map((entry) => cars.find((car) => car.id === entry.car_id)).filter(Boolean) });
});

module.exports = { toggleSavedCar, getSavedCars };
