// =====================================================
//  BARBER DASHBOARD
// =====================================================
const db = supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

const loginForm      = document.getElementById("login-form");
const dashboard      = document.getElementById("dashboard");
const logoutBtn      = document.getElementById("logout");
const filterDate     = document.getElementById("filter-date");
const filterBranch   = document.getElementById("filter-branch");
const filterUpcoming = document.getElementById("filter-upcoming");

filterDate.value = todayString();
let bookings = [];
let loggedIn = false;

// ---- Log in / log out ----
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const { error } = await db.auth.signInWithPassword({
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  });
  if (error) { document.getElementById("login-error").textContent = t("wrongLogin"); return; }
  showDashboard();
});

logoutBtn.addEventListener("click", async () => {
  await db.auth.signOut();
  location.reload();
});

function showDashboard() {
  loggedIn = true;
  loginForm.style.display = "none";
  dashboard.style.display = "block";
  logoutBtn.style.visibility = "visible";
  loadBookings();
}

// ---- Load bookings with the chosen filters ----
async function loadBookings() {
  let query = db.from("bookings").select("*");

  if (filterUpcoming.checked) query = query.gte("date", todayString());
  else query = query.eq("date", filterDate.value);

  if (filterBranch.value) query = query.eq("branch", filterBranch.value);

  const { data, error } = await query.order("date").order("time");
  if (error) { console.error(error); return; }
  bookings = data;
  renderBookings();
}

filterDate.addEventListener("change", () => { filterUpcoming.checked = false; loadBookings(); });
filterBranch.addEventListener("change", loadBookings);
filterUpcoming.addEventListener("change", loadBookings);

// ---- Show the bookings as cards ----
function renderBookings() {
  const active = bookings.filter(b => b.status !== "cancelled").length;
  document.getElementById("count").textContent = `${t("bookings")}: ${active}`;

  const list = document.getElementById("list");
  if (bookings.length === 0) {
    list.innerHTML = `<p class="empty">${t("noBookings")}</p>`;
    return;
  }

  list.innerHTML = bookings.map(b => {
    const branch  = findBranch(b.branch);
    const barber  = findBarber(b.barber);
    const service = findService(b.service);
    const branchName  = branch ? tr(branch.name) : b.branch;
    const barberName  = barber ? tr(barber.name) : b.barber;
    const serviceName = service ? tr(service.name) : b.service;

    // WhatsApp confirmation message to the customer
    const phone = "2" + String(b.phone).replace(/\D/g, "");
    const text = t("confirmMsg")
      .replace("{name}", b.name).replace("{service}", serviceName)
      .replace("{barber}", barberName).replace("{branch}", branchName)
      .replace("{date}", formatDate(b.date)).replace("{time}", formatTime(b.time));

    const status = b.status || "booked";
    return `
      <div class="booking card status-${status}">
        <div class="booking-top">
          <strong class="booking-time">${formatTime(b.time)}</strong>
          <span class="badge badge-${status}">${t("status_" + status)}</span>
        </div>
        <p class="booking-date">${formatDate(b.date)}</p>
        <p><strong>${escapeHtml(b.name)}</strong> · <span dir="ltr">${escapeHtml(b.phone)}</span></p>
        <p>${escapeHtml(serviceName)} · ${escapeHtml(barberName)} · ${escapeHtml(branchName)}</p>
        <div class="booking-actions">
          <a class="btn-small wa" href="https://wa.me/${phone}?text=${encodeURIComponent(text)}" target="_blank">💬 ${t("whatsapp")}</a>
          ${status === "booked" ? `
            <button class="btn-small done" onclick="setStatus(${b.id}, 'done')">✓ ${t("done")}</button>
            <button class="btn-small cancel" onclick="setStatus(${b.id}, 'cancelled')">✕ ${t("cancel")}</button>` : ""}
        </div>
      </div>`;
  }).join("");
}

// ---- Done / Cancel buttons ----
async function setStatus(id, status) {
  if (status === "cancelled" && !confirm(t("cancelConfirm"))) return;
  const { error } = await db.from("bookings").update({ status }).eq("id", id);
  if (error) { console.error(error); alert(t("error")); return; }
  loadBookings();
}

// ---- Language ----
function onLanguageChange() {
  const old = filterBranch.value;
  filterBranch.innerHTML = `<option value="">${t("allBranches")}</option>` +
    CONFIG.branches.map(b => `<option value="${b.id}">${tr(b.name)}</option>`).join("");
  filterBranch.value = old;
  if (loggedIn) renderBookings();
}
applyLanguage();

// If already logged in, open the dashboard directly
db.auth.getSession().then(({ data }) => { if (data.session) showDashboard(); });
