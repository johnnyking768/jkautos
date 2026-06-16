const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

const imageUrls = [
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&auto=format&fit=crop",
];

const userIds = Array.from({ length: 4 }, () => randomUUID());
const carIds = Array.from({ length: 20 }, () => randomUUID());
const planIds = Array.from({ length: 3 }, () => randomUUID());

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const commonFeatures = [
  "Air Conditioning",
  "Leather Seats",
  "Navigation System",
  "Bluetooth",
  "Backup Camera",
  "Parking Sensors",
  "Cruise Control",
  "Apple CarPlay/Android Auto",
  "Push Start",
  "Keyless Entry",
  "Premium Sound System",
  "Wireless Charging",
];

const users = [
  {
    id: userIds[0],
    name: "JK Autos Admin",
    email: "admin@jkautos.com",
    password: bcrypt.hashSync("Admin@12345", 10),
    role: "admin",
    phone: "+2348121638903",
    city: "Lagos",
    country: "Nigeria",
    is_active: true,
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: userIds[1],
    name: "Ada Okafor",
    email: "user1@jkautos.com",
    password: bcrypt.hashSync("User@12345", 10),
    role: "user",
    phone: "+2348010000001",
    city: "Lagos",
    country: "Nigeria",
    is_active: true,
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: userIds[2],
    name: "Tunde Bello",
    email: "user2@jkautos.com",
    password: bcrypt.hashSync("User@12345", 10),
    role: "user",
    phone: "+2348010000002",
    city: "Abuja",
    country: "Nigeria",
    is_active: true,
    is_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: userIds[3],
    name: "Chioma Briggs",
    email: "user3@jkautos.com",
    password: bcrypt.hashSync("User@12345", 10),
    role: "user",
    phone: "+2348010000003",
    city: "Port Harcourt",
    country: "Nigeria",
    is_active: true,
    is_verified: true,
    created_at: new Date().toISOString(),
  },
];

const carInputs = [
  ["2023 Mercedes-Benz GLE 450", "Mercedes-Benz", "GLE 450", 2023, 85000000, "suv", "new", "petrol", "automatic", "awd", true],
  ["2022 BMW 5 Series", "BMW", "5 Series", 2022, 65000000, "sedan", "used", "petrol", "automatic", "rwd", true],
  ["2023 Toyota Land Cruiser", "Toyota", "Land Cruiser", 2023, 120000000, "suv", "new", "petrol", "automatic", "4wd", true],
  ["2021 Lexus RX 350", "Lexus", "RX 350", 2021, 55000000, "suv", "used", "petrol", "automatic", "awd", false],
  ["2023 Range Rover Sport", "Range Rover", "Sport", 2023, 150000000, "suv", "new", "petrol", "automatic", "awd", true],
  ["2022 Honda Accord", "Honda", "Accord", 2022, 28000000, "sedan", "used", "petrol", "automatic", "fwd", false],
  ["2023 Ford Raptor", "Ford", "Raptor", 2023, 95000000, "truck", "new", "petrol", "automatic", "4wd", false],
  ["2021 Audi A6", "Audi", "A6", 2021, 72000000, "sedan", "used", "petrol", "automatic", "awd", false],
  ["2022 Chevrolet Tahoe", "Chevrolet", "Tahoe", 2022, 88000000, "suv", "used", "petrol", "automatic", "4wd", false],
  ["2023 Toyota Camry", "Toyota", "Camry", 2023, 32000000, "sedan", "new", "petrol", "automatic", "fwd", false, true],
  ["2020 Mercedes-Benz C300", "Mercedes-Benz", "C300", 2020, 45000000, "sedan", "used", "petrol", "automatic", "rwd", false],
  ["2023 Hyundai Tucson", "Hyundai", "Tucson", 2023, 25000000, "suv", "new", "petrol", "automatic", "fwd", false, true],
  ["2022 Porsche Cayenne", "Porsche", "Cayenne", 2022, 185000000, "suv", "used", "petrol", "automatic", "awd", true],
  ["2021 Kia Telluride", "Kia", "Telluride", 2021, 35000000, "suv", "used", "petrol", "automatic", "awd", false],
  ["2023 Volkswagen Tiguan", "Volkswagen", "Tiguan", 2023, 42000000, "suv", "new", "petrol", "automatic", "fwd", false],
  ["2022 Tesla Model 3", "Tesla", "Model 3", 2022, 58000000, "sedan", "used", "electric", "automatic", "awd", false],
  ["2023 BMW X5", "BMW", "X5", 2023, 95000000, "suv", "new", "petrol", "automatic", "awd", true],
  ["2021 Nissan Patrol", "Nissan", "Patrol", 2021, 68000000, "suv", "used", "petrol", "automatic", "4wd", false],
  ["2022 Lexus LX 600", "Lexus", "LX 600", 2022, 145000000, "suv", "used", "petrol", "automatic", "4wd", true],
  ["2023 Honda CR-V", "Honda", "CR-V", 2023, 29000000, "suv", "new", "petrol", "automatic", "fwd", false, true],
];

const cars = carInputs.map((item, index) => {
  const [title, brand, model, year, price, body_type, condition, fuel_type, transmission, drivetrain, is_featured, installment_available] = item;
  const rotatedImages = [0, 1, 2].map((offset) => imageUrls[(index + offset) % imageUrls.length]);

  return {
    id: carIds[index],
    title,
    slug: `${slugify(title)}-${index + 1}`,
    brand,
    model,
    year,
    price,
    discounted_price: index % 6 === 0 ? Math.round(price * 0.96) : null,
    condition,
    body_type,
    transmission,
    fuel_type,
    engine_size: fuel_type === "electric" ? "Dual motor" : index % 3 === 0 ? "3.0L V6" : "2.0L Turbo",
    horsepower: fuel_type === "electric" ? 450 : 240 + index * 14,
    torque: fuel_type === "electric" ? "471 lb-ft" : `${260 + index * 10} lb-ft`,
    drivetrain,
    mileage: condition === "new" ? 50 + index * 12 : 12000 + index * 2200,
    color: ["Black", "White", "Silver", "Graphite", "Red"][index % 5],
    interior_color: ["Black", "Tan", "Red", "Ivory"][index % 4],
    doors: body_type === "coupe" ? 2 : 4,
    seats: body_type === "truck" ? 5 : body_type === "suv" ? 7 : 5,
    vin: `JKAUTOS${String(index + 1).padStart(6, "0")}`,
    description: `${title} inspected by JK Autos with verified documents, premium cabin condition, sharp exterior finish, and a refined drive profile for Nigerian roads.`,
    features: commonFeatures.slice(0, 8 + (index % 5)),
    images: rotatedImages,
    video_url: index % 5 === 0 ? "https://www.youtube.com/embed/tgbNymZ7vqY" : "",
    status: index === 1 || index === 8 ? "sold" : "available",
    is_featured: Boolean(is_featured),
    is_negotiable: index % 4 !== 0,
    installment_available: Boolean(installment_available),
    views: 50 + index * 23,
    saves: 4 + index,
    location: index % 2 === 0 ? "Victoria Island, Lagos, Nigeria" : "Maitama, Abuja, Nigeria",
    added_by: userIds[0],
    sold_at: index === 1 || index === 8 ? new Date().toISOString() : null,
    created_at: new Date(Date.now() - index * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  };
});

const installment_plans = [
  {
    id: planIds[0],
    name: "Starter",
    description: "Higher down payment, faster finish.",
    down_payment_percent: 30,
    duration_months: 12,
    interest_rate: 5,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: planIds[1],
    name: "Standard",
    description: "Balanced monthly payment for premium cars.",
    down_payment_percent: 20,
    duration_months: 24,
    interest_rate: 8,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: planIds[2],
    name: "Premium",
    description: "Lowest down payment, longest spread.",
    down_payment_percent: 10,
    duration_months: 36,
    interest_rate: 12,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const saved_cars = [
  { id: randomUUID(), user_id: userIds[1], car_id: carIds[0], created_at: new Date().toISOString() },
  { id: randomUUID(), user_id: userIds[1], car_id: carIds[9], created_at: new Date().toISOString() },
  { id: randomUUID(), user_id: userIds[2], car_id: carIds[16], created_at: new Date().toISOString() },
];

const recently_viewed = [
  { id: randomUUID(), user_id: userIds[1], car_id: carIds[2], viewed_at: new Date().toISOString() },
  { id: randomUUID(), user_id: userIds[1], car_id: carIds[3], viewed_at: new Date(Date.now() - 3600000).toISOString() },
  { id: randomUUID(), user_id: userIds[2], car_id: carIds[4], viewed_at: new Date().toISOString() },
];

const inspections = [userIds[1], userIds[2], userIds[3]].flatMap((userId, index) => [
  {
    id: randomUUID(),
    user_id: userId,
    car_id: carIds[index],
    inspection_date: new Date(Date.now() + (index + 1) * 86400000).toISOString().slice(0, 10),
    inspection_time: "10:00",
    location: "JK Autos Lagos Studio",
    status: index === 0 ? "confirmed" : "pending",
    note: "I want a full inspection and financing advice.",
    admin_note: index === 0 ? "Inspection bay reserved." : "",
    created_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    user_id: userId,
    car_id: carIds[index + 5],
    inspection_date: new Date(Date.now() + (index + 4) * 86400000).toISOString().slice(0, 10),
    inspection_time: "14:00",
    location: "Customer preferred location",
    status: "pending",
    note: "Please bring service records.",
    admin_note: "",
    created_at: new Date().toISOString(),
  },
]);

const test_drives = inspections.slice(0, 3).map((inspection, index) => ({
  id: randomUUID(),
  user_id: inspection.user_id,
  car_id: carIds[index + 9],
  drive_date: new Date(Date.now() + (index + 2) * 86400000).toISOString().slice(0, 10),
  drive_time: "12:00",
  status: "pending",
  note: "Prefer a city route.",
  created_at: new Date().toISOString(),
}));

const messages = [
  {
    id: randomUUID(),
    user_id: userIds[1],
    car_id: carIds[0],
    subject: "GLE 450 availability",
    content: "Is the 2023 GLE 450 available for inspection this week?",
    reply: "Yes, it is available. We can host you tomorrow from 10 AM.",
    is_read: true,
    is_replied: true,
    created_at: new Date().toISOString(),
    replied_at: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    user_id: userIds[2],
    car_id: carIds[16],
    subject: "BMW X5 installment",
    content: "Can I use the Premium installment plan for the X5?",
    reply: "",
    is_read: false,
    is_replied: false,
    created_at: new Date().toISOString(),
    replied_at: null,
  },
  {
    id: randomUUID(),
    user_id: userIds[3],
    car_id: null,
    subject: "Trade-in request",
    content: "I want to trade in my 2018 Camry for a newer SUV.",
    reply: "",
    is_read: false,
    is_replied: false,
    created_at: new Date().toISOString(),
    replied_at: null,
  },
];

const reviews = carIds.slice(0, 5).map((carId, index) => ({
  id: randomUUID(),
  user_id: userIds[(index % 3) + 1],
  car_id: carId,
  rating: 5 - (index % 2),
  comment: "Professional inspection, transparent pricing, and a premium handover experience.",
  created_at: new Date(Date.now() - index * 7200000).toISOString(),
}));

const notifications = [];
const newsletter = [];
const compare_list = [];
const user_installments = [
  {
    id: randomUUID(),
    user_id: userIds[1],
    car_id: carIds[9],
    plan_id: planIds[1],
    car_price: cars[9].price,
    down_payment: Math.round(cars[9].price * 0.2),
    monthly_payment: 1216000,
    total_amount: Math.round(cars[9].price * 1.08),
    amount_paid: Math.round(cars[9].price * 0.28),
    months_remaining: 19,
    status: "active",
    next_payment_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
  },
];

module.exports = {
  users,
  cars,
  car_images: [],
  saved_cars,
  recently_viewed,
  inspections,
  test_drives,
  messages,
  installment_plans,
  user_installments,
  reviews,
  notifications,
  newsletter,
  compare_list,
};
