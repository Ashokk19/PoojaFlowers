# Database Configuration Reference

Quick reference for switching between Supabase and Local PostgreSQL.

## 🌐 Supabase Configuration (Current)

**File**: `backend/src/main/resources/application.properties`

```properties
# Database Configuration (Supabase PostgreSQL)
spring.datasource.url=jdbc:postgresql://db.xulzddxaldzhabymaupe.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=Yqlf3SxaWIqpJ4NA
spring.datasource.driver-class-name=org.postgresql.Driver
```

**Connection String Format**:
```
postgresql://postgres:Yqlf3SxaWIqpJ4NA@db.xulzddxaldzhabymaupe.supabase.co:5432/postgres
```

**Benefits**:
- ✅ Cloud-hosted (no local installation)
- ✅ Automatic backups
- ✅ Accessible from anywhere
- ✅ Production-ready
- ✅ Free tier available

**Access**:
- Dashboard: https://supabase.com/dashboard
- Project: xulzddxaldzhabymaupe

---

## 💻 Local PostgreSQL Configuration

**File**: `backend/src/main/resources/application.properties`

```properties
# Database Configuration (Local PostgreSQL)
spring.datasource.url=jdbc:postgresql://localhost:5432/floro_db
spring.datasource.username=postgres
spring.datasource.password=postgres123
spring.datasource.driver-class-name=org.postgresql.Driver
```

**Benefits**:
- ✅ Works offline
- ✅ Faster development (no network latency)
- ✅ Full control over database
- ✅ No usage limits

**Requirements**:
- Install PostgreSQL locally
- Create database: `floro_db`
- Ensure PostgreSQL service is running

---

## 🔄 Quick Switch Guide

### Switch to Local:
1. Install PostgreSQL (if not installed)
2. Create database: `CREATE DATABASE floro_db;`
3. Update `application.properties` with Local config above
4. Restart backend

### Switch to Supabase:
1. Update `application.properties` with Supabase config above
2. Restart backend
3. Ensure internet connection

---

## 📊 Current Status

✅ **Active Configuration**: Supabase  
✅ **Connection String**: jdbc:postgresql://db.xulzddxaldzhabymaupe.supabase.co:5432/postgres  
✅ **Status**: Ready to use

---

## 🚀 Next Steps

1. **Start Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Verify Connection**:
   - Backend should start without errors
   - Check: http://localhost:8080/api/health

3. **Initialize Data** (if needed):
   - Run SQL script in Supabase Dashboard → SQL Editor
   - File: `backend/init-database.sql`
   - This creates subscription plans (Value, Basic, Premium)

---

## 🔐 Security Notes

- ⚠️ Never commit passwords to Git
- ⚠️ Use environment variables in production
- ⚠️ Rotate passwords regularly
- ✅ Supabase connection is SSL-encrypted

---

## 📞 Supabase Support

- **Dashboard**: https://supabase.com/dashboard
- **Docs**: https://supabase.com/docs
- **SQL Editor**: Dashboard → SQL Editor
- **Database Settings**: Dashboard → Settings → Database

---

**Current Setup**: ✅ Configured for Supabase Cloud Database

