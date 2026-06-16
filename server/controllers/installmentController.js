const asyncHandler = require("express-async-handler");
const { all, insert, findById } = require("../utils/db");

const addMonthsIsoDate = (date, months) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next.toISOString().slice(0, 10);
};

const calculatePayment = (carPrice, plan, downPayment) => {
  const price = Number(carPrice);
  const down = Number(downPayment || price * (Number(plan.down_payment_percent) / 100));
  const financed = Math.max(price - down, 0);
  const interestTotal = financed * (Number(plan.interest_rate) / 100);
  const totalAmount = financed + interestTotal + down;
  const monthlyPayment = Math.ceil((financed + interestTotal) / Number(plan.duration_months));
  const schedule = Array.from({ length: Number(plan.duration_months) }, (_, index) => ({
    month: index + 1,
    due_date: addMonthsIsoDate(new Date(), index + 1),
    amount: monthlyPayment,
  }));

  return {
    down_payment: down,
    monthly_payment: monthlyPayment,
    total_amount: Math.ceil(totalAmount),
    interest_total: Math.ceil(interestTotal),
    schedule,
  };
};

const getPlans = asyncHandler(async (_req, res) => {
  const plans = (await all("installment_plans")).filter((plan) => plan.is_active !== false);
  res.json({ plans });
});

const calculate = asyncHandler(async (req, res) => {
  const plan = await findById("installment_plans", req.body.plan_id);
  if (!plan) {
    res.status(404);
    throw new Error("Installment plan not found");
  }
  res.json(calculatePayment(req.body.car_price, plan, req.body.down_payment));
});

const apply = asyncHandler(async (req, res) => {
  const car = await findById("cars", req.body.car_id);
  const plan = await findById("installment_plans", req.body.plan_id);
  if (!car || !plan) {
    res.status(404);
    throw new Error("Car or installment plan not found");
  }

  const payment = calculatePayment(car.discounted_price || car.price, plan, req.body.down_payment);
  const installment = await insert("user_installments", {
    user_id: req.user.id,
    car_id: car.id,
    plan_id: plan.id,
    car_price: car.discounted_price || car.price,
    down_payment: payment.down_payment,
    monthly_payment: payment.monthly_payment,
    total_amount: payment.total_amount,
    amount_paid: payment.down_payment,
    months_remaining: plan.duration_months,
    status: "active",
    next_payment_date: payment.schedule[0]?.due_date,
  });

  await insert("notifications", {
    user_id: car.added_by,
    title: "Installment application",
    message: `${req.user.name} applied for ${car.title}.`,
    type: "info",
    link: "/admin/settings",
    is_read: false,
  });

  res.status(201).json({ installment, schedule: payment.schedule });
});

const getMyInstallments = asyncHandler(async (req, res) => {
  const cars = await all("cars");
  const plans = await all("installment_plans");
  const installments = (await all("user_installments"))
    .filter((row) => row.user_id === req.user.id)
    .map((row) => ({
      ...row,
      car: cars.find((car) => car.id === row.car_id) || null,
      plan: plans.find((plan) => plan.id === row.plan_id) || null,
    }));
  res.json({ installments });
});

module.exports = { getPlans, calculate, apply, getMyInstallments, calculatePayment };
