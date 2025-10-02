-- Create indexes for better query performance

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_farm_type ON profiles(farm_type);

-- Farms indexes
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id);
CREATE INDEX IF NOT EXISTS idx_farms_location ON farms(latitude, longitude);

-- Fields indexes
CREATE INDEX IF NOT EXISTS idx_fields_farm_id ON fields(farm_id);

-- Plantings indexes
CREATE INDEX IF NOT EXISTS idx_plantings_field_id ON plantings(field_id);
CREATE INDEX IF NOT EXISTS idx_plantings_crop_type_id ON plantings(crop_type_id);
CREATE INDEX IF NOT EXISTS idx_plantings_status ON plantings(status);
CREATE INDEX IF NOT EXISTS idx_plantings_harvest_date ON plantings(expected_harvest_date);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- AI Recommendations indexes
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_status ON ai_recommendations(status);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_priority ON ai_recommendations(priority);

-- Weather data indexes
CREATE INDEX IF NOT EXISTS idx_weather_data_farm_date ON weather_data(farm_id, date DESC);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Activity logs indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_field_id ON activity_logs(field_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_activity_date ON activity_logs(activity_date DESC);
