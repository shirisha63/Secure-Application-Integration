# InternHub — Secure Application Integration (Task 3)

This repository combines the internship-board frontend with the Express + SQLite API and adds secure application submission.

## Project structure

```text
internship-portal-task3/
├── frontend/                 # HTML, CSS, browser JavaScript
└── backend/                  # Express API, SQLite, API tests
    ├── server.js
    ├── database.js
    ├── seed.js
    └── tests/api.test.js
```

## Requirements

- Node.js 18+ (recommended current LTS)
- npm
- VS Code Live Server extension (or another static web server)

## Run locally

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Add sample internships (run once; safe to rerun)

```bash
npm run seed
```

### 3. Start the API

```bash
npm start
```

API runs at `http://localhost:5000`. Quick check: open `http://localhost:5000/`.

### 4. Start the frontend

Open `frontend/index.html` with VS Code Live Server. It normally runs at `http://localhost:5500`.
The API CORS allowlist includes localhost ports 5500, 5501, and 3000. If you use another frontend port, add that exact origin to `allowedOrigins` in `backend/server.js`.

## Features

- Frontend fetches internship data from `GET /internships`.
- Loading, error, empty, and retry states are visible.
- Search and domain filter are supported (API records currently do not include a domain property, so the domain filter is a placeholder until domain is added to the database schema/API).
- Apply Now opens a form with name, email, phone, and HTTPS resume URL.
- Client-side validation provides quick feedback; backend independently validates every field.
- Successful application submission returns an application ID.
- SQLite uses prepared statements for user-controlled values.
- Helmet security headers, CORS allowlist, JSON body size limit, and API rate limit are enabled.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API health message |
| GET | `/internships?page=1&limit=5` | Paginated internship list |
| GET | `/internships/:id` | Internship details |
| POST | `/internships` | Create internship (required fields: title, company, location, description) |
| PUT | `/internships/:id` | Update internship |
| DELETE | `/internships/:id` | Delete internship |
| POST | `/applications` | Submit an application |

### Application request example

```json
{
  "internshipId": 1,
  "name": "Sample Applicant",
  "email": "sample@example.com",
  "phone": "9876543210",
  "resumeUrl": "https://example.com/resume.pdf"
}
```

## Run tests

```bash
cd backend
npm test
```

Tests use Node's built-in test runner and a temporary SQLite database. They cover internship loading, security headers, invalid application validation, valid application submission, and invalid internship IDs.

## Security checklist

- [x] Server-side input validation (application and internship create/update)
- [x] Client-side validation for user-friendly feedback
- [x] Helmet security headers
- [x] Rate limiting: 100 requests per IP per 15-minute window
- [x] CORS origin allowlist for local frontend development
- [x] JSON request body limited to 10 KB
- [x] Parameterized SQLite queries (prepared statements)
- [x] Resume URL restricted to HTTPS
- [x] No applicant data is exposed through a public applications-list endpoint
- [ ] For production: use HTTPS, configure trusted proxy correctly, store secrets in environment variables, add CAPTCHA/authentication and privacy/retention policy, and consider stricter rate limits.

## Test report

Run `npm test` and attach the terminal output/screenshot to your submission. The test file is included; do not mark tests as passed until you run them locally.

## Submission

Push this entire folder to one public GitHub repository and submit that single repository URL. Include your screenshots and actual test output if the task portal asks for evidence.
