# CitizenGate

A comprehensive government services booking platform built with React/Vite frontend and NestJS backend.

## 🚀 Quick Start with Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd CitizenGate
   ```

2. **Environment Configuration**

   ```bash
   # Copy the example environment file
   cp example.env .env

   # Edit the .env file with your actual values
   nano .env  # or use your preferred editor
   ```

3. **Start the application**

   ```bash
   # Start all services in development mode
   docker-compose up

   # Or run in background
   docker-compose up -d
   ```

4. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3000
   - **Database**: localhost:5432

### 🐳 Docker Commands

#### Development

```bash
# Start all services in development mode
docker-compose up

# Start specific service
docker-compose up client
docker-compose up server
docker-compose up db

# View logs
docker-compose logs -f
docker-compose logs -f client
docker-compose logs -f server

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This will delete all data)
docker-compose down -v
```

#### Production

```bash
# Build and start in production mode
NODE_ENV=production docker-compose up --build

# Or set in .env file
echo "NODE_ENV=production" >> .env
docker-compose up --build
```

#### Useful Commands

```bash
# Rebuild containers
docker-compose build

# Rebuild specific service
docker-compose build client

# Execute commands in running containers
docker-compose exec server npm run lint
docker-compose exec client npm run build

# View container status
docker-compose ps

# Remove unused containers and images
docker system prune -a
```

### 📁 Project Structure

```
CitizenGate/
├── client/                 # Vite React frontend
│   ├── Dockerfile         # Client container configuration
│   ├── nginx.conf         # Nginx configuration for production
│   └── src/               # React source code
├── server/                # NestJS backend
│   ├── Dockerfile         # Server container configuration
│   ├── healthcheck.js     # Health check script
│   └── src/               # NestJS source code
├── docker-compose.yml     # Multi-container orchestration
├── example.env           # Environment variables template
└── README.md             # This file
```

### 🛠️ Development

#### Hot Reloading

Both client and server support hot reloading in development mode:

- **Client**: Changes to React components will trigger hot reload
- **Server**: Changes to NestJS code will restart the server automatically

#### Database

The PostgreSQL database runs in a separate container with:

- **Persistent storage** via Docker volumes
- **Health checks** to ensure availability
- **Automatic initialization** scripts (place in `init.sql`)

#### Environment Variables

Key environment variables you need to configure:

| Variable                | Description                     | Required |
| ----------------------- | ------------------------------- | -------- |
| `CLERK_PUBLISHABLE_KEY` | Clerk authentication public key | Yes      |
| `CLERK_SECRET_KEY`      | Clerk authentication secret key | Yes      |
| `SUPABASE_URL`          | Supabase project URL            | Yes      |
| `SUPABASE_ANON_KEY`     | Supabase anonymous key          | Yes      |
| `SENDGRID_API_KEY`      | SendGrid email service key      | Optional |
| `PLUNK_API_KEY`         | Plunk email service key         | Optional |

### 🚀 Production Deployment

For production deployment:

1. **Set production environment**

   ```bash
   NODE_ENV=production
   ```

2. **Configure production variables**

   ```bash
   # Update .env with production values
   VITE_API_URL=https://your-api-domain.com
   APP_URL=https://your-app-domain.com
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.yml up -d --build
   ```

### 🔧 Troubleshooting

#### Common Issues

1. **Port already in use**

   ```bash
   # Change ports in .env file
   CLIENT_PORT=3001
   SERVER_PORT=3001
   DB_PORT=5433
   ```

2. **Permission denied**

   ```bash
   # On Linux/macOS, you might need to fix permissions
   sudo chown -R $USER:$USER .
   ```

3. **Database connection issues**

   ```bash
   # Restart database service
   docker-compose restart db

   # Check database logs
   docker-compose logs db
   ```

4. **Clear everything and start fresh**

   ```bash
   # Stop all containers and remove volumes
   docker-compose down -v

   # Remove all unused containers, networks, and images
   docker system prune -a

   # Rebuild and start
   docker-compose up --build
   ```

#### Logs and Debugging

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f client
docker-compose logs -f server
docker-compose logs -f db

# Execute shell in running container
docker-compose exec server sh
docker-compose exec client sh
```

### 📝 Additional Notes

- The client runs on port 5173 in development and port 80 in production
- The server runs on port 3000 in both environments
- PostgreSQL runs on port 5432
- All services are connected via a Docker network named `citizengate-network`
- Data persists in Docker volumes, so it survives container restarts
- Health checks ensure services are ready before dependent services start

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test with Docker: `docker-compose up`
4. Commit changes: `git commit -am 'Add feature'`
5. Push to branch: `git push origin feature-name`
6. Submit a pull request

### 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
