# Task 3 Test Report

**Project:** InternHub – Secure Application Integration  
**Test date:** Fill in after running tests  
**Environment:** Node.js / npm versions: fill in after running

## Automated tests

Run from the `backend` folder:

```bash
npm install
npm test
```

| Test case | Expected result | Status |
|---|---|---|
| GET `/internships?page=1&limit=5` | 200 response, JSON data array | Pending local run |
| Helmet security header | `X-Content-Type-Options: nosniff` | Pending local run |
| Invalid application fields | 400 response | Pending local run |
| Valid application submission | 201 response and application ID | Pending local run |
| Invalid internship ID | 400 response | Pending local run |

## Manual browser checks

| Check | Expected result | Status |
|---|---|---|
| Load internship page | Loading state then internship cards | Pending |
| Stop API and refresh frontend | Failure message and Retry button | Pending |
| Click Apply Now | Application form opens | Pending |
| Submit invalid email/phone | Client-side validation message | Pending |
| Submit valid form | Success message and application ID | Pending |

**Note:** Do not mark these as passed until you run the automated tests and browser checks. Add terminal output or screenshots here before submission.
