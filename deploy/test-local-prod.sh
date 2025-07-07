#!/bin/bash

# Local Production Testing Script
# This script allows you to test the production build locally

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
    fi
    
    log "Prerequisites check passed ✓"
}

# Setup local environment
setup_environment() {
    log "Setting up local production environment..."
    
    # Create local production environment file
    cat > .env.local.prod << EOF
# Local Production Testing Configuration
NODE_ENV=production
DB_TYPE=postgresql
DB_HOST=postgres
DB_PORT=5432
DB_NAME=taskgo_test
DB_USER=taskgo_user
DB_PASSWORD=test_password_123

# Server Configuration
PORT=3001
JWT_SECRET=local_test_jwt_secret_key_for_testing_only

# AI Services (use test keys or leave empty)
OPENAI_API_KEY=test_key
DEEPSEEK_API_KEY=test_key

# Redis
REDIS_URL=redis://redis:6379

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# File Configuration
MAX_FILE_SIZE=10485760
EXPORT_PATH=/app/exports

# Logging
LOG_LEVEL=debug
EOF
    
    log "Local environment configured ✓"
}

# Create test docker-compose
create_test_compose() {
    log "Creating test docker-compose configuration..."
    
    cat > docker-compose.local.prod.yml << EOF
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: taskgo-test-postgres
    environment:
      POSTGRES_DB: taskgo_test
      POSTGRES_USER: taskgo_user
      POSTGRES_PASSWORD: test_password_123
    ports:
      - "5433:5432"
    volumes:
      - postgres_test_data:/var/lib/postgresql/data
    networks:
      - taskgo-test-network

  redis:
    image: redis:7-alpine
    container_name: taskgo-test-redis
    ports:
      - "6380:6379"
    networks:
      - taskgo-test-network

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    container_name: taskgo-test-backend
    environment:
      NODE_ENV: production
      DB_TYPE: postgresql
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: taskgo_test
      DB_USER: taskgo_user
      DB_PASSWORD: test_password_123
      JWT_SECRET: local_test_jwt_secret_key_for_testing_only
      REDIS_URL: redis://redis:6379
      PORT: 3001
      OPENAI_API_KEY: test_key
      DEEPSEEK_API_KEY: test_key
      CORS_ORIGIN: http://localhost:3000,http://localhost:3001
    ports:
      - "3002:3001"
    depends_on:
      - postgres
      - redis
    networks:
      - taskgo-test-network
    volumes:
      - ./backend/exports:/app/exports

volumes:
  postgres_test_data:

networks:
  taskgo-test-network:
    driver: bridge
EOF
    
    log "Test compose configuration created ✓"
}

# Build and start services
start_services() {
    log "Building and starting services..."
    
    # Stop any existing containers
    docker-compose -f docker-compose.local.prod.yml down -v 2>/dev/null || true
    
    # Build and start
    docker-compose -f docker-compose.local.prod.yml up -d --build
    
    log "Services started ✓"
}

# Wait for services to be ready
wait_for_services() {
    log "Waiting for services to be ready..."
    
    # Wait for PostgreSQL
    log "Waiting for PostgreSQL..."
    for i in {1..30}; do
        if docker-compose -f docker-compose.local.prod.yml exec -T postgres pg_isready -U taskgo_user -d taskgo_test &>/dev/null; then
            log "PostgreSQL is ready ✓"
            break
        fi
        if [ $i -eq 30 ]; then
            error "PostgreSQL failed to start"
        fi
        sleep 2
    done
    
    # Wait for Redis
    log "Waiting for Redis..."
    for i in {1..30}; do
        if docker-compose -f docker-compose.local.prod.yml exec -T redis redis-cli ping &>/dev/null; then
            log "Redis is ready ✓"
            break
        fi
        if [ $i -eq 30 ]; then
            error "Redis failed to start"
        fi
        sleep 2
    done
    
    # Wait for backend
    log "Waiting for backend..."
    for i in {1..30}; do
        if curl -f http://localhost:3002/health &>/dev/null; then
            log "Backend is ready ✓"
            break
        fi
        if [ $i -eq 30 ]; then
            error "Backend failed to start"
        fi
        sleep 3
    done
}

# Run tests
run_tests() {
    log "Running production tests..."
    
    # Test health endpoint
    log "Testing health endpoint..."
    if curl -f http://localhost:3002/health; then
        log "Health check passed ✓"
    else
        error "Health check failed"
    fi
    
    # Test API endpoints
    log "Testing API endpoints..."
    
    # Test tasks endpoint
    if curl -f http://localhost:3002/api/tasks; then
        log "Tasks API test passed ✓"
    else
        warning "Tasks API test failed (may be expected if no data)"
    fi
    
    # Test database connection
    log "Testing database connection..."
    if docker-compose -f docker-compose.local.prod.yml exec -T postgres psql -U taskgo_user -d taskgo_test -c "SELECT 1;" &>/dev/null; then
        log "Database connection test passed ✓"
    else
        error "Database connection test failed"
    fi
    
    log "All tests completed ✓"
}

# Show status
show_status() {
    log "Production test environment status:"
    echo -e "${BLUE}================================${NC}"
    docker-compose -f docker-compose.local.prod.yml ps
    echo -e "${BLUE}================================${NC}"
    
    echo -e "${GREEN}Test URLs:${NC}"
    echo "  • Backend API: http://localhost:3002"
    echo "  • Health Check: http://localhost:3002/health"
    echo "  • Tasks API: http://localhost:3002/api/tasks"
    echo "  • PostgreSQL: localhost:5433"
    echo "  • Redis: localhost:6380"
    echo ""
    echo -e "${GREEN}Useful Commands:${NC}"
    echo "  • View logs: docker-compose -f docker-compose.local.prod.yml logs -f"
    echo "  • Stop services: docker-compose -f docker-compose.local.prod.yml down"
    echo "  • Cleanup: docker-compose -f docker-compose.local.prod.yml down -v"
    echo "  • Database shell: docker-compose -f docker-compose.local.prod.yml exec postgres psql -U taskgo_user -d taskgo_test"
}

# Cleanup function
cleanup() {
    log "Cleaning up test environment..."
    docker-compose -f docker-compose.local.prod.yml down -v
    rm -f .env.local.prod docker-compose.local.prod.yml
    log "Cleanup completed ✓"
}

# Main function
main() {
    case "${1:-start}" in
        start)
            log "Starting local production test environment..."
            check_prerequisites
            setup_environment
            create_test_compose
            start_services
            wait_for_services
            run_tests
            show_status
            log "Local production environment is ready! 🚀"
            ;;
        stop)
            log "Stopping local production test environment..."
            docker-compose -f docker-compose.local.prod.yml down
            log "Environment stopped ✓"
            ;;
        clean)
            cleanup
            ;;
        logs)
            docker-compose -f docker-compose.local.prod.yml logs -f
            ;;
        status)
            show_status
            ;;
        test)
            run_tests
            ;;
        *)
            echo "Usage: $0 {start|stop|clean|logs|status|test}"
            echo ""
            echo "Commands:"
            echo "  start  - Start the local production environment"
            echo "  stop   - Stop the environment"
            echo "  clean  - Stop and cleanup all data"
            echo "  logs   - Show logs"
            echo "  status - Show current status"
            echo "  test   - Run tests on running environment"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
