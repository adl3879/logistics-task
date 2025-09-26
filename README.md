# BrandMe Logistics Application

This repository contains a full-stack logistics management application, including a Next.js frontend and a Node.js/Express backend, with PostgreSQL as the database.

## Project Structure

- `frontend/`: Contains the Next.js application.
- `backend/`: Contains the Node.js/Express application.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Project with Docker Compose

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd logistics-task
    ```

2.  **Build and run the services:**

    Navigate to the root directory of the project (where `docker-compose.yml` is located) and run:

    ```bash
    docker-compose up --build
    ```

    This command will:
    - Build the Docker images for the frontend and backend (if they don't exist or have changed).
    - Start the PostgreSQL database service.
    - Start the backend service, connected to PostgreSQL.
    - Start the frontend service, connected to the backend.

3.  **Access the Application:**

    Once all services are up and running:
    - **Frontend:** Open your web browser and go to `http://localhost:3000`
    - **Backend API:** The backend API will be accessible at `http://localhost:3001/api` (e.g., for testing with tools like Postman or Insomnia).

4.  **Stopping the Services:**

    To stop the services, press `Ctrl+C` in the terminal where `docker-compose up` is running. To stop and remove the containers, networks, and volumes, run:

    ```bash
    docker-compose down
    ```

    To remove volumes (which will delete your PostgreSQL data), add the `-v` flag:

    ```bash
    docker-compose down -v
    ```

## Frontend Development (Optional, without Docker Compose)

If you wish to run the frontend separately for development:

1.  **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**

    ```bash
    npm run dev
    ```

    The frontend will be available at `http://localhost:3000`.

    *Note: For the frontend to communicate with the backend, the backend service must be running (either via Docker Compose or locally).* You might need to adjust `NEXT_PUBLIC_BACKEND_URL` in `frontend/.env.local` if running locally and the backend is not on `http://localhost:3001/api`.

## Backend Development (Optional, without Docker Compose)

If you wish to run the backend separately for development:

1.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**

    ```bash
    npm run dev
    ```

    The backend API will be available at `http://localhost:3001/api`.

    *Note: The backend requires a running PostgreSQL instance. You can either run the PostgreSQL service via Docker Compose (`docker-compose up postgres`) or have a local PostgreSQL instance running.*

## API Endpoints (Backend)

(This section should be expanded with actual API endpoints once the backend is fully implemented.)

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in a user.
- `POST /api/deliveries`: Create a new delivery request (Customer).
- `GET /api/deliveries/my`: Get delivery history for the authenticated user (Customer).
- `GET /api/deliveries`: Get all delivery requests (Admin).
- `GET /api/users/drivers`: Get a list of all drivers (Admin).
- `PUT /api/deliveries/:id/assign`: Assign a driver to a delivery (Admin).
- `PUT /api/deliveries/:id/status`: Update the status of a delivery (Driver).

