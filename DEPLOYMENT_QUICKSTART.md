# 🚀 TaskGo VPS Deployment - Quick Start

## ⚡ One-Command Deployment

### For Fresh VPS (Ubuntu 20.04+):
```bash
# 1. Setup VPS (run as root)
wget https://raw.githubusercontent.com/SergeyShakirov/TaskGo/main/deploy/setup-vps.sh && chmod +x setup-vps.sh && ./setup-vps.sh

# 2. Deploy Application (run as taskgo user)
su - taskgo
cd /opt/taskgo
git clone https://github.com/SergeyShakirov/TaskGo.git .
cp .env.production .env
# Edit .env with your settings
./deploy/deploy.sh
```

### For Existing VPS:
```bash
# Clone and deploy
git clone https://github.com/SergeyShakirov/TaskGo.git
cd TaskGo
cp .env.production .env
# Configure your settings in .env
./deploy/deploy.sh
```

## 📋 Required Configuration

### Environment Variables (.env)
```env
# Essential settings to configure:
DB_PASSWORD=your_secure_database_password
JWT_SECRET=your_super_secure_jwt_secret_32_chars_min
OPENAI_API_KEY=sk-your_openai_api_key
DOMAIN_NAME=your-domain.com

# Optional but recommended:
DEEPSEEK_API_KEY=your_deepseek_api_key
GRAFANA_PASSWORD=your_grafana_password
SLACK_WEBHOOK=your_slack_webhook_url
```

### DNS Configuration
```
A     your-domain.com        → YOUR_VPS_IP
A     www.your-domain.com    → YOUR_VPS_IP
CNAME api.your-domain.com    → your-domain.com
```

## 🎯 Deployment Options

### Option 1: Automated GitHub Deployment
1. Fork the repository
2. Configure GitHub Secrets:
   - `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`
   - `DB_PASSWORD`, `JWT_SECRET`, `OPENAI_API_KEY`
   - `DOMAIN_NAME`
3. Push to main branch → Automatic deployment

### Option 2: Manual VPS Deployment
```bash
# Complete setup on VPS
curl -sSL https://get.docker.com | sh
git clone https://github.com/SergeyShakirov/TaskGo.git
cd TaskGo && ./deploy/deploy.sh
```

### Option 3: Local Production Testing
```bash
# Test production build locally
./deploy/test-local-prod.sh start
# Access: http://localhost:3002
```

## 🔧 Service Ports

- **80/443**: Nginx (HTTP/HTTPS)
- **3001**: Backend API
- **5432**: PostgreSQL
- **6379**: Redis
- **9090**: Prometheus (monitoring)
- **3000**: Grafana (monitoring)

## 📊 Post-Deployment

### Health Checks
```bash
curl https://your-domain.com/health
curl https://your-domain.com/api/tasks
```

### Monitoring Access
- **Grafana**: https://your-domain.com:3000 (admin/admin)
- **Prometheus**: https://your-domain.com:9090

### Useful Commands
```bash
# View status
docker-compose -f docker-compose.prod.yml ps

# View logs  
docker-compose -f docker-compose.prod.yml logs -f backend

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Backup database
./scripts/backup.sh

# Update application
git pull && ./deploy/deploy.sh
```

## 🔒 Security Checklist

- [ ] SSL certificate installed
- [ ] Firewall configured (UFW)
- [ ] Strong database passwords
- [ ] SSH key authentication
- [ ] Regular backups scheduled
- [ ] Monitoring configured

## 🆘 Quick Troubleshooting

### Service Won't Start
```bash
docker-compose -f docker-compose.prod.yml logs backend
# Check environment variables
# Verify database connectivity
```

### SSL Issues
```bash
sudo certbot certificates
sudo certbot renew
sudo nginx -t && sudo systemctl reload nginx
```

### Database Issues
```bash
docker-compose -f docker-compose.prod.yml exec postgres psql -U taskgo_user -d taskgo_production
```

---

## 🎉 Success!

If everything is working:
- ✅ API: https://your-domain.com/health
- ✅ SSL: Certificate active
- ✅ Monitoring: Grafana accessible
- ✅ Backups: Automated daily

**Your TaskGo application is now live in production!** 🚀

For detailed documentation, see: [VPS_DEPLOYMENT.md](VPS_DEPLOYMENT.md)
