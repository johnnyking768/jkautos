CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  phone TEXT,
  city TEXT,
  country TEXT DEFAULT 'Nigeria',
  profile_image TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  discounted_price NUMERIC,
  condition TEXT CHECK (condition IN ('new', 'used', 'certified')),
  body_type TEXT CHECK (body_type IN ('sedan', 'suv', 'coupe', 'convertible', 'hatchback', 'truck', 'van', 'wagon', 'sports', 'luxury')),
  transmission TEXT CHECK (transmission IN ('automatic', 'manual', 'semi-automatic', 'cvt')),
  fuel_type TEXT CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid', 'plug-in-hybrid')),
  engine_size TEXT,
  horsepower INTEGER,
  torque TEXT,
  drivetrain TEXT CHECK (drivetrain IN ('fwd', 'rwd', 'awd', '4wd')),
  mileage INTEGER DEFAULT 0,
  color TEXT,
  interior_color TEXT,
  doors INTEGER DEFAULT 4,
  seats INTEGER DEFAULT 5,
  vin TEXT UNIQUE,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved', 'pending')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_negotiable BOOLEAN DEFAULT TRUE,
  installment_available BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  location TEXT DEFAULT 'Lagos, Nigeria',
  added_by UUID REFERENCES users(id),
  sold_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS car_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, car_id)
);

CREATE TABLE IF NOT EXISTS recently_viewed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, car_id)
);

CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  inspection_date DATE NOT NULL,
  inspection_time TEXT NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  note TEXT,
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id),
  subject TEXT,
  content TEXT NOT NULL,
  reply TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  is_replied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  replied_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS installment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  down_payment_percent NUMERIC NOT NULL,
  duration_months INTEGER NOT NULL,
  interest_rate NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES installment_plans(id),
  car_price NUMERIC NOT NULL,
  down_payment NUMERIC NOT NULL,
  monthly_payment NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  amount_paid NUMERIC DEFAULT 0,
  months_remaining INTEGER NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'defaulted', 'cancelled')),
  next_payment_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compare_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, car_id)
);

CREATE TABLE IF NOT EXISTS test_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  drive_date DATE NOT NULL,
  drive_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE installment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE compare_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_drives ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'users','cars','car_images','saved_cars','recently_viewed','inspections','messages',
    'installment_plans','user_installments','reviews','notifications','newsletter','compare_list','test_drives'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Service role full access" ON %I', table_name);
    EXECUTE format('CREATE POLICY "Service role full access" ON %I FOR ALL USING (true) WITH CHECK (true)', table_name);
  END LOOP;
END $$;
