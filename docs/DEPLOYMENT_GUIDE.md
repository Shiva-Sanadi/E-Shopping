# Docker & Container Deployment Guide

## Overview

This guide covers deploying the E-Shopping application using Docker and Docker Compose.

## Prerequisites

- Docker >= 20.10
- Docker Compose >= 2.0
- Linux (Ubuntu 20.04+ recommended) or Docker Desktop

## Local Development with Docker

### 1. Quick Start

```bash
# Clone repository
git clone <repository-url>
cd E-Shopping

# Create environment file
cp .env.example .env.docker
# Edit .env.docker with your settings

# Build and start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database (optional)
docker-compose exec backend npx prisma db seed
```

### 2. Access Services

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Database (Adminer)**: http://localhost:8080
- **Redis Commander**: http://localhost:8081

### 3. Useful Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Execute commands in container
docker-compose exec backend npm test
docker-compose exec backend npx prisma studio

# Stop services
docker-compose down

# Remove volumes (clean database)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache
```

## Production Deployment

### 1. Prerequisites

- AWS EC2 instance or similar VPS
- Domain name configured
- SSL certificate (Let's Encrypt)
- CI/CD pipeline (GitHub Actions)

### 2. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add current user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 3. Deploy Application

```bash
# Clone repository
git clone <repository-url>
cd E-Shopping

# Create production environment file
cp .env.example .env.prod
# Edit .env.prod with production values

# Create .env.prod with production secrets
cat > .env.prod << EOF
# Database
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
MYSQL_PASSWORD=$(openssl rand -base64 32)

# JWT
JWT_SECRET=$(openssl rand -base64 32)

# API URLs
VITE_API_URL=https://api.yourdomain.com/api
CORS_ORIGIN=https://yourdomain.com

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Stripe (if using payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...
EOF

# Build and start with production compose
docker-compose -f docker-compose.yml \
  -f docker-compose.prod.yml \
  --env-file .env.prod \
  up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Check status
docker-compose ps
```

### 4. SSL/TLS with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Add to docker-compose.yml volumes
volumes:
  - /etc/letsencrypt:/etc/letsencrypt:ro

# Update Nginx configuration for SSL
```

### 5. Nginx Reverse Proxy

Create `nginx/nginx.conf`:

```nginx
upstream backend {
    server backend:5000;
}

upstream frontend {
    server frontend:5173;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' 'https://yourdomain.com' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    }
}
```

Add to docker-compose:

```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
    - /etc/letsencrypt:/etc/letsencrypt:ro
  depends_on:
    - backend
    - frontend
```

### 6. Monitoring & Logging

```bash
# View all logs
docker-compose logs -f

# Setup log rotation
cat > /etc/docker/daemon.json << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

sudo systemctl restart docker
```

### 7. Backup Strategy

```bash
# Daily database backup
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
docker-compose exec -T db mysqldump -uroot -p${MYSQL_ROOT_PASSWORD} \
  --all-databases > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -mtime +7 -delete
EOF

chmod +x backup.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

## Scaling & Performance

### Horizontal Scaling

```yaml
# Use Docker Swarm or Kubernetes
docker swarm init

# Deploy service with replicas
docker service create \
  --replicas 3 \
  --name backend \
  backend-image
```

### Load Balancing

Use load balancer with auto-scaling:
- AWS ELB / ALB
- DigitalOcean Load Balancer
- Nginx (manual)

### Resource Limits

Already configured in `docker-compose.prod.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
    reservations:
      cpus: '0.5'
      memory: 256M
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs backend

# Restart with verbose output
docker-compose up backend

# Rebuild image
docker-compose build --no-cache backend
```

### Database connection errors

```bash
# Check database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Test connection
docker-compose exec backend mysql -h db -u eshopping -p${MYSQL_PASSWORD} -e "SELECT 1"
```

### Port conflicts

```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "5001:5000"
```

### Out of disk space

```bash
# Check usage
docker system df

# Clean up
docker system prune -a --volumes
```

## Security Best Practices

1. **Secrets Management**
   - Use `.env` files (never commit)
   - Or Docker Secrets for Swarm
   - Or AWS Secrets Manager for ECS

2. **Network Security**
   - Use only HTTPS in production
   - Restrict database access to backend only
   - Use firewall rules

3. **Container Security**
   - Use non-root user (already configured)
   - Scan images for vulnerabilities
   - Keep base images updated

4. **Access Control**
   - Restrict SSH access
   - Use SSH keys, not passwords
   - Enable 2FA for deployments

## Monitoring Setup

Install monitoring tools:

```bash
# Prometheus + Grafana stack
docker run -d -p 9090:9090 prom/prometheus
docker run -d -p 3000:3000 grafana/grafana

# ELK Stack (logging)
docker-compose -f docker-compose.elk.yml up -d
```

---

For more help, check logs and container status regularly!
