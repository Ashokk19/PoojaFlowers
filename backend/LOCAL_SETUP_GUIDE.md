# 🗄️ Local PostgreSQL Setup Guide

## Step 1: Install PostgreSQL

### Windows:
1. Download: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
2. Choose PostgreSQL 15 or 16 for Windows x86-64
3. Run the installer

### Installation Settings:
- **Port**: `5432` (default)
- **Password**: `postgres123` (or your choice - update application.properties)
- **Components**: 
  - ✅ PostgreSQL Server
  - ✅ pgAdmin 4 (database management tool)
  - ✅ Command Line Tools

## Step 2: Create Database

### Option A: Using pgAdmin (GUI - Easier)

1. **Open pgAdmin 4** (installed with PostgreSQL)
2. **Connect to PostgreSQL**:
   - Click on "Servers" in the left panel
   - Click on "PostgreSQL 15" (or your version)
   - Enter password: `postgres123`
3. **Create Database**:
   - Right-click on "Databases"
   - Select "Create" → "Database"
   - Name: `floro_db`
   - Owner: `postgres`
   - Click "Save"
4. **Verify**: You should see `floro_db` in the databases list

### Option B: Using Command Line (psql)

1. **Open Command Prompt or PowerShell**
2. **Navigate to PostgreSQL bin folder**:
   ```cmd
   cd "C:\Program Files\PostgreSQL\15\bin"
   ```
3. **Connect to PostgreSQL**:
   ```cmd
   psql -U postgres
   ```
   Enter password: `postgres123`

4. **Create Database**:
   ```sql
   CREATE DATABASE floro_db;
   ```

5. **Verify**:
   ```sql
   \l
   ```
   You should see `floro_db` in the list

6. **Exit**:
   ```sql
   \q
   ```

### Option C: Run SQL Script

1. Open pgAdmin
2. Select "PostgreSQL" server
3. Click Tools → Query Tool
4. Open file: `backend/create-local-database.sql`
5. Click Execute (▶️ button)

## Step 3: Update Configuration

**File**: `backend/src/main/resources/application.properties`

Already updated to:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/floro_db
spring.datasource.username=postgres
spring.datasource.password=postgres123
```

**⚠️ Important**: If you used a different password during PostgreSQL installation, update `spring.datasource.password` to match it!

## Step 4: Start the Backend

```bash
cd backend
mvn spring-boot:run
```

### Expected Output:
```
Started FloroApplication in X seconds
HikariPool-1 - Start completed.
Tomcat started on port 8080
```

**No more connection errors!** ✅

## Step 5: Verify Tables Were Created

### In pgAdmin:
1. Expand: Servers → PostgreSQL 15 → Databases → floro_db
2. Expand: Schemas → public → Tables
3. You should see:
   - `users`
   - `subscription_plans`
   - `subscriptions`
   - `orders`
   - `contact_messages`

### In Command Line:
```bash
psql -U postgres -d floro_db
\dt
```

## Step 6: Insert Sample Data (Optional)

Run the initialization script to add subscription plans:

### In pgAdmin:
1. Select `floro_db` database
2. Tools → Query Tool
3. Open: `backend/init-database.sql`
4. Click Execute

### In psql:
```bash
psql -U postgres -d floro_db -f backend/init-database.sql
```

## Step 7: Test the API

**Health Check**:
```
http://localhost:8080/api/health
```

**Get Subscription Plans**:
```
http://localhost:8080/api/plans
```

You should see your 3 subscription plans (Value, Basic, Premium)!

---

## 🔧 Troubleshooting

### "Password authentication failed"
- Update password in `application.properties` to match your PostgreSQL password
- Or reset PostgreSQL password and use `postgres123`

### "Database floro_db does not exist"
- Run Step 2 again to create the database
- Verify using pgAdmin or `psql -U postgres -l`

### "Port 5432 is already in use"
- PostgreSQL is already running (good!)
- Check if database exists: `psql -U postgres -l`

### "psql: command not found"
- Add PostgreSQL to PATH:
  - Search "Environment Variables" in Windows
  - Edit System Environment Variables
  - Add: `C:\Program Files\PostgreSQL\15\bin`
  - Restart Command Prompt

---

## 📊 Database Connection Details

| Setting | Value |
|---------|-------|
| Host | localhost |
| Port | 5432 |
| Database | floro_db |
| Username | postgres |
| Password | postgres123 |

---

## ✅ Success Checklist

- [ ] PostgreSQL installed
- [ ] pgAdmin working
- [ ] Database `floro_db` created
- [ ] application.properties updated
- [ ] Backend starts without errors
- [ ] Tables created automatically
- [ ] Sample data inserted
- [ ] API endpoints responding

---

## 🎉 You're All Set!

Your local development database is ready. Now you can:
1. Run the frontend: `npm start`
2. Run the backend: `mvn spring-boot:run`
3. Access the app: http://localhost:3000

Happy coding! 🚀

