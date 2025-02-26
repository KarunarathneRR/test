# Fault Alarm Visualization

This project is a Fault Alarm Visualization web application built with React and Node.js. The frontend is developed using React, while the backend is powered by Node.js and MongoDB.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (for backend)

### Setting up the Project

Follow the steps below to set up both the frontend and backend for development.

---

## Frontend Setup (React)

This project was bootstrapped with [Create React App](https://reactjs.org/docs/create-a-new-react-app.html).

### Available Scripts

In the `frontend` directory, you can run:

#### `npm start`

Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.  
The page will reload when you make changes.  
You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in interactive watch mode.  
See the section about running tests for more information.

#### `npm run build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.  
The build is minified, and the filenames include the hashes.  
Your app is ready to be deployed.

#### `npm run eject`

> **Note:** This is a one-way operation. Once you eject, you can't go back!

If you aren't satisfied with the build tool and configuration choices, you can eject at any time.  
This command will remove the single build dependency from your project.  
Instead, it will copy all the configuration files and transitive dependencies (webpack, Babel, ESLint, etc.) right into your project, so you have full control over them.

---

### Environment Configuration (`frontend/.env`)

The `.env` file contains environment-specific variables for the frontend application.

```ini
# frontend/.env file

# Allow connections from any host (use with caution in production)
HOST=0.0.0.0

# Disable host checking (use only for development purposes)
DANGEROUSLY_DISABLE_HOST_CHECK=true

# API URL for the backend
REACT_APP_API_URL=http://localhost:5000
```

### Environment Configuration (`backend/.env`)

The `.env` file contains environment-specific variables for the backend application.

```ini
# backend/.env file

# MongoDB URI for connecting to the database
MONGO_URI=mongodb+srv://nathashawijesundara99:leM7r2g0s1oMLUkF@cluster0.jxcpf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Database password (replace as needed)
pw = leM7r2g0s1oMLUkF
```
