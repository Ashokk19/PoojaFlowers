-- Check all users and their data
SELECT id, name, email, phone, address, city, state, pincode, created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;


