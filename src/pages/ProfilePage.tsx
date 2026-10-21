import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Check, Globe2, LogOut, Save, Sparkles, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context";
import { setPageMeta } from "../lib/meta";
import { supabase } from "../lib/supabase";
import type { Language, TravelPreferences } from "../types";
import { tr } from "../lib/i18n";


const languageOptions: { value: Language; native: string; english: string }[] = [
  { value: "en", native: "English", english: "English" }, { value: "hi", native: "हिन्दी", english: "Hindi" }, { value: "te", native: "తెలుగు", english: "Telugu" }, { value: "ta", native: "தமிழ்", english: "Tamil" },
  { value: "kn", native: "ಕನ್ನಡ", english: "Kannada" }, { value: "ml", native: "മലയാളം", english: "Malayalam" }, { value: "bn", native: "বাংলা", english: "Bengali" }, { value: "mr", native: "मराठी", english: "Marathi" },
];
const preferenceCopy: Record<keyof TravelPreferences, { title: string; detail: string }> = {
  slowTravel: { title: "A little more breathing room", detail: "Fewer stops, more time to settle in." },
  culture: { title: "Local stories & living culture", detail: "Craft, heritage, music and everyday life." },
  adventure: { title: "A touch of adventure", detail: "Trails, water and the occasional long way round." },
  food: { title: "A trip around the table", detail: "Regional flavours, market walks and chai breaks." },
};

export function ProfilePage() {
  const { session, profile, language, setLanguage, preferences, updatePreferences, updateProfile, wishlist, trip, setStatusMessage } = useAppContext();
  const [name, setName] = useState(profile.display_name);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setName(profile.display_name); }, [profile.display_name]);
  useEffect(() => { setPageMeta("Your travel profile — India Tourism", "Your India, your preferences, your saved places."); }, [language]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const synced = await updateProfile(name);
      if (synced) setStatusMessage("Your profile is up to date.");
    } finally { setSaving(false); }
  }

  function togglePreference(key: keyof TravelPreferences) {
    const next = { ...preferences, [key]: !preferences[key] };
    updatePreferences(next);
    setStatusMessage("Your travel preferences have been saved on this device.");
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) return setStatusMessage("We couldn’t sign you out just now. Please try again.");
      navigate("/signin", { replace: true });
    } catch {
      setStatusMessage("We couldn’t reach the account service. Please try signing out again.");
    }
  }

  const plannedPlaces = trip.destinationIds.length;
  return (
    <div className="profile-page page-enter">
      <section className="profile-intro"><div className="eyebrow"><span className="eyebrow-line" /> {tr("THE TRAVELLER, NOT THE CHECKLIST")}</div><h1>{tr("Your India,")}{" "}<em>{tr("your way.")}</em></h1><p>{tr("A few details help us make room for the sort of trip that feels like you.")}</p></section>
      <div className="profile-layout">
        <aside className="profile-summary-card"><div className="profile-summary-avatar">{(profile.display_name || "T").slice(0, 1).toUpperCase()}</div><span className="profile-summary-label">{tr("YOUR TRAVELLER PROFILE")}</span><h2>{profile.display_name || tr("Traveller")}</h2><p>{session.user.email ?? tr("Your places and plans live here.")}</p><div className="profile-stat-row"><div><strong>{wishlist.length}</strong><span>{tr("saved places")}</span></div><div><strong>{plannedPlaces}</strong><span>{tr("places in draft")}</span></div></div><div className="profile-summary-note"><Sparkles size={15} /><span>{tr("Every good trip starts with a little curiosity.")}</span></div></aside>
        <main className="profile-settings">
          <section className="profile-setting-card"><div className="setting-card-heading"><span className="setting-card-icon"><UserRound size={18} /></span><div><h2>{tr("A name to travel by")}</h2><p>{tr("We’ll use this to make your experience feel a little more personal.")}</p></div></div><form className="profile-name-form" onSubmit={save}><label className="field-label">{tr("Display name")}<span className="input-shell"><UserRound size={16} /><input value={name} onChange={(event) => setName(event.target.value)} required maxLength={60} /></span></label><button className="button button-primary" type="submit" disabled={saving}><Save size={16} /> {saving ? tr("Saving…") : tr("Save name")}</button></form></section>
          <section className="profile-setting-card"><div className="setting-card-heading"><span className="setting-card-icon"><Globe2 size={18} /></span><div><h2>{tr("Language of choice")}</h2><p>{tr("Some of India’s many voices, wherever feels like home.")}</p></div></div><label className="select-label">{tr("Preferred language")}<select value={language} onChange={(event) => setLanguage(event.target.value as Language)}>{languageOptions.map((option) => <option value={option.value} key={option.value}>{option.native} · {tr(option.english)}</option>)}</select></label></section>
          <section className="profile-setting-card"><div className="setting-card-heading"><span className="setting-card-icon"><Sparkles size={18} /></span><div><h2>{tr("What makes a trip yours?")}</h2><p>{tr("Your preferences stay on this device and can be changed whenever you like.")}</p></div></div><div className="preferences-list">{(Object.keys(preferenceCopy) as (keyof TravelPreferences)[]).map((key) => <button className={`preference-row ${preferences[key] ? "enabled" : ""}`} type="button" aria-pressed={preferences[key]} key={key} onClick={() => togglePreference(key)}><span className="preference-check">{preferences[key] && <Check size={15} />}</span><span><strong>{tr(preferenceCopy[key].title)}</strong><small>{tr(preferenceCopy[key].detail)}</small></span></button>)}</div></section>
          <section className="profile-bottom-actions"><Link to="/saved" className="button button-outline">{tr("Your saved places")}{" "}<ArrowRight size={16} /></Link><button type="button" className="button button-danger-outline" onClick={() => void signOut()}><LogOut size={16} /> {tr("Sign out")}</button></section>
          <p className="profile-data-note">{tr("Your sign-in and saved places are attached to your account. Trip drafts and preferences are saved locally on this device.")}</p>
        </main>
      </div>
    </div>
  );
}
