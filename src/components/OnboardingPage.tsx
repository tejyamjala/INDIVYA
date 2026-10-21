import { ArrowRight, Globe2, Languages } from "lucide-react";
import { useAppContext } from "../context";
import type { Language } from "../types";

const languages: { code: Language; native: string; english: string; region: string }[] = [
  { code: "en", native: "English", english: "English", region: "Global" },
  { code: "hi", native: "हिन्दी", english: "Hindi", region: "उत्तर भारत" },
  { code: "te", native: "తెలుగు", english: "Telugu", region: "దక్షిణ భారతదేశం" },
  { code: "ta", native: "தமிழ்", english: "Tamil", region: "தென் இந்தியா" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", region: "ದಕ್ಷಿಣ ಭಾರತ" },
  { code: "ml", native: "മലയാളം", english: "Malayalam", region: "കേരളം" },
  { code: "bn", native: "বাংলা", english: "Bengali", region: "পূর্ব ভারত" },
  { code: "mr", native: "मराठी", english: "Marathi", region: "पश्चिम भारत" },
];

export function OnboardingPage() {
  const { language, completeOnboarding } = useAppContext();
  return (
    <main className="onboarding-page">
      <div className="onboarding-intro">
        <div className="eyebrow"><span className="eyebrow-line" /> FIRST, A LITTLE CHOICE</div>
        <h1>How would you like<br />to <em>travel India?</em></h1>
        <p>Choose the language that feels most like home. You can change this any time in your profile.</p>
        <div className="onboarding-note"><Globe2 size={19} /><span>A country of many voices, ready to meet you in yours.</span></div>
      </div>
      <section className="language-panel" aria-labelledby="language-title">
        <div className="language-panel-heading"><div className="language-icon"><Languages size={20} /></div><div><h2 id="language-title">Choose your language</h2><p>Pick the one you’d like to see first.</p></div></div>
        <div className="language-grid">
          {languages.map((item) => (
            <button key={item.code} type="button" aria-pressed={language === item.code} className={`language-option ${language === item.code ? "selected" : ""}`} onClick={() => void completeOnboarding(item.code)}>
              <span className="language-native">{item.native}</span><span className="language-english">{item.english}</span><span className="language-region">{item.region}</span>
              {language === item.code && <span className="language-check">✓</span>}
            </button>
          ))}
        </div>
        <p className="language-panel-foot">Your saved places and plans stay right where you left them.</p>
        <button className="text-button onboarding-skip" type="button" onClick={() => void completeOnboarding(language)}>Keep English for now <ArrowRight size={15} /></button>
      </section>
      <div className="onboarding-wordmark"><span className="brand-seal"><Globe2 size={18} /></span><span>INDIA <em>TOURISM</em></span></div>
    </main>
  );
}
