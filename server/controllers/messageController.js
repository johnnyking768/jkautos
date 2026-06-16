const asyncHandler = require("express-async-handler");
const { all, insert, update } = require("../utils/db");

const decorateMessages = async (rows) => {
  const cars = await all("cars");
  const users = await all("users");
  return rows.map((row) => ({
    ...row,
    car: cars.find((car) => car.id === row.car_id) || null,
    user: users.find((user) => user.id === row.user_id) || null,
  }));
};

const createMessage = asyncHandler(async (req, res) => {
  const { car_id, subject, content, name, email } = req.body;
  if (!content) {
    res.status(400);
    throw new Error("Message content is required");
  }

  const message = await insert("messages", {
    user_id: req.user?.id || null,
    car_id: car_id || null,
    subject: subject || "JK Autos inquiry",
    content: req.user ? content : `${content}\n\nGuest: ${name || "Unknown"} <${email || "no email"}>`,
    reply: "",
    is_read: false,
    is_replied: false,
    replied_at: null,
  });

  res.status(201).json({ message });
});

const getMyMessages = asyncHandler(async (req, res) => {
  const rows = (await all("messages")).filter((row) => row.user_id === req.user.id);
  res.json({ messages: await decorateMessages(rows) });
});

const getAdminMessages = asyncHandler(async (req, res) => {
  let rows = await all("messages");
  if (req.query.is_replied !== undefined) rows = rows.filter((row) => String(row.is_replied) === String(req.query.is_replied));
  res.json({ messages: await decorateMessages(rows) });
});

const replyMessage = asyncHandler(async (req, res) => {
  const message = await update("messages", req.params.id, {
    reply: req.body.reply,
    is_replied: true,
    is_read: true,
    replied_at: new Date().toISOString(),
  });

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  if (message.user_id) {
    await insert("notifications", {
      user_id: message.user_id,
      title: "JK Autos replied",
      message: "Your inquiry has a new reply.",
      type: "success",
      link: "/dashboard/messages",
      is_read: false,
    });
  }

  res.json({ message });
});

module.exports = { createMessage, getMyMessages, getAdminMessages, replyMessage };
