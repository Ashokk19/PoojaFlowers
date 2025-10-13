-- Verify Database Setup
-- Run this in pgAdmin or psql to check if everything is set up correctly

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'subscription_plans', 'subscriptions', 'orders', 'contact_messages')
ORDER BY table_name;

-- Check subscription plans
SELECT plan_code, name, monthly_price, active, popular 
FROM subscription_plans 
ORDER BY monthly_price;

-- If no plans exist, run the init script
-- Or manually insert the plans:

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

-- Verify plans were inserted
SELECT plan_code, name, monthly_price, active, popular 
FROM subscription_plans 
ORDER BY monthly_price;