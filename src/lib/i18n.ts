import type { Language } from "../types";

type CopyKey = "discover" | "explore" | "pilgrims" | "planner" | "saved" | "profile" | "search" | "save" | "planTrip" | "signOut";

const copy: Record<Language, Record<CopyKey, string>> = {
  en: { discover: "Discover", explore: "Explore", pilgrims: "Pilgrims", planner: "Trip planner", saved: "Saved", profile: "Profile", search: "Search places, states, experiences", save: "Save place", planTrip: "Plan a trip", signOut: "Sign out" },
  hi: { discover: "खोजें", explore: "घूमें", pilgrims: "तीर्थ", planner: "यात्रा योजना", saved: "सहेजे गए", profile: "प्रोफ़ाइल", search: "जगह, राज्य या अनुभव खोजें", save: "जगह सहेजें", planTrip: "यात्रा बनाएँ", signOut: "साइन आउट" },
  te: { discover: "కనుగొనండి", explore: "అన్వేషించండి", pilgrims: "పుణ్యక్షేత్రాలు", planner: "యాత్ర ప్రణాళిక", saved: "సేవ్ చేసినవి", profile: "ప్రొఫైల్", search: "ప్రదేశాలు, రాష్ట్రాలు, అనుభవాలు వెతకండి", save: "ప్రదేశాన్ని సేవ్ చేయండి", planTrip: "యాత్రను ప్లాన్ చేయండి", signOut: "సైన్ అవుట్" },
  ta: { discover: "கண்டறியுங்கள்", explore: "ஆராயுங்கள்", pilgrims: "புனிதத் தலங்கள்", planner: "பயணத் திட்டம்", saved: "சேமித்தவை", profile: "சுயவிவரம்", search: "இடங்கள், மாநிலங்கள், அனுபவங்களைத் தேடுங்கள்", save: "இடத்தைச் சேமிக்கவும்", planTrip: "பயணத்தைத் திட்டமிடு", signOut: "வெளியேறு" },
  kn: { discover: "ಕಂಡುಹಿಡಿಯಿರಿ", explore: "ಅನ್ವೇಷಿಸಿ", pilgrims: "ತೀರ್ಥಕ್ಷೇತ್ರಗಳು", planner: "ಪ್ರಯಾಣ ಯೋಜನೆ", saved: "ಉಳಿಸಿದವು", profile: "ಪ್ರೊಫೈಲ್", search: "ಸ್ಥಳ, ರಾಜ್ಯ, ಅನುಭವ ಹುಡುಕಿ", save: "ಸ್ಥಳ ಉಳಿಸಿ", planTrip: "ಪ್ರಯಾಣ ಯೋಜಿಸಿ", signOut: "ಸೈನ್ ಔಟ್" },
  ml: { discover: "കണ്ടെത്തൂ", explore: "പര്യവേക്ഷണം", pilgrims: "തീർത്ഥാടനങ്ങൾ", planner: "യാത്രാ പദ്ധതി", saved: "സേവ് ചെയ്തത്", profile: "പ്രൊഫൈൽ", search: "സ്ഥലങ്ങളും സംസ്ഥാനങ്ങളും അനുഭവങ്ങളും തിരയൂ", save: "സ്ഥലം സേവ് ചെയ്യൂ", planTrip: "യാത്ര പ്ലാൻ ചെയ്യൂ", signOut: "സൈൻ ഔട്ട്" },
  bn: { discover: "আবিষ্কার", explore: "ঘুরে দেখুন", pilgrims: "তীর্থস্থান", planner: "ভ্রমণ পরিকল্পনা", saved: "সংরক্ষিত", profile: "প্রোফাইল", search: "স্থান, রাজ্য, অভিজ্ঞতা খুঁজুন", save: "জায়গা সংরক্ষণ করুন", planTrip: "ভ্রমণ পরিকল্পনা করুন", signOut: "সাইন আউট" },
  mr: { discover: "शोधा", explore: "फिरा", pilgrims: "तीर्थक्षेत्रे", planner: "प्रवास नियोजन", saved: "जतन केलेले", profile: "प्रोफाइल", search: "ठिकाणे, राज्ये, अनुभव शोधा", save: "ठिकाण जतन करा", planTrip: "प्रवास आखा", signOut: "साइन आउट" },
};

export function t(language: Language, key: CopyKey): string {
  return copy[language]?.[key] ?? copy.en[key];
}
