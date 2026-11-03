// =====================================================
//  LANGUAGE (Arabic / English) + small shared helpers
// =====================================================
const TEXT = {
  en: {
    langButton: "عربي",
    menu: "Menu",
    tagline: "Book your appointment in seconds",
    hours: "Open daily 11:00 AM – 12:00 midnight",
    ourServices: "Our services",
    bookTitle: "Book your appointment",
    branch: "Branch",
    barber: "Barber",
    service: "Service",
    day: "Day",
    time: "Time",
    yourName: "Your name",
    phone: "Phone number",
    bookNow: "Book now",
    choose: "Choose…",
    chooseBarberDay: "Choose a barber and a day first",
    loadingTimes: "Loading times…",
    noTimes: "No free times on this day",
    slotTaken: "Sorry, this time was just booked. Please choose another.",
    error: "Something went wrong. Please try again.",
    ourBranches: "Our branches",
    openMap: "Open in Maps",
    contactUs: "Contact us",
    instagram: "Instagram",
    whatsapp: "WhatsApp",
    egp: "EGP",
    thanksTitle: "Thank you",
    thanksText: "Your booking is confirmed. We'll see you soon!",
    details: "Booking details",
    bookAnother: "Book another appointment",
    // dashboard
    bookings: "Bookings",
    email: "Email",
    password: "Password",
    login: "Log in",
    logout: "Log out",
    wrongLogin: "Wrong email or password.",
    allBranches: "All branches",
    showUpcoming: "Show all upcoming days",
    noBookings: "No bookings",
    done: "Done",
    cancel: "Cancel",
    cancelConfirm: "Cancel this booking?",
    status_booked: "Booked",
    status_done: "Done",
    status_cancelled: "Cancelled",
    confirmMsg: "Hi {name}, your {service} with {barber} at our {branch} branch is confirmed on {date} at {time}. See you!"
  },
  ar: {
    langButton: "English",
    menu: "القائمة",
    tagline: "احجز ميعادك في ثواني",
    hours: "مفتوح يوميًا من ١١ صباحًا حتى ١٢ منتصف الليل",
    ourServices: "خدماتنا",
    bookTitle: "احجز ميعادك",
    branch: "الفرع",
    barber: "الحلاق",
    service: "الخدمة",
    day: "اليوم",
    time: "الساعة",
    yourName: "اسمك",
    phone: "رقم الموبايل",
    bookNow: "احجز الآن",
    choose: "اختر…",
    chooseBarberDay: "اختر الحلاق واليوم أولًا",
    loadingTimes: "جاري تحميل المواعيد…",
    noTimes: "لا توجد مواعيد متاحة في هذا اليوم",
    slotTaken: "عذرًا، هذا الميعاد اتحجز حالًا. اختر ميعاد آخر.",
    error: "حدث خطأ. حاول مرة أخرى.",
    ourBranches: "فروعنا",
    openMap: "افتح الخريطة",
    contactUs: "تواصل معنا",
    instagram: "إنستجرام",
    whatsapp: "واتساب",
    egp: "ج.م",
    thanksTitle: "شكرًا",
    thanksText: "تم تأكيد حجزك. في انتظارك!",
    details: "تفاصيل الحجز",
    bookAnother: "احجز ميعاد آخر",
    // dashboard
    bookings: "الحجوزات",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    login: "دخول",
    logout: "خروج",
    wrongLogin: "البريد أو كلمة المرور غير صحيحة.",
    allBranches: "كل الفروع",
    showUpcoming: "عرض كل الأيام القادمة",
    noBookings: "لا توجد حجوزات",
    done: "تم",
    cancel: "إلغاء",
    cancelConfirm: "إلغاء هذا الحجز؟",
    status_booked: "محجوز",
    status_done: "تم",
    status_cancelled: "ملغي",
    confirmMsg: "أهلًا {name}، تم تأكيد حجز {service} مع {barber} في فرع {branch} يوم {date} الساعة {time}. في انتظارك!"
  }
};

// Current language: saved choice, or Arabic by default
let lang = "ar";
try { lang = localStorage.getItem("lang") || "ar"; } catch (e) {}

// t("key") -> text in the current language
function t(key) { return TEXT[lang][key] || key; }

// tr({en: "...", ar: "..."}) -> the right one
function tr(obj) { return obj[lang] || obj.en; }

// Show "13:30" as "1:30 PM" / "1:30 م"
function formatTime(time) {
  let [h, m] = time.split(":").map(Number);
  const pm = h >= 12;
  h = h % 12 || 12;
  const suffix = lang === "ar" ? (pm ? "م" : "ص") : (pm ? "PM" : "AM");
  return `${h}:${String(m).padStart(2, "0")} ${suffix}`;
}

// Show "2026-11-05" as "Thursday 5 November"
function formatDate(date) {
  return new Date(date + "T00:00").toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
    weekday: "long", day: "numeric", month: "long"
  });
}

// Today's date as "YYYY-MM-DD" (local time)
function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Find items in CONFIG by id
const findBranch  = id => CONFIG.branches.find(b => b.id === id);
const findBarber  = id => CONFIG.barbers.find(b => b.id === id);
const findService = id => CONFIG.services.find(s => s.id === id);

// Make user text safe before putting it in the page
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Apply the language to the page
function applyLanguage() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll(".shop-name").forEach(el => { el.textContent = tr(CONFIG.shopName); });
  if (typeof onLanguageChange === "function") onLanguageChange();
}

// Language button(s)
document.querySelectorAll(".lang-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    lang = lang === "ar" ? "en" : "ar";
    try { localStorage.setItem("lang", lang); } catch (e) {}
    applyLanguage();
  });
});
