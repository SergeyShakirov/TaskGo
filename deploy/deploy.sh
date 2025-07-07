#!/bin/bash

# TaskGo Production Deployment Script
# This script deploys TaskGo to a VPS server

set -e

# Configuration
APP_NAME="taskgo"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="/opt/taskgo/backups"
LOG_FILE="/var/log/taskgo-deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root for security reasons"
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    # Check if user is in docker group
    if ! groups $USER | grep &>/dev/null '\bdocker\b'; then
        error "User $USER is not in the docker group. Run: sudo usermod -aG docker $USER"
    fi
    
    # Check environment file
    if [[ ! -f .env.production ]]; then
        error "Production environment file (.env.production) not found!"
    fi
    
    log "Prerequisites check passed ✓"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    if docker-compose -f $DOCKER_COMPOSE_FILE ps | grep -q "Up"; then
        # Create backup directory
        sudo mkdir -p $BACKUP_DIR
        
        # Backup database
        BACKUP_FILE="$BACKUP_DIR/taskgo_backup_$(date +%Y%m%d_%H%M%S).sql"
        docker-compose -f $DOCKER_COMPOSE_FILE exec -T postgres pg_dump -U taskgo_user taskgo_production > $BACKUP_FILE
        
        # Backup volumes
        docker run --rm -v taskgo_postgres_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/postgres_data_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
        
        log "Backup created successfully ✓"
    else
        warning "No running containers found, skipping backup"
    fi
}

# Pull latest images
pull_images() {
    log "Pulling latest Docker images..."
    docker-compose -f $DOCKER_COMPOSE_FILE pull
    log "Images pulled successfully ✓"
}

# Deploy application
deploy() {
    log "Starting deployment..."
    
    # Copy production environment
    cp .env.production .env
    
    # Stop existing containers
    log "Stopping existing containers..."
    docker-compose -f $DOCKER_COMPOSE_FILE down
    
    # Build and start new containers
    log "Building and starting containers..."
    docker-compose -f $DOCKER_COMPOSE_FILE up -d --build
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    sleep 30
    
    # Check health
    check_health
    
    log "Deployment completed successfully ✓"
}

# Check application health
check_health() {
    log "Checking application health..."
    
    # Check if all containers are running
    if ! docker-compose -f $DOCKER_COMPOSE_FILE ps | grep -q "Up"; then
        error "Some containers are not running!"
    fi
    
    # Check backend health endpoint
    for i in {1..10}; do
        if curl -f http://localhost/health &>/dev/null; then
            log "Health check passed ✓"
            return 0
        fi
        log "Health check attempt $i/10 failed, waiting..."
        sleep 10
    done
    
    error "Health check failed after 10 attempts"
}

# Cleanup old images and volumes
cleanup() {
    log "Cleaning up old images and volumes..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes (older than 7 days)
    docker volume ls -q | xargs docker volume inspect | grep -E '"CreatedAt".*"[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}' | awk -F'"' '$4 < "'$(date -d '7 days ago' '+%Y-%m-%dT%H:%M:%S')'" {print $8}' | xargs -r docker volume rm
    
    log "Cleanup completed ✓"
}

# Show deployment status
show_status() {
    log "Deployment Status:"
    echo -e "${BLUE}================================${NC}"
    docker-compose -f $DOCKER_COMPOSE_FILE ps
    echo -e "${BLUE}================================${NC}"
    
    echo -e "${GREEN}Application URLs:${NC}"
    echo "  • API Health: https://your-domain.com/health"
    echo "  • API Docs: https://your-domain.com/api"
    echo "  • Monitoring: docker stats"
    echo ""
    echo -e "${GREEN}Useful Commands:${NC}"
    echo "  • View logs: docker-compose -f $DOCKER_COMPOSE_FILE logs -f"
    echo "  • Restart: docker-compose -f $DOCKER_COMPOSE_FILE restart"
    echo "  • Stop: docker-compose -f $DOCKER_COMPOSE_FILE down"
    echo "  • Update: ./deploy.sh"
}

# Main deployment function
main() {
    log "Starting TaskGo deployment..."
    
    check_root
    check_prerequisites
    create_backup
    pull_images
    deploy
    cleanup
    show_status
    
    log "TaskGo deployment completed successfully! 🚀"
}

# Run main function
main "$@"
