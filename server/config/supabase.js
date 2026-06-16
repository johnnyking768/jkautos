const { createClient } = require("@supabase/supabase-js");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isConfigured =
  Boolean(url) &&
  Boolean(key) &&
  !url.includes("your_supabase_url") &&
  !key.includes("your_service_role_key");

const supabase = isConfigured
  ? createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

module.exports = { supabase, isConfigured };
