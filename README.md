# Weather App POC

A NestJS application for retrieving and storing weather data based on geographical coordinates.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [npm](https://www.npmjs.com/)

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/ahmedosama-st/weather-app-poc
cd weather-app-poc
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following content:

```
NODE_ENV=local
APP_PORT=8080
APP_URL='http://localhost'

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER='postgres'
POSTGRES_PASSWORD='secret'
POSTGRES_DATABASE='weather_app'

# Redis Configuration
REDIS_HOST='localhost'
REDIS_PORT=6379

# API Key for IQAir service
IQAIR_API_KEY='your-api-key'
```

Replace `'your-api-key'` with your actual IQAir API key.

## Starting the Project with Docker Compose

The project uses Docker Compose to set up PostgreSQL and Redis services.

### 1. Start the services

```bash
docker-compose up -d
```

This command starts:

- PostgreSQL database on port 5432
- Redis service on port 6379

### 2. Verify services are running

```bash
docker-compose ps
```

## Running the Server

### Development Mode

```bash
npm run start:dev
```

The server will start on http://localhost:8080 with hot-reload enabled.

## Testing the Endpoints

Once the server is running, you can test the following endpoints:

### Get Weather by Coordinates

```
GET /api/weather/coordinates?latitude=48.856613&longitude=2.352222
```

Example using curl:

```bash
curl "http://localhost:8080/api/weather/coordinates?latitude=48.856613&longitude=2.352222"
```

### Get Peak Weather by Coordinates

```
GET /api/weather/coordinates/peak?latitude=48.856613&longitude=2.352222
```

Example using curl:

```bash
curl "http://localhost:8080/api/weather/coordinates/peak?latitude=48.856613&longitude=2.352222"
```

## Running Tests

Make sure your Docker services are running before executing E2E tests.

```bash
npm run test:e2e
```

## Stopping Docker Services

When you're done working with the project, you can stop the Docker services:

```bash
docker-compose down
```

To remove all data volumes:

```bash
docker-compose down -v
```
