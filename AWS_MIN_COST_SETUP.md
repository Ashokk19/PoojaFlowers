# AWS Minimal-Cost Setup & Hosting Guide

This guide walks you through hosting the Floro application on AWS with the lowest possible cost, including two database options: PostgreSQL on EC2 and Supabase. It is detailed end-to-end so you can follow each step.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Option A (Recommended): Minimal-Cost Architecture](#option-a-recommended-minimal-cost-architecture)
- [Step 1: Prepare the App Locally](#step-1-prepare-the-app-locally)
- [Step 2: AWS Account and IAM](#step-2-aws-account-and-iam)
- [Step 3: Provision EC2 for Backend](#step-3-provision-ec2-for-backend)
- [Step 4: Choose and Set Up the Database](#step-4-choose-and-set-up-the-database)
  - [4A: Supabase (Easiest, often free)](#4a-supabase-easiest-often-free)
  - [4B: PostgreSQL on EC2 (Cheapest single-box)](#4b-postgresql-on-ec2-cheapest-single-box)
- [Step 5: Deploy Backend on EC2](#step-5-deploy-backend-on-ec2)
- [Step 6: Frontend Hosting on AWS](#step-6-frontend-hosting-on-aws)
  - [S3 + CloudFront (Recommended, HTTPS)](#s3--cloudfront-recommended-https)
  - [S3 Website Hosting Only (Cheapest, HTTP-only)](#s3-website-hosting-only-cheapest-http-only)
- [Step 7: Point Frontend to Backend API](#step-7-point-frontend-to-backend-api)
- [Step 8: Cost-Saving Tips](#step-8-cost-saving-tips)
- [Step 9: Backups](#step-9-backups)
- [Step 10: Monitoring & Maintenance](#step-10-monitoring--maintenance)
- [Appendix: OS Commands (Ubuntu vs Amazon Linux)](#appendix-os-commands-ubuntu-vs-amazon-linux)

---

## Architecture Overview
- Frontend (React): built static files served from AWS S3, optionally fronted by CloudFront for HTTPS + caching.
- Backend (Spring Boot): single low-cost EC2 instance. Expose via Nginx reverse proxy with free SSL (Let’s Encrypt).
- Database: choose one
  - Supabase (Free tier, managed PostgreSQL)
  - PostgreSQL installed on EC2 (same or separate instance) to avoid RDS cost

## Prerequisites
- A domain (optional but recommended for HTTPS), e.g., from Route 53, Namecheap, or GoDaddy.
- AWS account with billing set up.
- Basic terminal/SSH knowledge.

## Option A (Recommended): Minimal-Cost Architecture
- EC2: t4g.nano or t3.micro (free tier eligible) in a nearby region (e.g., ap-south-1). Use Arm (t4g) if you prefer lower cost and are okay with Arm instances.
- DB: Supabase Free Tier OR PostgreSQL on the same EC2 instance.
- Frontend: S3 static hosting with CloudFront (HTTPS). You can start with S3-only (HTTP) and add CloudFront later.

---

## Step 1: Prepare the App Locally
1. Build frontend
```bash
npm ci
npm run build
```
Output goes to `build/`.

2. Build backend JAR
```bash
cd backend
mvn clean package -DskipTests
```
This produces `target/floro-backend-1.0.0.jar` (as referenced in `DEPLOYMENT.md`).

---

## Step 2: AWS Account and IAM
1. Create an IAM user with programmatic access and AdministratorAccess (or least-privilege with S3/CloudFront/EC2/Route53 permissions).
2. Configure AWS CLI on your local machine (optional but helpful):
```bash
aws configure
```
Provide Access Key, Secret, default region (e.g., ap-south-1), and default output format (json).

---

## Step 3: Provision EC2 for Backend
1. Create a Security Group (SG) for the instance:
   - Inbound rules
     - SSH (22) from your IP only
     - HTTP (80) from 0.0.0.0/0
     - HTTPS (443) from 0.0.0.0/0
2. Create a Key Pair (PEM) to SSH into instance.
3. Launch Instance:
   - AMI: Ubuntu 22.04 LTS (easiest) or Amazon Linux 2
   - Type: t4g.nano or t3.micro
   - Storage: 8–16 GB gp3
   - Attach Security Group and Key Pair
4. Connect via SSH:
```bash
ssh -i /path/to/key.pem ubuntu@<EC2_PUBLIC_IP>
```
5. Update the OS and install dependencies (Ubuntu):
```bash
sudo apt update && sudo apt -y upgrade
sudo apt -y install openjdk-17-jdk maven nginx
```
6. Create app directories and user:
```bash
sudo useradd -m -s /bin/bash floro || true
sudo mkdir -p /opt/floro
sudo chown floro:floro /opt/floro
```

---

## Step 4: Choose and Set Up the Database
Choose ONE of the following.

### 4A: Supabase (Easiest, often free)
1. Go to https://supabase.com/ and create a project.
2. In Dashboard → Project → Settings → Database:
   - Note the `Host`, `Port`, `Database`, `User`, and set/reset the `Password`.
3. Connection URL example:
```
jdbc:postgresql://<HOST>:5432/postgres
```
4. You will use:
```
SPRING_DATASOURCE_URL=jdbc:postgresql://<HOST>:5432/postgres
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=<YOUR_PASSWORD>
```
5. If you want a dedicated database (optional): create `floro` db in Supabase SQL editor:
```sql
create database floro;
```
Then set `SPRING_DATASOURCE_URL=jdbc:postgresql://<HOST>:5432/floro`.

### 4B: PostgreSQL on EC2 (Cheapest single-box)
1. Install PostgreSQL on the EC2 instance (Ubuntu):
```bash
sudo apt -y install postgresql postgresql-contrib
```
2. Set a password for the `postgres` role and create a database:
```bash
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '<STRONG_PASSWORD>';"
sudo -u postgres createdb floro
```
3. Restrict Postgres to local connections for security (default is localhost only). Verify in `/etc/postgresql/*/main/postgresql.conf`:
```
listen_addresses = 'localhost'
```
Ensure `/etc/postgresql/*/main/pg_hba.conf` has `local` auth set to `md5` or `peer` as desired.
4. Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```
5. Connection variables for backend when Postgres is on the same EC2 host:
```
SPRING_DATASOURCE_URL=jdbc:postgresql://127.0.0.1:5432/floro
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=<STRONG_PASSWORD>
```

---

## Step 5: Deploy Backend on EC2
1. Copy JAR to the server from your local machine:
```bash
scp -i /path/to/key.pem backend/target/floro-backend-1.0.0.jar ubuntu@<EC2_PUBLIC_IP>:/opt/floro/app.jar
```
2. Create an environment file for secrets:
```bash
sudo tee /etc/floro.env >/dev/null << 'EOF'
SPRING_DATASOURCE_URL=jdbc:postgresql://<DB_HOST>:5432/<DB_NAME>
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=<DB_PASSWORD>
JWT_SECRET=<CHANGE_THIS_SECRET>
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
SERVER_PORT=8080
EOF
sudo chmod 600 /etc/floro.env
```
3. Create a systemd service to run the app:
```bash
sudo tee /etc/systemd/system/floro.service >/dev/null << 'EOF'
[Unit]
Description=Floro Spring Boot API
After=network.target

[Service]
User=floro
WorkingDirectory=/opt/floro
EnvironmentFile=/etc/floro.env
ExecStart=/usr/bin/java -jar /opt/floro/app.jar
Restart=always
RestartSec=5
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
EOF
```
4. Start and enable the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now floro
sudo systemctl status floro --no-pager
```
5. Configure Nginx reverse proxy (public HTTPS later):
```bash
sudo tee /etc/nginx/sites-available/floro.conf >/dev/null << 'EOF'
server {
  listen 80;
  server_name api.yourdomain.com;

  location /api/ {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://127.0.0.1:8080/api/;
  }
}
EOF
sudo ln -sf /etc/nginx/sites-available/floro.conf /etc/nginx/sites-enabled/floro.conf
sudo nginx -t && sudo systemctl reload nginx
```
6. Issue a free SSL certificate (Let’s Encrypt):
```bash
sudo apt -y install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com --non-interactive --agree-tos -m you@example.com
```
This updates the Nginx config to listen on 443 with SSL.

---

## Step 6: Frontend Hosting on AWS

### S3 + CloudFront (Recommended, HTTPS)
1. Create S3 bucket (private) in your region, name like `floro-frontend-<unique>`.
2. Upload the `build/` folder contents to the bucket.
3. Create CloudFront distribution:
   - Origin: your S3 bucket
   - Origin Access: create OAC (Origin Access Control) and attach to bucket (CloudFront can read private bucket)
   - Default behavior: GET/HEAD allowed, caching enabled
   - Viewer protocol policy: Redirect HTTP to HTTPS
   - Error pages: for SPA, map 403/404 to `/index.html` with 200 response
4. After distribution is deployed, note the CloudFront domain, e.g., `d123abc.cloudfront.net`.
5. (Optional) Route 53: create CNAME `www.yourdomain.com` → CloudFront domain.
6. Invalidate cache after updates:
```bash
aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/*"
```

### S3 Website Hosting Only (Cheapest, HTTP-only)
1. Create S3 bucket (must be public for website hosting).
2. Enable “Static website hosting” and set Index/404 to `index.html`.
3. Upload `build/` contents.
4. Access via the S3 website endpoint (no HTTPS on custom domain without CloudFront).

---

## Step 7: Point Frontend to Backend API
Set API URL at build time using React env variables.

1. Create `./.env.production` in project root:
```
REACT_APP_API_URL=https://api.yourdomain.com/api
```
2. Rebuild and deploy frontend:
```bash
npm run build
# upload build/ to S3; invalidate CloudFront
```

---

## Step 8: Cost-Saving Tips
- Use t4g.nano (Arm) or t3.micro (free tier) for the backend.
- Prefer Supabase Free Tier to avoid RDS cost.
- Keep S3 private and serve via CloudFront OAC to avoid data egress surprises.
- Turn off EC2 when idle (not for production) or schedule stop/start.
- Set CloudWatch log retention lower (e.g., 3–7 days).
- Use a single small EC2 hosting both API and PostgreSQL for the absolute minimum cost.

---

## Step 9: Backups
- Supabase: built-in backups in Dashboard → Database → Backups.
- Manual backup from anywhere with network access:
```bash
pg_dump -h <DB_HOST> -U postgres -d <DB_NAME> > backup.sql
```
- Local EC2 Postgres backup:
```bash
sudo -u postgres pg_dump floro > /tmp/floro_backup.sql
```

---

## Step 10: Monitoring & Maintenance
- Uptime monitoring: UptimeRobot pointing to `https://api.yourdomain.com/api/health` (already implemented).
- Logs: `sudo journalctl -u floro -f` on EC2.
- Security: Keep system updated, rotate keys/passwords, restrict SG ingress.

---

## Appendix: OS Commands (Ubuntu vs Amazon Linux)

### Amazon Linux 2 equivalents
```bash
# Java & Maven
sudo yum update -y
sudo yum install -y java-17-amazon-corretto maven nginx

# PostgreSQL (version availability can vary)
sudo amazon-linux-extras enable postgresql14 || true
sudo yum clean metadata
sudo yum install -y postgresql postgresql-server postgresql-contrib || true
# Initialize if needed (AL2 specific):
sudo /usr/bin/postgresql-setup --initdb || true
sudo systemctl enable --now postgresql
```
Adjust file paths for `postgresql.conf` and `pg_hba.conf` accordingly.

---

You can now run Floro on AWS at minimal cost with either Supabase or local PostgreSQL. Keep this document alongside `DEPLOYMENT.md` for quick reference.
