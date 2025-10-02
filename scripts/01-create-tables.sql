-- Agricultural Management System Database Schema
-- This script creates all the necessary tables for the agricultural app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'France',
    farm_name TEXT,
    farm_type TEXT, -- 'organic', 'conventional', 'mixed'
    experience_years INTEGER,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Farms/Fields table
CREATE TABLE IF NOT EXISTS farms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    total_area DECIMAL(10, 2), -- in hectares
    soil_type TEXT, -- 'clay', 'sandy', 'loamy', 'silty'
    irrigation_type TEXT, -- 'drip', 'sprinkler', 'flood', 'none'
    organic_certified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fields within farms
CREATE TABLE IF NOT EXISTS fields (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    area DECIMAL(10, 2), -- in hectares
    soil_ph DECIMAL(3, 1),
    soil_nutrients JSONB, -- store N, P, K levels
    last_soil_test DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crops catalog
CREATE TABLE IF NOT EXISTS crop_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT, -- 'cereals', 'vegetables', 'fruits', 'legumes'
    growing_season TEXT, -- 'spring', 'summer', 'fall', 'winter', 'year-round'
    days_to_maturity INTEGER,
    water_requirements TEXT, -- 'low', 'medium', 'high'
    soil_requirements JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plantings/Crops currently growing
CREATE TABLE IF NOT EXISTS plantings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
    crop_type_id UUID REFERENCES crop_types(id),
    variety TEXT,
    planting_date DATE NOT NULL,
    expected_harvest_date DATE,
    actual_harvest_date DATE,
    planted_area DECIMAL(10, 2), -- in hectares
    expected_yield DECIMAL(10, 2), -- in tons
    actual_yield DECIMAL(10, 2), -- in tons
    status TEXT DEFAULT 'planted', -- 'planted', 'growing', 'harvested', 'failed'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products for marketplace
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    planting_id UUID REFERENCES plantings(id),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price_per_unit DECIMAL(10, 2),
    unit TEXT, -- 'kg', 'ton', 'piece', 'box'
    quantity_available DECIMAL(10, 2),
    harvest_date DATE,
    expiry_date DATE,
    organic_certified BOOLEAN DEFAULT FALSE,
    images TEXT[], -- array of image URLs
    status TEXT DEFAULT 'available', -- 'available', 'sold_out', 'expired'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders for e-commerce
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    buyer_id UUID REFERENCES profiles(id),
    seller_id UUID REFERENCES profiles(id),
    total_amount DECIMAL(10, 2),
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
    shipping_address TEXT,
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    payment_intent_id TEXT, -- Stripe payment intent ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity DECIMAL(10, 2),
    unit_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Recommendations and advice
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    field_id UUID REFERENCES fields(id),
    planting_id UUID REFERENCES plantings(id),
    type TEXT, -- 'irrigation', 'fertilization', 'pest_control', 'harvest_timing'
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    status TEXT DEFAULT 'active', -- 'active', 'completed', 'dismissed'
    weather_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Weather data
CREATE TABLE IF NOT EXISTS weather_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    temperature_min DECIMAL(5, 2),
    temperature_max DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    rainfall DECIMAL(6, 2), -- in mm
    wind_speed DECIMAL(5, 2),
    uv_index DECIMAL(3, 1),
    conditions TEXT, -- 'sunny', 'cloudy', 'rainy', 'stormy'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(farm_id, date)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT, -- 'weather_alert', 'harvest_reminder', 'order_update', 'ai_recommendation'
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    field_id UUID REFERENCES fields(id),
    planting_id UUID REFERENCES plantings(id),
    activity_type TEXT NOT NULL, -- 'planting', 'watering', 'fertilizing', 'harvesting', 'pest_treatment'
    description TEXT,
    quantity DECIMAL(10, 2),
    unit TEXT,
    cost DECIMAL(10, 2),
    notes TEXT,
    activity_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
