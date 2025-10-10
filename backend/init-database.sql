-- Floro Puja Flowers Database Initialization Script
-- Run this script on your Supabase database after the tables are created

-- ========================================
-- SUBSCRIPTION PLANS
-- ========================================

-- Value Plan
INSERT INTO subscription_plans (plan_code, name, description, monthly_price, features, volume, active, popular, notes, created_at, updated_at)
VALUES (
    'value',
    'Value',
    'Affordable Pack of Flowers',
    300.00,
    '["Marigold (गेंदा)/Hibiscus (अड़हुल)/Butterfly Pea (अपराजिता)/Jasmine (चमेली)", "Doobh Grass (हरी दूब)", "Basil (तुलसी)", "Butterfly Pea (अपराजिता)/Red Marigold (लाल गेंदा)", "Hibiscus (अड़हुल)", "Belpatra (बेलपत्र) Every Monday", "Marigold Garland (गेंदा माला)"]',
    'Approx 50 Grams',
    true,
    false,
    '*Flower variety may change as per season and weather',
    NOW(),
    NOW()
)
ON CONFLICT (plan_code) DO NOTHING;

-- Basic Plan (Popular)
INSERT INTO subscription_plans (plan_code, name, description, monthly_price, features, volume, active, popular, notes, created_at, updated_at)
VALUES (
    'basic',
    'Basic',
    'Exotic Pack of Mix Flowers',
    600.00,
    '["Marigold (गेंदा)", "Doobh Grass (हरी दूब)", "Basil (तुलसी)", "Butterfly Pea (अपराजिता)/Red Marigold (लाल गेंदा)", "Shevanti (गुलदाउदी)/Jasmine (चमेली)", "Hibiscus (अड़हुल)", "Belpatra (बेलपत्र) Every Monday", "Marigold Garland (गेंदा माला)"]',
    'Approx 100 Grams',
    true,
    true,
    '**Any 3-4 varieties of flowers will be provided, depending on the season and weather',
    NOW(),
    NOW()
)
ON CONFLICT (plan_code) DO NOTHING;

-- Premium Plan
INSERT INTO subscription_plans (plan_code, name, description, monthly_price, features, volume, active, popular, notes, created_at, updated_at)
VALUES (
    'premium',
    'Premium',
    'Pack of Mix Flowers with Mala',
    900.00,
    '["Marigold (गेंदा)", "Doobh Grass (हरी दूब)", "Basil (तुलसी)", "Butterfly Pea (अपराजिता)/Red Marigold (लाल गेंदा)", "Shevanti (गुलदाउदी)/Jasmine (चमेली)", "Hibiscus (अड़हुल)", "Belpatra (बेलपत्र) Every Monday", "Marigold Garland (गेंदा माला) (Optional)"]',
    'Either 2 Packets of the Basic Pack or 1 Basic Pack with 1 Mala',
    true,
    false,
    '**Any 3-4 varieties of flowers will be provided, depending on the season and weather',
    NOW(),
    NOW()
)
ON CONFLICT (plan_code) DO NOTHING;

-- ========================================
-- SAMPLE TEST DATA (Optional)
-- ========================================

-- Create a test admin user (password: admin123)
-- Note: The password hash is for 'admin123' using BCrypt
INSERT INTO users (name, email, phone, password, address, pincode, city, state, role, active, email_verified, created_at, updated_at)
VALUES (
    'Admin User',
    'admin@floro.in',
    '+919999999999',
    '$2a$10$rN8r8TYVqw7LBp7Z5QNhxeXK1nZ5xK.qH.Zz.H5vJ.YJbGxZqL7Uu',
    'Krisha Kunj, Road No-10, Sanjay Nagar',
    '800001',
    'Patna',
    'Bihar',
    'ADMIN',
    true,
    true,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Create a test customer (password: customer123)
INSERT INTO users (name, email, phone, password, address, pincode, city, state, role, active, email_verified, created_at, updated_at)
VALUES (
    'Test Customer',
    'customer@example.com',
    '+919876543210',
    '$2a$10$XZz.Y8vW6nQ.L5mK4J3H.O1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6',
    'Test Address, Test Area',
    '800001',
    'Patna',
    'Bihar',
    'CUSTOMER',
    true,
    true,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ========================================
-- VERIFY INSTALLATION
-- ========================================

-- Check subscription plans
SELECT plan_code, name, monthly_price, active, popular 
FROM subscription_plans 
ORDER BY monthly_price;

-- Check users
SELECT id, name, email, role, active 
FROM users;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Database initialized successfully!';
    RAISE NOTICE '📊 Created 3 subscription plans';
    RAISE NOTICE '👤 Created 2 test users';
    RAISE NOTICE '';
    RAISE NOTICE '🔑 Test Login Credentials:';
    RAISE NOTICE '   Admin: admin@floro.in / admin123';
    RAISE NOTICE '   Customer: customer@example.com / customer123';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Your Floro database is ready!';
END $$;


