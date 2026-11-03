// =====================================================
//  BOOKING PAGE
// =====================================================
const db = supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

const branchSelect  = document.getElementById("branch");
const barberSelect  = document.getElementById("barber");
const serviceSelect = document.getElementById("service");
const dateInput     = document.getElementById("date");
const timeSelect    = document.getElementById("time");
const message       = document.getElementById("message");

// Customers can't book a day in the past
dateInput.min = todayString();

// Fill a <select> with options and keep the old choice if it still exists
function fillSelect(select, options, placeholder) {
  const old = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>` +
    options.map(o => `<option value="${o.value}">${o.label}</option>`).join("");
  if (options.some(o => o.value === old)) select.value = old;
}

// 1. Services: cards + dropdown
function renderServices() {
  document.getElementById("services").innerHTML = CONFIG.services.map(s =>
    `<div class="service"><strong>${tr(s.name)}</strong><span>${s.price} ${t("egp")}</span></div>`
  ).join("");
  fillSelect(serviceSelect, CONFIG.services.map(s => ({ value: s.id, label: `${tr(s.name)} – ${s.price} ${t("egp")}` })), t("choose"));
}

// 2. Branches dropdown
function renderBranches() {
  fillSelect(branchSelect, CONFIG.branches.map(b => ({ value: b.id, label: tr(b.name) })), t("choose"));
}

// 3. Barbers dropdown: only the barbers of the chosen branch
function renderBarbers() {
  const list = CONFIG.barbers.filter(b => b.branch === branchSelect.value);
  fillSelect(barberSelect, list.map(b => ({ value: b.id, label: tr(b.name) })), t("choose"));
}

// 4. All possible times: 11:00, 11:30 ... 23:30
function allSlots() {
  const slots = [];
  for (let m = CONFIG.openHour * 60; m < CONFIG.closeHour * 60; m += CONFIG.slotMinutes) {
    slots.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return slots;
}

// 5. Show only the free times for the chosen barber and day
let loadId = 0;
async function loadTimes() {
  const barber = barberSelect.value;
  const date = dateInput.value;
  if (!barber || !date) {
    timeSelect.innerHTML = `<option value="">${t("chooseBarberDay")}</option>`;
    return;
  }
  const myLoad = ++loadId;
  timeSelect.innerHTML = `<option value="">${t("loadingTimes")}</option>`;

  // Ask the database which times are already booked
  const { data, error } = await db.rpc("booked_times", { p_barber: barber, p_date: date });
  if (myLoad !== loadId) return; // the customer changed barber/day while loading
  if (error) { console.error(error); timeSelect.innerHTML = `<option value="">${t("error")}</option>`; return; }

  const booked = data.map(r => r.booked_time);
  let free = allSlots().filter(s => !booked.includes(s));

  // If the day is today, hide times that already passed
  if (date === todayString()) {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    free = free.filter(s => { const [h, m] = s.split(":").map(Number); return h * 60 + m > nowMinutes; });
  }

  if (free.length === 0) {
    timeSelect.innerHTML = `<option value="">${t("noTimes")}</option>`;
    return;
  }
  fillSelect(timeSelect, free.map(s => ({ value: s, label: formatTime(s) })), t("choose"));
}

branchSelect.addEventListener("change", () => { renderBarbers(); loadTimes(); });
barberSelect.addEventListener("change", loadTimes);
dateInput.addEventListener("change", loadTimes);

// 6. Send the booking
document.getElementById("booking-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const button = document.getElementById("submit-btn");
  button.disabled = true;
  message.textContent = "";

  const booking = {
    branch: branchSelect.value,
    barber: barberSelect.value,
    service: serviceSelect.value,
    date: dateInput.value,
    time: timeSelect.value,
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim()
  };

  const { error } = await db.from("bookings").insert(booking);
  button.disabled = false;

  if (error) {
    message.style.color = "#c62828";
    message.textContent = error.code === "23505" ? t("slotTaken") : t("error");
    if (error.code !== "23505") console.error(error);
    loadTimes();
    return;
  }

  // Go to the thank-you page with the booking details
  location.href = "thanks.html?" + new URLSearchParams(booking).toString();
});

// 7. Redraw everything when the language changes
function onLanguageChange() {
  renderMenu();
  renderServices();
  renderBranches();
  renderBarbers();
  loadTimes();
}
applyLanguage();

// 8. Let phones install the site as an app
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
