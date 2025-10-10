@echo off
echo Testing Supabase Connection...
echo.
echo 1. Testing DNS Resolution...
nslookup db.xulzddxaldzhabymaupe.supabase.co
echo.
echo 2. Testing Ping...
ping -n 2 db.xulzddxaldzhabymaupe.supabase.co
echo.
echo 3. Testing Port 5432...
echo This may take a moment...
powershell -Command "Test-NetConnection -ComputerName db.xulzddxaldzhabymaupe.supabase.co -Port 5432"
echo.
echo If all tests passed, the network is fine.
echo If tests failed, there's a network/firewall issue.
pause

