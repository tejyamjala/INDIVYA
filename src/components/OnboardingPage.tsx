import { ArrowRight, Globe2, Languages } from "lucide-react";
import { useAppContext } from "../context";
import type { Language } from "../types";
import { tr } from "../lib/i18n";


const languages: { code: Language; native: string; english: string; region: string }[] = [
  { code: "en", native: "English", english: "English", region: "Global" },
  { code: "hi", native: "हिन्दी", english: "Hindi", region: "North India" },
  { code: "te", native: "తెలుగు", english: "Telugu", region: "South India" },
  { code: "ta", native: "தமிழ்", english: "Tamil", region: "South India" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", region: "South India" },
  { code: "ml", native: "മലയാളം", english: "Malayalam", region: "South India" },
  { code: "bn", native: "বাংলা", english: "Bengali", region: "East India" },
  { code: "mr", native: "मराठी", english: "Marathi", region: "West India" },
];

export function OnboardingPage() {
  const { language, completeOnboarding } = useAppContext();
  return (
    <main className="onboarding-page">
      <div className="onboarding-intro">
        <div className="eyebrow"><span className="eyebrow-line" /> {tr("FIRST, A LITTLE CHOICE")}</div>
        <h1>{tr("How would you like")}<br />{tr("to")}{" "}<em>{tr("travel India?")}</em></h1>
        <p>{tr("Choose the language that feels most like home. You can change this any time in your profile.")}</p>
        <div className="onboarding-note"><Globe2 size={19} /><span>{tr("A country of many voices, ready to meet you in yours.")}</span></div>
      </div>
      <section className="language-panel" aria-labelledby="language-title">
        <div className="language-panel-heading"><div className="language-icon"><Languages size={20} /></div><div><h2 id="language-title">{tr("Choose your language")}</h2><p>{tr("Pick the one you’d like to see first.")}</p></div></div>
        <div className="language-grid">
          {languages.map((item) => (
            <button key={item.code} type="button" aria-pressed={language === item.code} className={`language-option ${language === item.code ? "selected" : ""}`} onClick={() => void completeOnboarding(item.code)}>
              <span className="language-native">{item.native}</span><span className="language-english">{tr(item.english)}</span><span className="language-region">{tr(item.region)}</span>
              {language === item.code && <span className="language-check">{tr("✓")}</span>}
            </button>
          ))}
        </div>
        <p className="language-panel-foot">{tr("Your saved places and plans stay right where you left them.")}</p>
        <button className="text-button onboarding-skip" type="button" onClick={() => void completeOnboarding(language)}>{tr("Keep English for now")}{" "}<ArrowRight size={15} /></button>
      </section>
      <div className="onboarding-wordmark"><span className="brand-seal"><Globe2 size={18} /></span><span>{tr("INDIA")}{" "}<em>{tr("TOURISM")}</em></span></div>
    </main>
  );
}
