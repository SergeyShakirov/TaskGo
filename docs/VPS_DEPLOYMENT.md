# TaskGo VPS Deployment Guide

This guide explains how to deploy TaskGo to a production VPS server.

## 📋 Prerequisites

### VPS Requirements
- **OS**: Ubuntu 20.04 LTS or newer
- **RAM**: Minimum 2GB, recommended 4GB+
- **Storage**: Minimum 20GB SSD
- **CPU**: 2+ cores recommended
- **Network**: Stable internet connection

### Domain & DNS
- Domain name pointing to your VPS IP
- DNS A records configured:
  - `your-domain.com` → `YOUR_VPS_IP`
  - `www.your-domain.com` → `YOUR_VPS_IP`

### Required Accounts
- OpenAI API account (for AI features)
- VPS provider account (DigitalOcean, Linode, AWS, etc.)
- Domain registrar access

## 🚀 Quick Deployment

### Step 1: VPS Setup
Run the automated setup script on your VPS:

```bash
# Connect to your VPS
ssh root@YOUR_VPS_IP

# Download and run setup script
wget https://raw.githubusercontent.com/SergeyShakirov/TaskGo/main/deploy/setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

### Step 2: Deploy Application
```bash
# Switch to application user
su - taskgo
cd /opt/taskgo

# Clone repository
git clone https://github.com/SergeyShakirov/TaskGo.git .

# Configure environment
cp .env.production .env
nano .env  # Edit with your settings

# Deploy
./deploy/deploy.sh
```

### Step 3: Configure SSL
```bash
# Install SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔧 Manual Setup

### 1. VPS Initial Setup

#### Update System
```bash
apt update && apt upgrade -y
apt install -y curl wget git unzip software-properties-common
```

#### Install Docker
```bash
# Add Docker repository
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

#### Create Application User
```bash
useradd -m -s /bin/bash taskgo
usermod -aG docker taskgo
mkdir -p /opt/taskgo
chown taskgo:taskgo /opt/taskgo
```

### 2. Application Deployment

#### Clone Repository
```bash
su - taskgo
cd /opt/taskgo
git clone https://github.com/SergeyShakirov/TaskGo.git .
```

#### Configure Environment
```bash
cp .env.production .env
```

Edit `.env` file with your settings:
```env
# Database
DB_NAME=taskgo_production
DB_USER=taskgo_user
DB_PASSWORD=your_secure_password

# Security
JWT_SECRET=your_super_secure_jwt_secret

# AI Services
OPENAI_API_KEY=sk-your_openai_key
DEEPSEEK_API_KEY=your_deepseek_key

# Domain
CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com
```

#### Update Nginx Configuration
```bash
sed -i 's/your-domain.com/actual-domain.com/g' nginx/conf.d/taskgo.conf
```

#### Deploy
```bash
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

### 3. SSL Configuration

#### Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

#### Get SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

#### Setup Auto-Renewal
```bash
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🛠️ Configuration Files

### Environment Variables (.env)
```env
# Database Configuration
DB_TYPE=postgresql
DB_HOST=postgres
DB_PORT=5432
DB_NAME=taskgo_production
DB_USER=taskgo_user
DB_PASSWORD=your_secure_database_password

# Server Configuration
NODE_ENV=production
PORT=3001
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters

# AI Services
OPENAI_API_KEY=sk-your_openai_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# CORS Configuration
CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com

# Redis
REDIS_URL=redis://redis:6379

# File Upload
MAX_FILE_SIZE=10485760
EXPORT_PATH=/app/exports

# Logging
LOG_LEVEL=info
```

### Nginx Configuration
The nginx configuration is automatically handled by Docker Compose, but you can customize it in `nginx/conf.d/taskgo.conf`.

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check application health
curl https://your-domain.com/health

# Check Docker containers
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Monitoring Stack (Optional)
Deploy full monitoring stack with Prometheus, Grafana, and Loki:

```bash
# Deploy monitoring
docker-compose -f docker-compose.monitoring.yml up -d

# Access Grafana
# URL: https://your-domain.com:3000
# Default: admin/admin
```

### Backup
```bash
# Manual backup
./scripts/backup.sh

# Setup automated backups
crontab -e
# Add: 0 2 * * * /opt/taskgo/scripts/backup.sh
```

### Updates
```bash
# Pull latest code
git pull origin main

# Redeploy
./deploy/deploy.sh
```

## 🔒 Security Checklist

- [ ] ✅ SSH key authentication enabled
- [ ] ✅ Root login disabled
- [ ] ✅ Firewall configured (UFW)
- [ ] ✅ SSL certificate installed
- [ ] ✅ Strong passwords for database
- [ ] ✅ JWT secret properly configured
- [ ] ✅ CORS origins restricted
- [ ] ✅ Regular backups configured
- [ ] ✅ Fail2ban installed
- [ ] ✅ Docker containers run as non-root
- [ ] ✅ Environment variables secured

## 🚨 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs backend

# Check environment
docker-compose -f docker-compose.prod.yml exec backend env

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

#### Database Connection Issues
```bash
# Check PostgreSQL
docker-compose -f docker-compose.prod.yml logs postgres

# Test database connection
docker-compose -f docker-compose.prod.yml exec postgres psql -U taskgo_user -d taskgo_production
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test nginx configuration
sudo nginx -t
```

#### Performance Issues
```bash
# Check system resources
htop
docker stats

# Check disk space
df -h

# Check logs for errors
tail -f /var/log/nginx/error.log
```

## 📞 Support

### Logs Location
- Application logs: `/opt/taskgo/logs/`
- Nginx logs: `/var/log/nginx/`
- Docker logs: `docker-compose logs`

### Useful Commands
```bash
# Application status
docker-compose -f docker-compose.prod.yml ps

# Restart application
docker-compose -f docker-compose.prod.yml restart backend

# Update application
git pull && ./deploy/deploy.sh

# Backup database
./scripts/backup.sh

# Monitor resources
htop
docker stats
```

### Getting Help
1. Check application logs
2. Review this documentation
3. Check GitHub issues
4. Contact support team

## 🎯 Performance Optimization

### Database Optimization
- Regular VACUUM and ANALYZE
- Connection pooling configured
- Proper indexing

### Application Optimization
- Redis caching enabled
- File upload limits configured
- Rate limiting active

### Server Optimization
- Nginx gzip compression
- HTTP/2 enabled
- CDN for static assets (optional)

---

**TaskGo Production Deployment** - Complete and secure! 🚀
