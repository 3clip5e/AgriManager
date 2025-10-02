-- Utility functions for the agricultural management system

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON farms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fields_updated_at BEFORE UPDATE ON fields FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plantings_updated_at BEFORE UPDATE ON plantings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate field utilization
CREATE OR REPLACE FUNCTION get_field_utilization(field_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_area DECIMAL;
    planted_area DECIMAL;
BEGIN
    SELECT area INTO total_area FROM fields WHERE id = field_uuid;
    
    SELECT COALESCE(SUM(planted_area), 0) INTO planted_area 
    FROM plantings 
    WHERE field_id = field_uuid AND status IN ('planted', 'growing');
    
    IF total_area > 0 THEN
        RETURN (planted_area / total_area) * 100;
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get harvest calendar for a user
CREATE OR REPLACE FUNCTION get_harvest_calendar(user_uuid UUID, start_date DATE, end_date DATE)
RETURNS TABLE (
    planting_id UUID,
    crop_name TEXT,
    field_name TEXT,
    expected_harvest_date DATE,
    planted_area DECIMAL,
    expected_yield DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        ct.name,
        f.name,
        p.expected_harvest_date,
        p.planted_area,
        p.expected_yield
    FROM plantings p
    JOIN fields fi ON p.field_id = fi.id
    JOIN farms fa ON fi.farm_id = fa.id
    JOIN crop_types ct ON p.crop_type_id = ct.id
    WHERE fa.user_id = user_uuid
    AND p.expected_harvest_date BETWEEN start_date AND end_date
    AND p.status IN ('planted', 'growing')
    ORDER BY p.expected_harvest_date;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate total farm revenue
CREATE OR REPLACE FUNCTION get_farm_revenue(user_uuid UUID, start_date DATE, end_date DATE)
RETURNS DECIMAL AS $$
DECLARE
    total_revenue DECIMAL := 0;
BEGIN
    SELECT COALESCE(SUM(total_amount), 0) INTO total_revenue
    FROM orders
    WHERE seller_id = user_uuid
    AND payment_status = 'paid'
    AND created_at::DATE BETWEEN start_date AND end_date;
    
    RETURN total_revenue;
END;
$$ LANGUAGE plpgsql;
