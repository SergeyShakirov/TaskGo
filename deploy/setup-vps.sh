#!/bin/bash

# TaskGo VPS Server Setup Script
# This script sets up a fresh VPS for TaskGo deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_USER="taskgo"
APP_DIR="/opt/taskgo"
DOMAIN="your-domain.com"

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    error "This script must be run as root"
fi

# Update system
update_system() {
    log "Updating system packages..."
    apt-get update
    apt-get upgrade -y
    apt-get install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
}

# Install Docker
install_docker() {
    log "Installing Docker..."
    
    # Remove old versions
    apt-get remove -y docker docker-engine docker.io containerd runc || true
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io
    
    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Start Docker service
    systemctl start docker
    systemctl enable docker
    
    log "Docker installed successfully ✓"
}

# Create application user
create_app_user() {
    log "Creating application user..."
    
    # Create user if doesn't exist
    if ! id "$APP_USER" &>/dev/null; then
        useradd -m -s /bin/bash $APP_USER
        usermod -aG docker $APP_USER
        log "User $APP_USER created ✓"
    else
        log "User $APP_USER already exists ✓"
    fi
    
    # Create application directory
    mkdir -p $APP_DIR
    chown $APP_USER:$APP_USER $APP_DIR
    
    # Create backup directory
    mkdir -p /opt/taskgo/backups
    chown $APP_USER:$APP_USER /opt/taskgo/backups
}

# Install Nginx
install_nginx() {
    log "Installing Nginx..."
    apt-get install -y nginx
    systemctl start nginx
    systemctl enable nginx
    
    # Create basic firewall rules
    ufw allow 'Nginx Full'
    ufw allow OpenSSH
    ufw --force enable
    
    log "Nginx installed successfully ✓"
}

# Install SSL certificates with Let's Encrypt
install_ssl() {
    log "Installing SSL certificates..."
    
    # Install Certbot
    apt-get install -y certbot python3-certbot-nginx
    
    # Note: This will need manual domain configuration
    warning "SSL certificate setup requires manual configuration"
    warning "After deployment, run: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
}

# Configure system settings
configure_system() {
    log "Configuring system settings..."
    
    # Increase file limits
    cat >> /etc/security/limits.conf << EOF
$APP_USER soft nofile 65536
$APP_USER hard nofile 65536
EOF
    
    # Configure sysctl
    cat >> /etc/sysctl.conf << EOF
# TaskGo optimizations
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.ip_local_port_range = 1024 65535
vm.swappiness = 10
EOF
    
    sysctl -p
    
    # Setup log rotation
    cat > /etc/logrotate.d/taskgo << EOF
/var/log/taskgo*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
EOF
    
    log "System configuration completed ✓"
}

# Install monitoring tools
install_monitoring() {
    log "Installing monitoring tools..."
    
    # Install htop, iotop, and other monitoring tools
    apt-get install -y htop iotop nethogs ncdu tree fail2ban
    
    # Configure fail2ban
    systemctl start fail2ban
    systemctl enable fail2ban
    
    log "Monitoring tools installed ✓"
}

# Setup SSH security
secure_ssh() {
    log "Securing SSH..."
    
    # Backup original SSH config
    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
    
    # Configure SSH security
    sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
    sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config
    
    # Restart SSH service
    systemctl restart sshd
    
    warning "SSH root login disabled. Make sure you have SSH key access configured!"
    log "SSH security configured ✓"
}

# Create deployment structure
create_deployment_structure() {
    log "Creating deployment structure..."
    
    # Switch to app user
    sudo -u $APP_USER bash << EOF
cd $APP_DIR

# Create directory structure
mkdir -p {logs,backups,certs,nginx,scripts}

# Create basic scripts directory
cat > scripts/backup.sh << 'EOL'
#!/bin/bash
# TaskGo backup script
BACKUP_DIR="/opt/taskgo/backups"
DATE=\$(date +%Y%m%d_%H%M%S)

# Backup database
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U taskgo_user taskgo_production > \$BACKUP_DIR/db_backup_\$DATE.sql

# Backup volumes
docker run --rm -v taskgo_postgres_data:/data -v \$BACKUP_DIR:/backup alpine tar czf /backup/volumes_\$DATE.tar.gz -C /data .

# Clean old backups (keep 30 days)
find \$BACKUP_DIR -name "*.sql" -mtime +30 -delete
find \$BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: \$DATE"
EOL

chmod +x scripts/backup.sh

# Create monitoring script
cat > scripts/monitor.sh << 'EOL'
#!/bin/bash
# TaskGo monitoring script

echo "=== TaskGo System Status ==="
echo "Date: \$(date)"
echo ""

echo "=== Docker Containers ==="
docker-compose -f docker-compose.prod.yml ps
echo ""

echo "=== System Resources ==="
echo "Memory Usage:"
free -h
echo ""
echo "Disk Usage:"
df -h
echo ""

echo "=== Application Health ==="
curl -f http://localhost/health && echo "✓ API is healthy" || echo "✗ API is down"
echo ""

echo "=== Recent Logs ==="
docker-compose -f docker-compose.prod.yml logs --tail=20 backend
EOL

chmod +x scripts/monitor.sh
EOF
    
    log "Deployment structure created ✓"
}

# Main setup function
main() {
    log "Starting TaskGo VPS setup..."
    
    update_system
    install_docker
    create_app_user
    install_nginx
    install_ssl
    configure_system
    install_monitoring
    secure_ssh
    create_deployment_structure
    
    log "VPS setup completed successfully! 🚀"
    
    echo -e "${BLUE}================================${NC}"
    echo -e "${GREEN}Next Steps:${NC}"
    echo "1. Copy your TaskGo project to: $APP_DIR"
    echo "2. Configure your domain in nginx configuration"
    echo "3. Set up SSL certificate: certbot --nginx -d $DOMAIN"
    echo "4. Configure .env.production with your settings"
    echo "5. Run deployment: sudo -u $APP_USER ./deploy/deploy.sh"
    echo ""
    echo -e "${GREEN}Important Files:${NC}"
    echo "• Application directory: $APP_DIR"
    echo "• Backup directory: /opt/taskgo/backups"
    echo "• Logs: /var/log/taskgo*.log"
    echo "• Nginx config: /etc/nginx/sites-available/taskgo"
    echo ""
    echo -e "${YELLOW}Security Note:${NC}"
    echo "SSH root login has been disabled for security."
    echo "Make sure you have SSH key access configured!"
    echo -e "${BLUE}================================${NC}"
}

# Run main function
main "$@"
