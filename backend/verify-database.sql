-- ========================================
-- Verify Database Setup
-- ========================================
-- Run this script in pgAdmin after starting the backend
-- to verify everything is working correctly

-- Check database exists
SELECT current_database() as connected_to;

-- List all tables
SELECT 
    table_name,
    table_type
FROM 
    information_schema.tables
WHERE 
    table_schema = 'public'
ORDER BY 
    table_name;

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'subscription_plans', COUNT(*) FROM subscription_plans
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM subscriptions
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'contact_messages', COUNT(*) FROM contact_messages;

-- View subscription plans
SELECT 
    plan_code,
    name,
    monthly_price,
    active,
    popular
FROM 
    subscription_plans
ORDER BY 
    monthly_price;

-- View database size
SELECT 
    pg_size_pretty(pg_database_size('floro_db')) as database_size;

-- Success message
SELECT '✅ Database verification complete!' as status;

