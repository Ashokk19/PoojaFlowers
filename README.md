# Floro Puja Flowers - Subscription Service

A modern, full-stack web application for daily puja flower subscription service built with React and Java Spring Boot.

## 🌸 Features

- **User Authentication**: Secure registration and login system
- **Subscription Plans**: Value, Basic, and Premium plans for different needs
- **Daily Delivery**: Fresh flowers delivered before 7 AM
- **Subscription Management**: Pause, resume, or cancel anytime
- **Contact System**: Customer support through contact forms
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI/UX**: Beautiful, intuitive interface with smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Supabase Client** - Direct database access
- **CSS3** - Custom styling with modern features

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.2** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database ORM
- **PostgreSQL** - Database (via Supabase)
- **Maven** - Dependency management

### Database
- **PostgreSQL** (Supabase hosted)
- Tables: users, subscription_plans, subscriptions, orders, contact_messages

## 📋 Prerequisites

- **Node.js** 16+ and npm
- **Java JDK** 17+
- **Maven** 3.8+
- **PostgreSQL** (Supabase account)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Flora
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create .env file from example
cp src/.env.example .env

# Start development server
npm start
```

The frontend will run at `http://localhost:3000`

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Update database credentials in application.properties
# Edit: backend/src/main/resources/application.properties
# Set your Supabase database password

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend API will run at `http://localhost:8080/api`

### 4. Database Configuration

Update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://db.xulzddxaldzhabymaupe.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=YOUR_SUPABASE_DB_PASSWORD
```

**Important**: Replace `YOUR_SUPABASE_DB_PASSWORD` with your actual Supabase database password.

### 5. Database Initialization

The application will automatically create tables on first run using JPA. To populate initial data:

```sql
-- Insert subscription plans
INSERT INTO subscription_plans (plan_code, name, description, monthly_price, features, volume, active, popular, created_at, updated_at) VALUES
('value', 'Value', 'Affordable pack of puja flowers', 300.00, '["Marigold", "Doorstep drop", "Approx. 50 grams"]', 'Approx 50 Grams', true, false, NOW(), NOW()),
('basic', 'Basic', 'Exotic mix for daily puja', 600.00, '["Jasmine + Marigold", "Hibiscus (2 pcs)", "Approx. 100 grams"]', 'Approx 100 Grams', true, true, NOW(), NOW()),
('premium', 'Premium', 'Mix flowers with mala', 900.00, '["Lotus (2 pcs)", "Garland + Leaves", "Priority delivery"]', 'Either 2 Packets or 1 Pack with Mala', true, false, NOW(), NOW());
```

## 📁 Project Structure

```
Flora/
├── public/                 # Static files
├── src/                    # React frontend source
│   ├── components/         # Reusable components
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── HomePage.js
│   │   ├── SubscriptionsPage.js
│   │   ├── AboutPage.js
│   │   ├── ContactPage.js
│   │   └── ...
│   ├── services/          # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── subscriptionService.js
│   │   └── contactService.js
│   ├── config/            # Configuration
│   │   └── supabase.js
│   ├── App.js             # Main app component
│   └── index.js           # Entry point
├── backend/               # Java Spring Boot backend
│   ├── src/main/java/com/floro/
│   │   ├── model/         # Entity models
│   │   ├── repository/    # Data repositories
│   │   ├── service/       # Business logic
│   │   ├── controller/    # REST controllers
│   │   ├── dto/           # Data transfer objects
│   │   ├── config/        # Configuration classes
│   │   └── exception/     # Exception handlers
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml           # Maven configuration
├── package.json          # Frontend dependencies
└── README.md            # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Subscription Plans
- `GET /api/plans` - Get all active plans
- `GET /api/plans/{id}` - Get plan by ID
- `GET /api/plans/code/{code}` - Get plan by code

### Subscriptions
- `POST /api/subscriptions/user/{userId}` - Create subscription
- `GET /api/subscriptions/user/{userId}` - Get user subscriptions
- `GET /api/subscriptions/{id}` - Get subscription by ID
- `PUT /api/subscriptions/{id}/status` - Update subscription status
- `DELETE /api/subscriptions/{id}` - Cancel subscription

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (admin)
- `GET /api/contact/status/{status}` - Get messages by status

### Health Check
- `GET /api/health` - Check API health

## 🎨 Design Features

- **Modern Gradient UI**: Beautiful orange/amber gradient theme
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Works on mobile, tablet, and desktop
- **Glassmorphism**: Modern frosted glass effects
- **Accessibility**: ARIA labels and semantic HTML
- **Fast Loading**: Optimized assets and code splitting

## 🔐 Security Features

- Password encryption using BCrypt
- JWT token-based authentication
- CORS configuration for API security
- Input validation on both frontend and backend
- SQL injection prevention through JPA
- XSS protection

## 📱 Future Mobile App

The architecture is designed to support a React Native mobile app:
- Shared backend API
- Token-based authentication
- RESTful design principles
- JSON data format

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_SUPABASE_URL=https://xulzddxaldzhabymaupe.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (application.properties)
```
server.port=8080
spring.datasource.url=jdbc:postgresql://db.xulzddxaldzhabymaupe.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
jwt.secret=YOUR_JWT_SECRET
```

## 🐛 Troubleshooting

### Frontend Issues
- **Port already in use**: Change port in package.json scripts or kill the process
- **API connection failed**: Ensure backend is running on port 8080
- **Module not found**: Run `npm install` again

### Backend Issues
- **Database connection failed**: Check Supabase credentials and network
- **Port 8080 in use**: Change server.port in application.properties
- **Build failed**: Ensure Java 17+ and Maven 3.8+ are installed

## 📞 Support

For support, email support@floro.in or call +91-62066-16540 (24/7)

## 📄 License

Copyright © 2023 Floro Technologies Pvt Ltd. All Rights Reserved.

## 🙏 Acknowledgments

- Design inspiration from modern e-commerce platforms
- Icons and emojis for visual appeal
- Supabase for database hosting
- Spring Boot and React communities

---

**Made with ❤️ for devotees across India**


