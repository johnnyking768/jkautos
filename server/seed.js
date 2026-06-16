require("dotenv").config();

const { supabase, isConfigured } = require("./config/supabase");
const data = require("./data/sampleData");

const order = [
  "users",
  "installment_plans",
  "cars",
  "saved_cars",
  "recently_viewed",
  "inspections",
  "test_drives",
  "messages",
  "reviews",
  "notifications",
  "newsletter",
  "compare_list",
  "user_installments",
];

async function upsert(table, rows) {
  if (!rows.length) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`Seeded ${rows.length} rows into ${table}`);
}

async function run() {
  if (!isConfigured) {
    console.log("Supabase env vars are placeholders. The API will use in-memory sample data locally.");
    console.log("Default admin: admin@jkautos.com / Admin@12345");
    console.log("Default users: user1@jkautos.com, user2@jkautos.com, user3@jkautos.com / User@12345");
    return;
  }

  for (const table of order) {
    await upsert(table, data[table] || []);
  }

  console.log("JK Autos Supabase seed complete.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
