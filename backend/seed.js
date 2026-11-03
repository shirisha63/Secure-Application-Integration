const db = require("./database");
const records = [
  { title: "Frontend Developer Intern", company: "ABC Technologies", location: "Hyderabad", description: "Develop responsive web applications", stipend: "₹10,000/month" },
  { title: "Java Developer Intern", company: "Tech Solutions", location: "Bangalore", description: "Work on Java and backend development", stipend: "₹12,000/month" },
  { title: "Web Developer Intern", company: "Digital Solutions", location: "Chennai", description: "Develop and maintain websites", stipend: "₹8,000/month" }
];
const exists = db.prepare("SELECT id FROM internships WHERE title = ? AND company = ?");
const insert = db.prepare("INSERT INTO internships (title, company, location, description, stipend) VALUES (?, ?, ?, ?, ?)");
let added = 0;
for (const item of records) {
  if (!exists.get(item.title, item.company)) { insert.run(item.title, item.company, item.location, item.description, item.stipend); added++; }
}
console.log(`Seed complete. ${added} new internship record(s) inserted.`);
db.close();
