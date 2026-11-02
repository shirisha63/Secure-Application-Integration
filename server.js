const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const db = require("./database");

const app = express();
const allowedOrigins = new Set([
  "http://localhost:5500", "http://127.0.0.1:5500",
  "http://localhost:5501", "http://127.0.0.1:5501",
  "http://localhost:3000", "http://127.0.0.1:3000"
]);
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin(origin, callback) {
  // No Origin is typical for curl/Postman. Browser frontend should use a local web server.
  if (!origin || allowedOrigins.has(origin)) return callback(null, true);
  return callback(new Error("Origin is not allowed by CORS"));
}}));
app.use(express.json({ limit: "10kb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-7", legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again after 15 minutes." }
}));

const cleanText = value => typeof value === "string" ? value.trim() : "";
const validId = value => Number.isInteger(Number(value)) && Number(value) > 0;
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
const validPhone = value => /^\+?[0-9]{10,15}$/.test(value.replace(/[\s()-]/g, ""));
const validResumeUrl = value => {
  try { const url = new URL(value); return url.protocol === "https:"; }
  catch { return false; }
};

app.get("/", (req, res) => res.json({ success: true, message: "Internship API is running successfully!" }));

// GET internships with bounded pagination. SQL uses placeholders for user-controlled values.
app.get("/internships", (req, res) => {
  const rawPage = Number(req.query.page || 1);
  const rawLimit = Number(req.query.limit || 5);
  if (!Number.isInteger(rawPage) || rawPage < 1 || !Number.isInteger(rawLimit) || rawLimit < 1) {
    return res.status(400).json({ success: false, message: "page and limit must be positive integers." });
  }
  const page = rawPage;
  const limit = Math.min(50, rawLimit);
  const offset = (page - 1) * limit;
  const data = db.prepare("SELECT * FROM internships ORDER BY id DESC LIMIT ? OFFSET ?").all(limit, offset);
  const totalRecords = db.prepare("SELECT COUNT(*) AS total FROM internships").get().total;
  res.json({ success: true, page, limit, totalRecords, totalPages: Math.ceil(totalRecords / limit), data });
});

app.get("/internships/:id", (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid internship ID." });
  const item = db.prepare("SELECT * FROM internships WHERE id = ?").get(Number(req.params.id));
  if (!item) return res.status(404).json({ success: false, message: "Internship not found." });
  res.json({ success: true, data: item });
});

app.post("/internships", (req, res) => {
  const title = cleanText(req.body.title), company = cleanText(req.body.company), location = cleanText(req.body.location), description = cleanText(req.body.description), stipend = cleanText(req.body.stipend);
  if (!title || !company || !location || !description) return res.status(400).json({ success: false, message: "title, company, location, and description are required." });
  if ([title, company, location, description, stipend].some(value => value.length > 500)) return res.status(400).json({ success: false, message: "Fields must be 500 characters or fewer." });
  const result = db.prepare("INSERT INTO internships (title, company, location, description, stipend) VALUES (?, ?, ?, ?, ?)").run(title, company, location, description, stipend || "Not specified");
  res.status(201).json({ success: true, message: "Internship created.", id: result.lastInsertRowid });
});

app.put("/internships/:id", (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid internship ID." });
  const title = cleanText(req.body.title), company = cleanText(req.body.company), location = cleanText(req.body.location), description = cleanText(req.body.description), stipend = cleanText(req.body.stipend);
  if (!title || !company || !location || !description) return res.status(400).json({ success: false, message: "title, company, location, and description are required." });
  if ([title, company, location, description, stipend].some(value => value.length > 500)) return res.status(400).json({ success: false, message: "Fields must be 500 characters or fewer." });
  const result = db.prepare("UPDATE internships SET title=?, company=?, location=?, description=?, stipend=? WHERE id=?").run(title, company, location, description, stipend || "Not specified", Number(req.params.id));
  if (!result.changes) return res.status(404).json({ success: false, message: "Internship not found." });
  res.json({ success: true, message: "Internship updated." });
});

app.delete("/internships/:id", (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid internship ID." });
  const result = db.prepare("DELETE FROM internships WHERE id = ?").run(Number(req.params.id));
  if (!result.changes) return res.status(404).json({ success: false, message: "Internship not found." });
  res.json({ success: true, message: "Internship deleted." });
});

// Application form endpoint: validate on server, then use a prepared statement.
app.post("/applications", (req, res) => {
  const internshipId = Number(req.body.internshipId);
  const name = cleanText(req.body.name);
  const email = cleanText(req.body.email).toLowerCase();
  const phone = cleanText(req.body.phone);
  const resumeUrl = cleanText(req.body.resumeUrl);

  if (!validId(internshipId)) return res.status(400).json({ success: false, message: "Select a valid internship." });
  if (name.length < 2 || name.length > 80 || !/^[\p{L}\p{M} .'-]+$/u.test(name)) return res.status(400).json({ success: false, message: "Name must be 2–80 characters and contain valid name characters." });
  if (!validEmail(email)) return res.status(400).json({ success: false, message: "Enter a valid email address (maximum 254 characters)." });
  if (!validPhone(phone)) return res.status(400).json({ success: false, message: "Enter a valid phone number with 10–15 digits." });
  if (resumeUrl.length > 500 || !validResumeUrl(resumeUrl)) return res.status(400).json({ success: false, message: "Resume URL must be a valid HTTPS link (maximum 500 characters)." });
  const internship = db.prepare("SELECT id FROM internships WHERE id = ?").get(internshipId);
  if (!internship) return res.status(404).json({ success: false, message: "Internship not found." });

  const result = db.prepare("INSERT INTO applications (internship_id, applicant_name, email, phone, resume_url) VALUES (?, ?, ?, ?, ?)").run(internshipId, name, email, phone, resumeUrl);
  res.status(201).json({ success: true, message: "Application submitted successfully.", applicationId: result.lastInsertRowid });
});

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found." }));
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.message === "Origin is not allowed by CORS") return res.status(403).json({ success: false, message: "This origin is not allowed." });
  if (err instanceof SyntaxError && "body" in err) return res.status(400).json({ success: false, message: "Invalid JSON body." });
  console.error("API error:", err.message);
  res.status(500).json({ success: false, message: "Internal server error." });
});

if (require.main === module) {
  const PORT = Number(process.env.PORT || 5000);
  app.listen(PORT, () => console.log(`Internship API running at http://localhost:${PORT}`));
}
module.exports = app;
