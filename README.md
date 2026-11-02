# Secure Application Integration – Internship Portal

## Project Overview

InternHub is an internship portal that connects a frontend application with a backend API. It allows users to view internship opportunities, search and filter internships, and submit applications securely.

## Objectives

* Integrate frontend with backend API.
* Display internship data dynamically.
* Implement a secure application form.
* Validate user inputs on both frontend and backend.
* Handle loading, error, retry, and failure states.
* Protect the API using security features.

## Technologies Used

* HTML
* CSS
* JavaScript
* Node.js
* Express.js
* SQLite
* Helmet
* CORS
* Express Rate Limit

## Features

* Dynamic internship listings from API.
* Search internships by role or company.
* Filter internships by domain.
* Application form with input validation.
* Loading and error messages.
* Retry functionality.
* Secure application submission.
* Backend validation and database storage.

## Security Features

| Security Feature       | Description                                |
| ---------------------- | ------------------------------------------ |
| Helmet                 | Provides HTTP security headers.            |
| Rate Limiting          | Limits excessive API requests.             |
| CORS                   | Controls permitted frontend origins.       |
| Server-side Validation | Validates application data on the backend. |
| Parameterized SQL      | Helps prevent SQL injection.               |
| Error Handling         | Handles errors with appropriate responses. |

## Project Structure

```text
internship-portal-task3/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── server.js
│   ├── database.js
│   ├── seed.js
│   ├── package.json
│   └── tests/
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/shirisha63/Secure-Application-Integration.git
```

### 2. Navigate to Backend

```bash
cd Secure-Application-Integration/backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Backend Server

```bash
npm start
```

The backend server runs at:

`http://localhost:5000`

### 5. Open the Frontend

Open `frontend/index.html` using VS Code Live Server.

## API Endpoints

| Method | Endpoint           | Description                      |
| ------ | ------------------ | -------------------------------- |
| GET    | `/internships`     | Retrieve internship listings     |
| GET    | `/internships/:id` | Retrieve an internship by ID     |
| POST   | `/applications`    | Submit an internship application |
| POST   | `/internships`     | Create an internship             |
| PUT    | `/internships/:id` | Update an internship             |
| DELETE | `/internships/:id` | Delete an internship             |

## Testing

Backend tests were executed using:

```bash
npm test
```

### Test Results

| Test Case                                | Result |
| ---------------------------------------- | ------ |
| GET internships API and security headers | PASS   |
| Invalid application validation           | PASS   |
| Valid application submission             | PASS   |
| Invalid internship ID validation         | PASS   |

**Total Tests:** 4
**Passed:** 4
**Failed:** 0

## Security Checklist

* [x] Helmet security headers
* [x] Rate limiting
* [x] CORS configuration
* [x] Server-side validation
* [x] Parameterized SQL queries
* [x] Error handling
* [x] Backend tests passed

Website link:  https://shirisha63.github.io/Secure-Application-Integration/

## Author

**Shirisha Kokkera**

GitHub: [shirisha63](https://github.com/shirisha63)

## Conclusion

This project demonstrates secure frontend and backend integration for an internship portal with API communication, application submission, validation, database operations, security features, and automated testing.
