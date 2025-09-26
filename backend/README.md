
# Logistics Management System

A lightweight backend API for managing logistics deliveries with role-based access control. Built with Node.js, TypeScript, Express.js, and PostgreSQL.

## 🚀 Features

- **JWT-based Authentication** - Secure user authentication and authorization
- **Role-Based Access Control** - Three user types: Customer, Driver, Admin
- **Delivery Management** - Complete CRUD operations for deliveries
- **Driver Assignment** - Admin can assign drivers to deliveries
- **Status Tracking** - Real-time delivery status updates
- **Input Validation** - Comprehensive request validation and error handling

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **ORM**: pg (node-postgres)

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn
- Docker (for running with Docker Compose)

## ⚙️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd logistics-management-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/logistics
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

4. **Set up the database**
```bash
# Create database
createdb logistics

# Run migrations
npm run migrate
```

## 🚀 Running the project with Docker Compose

1. **Build and run the containers**
```bash
docker-compose up -d
```

This will start the application and a PostgreSQL database. The application will be available at `http://localhost:3000`.

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |

### Deliveries

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/deliveries` | Get deliveries (role-based) | Authenticated |
| POST | `/api/deliveries` | Create delivery | Customer |
| GET | `/api/deliveries/:id` | Get specific delivery | Owner/Admin |
| PUT | `/api/deliveries/:id` | Update delivery | Owner/Admin |
| DELETE | `/api/deliveries/:id` | Delete delivery | Owner/Admin |

### Driver Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| PUT | `/api/deliveries/:id/assign` | Assign driver to delivery | Admin |
| PUT | `/api/deliveries/:id/status` | Update delivery status | Driver/Admin |

### Admin

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/admin/drivers` | Create driver account | Admin |
| GET | `/api/admin/users` | List all users | Admin |

## 📝 API Usage Examples

You can use the provided `.http` files in the `http` directory to test the API endpoints. You can use a REST client like Postman or the VS Code REST Client extension to execute the requests.

### Register a new user

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CUSTOMER"
}
```

### Login

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "securePassword123"
}
```

### Create a delivery (Customer)

```http
@token = <your_jwt_token>

POST http://localhost:3000/api/deliveries
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "pickupAddress": "123 Main St, New York",
  "deliveryAddress": "456 Oak Ave, Brooklyn",
  "packageDescription": "Important documents"
}
```
