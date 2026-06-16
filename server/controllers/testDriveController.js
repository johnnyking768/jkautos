const asyncHandler = require("express-async-handler");
const { all, insert, update, findById } = require("../utils/db");

const decorate = async (rows) => {
  const cars = await all("cars");
  const users = await all("users");
  return rows.map((row) => ({
    ...row,
    car: cars.find((car) => car.id === row.car_id) || null,
    user: users.find((user) => user.id === row.user_id) || null,
  }));
};

const createTestDrive = asyncHandler(async (req, res) => {
  const { car_id, drive_date, drive_time, note } = req.body;
  if (!car_id || !drive_date || !drive_time) {
    res.status(400);
    throw new Error("Car, drive date, and time are required");
  }

  const car = await findById("cars", car_id);
  if (!car) {
    res.status(404);
    throw new Error("Car not found");
  }

  const testDrive = await insert("test_drives", {
    user_id: req.user.id,
    car_id,
    drive_date,
    drive_time,
    note,
    status: "pending",
  });

  await insert("notifications", {
    user_id: car.added_by,
    title: "New test drive request",
    message: `${req.user.name} requested a test drive for ${car.title}.`,
    type: "info",
    link: "/admin/test-drives",
    is_read: false,
  });

  res.status(201).json({ testDrive });
});

const getMyTestDrives = asyncHandler(async (req, res) => {
  const rows = (await all("test_drives")).filter((row) => row.user_id === req.user.id);
  res.json({ testDrives: await decorate(rows) });
});

const getAdminTestDrives = asyncHandler(async (req, res) => {
  let rows = await all("test_drives");
  if (req.query.status) rows = rows.filter((row) => row.status === req.query.status);
  res.json({ testDrives: await decorate(rows) });
});

const updateTestDriveStatus = asyncHandler(async (req, res) => {
  const testDrive = await update("test_drives", req.params.id, { status: req.body.status });
  if (!testDrive) {
    res.status(404);
    throw new Error("Test drive not found");
  }
  res.json({ testDrive });
});

module.exports = { createTestDrive, getMyTestDrives, getAdminTestDrives, updateTestDriveStatus };
