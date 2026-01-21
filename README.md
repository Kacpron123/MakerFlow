# MakerFlow
is a comprehensive workshop and sales management system designed specifically for small-scale makers and artisans. It bridges the gap between creative production and business management, offering real-time stock synchronization, custom order tracking, and secure financial history.
# Architecture & Deployment
The project has transitioned from a monolithic Docker Compose setup to a Modular Resource Architecture optimized for Coolify.
## Project Structure (Monorepo)
- `/backend` – NestJS API (Business logic, Database Transactions, Auth)
- `./frontend` – React/Vite SPA (Dashboard, Sales UI)
  
# Production (Coolify)
Each module is deployed as a separate resource using dedicated Dockerfiles. This allows for:
- Independent Scaling: Scale the backend without affecting the frontend
- Persistent Database: PostgreSQL is managed as a standalone Coolify resource for better reliability.

# Local Development
## 1. Prerequisites
Prepare your environment variables by creating a `.env` file using `.env.example` template

## 2. Installation
Install dependencies for both parts of the application:
```
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```
## 3. Running with Docker
A master docker-compose.yaml is maintained at the root for developers who wish to spin up the entire environment (including the database) with a single command:
```
docker-compose up
```
Development Mode (with Hot-Reload): If you wish to start the program with hot-reload enabled for faster development, use:
```
docker-compose -f .\docker-compose.dev.yaml up
```
