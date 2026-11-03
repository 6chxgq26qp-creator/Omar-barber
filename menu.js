// =====================================================
//  SIDE MENU: branches, maps, Instagram, WhatsApp
// =====================================================
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");

function openMenu()  { drawer.classList.add("open");    overlay.classList.add("open"); }
function closeMenu() { drawer.classList.remove("open"); overlay.classList.remove("open"); }

document.getElementById("menu-open").addEventListener("click", openMenu);
document.getElementById("menu-close").addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

// Fill the menu and the footer (called again when the language changes)
function renderMenu() {
  const branchesHtml = CONFIG.branches.map(b => `
    <div class="branch">
      <strong>${tr(b.name)}</strong>
      <p>${tr(b.address)}</p>
      <div class="branch-links">
        <a href="${b.map}" target="_blank">📍 ${t("openMap")}</a>
        <a href="https://wa.me/${b.whatsapp}" target="_blank">💬 ${t("whatsapp")}</a>
      </div>
    </div>`).join("");

  const contactHtml = `
    <a class="social insta" href="${CONFIG.instagram}" target="_blank">📷 ${t("instagram")}</a>
    <a class="social wa" href="https://wa.me/${CONFIG.whatsapp}" target="_blank">💬 ${t("whatsapp")}</a>`;

  document.getElementById("drawer-branches").innerHTML = branchesHtml;
  document.getElementById("drawer-contact").innerHTML = contactHtml;

  const footer = document.getElementById("footer");
  if (footer) {
    footer.innerHTML = `
      <div class="footer-links">${contactHtml}</div>
      <p>${tr(CONFIG.shopName)} · ${CONFIG.branches.map(b => tr(b.name)).join(" · ")}</p>`;
  }
}
