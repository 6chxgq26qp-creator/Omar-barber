// =====================================================
//  THANK-YOU PAGE: shows the booking from the link
// =====================================================
const params = new URLSearchParams(location.search);
const booking = Object.fromEntries(params.entries());

function onLanguageChange() {
  renderMenu();

  const branch  = findBranch(booking.branch);
  const barber  = findBarber(booking.barber);
  const service = findService(booking.service);

  const comma = lang === "ar" ? "، " : ", ";
  document.getElementById("thanks-title").textContent =
    booking.name ? `${t("thanksTitle")}${comma}${booking.name}!` : `${t("thanksTitle")}!`;

  const rows = [
    [t("branch"),  branch  ? tr(branch.name) : ""],
    [t("barber"),  barber  ? tr(barber.name) : ""],
    [t("service"), service ? `${tr(service.name)} – ${service.price} ${t("egp")}` : ""],
    [t("day"),     booking.date ? formatDate(booking.date) : ""],
    [t("time"),    booking.time ? formatTime(booking.time) : ""]
  ];
  document.getElementById("details").innerHTML = rows.map(([label, value]) =>
    `<div class="detail-row"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`
  ).join("");

  document.getElementById("actions").innerHTML = branch ? `
    <a class="button outline" href="${branch.map}" target="_blank">📍 ${t("openMap")}</a>
    <a class="button outline" href="https://wa.me/${branch.whatsapp}" target="_blank">💬 ${t("whatsapp")}</a>` : "";
}
applyLanguage();
