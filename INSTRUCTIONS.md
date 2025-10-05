# Token Price Service - Running Instructions

This document provides instructions on how to run the Token Price Service application.

## Prerequisites

- Node.js v22
- Docker and Docker Compose

## Running with Docker Compose

The easiest way to run the application is to use Docker Compose for the dependencies (PostgreSQL and Kafka):

1. Start the dependencies:

```bash
docker compose up -d
```

2. Install the Node.js dependencies:

```bash
npm install
```

3. Run database migrations:

```bash
npm run migration:run
```

4. Register Debezium connectors:

```bash
bash scripts/register_debezium.bash
```

5. Run the application:

```bash
npm start
```

## Running the Tests

The integration tests use Testcontainers to spin up PostgreSQL and Kafka in Docker containers:

```bash
npm test
```

End-to-end (E2E) tests are also available:

```bash
npm run test:e2e
```

## Stopping the Application

1. Press `Ctrl+C` to stop the Node.js application

2. Stop the Docker containers:

```bash
docker compose down
```

## Cleaning Up

To remove all data volumes:

```bash
docker compose down -v
```

