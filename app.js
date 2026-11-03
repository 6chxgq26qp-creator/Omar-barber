// 1. The shop's services. Change these to match your barber.
const services = [
  { name: "Haircut", price: 100 },
  { name: "Beard trim", price: 60 },
  { name: "Haircut + beard", price: 140 },
  { name: "Kids haircut", price: 70 }
];

// 2. Opening hours: 12 (noon) to 22 (10 PM), one booking every 30 minutes.
const OPEN_HOUR = 12;
const CLOSE_HOUR = 22;

// 3. Show the services as cards and in the dropdown.
const servicesDiv = document.getElementById("services");
const serviceSelect = document.getElementById("service");

services.forEach(function (s) {
  servicesDiv.innerHTML += `<div class="service"><strong>${s.name}</strong><span>${s.price} EGP</span></div>`;
  serviceSelect.innerHTML += `<option value="${s.name}">${s.name} - ${s.price} EGP</option>`;
});

// 4. Build the list of times (12:00, 12:30, 13:00 ...).
const timeSelect = document.getElementById("time");
for (let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour++) {
  ["00", "30"].forEach(function (min) {
    const t = `${hour}:${min}`;
    timeSelect.innerHTML += `<option value="${t}">${t}</option>`;
  });
}

// 5. Customers can't book a day in the past.
const dateInput = document.getElementById("date");
dateInput.min = new Date().toISOString().split("T")[0];

// 6. Connect to Supabase.
const SUPABASE_URL = "https://khfodjlsxomedvbcrruy.supabase.co";
const SUPABASE_KEY = "sb_publishable_6T4Q4ClC6nbanKU_867qDQ_MJplhhhZ";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 7. When the form is sent.
document.getElementById("booking-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const booking = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    service: serviceSelect.value,
    date: dateInput.value,
    time: timeSelect.value
  };

  const message = document.getElementById("message");
  const { error } = await db.from("bookings").insert(booking);

  if (error && error.code === "23505") {
    message.style.color = "#c62828";
    message.textContent = "Sorry, this time is already booked. Please choose another.";
    return;
  }
  if (error) {
    message.style.color = "#c62828";
    message.textContent = "Something went wrong. Please try again.";
    console.error(error);
    return;
  }

  message.style.color = "#2e7d32";
  message.textContent = `Thanks ${booking.name}! You're booked on ${booking.date} at ${booking.time}.`;
  event.target.reset();
});