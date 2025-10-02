-- Seed data for crop types

INSERT INTO crop_types (name, category, growing_season, days_to_maturity, water_requirements, soil_requirements) VALUES
-- Cereals
('Blé tendre', 'cereals', 'fall', 240, 'medium', '{"ph_min": 6.0, "ph_max": 7.5, "drainage": "good"}'),
('Blé dur', 'cereals', 'fall', 250, 'medium', '{"ph_min": 6.5, "ph_max": 8.0, "drainage": "good"}'),
('Orge', 'cereals', 'fall', 200, 'medium', '{"ph_min": 6.0, "ph_max": 7.5, "drainage": "good"}'),
('Avoine', 'cereals', 'spring', 120, 'medium', '{"ph_min": 5.5, "ph_max": 7.0, "drainage": "moderate"}'),
('Maïs', 'cereals', 'spring', 140, 'high', '{"ph_min": 6.0, "ph_max": 7.0, "drainage": "good"}'),
('Riz', 'cereals', 'spring', 150, 'high', '{"ph_min": 5.5, "ph_max": 7.0, "drainage": "poor"}'),

-- Vegetables
('Tomate', 'vegetables', 'spring', 80, 'high', '{"ph_min": 6.0, "ph_max": 7.0, "drainage": "good"}'),
('Carotte', 'vegetables', 'spring', 70, 'medium', '{"ph_min": 6.0, "ph_max": 7.0, "drainage": "excellent"}'),
('Pomme de terre', 'vegetables', 'spring', 90, 'medium', '{"ph_min": 5.0, "ph_max": 6.5, "drainage": "good"}'),
('Oignon', 'vegetables', 'spring', 120, 'low', '{"ph_min": 6.0, "ph_max": 7.0, "drainage": "excellent"}'),
('Laitue', 'vegetables', 'spring', 45, 'medium', '{"ph_min": 6.0, "ph_max": 7.0, "drainage": "good"}'),
('Épinard', 'vegetables', 'fall', 50, 'medium', '{"ph_min": 6.0, "ph_max": 7.5, "drainage": "good"}'),
('Radis', 'vegetables', 'spring', 30, 'medium', '{"ph_min": 6.0, "ph_max": 7.0, "drainage": "good"}'),
('Courgette', 'vegetables', 'spring', 60, 'high', '{"ph_min": 6.0, "ph_max": 7.5, "drainage": "good"}'),

-- Fruits
('Pomme', 'fruits', 'year-round', 1460, 'medium', '{"ph_min": 6.0, "ph_max": 7.0, "drainage": "good"}'),
('Poire', 'fruits', 'year-round', 1460, 'medium', '{"ph_min": 6.0, "ph_max": 7.5, "drainage": "good"}'),
('Cerise', 'fruits', 'year-round', 1095, 'medium', '{"ph_min": 6.0, "ph_max": 7.5, "drainage": "excellent"}'),
('Fraise', 'fruits', 'spring', 90, 'high', '{"ph_min": 5.5, "ph_max": 6.5, "drainage": "good"}'),
('Raisin', 'fruits', 'year-round', 1095, 'low', '{"ph_min": 6.0, "ph_max": 8.0, "drainage": "excellent"}'),

-- Legumes
('Haricot vert', 'legumes', 'spring', 60, 'medium', '{"ph_min": 6.0, "ph_max": 7.0, "drainage": "good"}'),
('Petit pois', 'legumes', 'spring', 70, 'medium', '{"ph_min": 6.0, "ph_max": 7.5, "drainage": "good"}'),
('Lentille', 'legumes', 'spring', 100, 'low', '{"ph_min": 6.0, "ph_max": 7.5, "drainage": "good"}'),
('Pois chiche', 'legumes', 'spring', 120, 'low', '{"ph_min": 6.0, "ph_max": 8.0, "drainage": "excellent"}'),
('Soja', 'legumes', 'spring', 120, 'medium', '{"ph_min": 6.0, "ph_max": 7.0, "drainage": "good"}')

ON CONFLICT (name) DO NOTHING;
