// =====================================================
//  SHOP SETTINGS — change everything in this file only
// =====================================================
const CONFIG = {
  shopName: { en: "Ahmed's Barbershop", ar: "صالون أحمد" },

  // Social links
  instagram: "https://instagram.com/YOUR_ACCOUNT",
  whatsapp: "201000000000", // Egyptian number in international format: 20 + number without the first 0

  // Working hours: 11 = 11 AM, 24 = 12 midnight. One booking every 30 minutes.
  openHour: 11,
  closeHour: 24,
  slotMinutes: 30,

  // Supabase
  supabaseUrl: "https://khfodjlsxomedvbcrruy.supabase.co",
  supabaseKey: "sb_publishable_6T4Q4ClC6nbanKU_867qDQ_MJplhhhZ",

  // Branches (add or remove as needed). "id" must be short, English, no spaces.
  branches: [
    {
      id: "nasr",
      name: { en: "Nasr City", ar: "مدينة نصر" },
      address: { en: "12 Abbas El Akkad St, Nasr City", ar: "١٢ شارع عباس العقاد، مدينة نصر" },
      map: "https://maps.google.com/?q=Abbas+El+Akkad+Nasr+City+Cairo",
      whatsapp: "201000000001"
    },
    {
      id: "maadi",
      name: { en: "Maadi", ar: "المعادي" },
      address: { en: "Road 9, Maadi", ar: "شارع ٩، المعادي" },
      map: "https://maps.google.com/?q=Road+9+Maadi+Cairo",
      whatsapp: "201000000002"
    }
  ],

  // Barbers. "branch" must match a branch id above.
  barbers: [
    { id: "ahmed",   branch: "nasr",  name: { en: "Ahmed",   ar: "أحمد" } },
    { id: "mostafa", branch: "nasr",  name: { en: "Mostafa", ar: "مصطفى" } },
    { id: "karim",   branch: "maadi", name: { en: "Karim",   ar: "كريم" } },
    { id: "youssef", branch: "maadi", name: { en: "Youssef", ar: "يوسف" } }
  ],

  // Services and prices (EGP)
  services: [
    { id: "haircut", name: { en: "Haircut",         ar: "قص شعر" },        price: 100 },
    { id: "beard",   name: { en: "Beard trim",      ar: "تهذيب ذقن" },     price: 60 },
    { id: "combo",   name: { en: "Haircut + beard", ar: "شعر + ذقن" },      price: 140 },
    { id: "kids",    name: { en: "Kids haircut",    ar: "قص شعر أطفال" },  price: 70 }
  ]
};
