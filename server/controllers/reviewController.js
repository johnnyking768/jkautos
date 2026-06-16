const asyncHandler = require("express-async-handler");
const { all, insert } = require("../utils/db");

const createReview = asyncHandler(async (req, res) => {
  const { car_id, rating, comment } = req.body;
  const existing = (await all("reviews")).find((row) => row.user_id === req.user.id && row.car_id === car_id);
  if (existing) {
    res.status(409);
    throw new Error("You have already reviewed this car");
  }

  const review = await insert("reviews", {
    user_id: req.user.id,
    car_id,
    rating: Math.min(Math.max(Number(rating), 1), 5),
    comment,
  });
  res.status(201).json({ review });
});

const getReviewsByCar = asyncHandler(async (req, res) => {
  const users = await all("users");
  const reviews = (await all("reviews"))
    .filter((row) => row.car_id === req.params.carId)
    .map((row) => ({ ...row, user: users.find((user) => user.id === row.user_id)?.name || "JK Autos customer" }));

  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length
    : 0;
  res.json({ reviews, average, count: reviews.length });
});

module.exports = { createReview, getReviewsByCar };
