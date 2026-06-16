require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { insert } = require("./utils/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = new Set([
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (_req, res) => {
  res.json({ name: "JK Autos API", status: "online" });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, name: "JK Autos API" });
});

app.post("/api/newsletter", async (req, res, next) => {
  try {
    if (!req.body.email) return res.status(400).json({ message: "Email is required" });
    const row = await insert("newsletter", { email: req.body.email.toLowerCase() });
    res.status(201).json({ subscriber: row });
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cars", require("./routes/carRoutes"));
app.use("/api/saved", require("./routes/savedRoutes"));
app.use("/api/viewed", require("./routes/viewedRoutes"));
app.use("/api/inspections", require("./routes/inspectionRoutes"));
app.use("/api/test-drives", require("./routes/testDriveRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/installments", require("./routes/installmentRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/compare", require("./routes/compareRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`JK Autos API running on http://localhost:${port}`);
});
