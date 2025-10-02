/*
  # Initial Schema for AgriManager

  1. New Tables
    - `users` - Authentication and user type information
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password` (text, hashed)
      - `name` (text)
      - `user_type` (text, 'farmer' or 'customer')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_profiles` - Extended user profile information
      - `id` (uuid, primary key, references users)
      - `email` (text, unique)
      - `full_name` (text)
      - `phone` (text)
      - `address` (text)
      - `user_type` (text, 'farmer' or 'customer')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `farms` - Farm information (for farmers only)
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `location` (text)
      - `total_area` (numeric)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `fields` - Field information within farms
      - `id` (uuid, primary key)
      - `farm_id` (uuid, foreign key to farms)
      - `name` (text)
      - `area` (numeric)
      - `soil_type` (text)
      - `soil_ph` (numeric)
      - `irrigation_type` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `crop_types` - Available crop types
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `growing_season` (text)
      - `days_to_harvest` (integer)
      - `created_at` (timestamp)

    - `plantings` - Planting records for fields
      - `id` (uuid, primary key)
      - `field_id` (uuid, foreign key to fields)
      - `crop_type_id` (uuid, foreign key to crop_types)
      - `planted_date` (date)
      - `expected_harvest_date` (date)
      - `actual_harvest_date` (date)
      - `quantity_planted` (numeric)
      - `quantity_harvested` (numeric)
      - `status` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `products` - Products for sale in marketplace
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `price` (numeric)
      - `unit` (text)
      - `quantity_available` (numeric)
      - `harvest_date` (date)
      - `expiry_date` (date)
      - `organic` (boolean)
      - `image_url` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `orders` - Order records
      - `id` (uuid, primary key)
      - `buyer_id` (uuid, foreign key to users)
      - `seller_id` (uuid, foreign key to users)
      - `product_id` (uuid, foreign key to products)
      - `quantity` (numeric)
      - `unit_price` (numeric)
      - `total_amount` (numeric)
      - `status` (text)
      - `delivery_address` (text)
      - `delivery_date` (date)
      - `payment_status` (text)
      - `payment_method` (text)
      - `stripe_payment_intent_id` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `ai_recommendations` - AI-generated recommendations
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `type` (text)
      - `title` (text)
      - `content` (text)
      - `priority` (text)
      - `field_id` (uuid)
      - `crop_type_id` (uuid)
      - `is_read` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to access their own data
    - Add policies for customers to view products and create orders
    - Add policies for farmers to manage their farms, fields, and products
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  user_type text NOT NULL DEFAULT 'customer' CHECK (user_type IN ('farmer', 'customer')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  address text,
  user_type text NOT NULL DEFAULT 'customer' CHECK (user_type IN ('farmer', 'customer')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Farms table
CREATE TABLE IF NOT EXISTS farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  location text,
  total_area numeric(10,2),
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fields table
CREATE TABLE IF NOT EXISTS fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  name text NOT NULL,
  area numeric(10,2) NOT NULL,
  soil_type text,
  soil_ph numeric(3,1),
  irrigation_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crop types table
CREATE TABLE IF NOT EXISTS crop_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  growing_season text,
  days_to_harvest integer,
  created_at timestamptz DEFAULT now()
);

-- Plantings table
CREATE TABLE IF NOT EXISTS plantings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id uuid NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  crop_type_id uuid NOT NULL REFERENCES crop_types(id),
  planted_date date NOT NULL,
  expected_harvest_date date,
  actual_harvest_date date,
  quantity_planted numeric(10,2),
  quantity_harvested numeric(10,2),
  status text DEFAULT 'planted' CHECK (status IN ('planted', 'growing', 'harvested', 'failed')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text,
  price numeric(10,2) NOT NULL,
  unit text NOT NULL,
  quantity_available numeric(10,2) NOT NULL DEFAULT 0,
  harvest_date date,
  expiry_date date,
  organic boolean DEFAULT false,
  image_url text,
  status text DEFAULT 'available' CHECK (status IN ('available', 'sold_out', 'expired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES users(id),
  seller_id uuid NOT NULL REFERENCES users(id),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity numeric(10,2) NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  delivery_address text,
  delivery_date date,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method text,
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- AI recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('irrigation', 'fertilization', 'pest_control', 'harvest', 'general')),
  title text NOT NULL,
  content text NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  field_id uuid REFERENCES fields(id) ON DELETE SET NULL,
  crop_type_id uuid REFERENCES crop_types(id) ON DELETE SET NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE plantings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (id = (current_setting('app.user_id', true))::uuid);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (id = (current_setting('app.user_id', true))::uuid)
  WITH CHECK (id = (current_setting('app.user_id', true))::uuid);

-- User profiles policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (id = (current_setting('app.user_id', true))::uuid);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (id = (current_setting('app.user_id', true))::uuid)
  WITH CHECK (id = (current_setting('app.user_id', true))::uuid);

-- Farms policies (only farmers)
CREATE POLICY "Farmers can view their own farms"
  ON farms FOR SELECT
  USING (user_id = (current_setting('app.user_id', true))::uuid);

CREATE POLICY "Farmers can insert their own farms"
  ON farms FOR INSERT
  WITH CHECK (user_id = (current_setting('app.user_id', true))::uuid);

CREATE POLICY "Farmers can update their own farms"
  ON farms FOR UPDATE
  USING (user_id = (current_setting('app.user_id', true))::uuid)
  WITH CHECK (user_id = (current_setting('app.user_id', true))::uuid);

CREATE POLICY "Farmers can delete their own farms"
  ON farms FOR DELETE
  USING (user_id = (current_setting('app.user_id', true))::uuid);

-- Fields policies (only farmers)
CREATE POLICY "Farmers can view their own fields"
  ON fields FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM farms WHERE farms.id = fields.farm_id
    AND farms.user_id = (current_setting('app.user_id', true))::uuid
  ));

CREATE POLICY "Farmers can insert fields in their farms"
  ON fields FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM farms WHERE farms.id = fields.farm_id
    AND farms.user_id = (current_setting('app.user_id', true))::uuid
  ));

CREATE POLICY "Farmers can update their own fields"
  ON fields FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM farms WHERE farms.id = fields.farm_id
    AND farms.user_id = (current_setting('app.user_id', true))::uuid
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM farms WHERE farms.id = fields.farm_id
    AND farms.user_id = (current_setting('app.user_id', true))::uuid
  ));

CREATE POLICY "Farmers can delete their own fields"
  ON fields FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM farms WHERE farms.id = fields.farm_id
    AND farms.user_id = (current_setting('app.user_id', true))::uuid
  ));

-- Crop types policies (all authenticated users can view)
CREATE POLICY "Everyone can view crop types"
  ON crop_types FOR SELECT
  USING (true);

-- Plantings policies (only farmers)
CREATE POLICY "Farmers can view their own plantings"
  ON plantings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM fields
    JOIN farms ON fields.farm_id = farms.id
    WHERE fields.id = plantings.field_id
    AND farms.user_id = (current_setting('app.user_id', true))::uuid
  ));

CREATE POLICY "Farmers can insert plantings in their fields"
  ON plantings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM fields
    JOIN farms ON fields.farm_id = farms.id
    WHERE fields.id = plantings.field_id
    AND farms.user_id = (current_setting('app.user_id', true))::uuid
  ));

CREATE POLICY "Farmers can update their own plantings"
  ON plantings FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM fields
    JOIN farms ON fields.farm_id = farms.id
    WHERE fields.id = plantings.field_id
    AND farms.user_id = (current_setting('app.user_id', true))::uuid
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM fields
    JOIN farms ON fields.farm_id = farms.id
    WHERE fields.id = plantings.field_id
    AND farms.user_id = (current_setting('app.user_id', true))::uuid
  ));

CREATE POLICY "Farmers can delete their own plantings"
  ON plantings FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM fields
    JOIN farms ON fields.farm_id = farms.id
    WHERE fields.id = plantings.field_id
    AND farms.user_id = (current_setting('app.user_id', true))::uuid
  ));

-- Products policies (all can view, only farmers can manage)
CREATE POLICY "Everyone can view available products"
  ON products FOR SELECT
  USING (status = 'available' AND quantity_available > 0);

CREATE POLICY "Farmers can insert their own products"
  ON products FOR INSERT
  WITH CHECK (user_id = (current_setting('app.user_id', true))::uuid);

CREATE POLICY "Farmers can update their own products"
  ON products FOR UPDATE
  USING (user_id = (current_setting('app.user_id', true))::uuid)
  WITH CHECK (user_id = (current_setting('app.user_id', true))::uuid);

CREATE POLICY "Farmers can delete their own products"
  ON products FOR DELETE
  USING (user_id = (current_setting('app.user_id', true))::uuid);

-- Orders policies
CREATE POLICY "Buyers can view their orders"
  ON orders FOR SELECT
  USING (buyer_id = (current_setting('app.user_id', true))::uuid);

CREATE POLICY "Sellers can view orders for their products"
  ON orders FOR SELECT
  USING (seller_id = (current_setting('app.user_id', true))::uuid);

CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  WITH CHECK (buyer_id = (current_setting('app.user_id', true))::uuid);

CREATE POLICY "Sellers can update their orders"
  ON orders FOR UPDATE
  USING (seller_id = (current_setting('app.user_id', true))::uuid)
  WITH CHECK (seller_id = (current_setting('app.user_id', true))::uuid);

-- AI recommendations policies (only farmers)
CREATE POLICY "Farmers can view their own recommendations"
  ON ai_recommendations FOR SELECT
  USING (user_id = (current_setting('app.user_id', true))::uuid);

CREATE POLICY "System can insert recommendations"
  ON ai_recommendations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Farmers can update their own recommendations"
  ON ai_recommendations FOR UPDATE
  USING (user_id = (current_setting('app.user_id', true))::uuid)
  WITH CHECK (user_id = (current_setting('app.user_id', true))::uuid);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id);
CREATE INDEX IF NOT EXISTS idx_fields_farm_id ON fields(farm_id);
CREATE INDEX IF NOT EXISTS idx_plantings_field_id ON plantings(field_id);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations(user_id);

-- Seed some crop types
INSERT INTO crop_types (name, category, growing_season, days_to_harvest) VALUES
  ('Tomatoes', 'vegetables', 'summer', 80),
  ('Corn', 'cereals', 'summer', 90),
  ('Wheat', 'cereals', 'winter', 120),
  ('Lettuce', 'vegetables', 'spring', 45),
  ('Carrots', 'vegetables', 'spring', 70),
  ('Potatoes', 'vegetables', 'summer', 100),
  ('Strawberries', 'fruits', 'spring', 60),
  ('Apples', 'fruits', 'fall', 180)
ON CONFLICT DO NOTHING;
