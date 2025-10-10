# 🚀 Quick Start with Local Database

## ⚡ Super Fast Setup (10 Minutes)

### **Step 1: Install PostgreSQL** (5 minutes)

1. **Download**: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
   - Choose: PostgreSQL 15 or 16 for Windows x86-64
   
2. **Install** with these settings:
   - Port: `5432` ✅
   - Password: `postgres123` (or remember what you choose!)
   - Install pgAdmin: ✅ Yes
   
3. **Verify Installation**:
   ```cmd
   psql --version
   ```
   Should show: `psql (PostgreSQL) 15.x`

---

### **Step 2: Create Database** (1 minute)

**Choose ONE method:**

#### **Method A: Automatic (Easiest)** 🎯
```cmd
cd C:\Flora\backend
setup-local-db.bat
```
Enter your PostgreSQL password when prompted. Done! ✅

#### **Method B: Using pgAdmin (GUI)**
1. Open **pgAdmin 4**
2. Connect to PostgreSQL (enter password)
3. Right-click "Databases" → Create → Database
4. Name: `floro_db`
5. Click Save

#### **Method C: Command Line**
```cmd
psql -U postgres
```
Enter password, then:
```sql
CREATE DATABASE floro_db;
\q
```

---

### **Step 3: Start Backend** (2 minutes)

```bash
cd C:\Flora\backend
mvn spring-boot:run
```

**Wait for**: `Started FloroApplication in X seconds`

✅ **Success!** Backend running at: http://localhost:8080/api

---

### **Step 4: Start Frontend** (2 minutes)

**New terminal**:
```bash
cd C:\Flora
npm start
```

✅ **Success!** Frontend opens at: http://localhost:3000

---

## 🎉 You're Live!

Your complete Floro application is now running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/api/health
- **Database**: PostgreSQL on localhost:5432

---

## 📊 Optional: Add Sample Data

**In pgAdmin Query Tool** or **psql**:

```bash
cd C:\Flora\backend
psql -U postgres -d floro_db -f init-database.sql
```

This adds the 3 subscription plans (Value ₹300, Basic ₹600, Premium ₹900).

---

## 🔧 Configuration Summary

Your **`application.properties`** is set to:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/floro_db
spring.datasource.username=postgres
spring.datasource.password=postgres123
```

**⚠️ If you used a different password**, edit:
`backend/src/main/resources/application.properties`

---

## ✅ Verify Everything Works

1. **Backend Health**: http://localhost:8080/api/health
   ```json
   {"status":"UP","timestamp":"..."}
   ```

2. **Get Plans**: http://localhost:8080/api/plans
   ```json
   [{"id":1,"name":"Value","monthlyPrice":300}...]
   ```

3. **Frontend**: http://localhost:3000
   - See beautiful homepage ✅
   - Browse subscription plans ✅
   - Contact form works ✅

---

## 🐛 Troubleshooting

### Backend won't start - "Connection refused"
- PostgreSQL not running
- **Fix**: Open Services → Find "postgresql-x64-15" → Start

### "Password authentication failed"
- Wrong password in application.properties
- **Fix**: Edit `backend/src/main/resources/application.properties`
  Change `spring.datasource.password=postgres123` to your password

### "Database floro_db does not exist"
- Database not created
- **Fix**: Run Step 2 again

### Port 3000 already in use
```bash
# Kill the process
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

### Port 8080 already in use
- Change in `application.properties`: `server.port=8081`

---

## 📱 Next Steps

Now that everything is running:

1. **Customize the App**
   - Update company info in About page
   - Add your logo to Navbar
   - Modify colors in CSS files

2. **Add Payment Integration**
   - Integrate Razorpay or Stripe
   - Update subscription flow

3. **Deploy to Production**
   - Follow `DEPLOYMENT.md` guide
   - Set up domain and SSL

4. **Build Mobile App**
   - Create React Native app
   - Use same backend APIs

---

## 🎯 Development Workflow

```bash
# Terminal 1 - Backend
cd C:\Flora\backend
mvn spring-boot:run

# Terminal 2 - Frontend  
cd C:\Flora
npm start
```

Both will auto-reload when you make changes!

---

## 📚 Documentation

- **Full Setup**: `README.md`
- **Database Guide**: `backend/LOCAL_SETUP_GUIDE.md`
- **Deployment**: `DEPLOYMENT.md`
- **Project Overview**: `PROJECT_SUMMARY.md`

---

## 💡 Pro Tips

- **pgAdmin**: Use it to view/edit database records visually
- **Hot Reload**: Frontend auto-refreshes on file save
- **API Testing**: Use Postman or browser for API testing
- **Logs**: Check terminal for errors and SQL queries

---

## 🆘 Still Having Issues?

1. Check PostgreSQL is running: Services → postgresql-x64-15
2. Verify database exists: `psql -U postgres -l`
3. Test connection: `psql -U postgres -d floro_db`
4. Check application.properties password matches
5. Review error messages in terminal

---

## ✨ Success!

You now have a fully functional puja flowers subscription platform running locally!

- 🌸 Beautiful React frontend
- ⚙️ Robust Spring Boot backend
- 🗄️ PostgreSQL database
- 🔐 Secure authentication ready
- 📱 Mobile-ready API architecture

**Start building your business!** 🚀

