-- Row Level Security (RLS) policies for data protection

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE plantings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Farms policies
CREATE POLICY "Users can manage own farms" ON farms FOR ALL USING (auth.uid() = user_id);

-- Fields policies
CREATE POLICY "Users can manage own fields" ON fields FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM farms WHERE farms.id = fields.farm_id)
);

-- Plantings policies
CREATE POLICY "Users can manage own plantings" ON plantings FOR ALL USING (
    auth.uid() IN (
        SELECT f.user_id FROM farms f 
        JOIN fields fi ON f.id = fi.farm_id 
        WHERE fi.id = plantings.field_id
    )
);

-- Products policies
CREATE POLICY "Users can manage own products" ON products FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view available products" ON products FOR SELECT USING (status = 'available');

-- Orders policies
CREATE POLICY "Users can view own orders as buyer" ON orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Users can view own orders as seller" ON orders FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Users can create orders as buyer" ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Sellers can update order status" ON orders FOR UPDATE USING (auth.uid() = seller_id);

-- Order items policies
CREATE POLICY "Users can view order items for their orders" ON order_items FOR SELECT USING (
    auth.uid() IN (
        SELECT buyer_id FROM orders WHERE orders.id = order_items.order_id
        UNION
        SELECT seller_id FROM orders WHERE orders.id = order_items.order_id
    )
);

-- AI recommendations policies
CREATE POLICY "Users can manage own recommendations" ON ai_recommendations FOR ALL USING (auth.uid() = user_id);

-- Weather data policies
CREATE POLICY "Users can view weather for own farms" ON weather_data FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM farms WHERE farms.id = weather_data.farm_id)
);

-- Notifications policies
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Activity logs policies
CREATE POLICY "Users can manage own activity logs" ON activity_logs FOR ALL USING (auth.uid() = user_id);

-- Crop types are public (read-only for users)
ALTER TABLE crop_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view crop types" ON crop_types FOR SELECT TO authenticated USING (true);
