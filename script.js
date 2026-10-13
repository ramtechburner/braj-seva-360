/* BRAND SETTING: change only this value to rename the site later. */
const BRAND_NAME = "Braj Seva 360";

document.querySelectorAll("[data-brand]").forEach(el => el.textContent = BRAND_NAME);
document.title = `${BRAND_NAME} | Explore Braj. Discover Local.`;
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", mainNav.classList.contains("open") ? "true" : "false");
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => mainNav.classList.remove("open")));

// Sample listing filters. This prototype uses illustrative cards, not a live database.
const categoryFilter = document.getElementById("categoryFilter");
const areaFilter = document.getElementById("areaFilter");
const cards = [...document.querySelectorAll(".place-card[data-category]")];
const chips = [...document.querySelectorAll(".category-chip")];
const emptyState = document.getElementById("emptyState");

function filterListings(category, area) {
  let visible = 0;
  cards.forEach(card => {
    const categoryMatch = category === "all" || card.dataset.category === category;
    const areaMatch = area === "all" || card.dataset.area === area;
    const show = categoryMatch && areaMatch;
    card.hidden = !show;
    if (show) visible++;
  });
  emptyState.hidden = visible > 0;
  chips.forEach(chip => chip.classList.toggle("active", chip.dataset.category === category));
}
document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  filterListings(categoryFilter.value, areaFilter.value);
  document.getElementById("discover").scrollIntoView({behavior:"smooth"});
});
chips.forEach(chip => chip.addEventListener("click", () => {
  categoryFilter.value = chip.dataset.category;
  filterListings(chip.dataset.category, areaFilter.value);
}));

// Save/favourite UI demo
document.querySelectorAll(".save-button").forEach(button => {
  button.addEventListener("click", () => {
    button.classList.toggle("saved");
    button.textContent = button.classList.contains("saved") ? "♥" : "♡";
    button.setAttribute("aria-pressed", button.classList.contains("saved") ? "true" : "false");
  });
});

// Suggested itinerary demo. This is not live routing, opening-hours data, or crowd information.
document.getElementById("plannerForm").addEventListener("submit", event => {
  event.preventDefault();
  const area = document.getElementById("plannerArea").value;
  const time = Number(document.getElementById("plannerTime").value);
  const style = document.getElementById("plannerStyle").value;
  const plans = {
    spiritual: ["Choose one or two spiritual places to visit", "Check official darshan timings before departure", "Leave flexible time for rest and local travel"],
    family: ["Choose a manageable first stop", "Plan a meal and a rest break", "Keep extra time for family needs and local travel"],
    food: ["Explore local food options after checking current details", "Add a market or local shopping stop", "Keep time flexible for discovering local culture"],
    mixed: ["Start with a priority place or temple", "Add a local food or shopping stop", "Keep the final part flexible for nearby discoveries"]
  };
  const stops = time <= 3 ? plans[style].slice(0,2) : plans[style];
  const result = document.getElementById("itineraryResult");
  result.innerHTML = `<h4>Your sample ${time >= 10 ? "day" : `${time}-hour`} plan · ${area}</h4><ol>${stops.map(stop => `<li>${stop}</li>`).join("")}</ol><p class="itinerary-warning">Demo suggestion only. Confirm current timings, routes, accessibility and availability independently.</p>`;
  result.hidden = false;
});

// Interest form prepares a local email draft. It does not upload or store submitted details.
document.getElementById("joinForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("joinName").value.trim();
  const role = document.getElementById("joinRole").value;
  const need = document.getElementById("joinNeed").value.trim();
  const subject = encodeURIComponent(`${BRAND_NAME} — Prototype feedback`);
  const body = encodeURIComponent(`Name: ${name}\nI am a: ${role}\nWhat would help me most:\n${need}\n\nSent from the ${BRAND_NAME} concept prototype.`);
  const message = document.getElementById("joinMessage");
  message.hidden = false;
  message.textContent = "Your email draft is ready. Your browser may ask which email app to use; no information has been sent yet.";
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
});
