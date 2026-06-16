const asyncHandler = require("express-async-handler");
const { all, insert, update, findById } = require("../utils/db");

const decorateBookings = async (rows) => {
  const cars = await all("cars");
  const users = await all("users");
  return rows.map((row) => ({
    ...row,
    car: cars.find((car) => car.id === row.car_id) || null,
    user: users.find((user) => user.id === row.user_id) || null,
  }));
};

const createInspection = asyncHandler(async (req, res) => {
  const { car_id, inspection_date, inspection_time, location, note } = req.body;
  if (!car_id || !inspection_date || !inspection_time) {
    res.status(400);
    throw new Error("Car, inspection date, and time are required");
  }

  const car = await findById("cars", car_id);
  if (!car) {
    res.status(404);
    throw new Error("Car not found");
  }

  const conflict = (await all("inspections")).find(
    (row) => row.inspection_date === inspection_date && row.inspection_time === inspection_time && row.status !== "cancelled"
  );
  if (conflict) {
    res.status(409);
    throw new Error("That inspection time slot is already booked");
  }

  const inspection = await insert("inspections", {
    user_id: req.user.id,
    car_id,
    inspection_date,
    inspection_time,
    location,
    note,
    status: "pending",
    admin_note: "",
  });

  await insert("notifications", {
    user_id: car.added_by,
    title: "New inspection booking",
    message: `${req.user.name} booked ${car.title}.`,
    type: "info",
    link: "/admin/inspections",
    is_read: false,
  });

  res.status(201).json({ inspection });
});

const getMyInspections = asyncHandler(async (req, res) => {
  const rows = (await all("inspections"))
    .filter((row) => row.user_id === req.user.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json({ inspections: await decorateBookings(rows) });
});

const cancelInspection = asyncHandler(async (req, res) => {
  const inspection = (await all("inspections")).find((row) => row.id === req.params.id && row.user_id === req.user.id);
  if (!inspection) {
    res.status(404);
    throw new Error("Inspection not found");
  }
  res.json({ inspection: await update("inspections", inspection.id, { status: "cancelled" }) });
});

const getAdminInspections = asyncHandler(async (req, res) => {
  let rows = await all("inspections");
  if (req.query.status) rows = rows.filter((row) => row.status === req.query.status);
  if (req.query.date) rows = rows.filter((row) => row.inspection_date === req.query.date);
  rows.sort((a, b) => new Date(`${a.inspection_date} ${a.inspection_time}`) - new Date(`${b.inspection_date} ${b.inspection_time}`));
  res.json({ inspections: await decorateBookings(rows) });
});

const updateInspectionStatus = asyncHandler(async (req, res) => {
  const inspection = await update("inspections", req.params.id, {
    status: req.body.status,
    admin_note: req.body.admin_note || "",
  });
  if (!inspection) {
    res.status(404);
    throw new Error("Inspection not found");
  }

  await insert("notifications", {
    user_id: inspection.user_id,
    title: "Inspection update",
    message: `Your inspection is now ${inspection.status}.`,
    type: inspection.status === "confirmed" ? "success" : "info",
    link: "/dashboard/inspections",
    is_read: false,
  });

  res.json({ inspection });
});

module.exports = {
  createInspection,
  getMyInspections,
  cancelInspection,
  getAdminInspections,
  updateInspectionStatus,
};
