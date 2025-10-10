-- Initial data for subscription plans
-- This will be executed automatically by Spring Boot on startup

-- Insert subscription plans (if not exists)
INSERT INTO subscription_plans (plan_code, name, description, monthly_price, features, volume, active, popular, notes, created_at, updated_at)
SELECT 'value', 'Value', 'Affordable Pack of Flowers', 300.00,
       '["Marigold (गेंदा)/Hibiscus (अड़हुल)/Butterfly Pea (अपराजिता)/Jasmine (चमेली)", "Doobh Grass (हरी दूब)", "Basil (तुलसी)", "Butterfly Pea (अपराजिता)/Red Marigold (लाल गेंदा)", "Hibiscus (अड़हुल)", "Belpatra (बेलपत्र) Every Monday", "Marigold Garland (गेंदा माला)"]',
       'Approx 50 Grams', true, false, '*Flower variety may change as per season and weather', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE plan_code = 'value');

INSERT INTO subscription_plans (plan_code, name, description, monthly_price, features, volume, active, popular, notes, created_at, updated_at)
SELECT 'basic', 'Basic', 'Exotic Pack of Mix Flowers', 600.00,
       '["Marigold (गेंदा)", "Doobh Grass (हरी दूब)", "Basil (तुलसी)", "Butterfly Pea (अपराजिता)/Red Marigold (लाल गेंदा)", "Shevanti (गुलदाउदी)/Jasmine (चमेली)", "Hibiscus (अड़हुल)", "Belpatra (बेलपत्र) Every Monday", "Marigold Garland (गेंदा माला)"]',
       'Approx 100 Grams', true, true, '**Any 3-4 varieties of flowers will be provided, depending on the season and weather', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE plan_code = 'basic');

INSERT INTO subscription_plans (plan_code, name, description, monthly_price, features, volume, active, popular, notes, created_at, updated_at)
SELECT 'premium', 'Premium', 'Pack of Mix Flowers with Mala', 900.00,
       '["Marigold (गेंदा)", "Doobh Grass (हरी दूब)", "Basil (तुलसी)", "Butterfly Pea (अपराजिता)/Red Marigold (लाल गेंदा)", "Shevanti (गुलदाउदी)/Jasmine (चमेली)", "Hibiscus (अड़हुल)", "Belpatra (बेलपत्र) Every Monday", "Marigold Garland (गेंदा माला) (Optional)"]',
       'Either 2 Packets of the Basic Pack or 1 Basic Pack with 1 Mala', true, false, '**Any 3-4 varieties of flowers will be provided, depending on the season and weather', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE plan_code = 'premium');


