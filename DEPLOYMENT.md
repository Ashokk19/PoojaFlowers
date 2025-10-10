# Production Deployment Guide

## 🌐 Deployment Options

This guide covers deploying Floro to production environments.

## Option 1: Deploy to Vercel (Frontend) + Railway (Backend)

### Frontend → Vercel

1. **Prepare for deployment**
```bash
npm run build
```

2. **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

3. **Configure environment variables** in Vercel Dashboard:
```
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

### Backend → Railway

1. **Create `railway.json`** in backend folder:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "mvn clean install -DskipTests"
  },
  "deploy": {
    "startCommand": "java -jar target/floro-backend-1.0.0.jar",
    "healthcheckPath": "/api/health"
  }
}
```

2. **Deploy**:
   - Go to [Railway.app](https://railway.app)
   - Create new project
   - Connect GitHub repository
   - Select backend folder
   - Add environment variables

3. **Environment Variables**:
```
SPRING_DATASOURCE_URL=jdbc:postgresql://db.xulzddxaldzhabymaupe.supabase.co:5432/postgres
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_production_jwt_secret
CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

## Option 2: Deploy to Heroku (Full Stack)

### Prerequisites
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login
```

### Backend Deployment

1. **Create Heroku app**
```bash
cd backend
heroku create floro-api

# Add PostgreSQL (if not using Supabase)
heroku addons:create heroku-postgresql:mini
```

2. **Create `Procfile`** in backend folder:
```
web: java -jar target/floro-backend-1.0.0.jar
```

3. **Create `system.properties`**:
```
java.runtime.version=17
```

4. **Configure environment variables**:
```bash
heroku config:set SPRING_DATASOURCE_URL=jdbc:postgresql://db.xulzddxaldzhabymaupe.supabase.co:5432/postgres
heroku config:set SPRING_DATASOURCE_PASSWORD=your_password
heroku config:set JWT_SECRET=your_jwt_secret
```

5. **Deploy**:
```bash
git push heroku main
```

### Frontend Deployment

```bash
cd ..  # Back to root
heroku create floro-frontend
heroku buildpacks:set heroku/nodejs

# Configure environment
heroku config:set REACT_APP_API_URL=https://floro-api.herokuapp.com/api

# Deploy
git push heroku main
```

## Option 3: AWS Deployment

### Frontend → S3 + CloudFront

1. **Build frontend**
```bash
npm run build
```

2. **Create S3 bucket**
```bash
aws s3 mb s3://floro-frontend
aws s3 sync build/ s3://floro-frontend --acl public-read
```

3. **Configure bucket for static hosting**
4. **Create CloudFront distribution**
5. **Configure Route 53 for custom domain**

### Backend → EC2 + RDS

1. **Launch EC2 instance** (Amazon Linux 2)
2. **Install Java and Maven**
```bash
sudo yum update -y
sudo yum install java-17-amazon-corretto -y
sudo yum install maven -y
```

3. **Upload and run application**
```bash
mvn clean package
nohup java -jar target/floro-backend-1.0.0.jar &
```

4. **Configure nginx as reverse proxy**

## Option 4: Docker Deployment

### Frontend Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile
```dockerfile
FROM maven:3.8-openjdk-17 as build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/floro-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=http://backend:8080/api
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db.xulzddxaldzhabymaupe.supabase.co:5432/postgres
      - SPRING_DATASOURCE_USERNAME=postgres
      - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
```

### Deploy with Docker
```bash
docker-compose up -d
```

## 🔒 Production Checklist

### Security
- [ ] Change all default passwords
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable SQL injection protection
- [ ] Implement XSS protection
- [ ] Add CSRF tokens
- [ ] Set secure cookie flags
- [ ] Use strong JWT secrets

### Performance
- [ ] Enable database indexing
- [ ] Configure connection pooling
- [ ] Set up CDN for static assets
- [ ] Enable gzip compression
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Use lazy loading

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging (ELK Stack)
- [ ] Set up uptime monitoring
- [ ] Configure alerts
- [ ] Set up database backups
- [ ] Monitor API response times
- [ ] Track user analytics

### SEO
- [ ] Add meta tags
- [ ] Create sitemap.xml
- [ ] Set up robots.txt
- [ ] Configure Open Graph tags
- [ ] Add structured data
- [ ] Optimize page speed

## 🌐 Domain Configuration

### Custom Domain Setup

1. **Purchase domain** (GoDaddy, Namecheap, etc.)

2. **Frontend DNS (Vercel/Netlify)**
```
A Record: @ → 76.76.21.21
CNAME: www → cname.vercel-dns.com
```

3. **Backend DNS (Railway/Heroku)**
```
CNAME: api → your-backend-url.railway.app
```

### SSL Certificate
- Most platforms (Vercel, Railway, Heroku) provide free SSL
- For custom setup, use Let's Encrypt

## 📊 Environment Variables

### Production Frontend (.env.production)
```
REACT_APP_API_URL=https://api.floro.in
REACT_APP_SUPABASE_URL=https://xulzddxaldzhabymaupe.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_key
REACT_APP_ENVIRONMENT=production
```

### Production Backend
```
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://your-prod-db-url
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=strong_password_here
JWT_SECRET=very_strong_jwt_secret_for_production
CORS_ALLOWED_ORIGINS=https://floro.in,https://www.floro.in
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
LOGGING_LEVEL_ROOT=INFO
```

## 🔄 CI/CD Pipeline

### GitHub Actions (.github/workflows/deploy.yml)
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install and Build
        run: |
          npm ci
          npm run build
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Java
        uses: actions/setup-java@v2
        with:
          java-version: '17'
      - name: Build with Maven
        run: |
          cd backend
          mvn clean package -DskipTests
      - name: Deploy to Railway
        run: railway up --service backend
```

## 🚨 Monitoring & Alerts

### Set up monitoring with:
1. **Uptime Robot** - Free uptime monitoring
2. **Sentry** - Error tracking
3. **Google Analytics** - User analytics
4. **LogRocket** - Session replay

### Health Check Endpoint
Already implemented: `GET /api/health`

Monitor this endpoint every 5 minutes.

## 💾 Database Backups

### Supabase Backups
- Supabase provides automatic backups
- Go to Dashboard → Database → Backups
- Set up daily automated backups

### Manual Backup
```bash
pg_dump -h db.xulzddxaldzhabymaupe.supabase.co -U postgres -d postgres > backup.sql
```

## 📈 Scaling Strategies

1. **Horizontal Scaling**: Add more backend instances
2. **Database Optimization**: Add indexes, use read replicas
3. **Caching**: Implement Redis for session storage
4. **CDN**: Use CloudFlare or AWS CloudFront
5. **Load Balancing**: Use nginx or AWS ALB

## 🎯 Post-Deployment

1. **Test all features** in production
2. **Monitor logs** for errors
3. **Check performance** metrics
4. **Test payment integration**
5. **Verify email notifications**
6. **Test on mobile devices**
7. **Run security audit**

## 📞 Support

For deployment issues:
- Check logs: `heroku logs --tail` or platform-specific logs
- Review environment variables
- Verify database connectivity
- Check CORS configuration

---

**Your production-ready Floro application is now live! 🎉**


