# Urban Transport Management System

A microservices-based bus transportation management system built with Spring Boot, React, and Docker. This system provides comprehensive functionality for managing users, tickets, subscriptions, routes, bus geolocation, and notifications.

## 🏗️ Architecture

This project follows a microservices architecture pattern with the following components:

### Core Services

- **User Service** (`User/`) - User management, authentication, and authorization
- **Ticket Service** (`Ticket/`) - Ticket creation, validation, and management
- **Subscription Service** (`Subscription/`) - Subscription plans and management
- **Route Service** (`Route/`) - Bus routes and route planning
- **Bus Geolocation Service** (`BusGeolocation/`) - Real-time bus location tracking
- **Notification Service** (`Notification/`) - Push notifications and alerts
- **API Gateway** (`api-gateway/`) - Single entry point for all client requests
- **Frontend** (`Frontend/`) - React-based web application

### Infrastructure

- **PostgreSQL** - Database for each microservice
- **Docker & Docker Compose** - Containerization and orchestration
- **Drone CI** - Continuous Integration and Deployment

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Java 17+ (for local development)
- Maven 3.8+ (for local development)
- Node.js 16+ and npm (for frontend development)

### Start All Services

1. **Start Docker Daemon** (if not running):
   ```bash
   sudo systemctl start docker
   ```

2. **Start all services**:
   ```bash
   docker compose up -d --build
   ```

   Or use the provided script:
   ```bash
   ./start-services.sh
   ```

3. **Verify services are running**:
   ```bash
   docker compose ps
   ```

4. **View logs**:
   ```bash
   docker compose logs -f
   ```

### Access Points

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8082
- **User Service**: http://localhost:8081
- **Ticket Service**: http://localhost:8083
- **Subscription Service**: http://localhost:8084
- **Route Service**: http://localhost:8085
- **Bus Geolocation Service**: http://localhost:8086
- **Notification Service**: http://localhost:8087

### API Documentation

- **User Service Swagger**: http://localhost:8081/api/v1/swagger-ui.html
- **Ticket Service Swagger**: http://localhost:8083/swagger-ui.html
- **pgAdmin**: http://localhost:5051 (admin@admin.com / admin)

## 🧪 Testing

### Health Checks

```bash
# User Service
curl http://localhost:8081/api/v1/actuator/health

# API Gateway
curl http://localhost:8082/actuator/health

# Ticket Service
curl http://localhost:8083/actuator/health
```

### Test User Registration

```bash
curl -X POST http://localhost:8082/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "TestPass123",
    "phoneNumber": "+1234567890",
    "role": "PASSENGER"
  }'
```

## 🔧 Development

### Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd mymicroservices
   ```

2. **Build all services**:
   ```bash
   mvn clean install -DskipTests
   ```

3. **Run individual services**:
   ```bash
   # User Service
   cd User
   mvn spring-boot:run

   # Ticket Service
   cd Ticket
   mvn spring-boot:run
   ```

4. **Frontend Development**:
   ```bash
   cd Frontend
   npm install
   npm start
   ```

### Project Structure

```
mymicroservices/
├── User/                 # User service
├── Ticket/              # Ticket service
├── Subscription/       # Subscription service
├── Route/               # Route service
├── BusGeolocation/      # Bus geolocation service
├── Notification/        # Notification service
├── api-gateway/         # API Gateway
├── Frontend/            # React frontend
├── docker-compose.yml   # Development compose file
├── docker-compose.production.yml  # Production compose file
├── .drone.yml           # CI/CD pipeline configuration
└── pom.xml              # Parent Maven POM
```

## 🚢 CI/CD Pipeline

This project uses **Drone CI** for continuous integration and deployment.

### Pipeline Steps

1. **detect-changed-services** - Detects which services have changed
2. **build-user-service** - Builds User service (if changed)
3. **build-ticket-service** - Builds Ticket service (if changed)
4. **build-subscription-service** - Builds Subscription service (if changed)
5. **build-route-service** - Builds Route service (if changed)
6. **build-bus-geolocation-service** - Builds Bus Geolocation service (if changed)
7. **build-notification-service** - Builds Notification service (if changed)
8. **build-api-gateway** - Builds API Gateway (if changed)
9. **deploy-to-vps** - Deploys to production VPS

### Required Secrets

Configure the following secrets in Drone CI:

- `ghcr_username` - GitHub Container Registry username
- `ghcr_token` - GitHub Container Registry token
- `vps_host` - VPS hostname/IP
- `vps_user` - VPS SSH user
- `vps_ssh_key` - VPS SSH private key

### Pipeline Triggers

The pipeline runs on:
- Push to `master` branch
- Custom events
- Pull requests (build only, no deployment)

## 📦 Docker Images

All services are containerized and published to GitHub Container Registry (GHCR):

- `ghcr.io/<username>/soa-bus-app-user-service`
- `ghcr.io/<username>/soa-bus-app-ticket-service`
- `ghcr.io/<username>/soa-bus-app-subscription-service`
- `ghcr.io/<username>/soa-bus-app-route-service`
- `ghcr.io/<username>/soa-bus-app-bus-geolocation-service`
- `ghcr.io/<username>/soa-bus-app-notification-service`
- `ghcr.io/<username>/soa-bus-app-api-gateway`
- `ghcr.io/<username>/soa-bus-app-frontend`

## 🗄️ Database

Each microservice has its own PostgreSQL database:

- `user_db` - User service database (port 5434)
- `ticket_db` - Ticket service database (port 5435)
- `subscription_db` - Subscription service database (port 5436)
- `route_db` - Route service database (port 5437)
- `bus_geolocation_db` - Bus Geolocation service database (port 5438)
- `notification_db` - Notification service database (port 5439)

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication. The API Gateway handles authentication and routes requests to appropriate microservices.

### User Roles

- `PASSENGER` - Regular bus passengers
- `DRIVER` - Bus drivers
- `CONTROLLER` - Ticket controllers
- `ADMIN` - System administrators

## 🛠️ Troubleshooting

### Docker Issues

```bash
# Check Docker status
sudo systemctl status docker

# Restart Docker
sudo systemctl restart docker

# View service logs
docker compose logs -f <service-name>
```

### Port Conflicts

```bash
# Find process using port
sudo lsof -i :8081
sudo lsof -i :8082

# Kill process if needed
sudo kill -9 <PID>
```

### Reset Everything

```bash
# Stop and remove all containers and volumes
docker compose down -v

# Rebuild and start
docker compose up -d --build
```

### Database Issues

```bash
# Access database directly
docker exec -it user-service-postgres psql -U postgres -d user_db

# Reset database
docker compose down -v
docker compose up -d
```

## 📚 Additional Documentation

- [Quick Start Guide](QUICK_START.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Docker Compose README](DOCKER_COMPOSE_README.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)

## 🏗️ Technology Stack

- **Backend**: Spring Boot 3.2.0, Java 17
- **Frontend**: React, Material-UI
- **Database**: PostgreSQL 15
- **Containerization**: Docker, Docker Compose
- **CI/CD**: Drone CI
- **API Gateway**: Spring Cloud Gateway
- **Authentication**: JWT
- **Build Tool**: Maven

## 📝 License

OPEN SOURCE

## 👥 Contributors

AIT TALEB Saad
AKOUR Ayoub
ETTALBI Omar

