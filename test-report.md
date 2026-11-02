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

| Test case                    | Status |
| ---------------------------- | ------ |
| GET internships API          | Passed |
| Helmet security header       | Passed |
| Invalid application fields   | Passed |
| Valid application submission | Passed |
| Invalid internship ID        | Passed |

## Manual browser checks

| Check | Expected result | Status |
|---|---|---|
| Load internship page | Loading state then internship cards | Passed |
| Stop API and refresh frontend | Failure message and Retry button | Passed |
| Click Apply Now | Application form opens | Passed |
| Submit invalid email/phone | Client-side validation message | Passed |
| Submit valid form | Success message and application ID | Passed |

**Note:** Do not mark these as passed until you run the automated tests and browser checks. Add terminal output or screenshots here before submission.
