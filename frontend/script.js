// API URL. The frontend and API run locally on different ports.
const API_BASE = "https://secure-application-integration-1.onrender.com";
const internshipContainer = document.getElementById("internshipContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const domainFilter = document.getElementById("domainFilter");
const statusMessage = document.getElementById("statusMessage");
const retryBtn = document.getElementById("retryBtn");
const modal = document.getElementById("applicationModal");
const applicationForm = document.getElementById("applicationForm");
const formMessage = document.getElementById("formMessage");
const submitButton = document.getElementById("submitApplication");
let internships = [];

async function loadInternships() {
  statusMessage.className = "";
  statusMessage.textContent = "Loading internships...";
  retryBtn.hidden = true;
  internshipContainer.replaceChildren();
  try {
    const response = await fetch(`${API_BASE}/internships?page=1&limit=50`);
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success !== true || !Array.isArray(result.data)) {
      throw new Error(result.message || "Could not load internships.");
    }
    internships = result.data;
    renderInternships(filterInternships());
  } catch (error) {
    statusMessage.textContent = "Unable to load internships. Check that the API server is running, then retry.";
    statusMessage.className = "error-message";
    retryBtn.hidden = false;
    console.error("Internship loading error:", error);
  }
}

function filterInternships() {
  const searchText = searchInput.value.trim().toLowerCase();
  const selectedDomain = domainFilter.value;
  return internships.filter(item => {
    const role = String(item.title || "").toLowerCase();
    const company = String(item.company || "").toLowerCase();
    const matchesSearch = role.includes(searchText) || company.includes(searchText);
    // Existing API records do not have a domain field, so domain filtering is only applied when present.
    const matchesDomain = selectedDomain === "all" || !item.domain || item.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });
}

function renderInternships(data) {
  internshipContainer.replaceChildren();
  statusMessage.className = data.length ? "" : "empty-message";
  statusMessage.textContent = `${data.length} internship(s) found`;
  if (!data.length) return;

  data.forEach(item => {
    const card = document.createElement("article");
    card.className = "internship-card";
    const logo = document.createElement("div"); logo.className = "company-logo"; logo.textContent = String(item.company || "?").charAt(0).toUpperCase();
    const title = document.createElement("h3"); title.textContent = item.title;
    const company = document.createElement("p"); company.className = "company-name"; company.textContent = item.company;
    const domain = document.createElement("span"); domain.className = "domain"; domain.textContent = item.domain || "Internship";
    const details = document.createElement("div"); details.className = "details"; details.textContent = `📍 ${item.location} | 💰 ${item.stipend || "Not specified"}`;
    const description = document.createElement("p"); description.className = "internship-description"; description.textContent = item.description || "Explore this internship opportunity.";
    const apply = document.createElement("button"); apply.className = "apply-btn"; apply.type = "button"; apply.textContent = "Apply Now";
    apply.addEventListener("click", () => openApplication(item));
    card.append(logo, title, company, domain, details, description, apply);
    internshipContainer.appendChild(card);
  });
}

function openApplication(item) {
  applicationForm.reset();
  formMessage.textContent = "";
  formMessage.className = "";
  document.getElementById("internshipId").value = item.id;
  document.getElementById("selectedInternship").textContent = `${item.title} at ${item.company}`;
  modal.hidden = false;
  document.getElementById("applicantName").focus();
}
function closeApplication() { modal.hidden = true; }

applicationForm.addEventListener("submit", async event => {
  event.preventDefault();
  formMessage.className = "";
  const payload = {
    internshipId: Number(document.getElementById("internshipId").value),
    name: document.getElementById("applicantName").value.trim(),
    email: document.getElementById("applicantEmail").value.trim(),
    phone: document.getElementById("applicantPhone").value.trim(),
    resumeUrl: document.getElementById("resumeUrl").value.trim()
  };
  // Basic client-side checks improve user experience. The API repeats all checks.
  if (!payload.name || payload.name.length < 2) return showFormMessage("Please enter your full name (at least 2 characters).", true);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return showFormMessage("Please enter a valid email address.", true);
  if (!/^\+?[0-9]{10,15}$/.test(payload.phone.replace(/[\s()-]/g, ""))) return showFormMessage("Enter a valid phone number (10–15 digits).", true);
  try {
    const resume = new URL(payload.resumeUrl);
    if (resume.protocol !== "https:") return showFormMessage("Resume link must start with https://", true);
  } catch { return showFormMessage("Please enter a valid resume URL.", true); }

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  showFormMessage("Submitting your application...");
  try {
    const response = await fetch(`${API_BASE}/applications`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Application submission failed.");
    showFormMessage("Application submitted successfully! Your application ID is " + result.applicationId + ".");
    applicationForm.reset();
  } catch (error) {
    showFormMessage(`${error.message || "Network error."} Please check your details and retry.`, true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Application";
  }
});
function showFormMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.className = isError ? "error-message" : "success-message";
}
searchBtn.addEventListener("click", () => renderInternships(filterInternships()));
searchInput.addEventListener("input", () => renderInternships(filterInternships()));
domainFilter.addEventListener("change", () => renderInternships(filterInternships()));
retryBtn.addEventListener("click", loadInternships);
document.getElementById("closeModal").addEventListener("click", closeApplication);
modal.addEventListener("click", event => { if (event.target === modal) closeApplication(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && !modal.hidden) closeApplication(); });
loadInternships();
