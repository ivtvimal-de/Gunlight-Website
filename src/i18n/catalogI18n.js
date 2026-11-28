/**
 * Frontend catalog localization helpers.
 * Prioritizes Admin-saved Hindi fields (*Hi) from MongoDB when Hindi is active,
 * falling back to built-in translations for initial/seeded data and then English
 * so legacy English-only records always render seamlessly.
 */

const CATEGORY_MAP_HI = {
  all: { name: "सभी", desc: "संपूर्ण उत्पाद श्रृंखला" },
  "all models": { name: "सभी मॉडल", desc: "संपूर्ण उत्पाद श्रृंखला" },
  "led torch": { name: "LED टॉर्च", desc: "हाथ में पकड़ने योग्य हाई-बीम" },
  "search light": { name: "सर्च लाइट", desc: "लंबी दूरी के ऑप्टिक्स" },
  rechargeable: { name: "रिचार्जेबल", desc: "लिथियम बैटरी बैकअप पावर" },
};

const CATEGORY_DESC_MAP_HI = {
  "handheld high-beam": "हाथ में पकड़ने योग्य हाई-बीम",
  "long-range optics": "लंबी दूरी के ऑप्टिक्स",
  "lithium backup power": "लिथियम बैटरी बैकअप पावर",
  "complete lineup": "संपूर्ण उत्पाद श्रृंखला",
  "professional illumination": "प्रोफेशनल प्रकाश उपकरण",
  "handheld high-beam led torches for everyday, industrial, and outdoor tasks.":
    "दैनिक, औद्योगिक और आउटडोर कार्यों के लिए हैंडहेल्ड हाई-बीम LED टॉर्च।",
  "long-range focused optics for security, agriculture, and night patrol.":
    "सुरक्षा, कृषि और रात्रि गश्त के लिए लंबी दूरी के केंद्रित ऑप्टिक्स।",
  "high-capacity lithium backup lighting with type-c and usb fast charging.":
    "Type-C और USB फास्ट चार्जिंग के साथ उच्च क्षमता वाली लिथियम बैकअप लाइटिंग।",
};

const BADGE_MAP_HI = {
  "best seller": "बेस्ट सेलर",
  new: "नया",
  featured: "प्रमुख",
  popular: "लोकप्रिय",
  limited: "सीमित स्टॉक",
  "top rated": "शीर्ष रेटेड",
};

const PRODUCT_DESC_BY_SLUG_HI = {
  eagle:
    "लंबी दूरी के फोकस, आपातकालीन उपयोग और औद्योगिक अनुप्रयोगों के लिए डिज़ाइन की गई हाई-पावर प्रोफेशनल रिचार्जेबल सर्च लाइट। इसमें 50W LED चिप और पारदर्शी Fresnel लेंस दिया गया है।",
  everest:
    "लंबी दूरी की दृश्यता, आपातकालीन स्थितियों और प्रोफेशनल उपयोग के लिए बहु-उपयोगी हाई-पावर रिचार्जेबल सर्चलाइट। इसमें 55W पावर आउटपुट और विशाल 10000mAh बैटरी दी गई है।",
  tiger:
    "दैनिक उपयोग, आपातकालीन प्रकाश और प्रोफेशनल ड्यूटी के लिए निर्मित उच्च गुणवत्ता वाली रिचार्जेबल एल्युमीनियम फ्लैशलाइट। यह प्रामाणिक USA-निर्मित CREE LED से सुसज्जित है।",
  sniper:
    "लंबी दूरी के फोकस, आउटडोर उपयोग, आपातकालीन रोशनी और प्रोफेशनल जरूरतों के लिए हाई-पावर रिचार्जेबल एल्युमीनियम टॉर्च। इसमें डुअल 18650 बैटरी पावर की सुविधा है।",
};

const SHORT_SPEC_BY_SLUG_HI = {
  eagle: "50W LED · Type-C",
  everest: "55W LED · 10,000mAh",
  tiger: "500 ल्यूमेन · 4000mAh",
  sniper: "1000 ल्यूमेन · ज़ूम",
};

const SPEC_LABEL_MAP_HI = {
  "led emitter": "LED एमिटर",
  "beam optics": "बीम ऑप्टिक्स",
  "zoom system": "ज़ूम सिस्टम",
  "optic lens": "ऑप्टिक लेंस",
  "light color filters": "लाइट कलर फ़िल्टर",
  "emergency modes": "आपातकालीन मोड",
  "battery cell": "बैटरी सेल",
  "charging & output": "चार्जिंग और आउटपुट",
  "chassis material": "बॉडी सामग्री",
  "power output": "पावर आउटपुट",
  "battery capacity": "बैटरी क्षमता",
  "charging input": "चार्जिंग इनपुट",
  "power bank output": "पावर बैंक आउटपुट",
  "switch design": "स्विच डिज़ाइन",
  "lighting array": "लाइटिंग सिस्टम",
  "recommended use": "अनुशंसित उपयोग",
  "driver technology": "ड्राइवर तकनीक",
  "peak output": "अधिकतम प्रकाश",
  "charging port": "चार्जिंग पोर्ट",
  "internal battery": "आंतरिक बैटरी",
  "runtime / backup": "बैटरी बैकअप समय",
  "chassis build": "बॉडी बनावट",
  "overall length": "कुल लंबाई",
  "switch modes": "स्विच मोड",
  "hardware warranty": "हार्डवेयर वारंटी",
  brightness: "चमक (ब्राइटनेस)",
  "battery system": "बैटरी सिस्टम",
  "charging support": "चार्जिंग सपोर्ट",
  "zoom mechanism": "ज़ूम मैकेनिज़्म",
  "tactical modes": "टैक्टिकल मोड",
  "body construction": "बॉडी निर्माण",
  "working backup": "कार्यशील बैकअप",
  warranty: "वारंटी",
};

const SPEC_VALUE_MAP_HI = {
  "50w high power led chip": "50W हाई पावर LED चिप",
  "long-range focused throw": "लंबी दूरी का केंद्रित प्रकाश थ्रो",
  "zoom-in / zoom-out (flood & focus light)": "ज़ूम-इन / ज़ूम-आउट (फ्लड और फोकस लाइट)",
  "high-transmittance fresnel lens": "उच्च-पारदर्शिता Fresnel लेंस",
  "white, blue, green, red": "सफेद, नीला, हरा, लाल",
  "high / medium / strobe / sos function": "हाई / मीडियम / स्ट्रोब / SOS फंक्शन",
  "rechargeable high-capacity lithium-ion": "रिचार्जेबल उच्च-क्षमता लिथियम-आयन",
  "type-c fast input with power bank usb output": "Type-C तेज़ इनपुट और पावर बैंक USB आउटपुट",
  "aircraft-grade hard-anodized aluminium alloy": "एयरक्राफ्ट-ग्रेड हार्ड-एनोडाइज़्ड एल्युमीनियम अलॉय",
  "55 watts high power led": "55 वॉट हाई पावर LED",
  "10000 mah lithium-ion rechargeable": "10000 mAh लिथियम-आयन रिचार्जेबल",
  "type-c fast input charging": "Type-C तेज़ इनपुट चार्जिंग",
  "usb output to charge smartphones & devices": "स्मार्टफोन और उपकरण चार्ज करने के लिए USB आउटपुट",
  "dual tactical switch system": "डुअल टैक्टिकल स्विच सिस्टम",
  "main forward beam + side work light + tail warning light":
    "मुख्य फ्रंट बीम + साइड वर्क लाइट + टेल वार्निंग लाइट",
  "emergency, outdoor trekking, security & industrial":
    "आपातकाल, आउटडोर ट्रेकिंग, सुरक्षा और औद्योगिक उपयोग",
  "cree led (made in usa)": "CREE LED (USA निर्मित)",
  "german regulated constant-current technology": "जर्मन रेगुलेटेड कॉन्स्टेंट-करंट तकनीक",
  "500 lumens": "500 ल्यूमेन",
  "usb type-c": "USB Type-C",
  "4000 mah lithium-ion (3.7v)": "4000 mAh लिथियम-आयन (3.7V)",
  "up to 8 hours (~300 minutes continuous)": "8 घंटे तक (~300 मिनट निरंतर)",
  "heavy-duty machined aluminium alloy": "हैवी-ड्यूटी मशीन्ड एल्युमीनियम अलॉय",
  "10.5 inches": "10.5 इंच",
  "low / medium / high / flickering / off": "लो / मीडियम / हाई / फ्लिकरिंग / ऑफ",
  "1 year official guarantee": "1 वर्ष की आधिकारिक गारंटी",
  "german engineering architecture": "जर्मन इंजीनियरिंग आर्किटेक्चर",
  "1000 lumens peak output": "1000 ल्यूमेन अधिकतम आउटपुट",
  "2 × 18650 high-drain lithium-ion cells": "2 × 18650 हाई-ड्रेन लिथियम-आयन सेल",
  "usb fast charging interface": "USB फास्ट चार्जिंग इंटरफेस",
  "telescopic zoom in / zoom out (flood & focus)": "टेलीस्कोपिक ज़ूम इन / ज़ूम आउट (फ्लड और फोकस)",
  "high / medium / low / strobe / sos": "हाई / मीडियम / लो / स्ट्रोब / SOS",
  "anodized aerospace aluminium": "एनोडाइज़्ड एयरोस्पेस एल्युमीनियम",
  "up to 6–8 hours operating life": "6–8 घंटे तक का कार्यकाल",
  "1 year hardware warranty": "1 वर्ष की हार्डवेयर वारंटी",
};

const BRAND_TAGLINE_HI = {
  gunlite: "कोयंबटूर से प्रोफेशनल LED टॉर्च और सर्च लाइट्स।",
};

const BRAND_DESC_HI = {
  gunlite:
    "Jerone Enterprises द्वारा इंजीनियर की गई प्रमुख हाई-पावर रिचार्जेबल LED टॉर्च और पोर्टेबल सर्चलाइट्स।",
};

const WARRANTY_LABEL_HI = {
  "1-year warranty": "1-वर्ष की वारंटी",
  "1-year hardware warranty": "1-वर्ष की हार्डवेयर वारंटी",
};

export function getLocalizedProductTitle(product, language, { stripGunlite = false } = {}) {
  if (!product) return "";
  const rawEn = product.title || product.name || "";
  const rawHi = product.nameHi || product.titleHi || "";
  const chosen = language === "hi" && String(rawHi).trim() ? String(rawHi).trim() : rawEn;
  if (stripGunlite) {
    const stripped = chosen.replace(/\s*GunLite\s*/gi, "").trim();
    return stripped || chosen;
  }
  return chosen;
}

export function translateCategoryName(catOrName, language) {
  if (!catOrName) return "";
  if (typeof catOrName === "object") {
    if (language === "hi" && String(catOrName.nameHi || "").trim()) {
      return String(catOrName.nameHi).trim();
    }
    const baseName = catOrName.name || "";
    if (language !== "hi") return baseName;
    const key = String(baseName).trim().toLowerCase();
    return CATEGORY_MAP_HI[key]?.name || baseName;
  }
  if (language !== "hi") return catOrName;
  const key = String(catOrName).trim().toLowerCase();
  return CATEGORY_MAP_HI[key]?.name || catOrName;
}

export function translateCategoryDescription(catOrDesc, fallbackDescOrLang, maybeLang) {
  const hasExplicitFallback = typeof maybeLang === "string";
  const language = hasExplicitFallback ? maybeLang : fallbackDescOrLang;
  const fallbackDesc = hasExplicitFallback ? fallbackDescOrLang : "";

  if (!catOrDesc) return fallbackDesc || "";
  if (typeof catOrDesc === "object") {
    if (language === "hi" && String(catOrDesc.descriptionHi || "").trim()) {
      return String(catOrDesc.descriptionHi).trim();
    }
    const rawDesc = catOrDesc.description || fallbackDesc || "";
    if (language !== "hi") return rawDesc;
    const descKey = String(rawDesc).trim().toLowerCase();
    const nameKey = String(catOrDesc.name || "").trim().toLowerCase();
    return CATEGORY_DESC_MAP_HI[descKey] || CATEGORY_MAP_HI[nameKey]?.desc || rawDesc;
  }
  if (language !== "hi") return catOrDesc;
  const key = String(catOrDesc).trim().toLowerCase();
  return CATEGORY_DESC_MAP_HI[key] || CATEGORY_MAP_HI[key]?.desc || catOrDesc;
}

export function translateBadge(badgeOrProduct, language) {
  if (!badgeOrProduct) return "";
  if (typeof badgeOrProduct === "object") {
    if (language === "hi" && String(badgeOrProduct.badgeHi || "").trim()) {
      return String(badgeOrProduct.badgeHi).trim();
    }
    const raw = badgeOrProduct.badge || "";
    if (language !== "hi" || !raw) return raw;
    return BADGE_MAP_HI[String(raw).trim().toLowerCase()] || raw;
  }
  if (language !== "hi") return badgeOrProduct;
  const key = String(badgeOrProduct).trim().toLowerCase();
  return BADGE_MAP_HI[key] || badgeOrProduct;
}

export function translateWarrantyLabel(labelOrProduct, language) {
  if (!labelOrProduct) return "";
  if (typeof labelOrProduct === "object") {
    if (language === "hi" && String(labelOrProduct.warrantyLabelHi || "").trim()) {
      return String(labelOrProduct.warrantyLabelHi).trim();
    }
    const raw = labelOrProduct.warrantyLabel || "1-Year Warranty";
    if (language !== "hi") return raw;
    return WARRANTY_LABEL_HI[String(raw).trim().toLowerCase()] || raw;
  }
  if (language !== "hi") return labelOrProduct;
  const key = String(labelOrProduct).trim().toLowerCase();
  return WARRANTY_LABEL_HI[key] || labelOrProduct;
}

export function translateBrandTagline(brand, language) {
  if (!brand) return "";
  if (language === "hi") {
    if (String(brand.taglineHi || "").trim()) return String(brand.taglineHi).trim();
    if (String(brand.descriptionHi || "").trim()) return String(brand.descriptionHi).trim();
    const slug = String(brand.slug || "").trim().toLowerCase();
    if (BRAND_TAGLINE_HI[slug]) return BRAND_TAGLINE_HI[slug];
    if (brand.tagline === "Professional LED torches and search lights from Coimbatore.") {
      return BRAND_TAGLINE_HI.gunlite;
    }
    return brand.tagline || BRAND_DESC_HI[slug] || brand.description || "";
  }
  return brand.tagline || brand.description || "";
}

export function translateProductDescription(product, language) {
  if (!product) return "";
  const rawEn = product.desc || product.description || "";
  if (language !== "hi") return rawEn;
  const rawHi = product.descHi || product.descriptionHi || "";
  if (String(rawHi).trim()) return String(rawHi).trim();
  const slug = String(product.slug || product.id || "").trim().toLowerCase();
  if (PRODUCT_DESC_BY_SLUG_HI[slug]) {
    return PRODUCT_DESC_BY_SLUG_HI[slug];
  }
  return rawEn;
}

export function translateShortSpec(product, fallbackSpec, language) {
  if (language !== "hi") return product?.shortSpec || fallbackSpec || "";
  if (String(product?.shortSpecHi || "").trim()) {
    return String(product.shortSpecHi).trim();
  }
  const slug = String(product?.slug || product?.id || "").trim().toLowerCase();
  if (SHORT_SPEC_BY_SLUG_HI[slug]) return SHORT_SPEC_BY_SLUG_HI[slug];
  const src = product?.shortSpec || fallbackSpec;
  if (!src) return "हाई-पावर LED";
  return String(src)
    .replace(/\bLumens\b/gi, "ल्यूमेन")
    .replace(/\bLm\b/g, "ल्यूमेन")
    .replace(/\bZoom\b/gi, "ज़ूम")
    .replace(/\bHigh-Power LED\b/gi, "हाई-पावर LED");
}

export function translateSpecItem(item, language) {
  if (language !== "hi") return item;
  if (typeof item === "string") {
    const valKey = item.trim().toLowerCase();
    return SPEC_VALUE_MAP_HI[valKey] || item;
  }
  const rawLabel = item.label || item.key || "";
  const rawValue = item.value || item.desc || "";
  const rawLabelHi = String(item.labelHi || "").trim();
  const rawValueHi = String(item.valueHi || "").trim();
  const labelKey = String(rawLabel).trim().toLowerCase();
  const valueKey = String(rawValue).trim().toLowerCase();

  return {
    ...item,
    label: rawLabelHi || SPEC_LABEL_MAP_HI[labelKey] || rawLabel,
    value: rawValueHi || SPEC_VALUE_MAP_HI[valueKey] || rawValue,
  };
}

export function getLocalizedVideoTitle(video, language, fallback = "") {
  if (!video) return fallback;
  if (language === "hi" && String(video.titleHi || "").trim()) {
    return String(video.titleHi).trim();
  }
  return video.title || fallback;
}

export function getLocalizedVideoDescription(video, language) {
  if (!video) return "";
  if (language === "hi" && String(video.descriptionHi || "").trim()) {
    return String(video.descriptionHi).trim();
  }
  return video.description || "";
}

export function formatLocalizedPrice(priceStr, t) {
  if (!priceStr || priceStr === "On Request") {
    return t("common.onRequest");
  }
  return priceStr;
}
