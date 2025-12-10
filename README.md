# Eco Project(backend)

Small Express + Mongoose API for air quality and stations.

## Prerequisites
- Node.js (v16+ recommended)
- npm

## Install

Open a terminal in the project root and run:

```powershell
npm install
```

## Run the server

The project uses ESM (`type: module`). Start the server with:

```powershell
# development
node server.js


Environment variables (optional): create a `.env` file with `PORT` and MongoDB connection settings if you run the real server.

## Tests

Tests use Jest and run in ESM mode. Run:

```powershell
npm test
```

## Available scripts
- `npm test` — run tests (Jest via Node VM modules)
- `npm run seed` — run data seed script (if present)
- `npm run seed:clear` — clear seeded data (if present)

## Dependencies

Runtime dependencies (from `package.json`):

- `mongodb-memory-server` ^10.4.1
- `mongoose` ^9.0.1
- `express` ^4.18.2
- `cors` ^2.8.5
- `dotenv` ^16.0.3

Dev dependencies:

- `jest` ^30.2.0
- `supertest` ^7.1.4

## Notes
- The test setup configures Jest to run ESM tests using `--experimental-vm-modules`.
- `.gitignore` is included to avoid committing `node_modules`, `.env` files(you have example, just remove ".example" and type your data), and build/test artifacts.

# Eco Frontend (frontend)

A React-based frontend application for ecological data management and visualization.

## Features

- Data table visualization
- RESTful API integration
- Responsive user interface
- Real-time data updates

## Quick Start

1. Install React
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Available Scripts

- `npm start` - Run the app in development mode
- `npm build` - Build the app for production
- `npm test` - Launch the test runner

## Project Structure

```
src/
├── App.js              # Main application component
├── index.js            # Application entry point
├── api/
│   └── api.js          # API communication
└── components/
    └── DataTable.js    # Data table component
```

## Technologies

- React
- Node.js
- REST API
- Axios

## Notes
- /public was added to gitignore