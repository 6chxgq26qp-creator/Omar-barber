const SUPABASE_URL = "https://khfodjlsxomedvbcrruy.supabase.co";
const SUPABASE_KEY = "sb_publishable_6T4Q4ClC6nbanKU_867qDQ_MJplhhhZ";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const loginForm = document.getElementById("login-form");
const bookingsBox = document.getElementById("bookings");

// Log in with the barber's email and password.
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const { error } = await db.auth.signInWithPassword({
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  });
  if (error) {
    document.getElementById("login-error").textContent = "Wrong email or password.";
    return;
  }
  showBookings();
});

// Load the bookings from the database and show them.
async function showBookings() {
  const { data: bookings, error } = await db
    .from("bookings")
    .select("*")
    .order("date")
    .order("time");
  if (error) { console.error(error); return; }

  loginForm.style.display = "none";
  bookingsBox.style.display = "block";
  document.getElementById("count").textContent = `${bookings.length} bookings`;

  const list = document.getElementById("list");
  list.innerHTML = "";
  bookings.forEach(function (b) {
    const phone = "2" + b.phone.replace(/\D/g, "");
    const text = encodeURIComponent(`Hi ${b.name}, your ${b.service} is confirmed on ${b.date} at ${b.time}. See you!`);
    list.innerHTML += `
      <tr>
        <td>${b.date}</td>
        <td>${b.time}</td>
        <td>${b.name}<br><small>${b.phone}</small></td>
        <td>${b.service}</td>
        <td><a class="whatsapp" href="https://wa.me/${phone}?text=${text}" target="_blank">WhatsApp</a></td>
      </tr>`;
  });
}

// If the barber is already logged in, skip the login form.
db.auth.getSession().then(function ({ data }) {
  if (data.session) showBookings();
});