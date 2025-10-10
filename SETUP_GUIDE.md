# Quick Setup Guide

## 🚀 5-Minute Setup

### Step 1: Install Prerequisites

Ensure you have:
- Node.js 16+ (`node --version`)
- Java JDK 17+ (`java --version`)
- Maven 3.8+ (`mvn --version`)

### Step 2: Frontend Setup

```bash
# In the project root (Flora/)
npm install
npm start
```

Access frontend at: `http://localhost:3000`

### Step 3: Backend Setup

```bash
# Open a new terminal, navigate to backend
cd backend

# IMPORTANT: Update your database password
# Edit: backend/src/main/resources/application.properties
# Replace: YOUR_SUPABASE_DB_PASSWORD with your actual password

# Build and run
mvn clean install
mvn spring-boot:run
```

Access backend at: `http://localhost:8080/api`

### Step 4: Get Your Supabase Password

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `xulzddxaldzhabymaupe`
3. Go to Settings → Database
4. Find "Database Password" or reset it
5. Copy the password

### Step 5: Update Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.password=YOUR_ACTUAL_PASSWORD_HERE
```

### Step 6: Test the Application

1. **Frontend**: Open `http://localhost:3000`
2. **Backend Health Check**: Open `http://localhost:8080/api/health`
3. **Try Registration**: Click "Subscribe" → Fill the form

## 🎯 Key Features to Test

1. **Homepage** → Beautiful hero section with flower subscription info
2. **Subscriptions** → Choose from Value/Basic/Premium plans
3. **How It Works** → 6-step process explanation
4. **About** → Company information
5. **Contact** → Submit contact form
6. **Register/Login** → User authentication

## 📊 Database Tables

The application automatically creates these tables:
- `users` - Customer accounts
- `subscription_plans` - Available plans (Value, Basic, Premium)
- `subscriptions` - Active user subscriptions
- `orders` - Daily flower orders
- `contact_messages` - Customer inquiries

## 🔧 Troubleshooting

### "Cannot connect to database"
- Check if Supabase password is correct
- Verify database URL in `application.properties`
- Ensure Supabase project is active

### "Port 3000 already in use"
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# On Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### "Port 8080 already in use"
- Change port in `application.properties`: `server.port=8081`
- Update frontend API URL: `REACT_APP_API_URL=http://localhost:8081/api`

### Maven build fails
```bash
# Clean and rebuild
mvn clean
mvn install -DskipTests
```

### Frontend dependency errors
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🎨 Customization

### Change Theme Colors

Edit CSS files:
- Primary color: `#F59E0B` (Orange)
- Secondary: `#D97706` (Darker Orange)
- Background: `#FBF7F4` (Beige)

Files to edit:
- `src/index.css`
- `src/components/Navbar.css`
- `src/pages/*.css`

### Add New Subscription Plan

1. Insert into database:
```sql
INSERT INTO subscription_plans (plan_code, name, description, monthly_price, features, volume, active) 
VALUES ('custom', 'Custom', 'Your custom plan', 1200.00, '["Feature 1", "Feature 2"]', '150 grams', true);
```

2. Plan will automatically appear on website

### Modify API Endpoints

Backend controllers are in: `backend/src/main/java/com/floro/controller/`

## 📱 Future Enhancements

Ready to add:
- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Email notifications (SendGrid/AWS SES)
- [ ] SMS alerts (Twilio)
- [ ] Admin dashboard
- [ ] Order tracking system
- [ ] Vendor management portal
- [ ] Mobile app (React Native)

## 🔐 Security Checklist

- [ ] Change JWT secret in `application.properties`
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS in production
- [ ] Set up database backups
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Enable CORS only for trusted domains

## 📞 Need Help?

- **Email**: support@floro.in
- **Phone**: +91-62066-16540
- **GitHub Issues**: Create an issue in the repository

## 🎉 You're All Set!

Your Floro Puja Flowers application is ready. Start by:
1. Registering a test user
2. Browsing subscription plans
3. Creating a test subscription
4. Customizing the design to match your brand

Happy coding! 🌸

