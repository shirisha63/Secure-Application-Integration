const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "internhub-task3-"));
process.env.DATABASE_PATH = path.join(tempDir, "test.db");
const db = require("../database");
const app = require("../server");
let server, baseUrl, internshipId;

before(async () => {
  server = app.listen(0);
  await new Promise(resolve => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  const result = db.prepare("INSERT INTO internships (title, company, location, description, stipend) VALUES (?, ?, ?, ?, ?)").run("Test Intern", "Test Company", "Hyderabad", "Test role", "₹5000");
  internshipId = result.lastInsertRowid;
});
after(async () => {
  await new Promise(resolve => server.close(resolve));
  db.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("GET internships returns API data and security headers", async () => {
  const response = await fetch(`${baseUrl}/internships?page=1&limit=5`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.ok(Array.isArray(body.data));
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
});

test("invalid application is rejected by server-side validation", async () => {
  const response = await fetch(`${baseUrl}/applications`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "", email: "bad", phone: "1", resumeUrl: "http://not-secure.example" }) });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).success, false);
});

test("valid application is saved successfully", async () => {
  const response = await fetch(`${baseUrl}/applications`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ internshipId, name: "Test Applicant", email: "test@example.com", phone: "9876543210", resumeUrl: "https://example.com/resume.pdf" }) });
  const body = await response.json();
  assert.equal(response.status, 201);
  assert.equal(body.success, true);
  assert.ok(body.applicationId);
});

test("invalid internship id returns 400", async () => {
  const response = await fetch(`${baseUrl}/internships/abc`);
  assert.equal(response.status, 400);
});
