# Deployment Guide - SkillMatrix Pro

## 🚀 Production Deployment

This guide covers deployment to popular platforms.

---

## Prerequisites

- [ ] PostgreSQL database
- [ ] Node.js runtime
- [ ] Domain name (optional)
- [ ] SSL certificate (for production)

---

## Option 1: Heroku Deployment

### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd server
   heroku create skillmatrix-api
   ```

4. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-super-secret-key
   heroku config:set JWT_EXPIRE=7d
   heroku config:set COOKIE_EXPIRE=7
   ```

6. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

7. **Run Database Schema**
   ```bash
   heroku pg:psql < ../database/schema.sql
   ```

### Frontend Deployment

1. **Update API URL**
   ```javascript
   // client/src/services/api.js
   baseURL: 'https://your-heroku-app.herokuapp.com/api'
   ```

2. **Build**
   ```bash
   cd client
   npm run build
   ```

3. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel deploy --prod
   ```

---

## Option 2: AWS Deployment

### Backend (AWS EC2)

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.micro (free tier)
   - Configure security group (ports 22, 80, 443, 5000)

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib

   # Install PM2
   sudo npm install -g pm2
   ```

4. **Setup PostgreSQL**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE skillmatrix_db;
   CREATE USER skillmatrix WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE skillmatrix_db TO skillmatrix;
   \q
   ```

5. **Deploy Application**
   ```bash
   # Clone repository
   git clone your-repo-url
   cd skillmatrix-pro/server

   # Install dependencies
   npm install --production

   # Setup environment
   nano .env
   # Add production environment variables

   # Run database schema
   psql -d skillmatrix_db < ../database/schema.sql

   # Start with PM2
   pm2 start server.js --name skillmatrix-api
   pm2 startup
   pm2 save
   ```

6. **Setup Nginx**
   ```bash
   sudo apt install nginx

   # Create Nginx config
   sudo nano /etc/nginx/sites-available/skillmatrix
   ```

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/skillmatrix /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Frontend (AWS S3 + CloudFront)

1. **Build Application**
   ```bash
   cd client
   npm run build
   ```

2. **Create S3 Bucket**
   - Go to AWS S3 Console
   - Create bucket (e.g., skillmatrix-frontend)
   - Enable static website hosting
   - Upload build files

3. **Setup CloudFront**
   - Create CloudFront distribution
   - Set origin to S3 bucket
   - Configure SSL certificate
   - Set default root object to index.html

4. **Update API URL**
   - Update baseURL in api.js to your backend URL

---

## Option 3: DigitalOcean Deployment

### Using App Platform

1. **Backend**
   ```bash
   # Create app.yaml
   cd server
   ```

   ```yaml
   name: skillmatrix-api
   services:
     - name: api
       github:
         repo: your-username/skillmatrix-pro
         branch: main
         deploy_on_push: true
       source_dir: /server
       run_command: npm start
       environment_slug: node-js
       envs:
         - key: NODE_ENV
           value: production
         - key: JWT_SECRET
           value: ${JWT_SECRET}
       http_port: 5000
   databases:
     - name: skillmatrix-db
       engine: PG
   ```

2. **Frontend**
   ```yaml
   name: skillmatrix-client
   static_sites:
     - name: web
       github:
         repo: your-username/skillmatrix-pro
         branch: main
       source_dir: /client
       build_command: npm run build
       output_dir: /dist
   ```

---

## Option 4: Docker Deployment

### Backend Dockerfile

```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Frontend Dockerfile

```dockerfile
# client/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: skillmatrix_db
      POSTGRES_USER: skillmatrix
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "5432:5432"

  backend:
    build: ./server
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: skillmatrix
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: skillmatrix_db
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRE: 7d
      COOKIE_EXPIRE: 7
    ports:
      - "5000:5000"
    depends_on:
      - postgres

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Deploy with Docker Compose:**
```bash
docker-compose up -d
```

---

## Environment Variables

### Production Environment Variables

**Backend (.env)**
```env
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=skillmatrix_db

# JWT
JWT_SECRET=your-super-secret-production-key-min-32-chars
JWT_EXPIRE=7d

# Cookies
COOKIE_EXPIRE=7

# Client URL (for CORS)
CLIENT_URL=https://your-frontend-domain.com
```

**Frontend**
```env
VITE_API_URL=https://your-api-domain.com/api
```

---

## Post-Deployment Checklist

- [ ] Database schema is applied
- [ ] Environment variables are set
- [ ] SSL certificate is configured
- [ ] CORS is properly configured
- [ ] API endpoints are accessible
- [ ] Frontend can connect to backend
- [ ] Authentication works
- [ ] Test all major features
- [ ] Setup monitoring (optional)
- [ ] Setup backups (database)
- [ ] Configure domain/DNS
- [ ] Setup CI/CD pipeline (optional)

---

## Security Checklist

- [ ] Use HTTPS (SSL/TLS)
- [ ] Set secure JWT secret (min 32 characters)
- [ ] Enable CORS only for trusted domains
- [ ] Use environment variables for secrets
- [ ] Enable HTTP-only cookies
- [ ] Set secure headers (helmet.js)
- [ ] Implement rate limiting
- [ ] Regular security updates
- [ ] Database backups
- [ ] Monitor logs for suspicious activity

---

## Monitoring & Maintenance

### Application Monitoring
- **Uptime monitoring**: UptimeRobot, Pingdom
- **APM**: New Relic, DataDog
- **Error tracking**: Sentry
- **Logging**: Winston, Morgan

### Database Maintenance
```bash
# Backup database
pg_dump skillmatrix_db > backup.sql

# Restore database
psql skillmatrix_db < backup.sql

# Automated backups (cron)
0 2 * * * pg_dump skillmatrix_db > /backups/skillmatrix_$(date +\%Y\%m\%d).sql
```

### Updates
```bash
# Update dependencies
npm update

# Security audit
npm audit
npm audit fix

# PM2 updates
pm2 update
```

---

## Scaling Strategies

### Horizontal Scaling
- Load balancer (Nginx, AWS ALB)
- Multiple backend instances
- Session management (Redis)
- Database read replicas

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Add database indexes
- Implement caching

### CDN
- CloudFlare for global distribution
- Cache static assets
- DDoS protection

---

## Support

For deployment issues:
1. Check logs: `pm2 logs` or `docker logs container-name`
2. Verify environment variables
3. Test database connection
4. Check firewall/security groups
5. Review CORS configuration

For help: Open an issue in the repository

---

**Last Updated**: February 2026
