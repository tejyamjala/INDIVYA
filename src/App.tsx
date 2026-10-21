import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { AppContext, type AppContextValue } from "./context";
import { AppShell } from "./components/AppShell";
import { AuthPage, ResetPasswordPage } from "./components/AuthPage";
import { OnboardingPage } from "./components/OnboardingPage";
import { CatalogPage } from "./pages/CatalogPage";
import { DestinationPage } from "./pages/DestinationPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { PlannerPage } from "./pages/PlannerPage";
import { ProfilePage } from "./pages/ProfilePage";
import { getProfile, getWishlist, saveProfile, setWishlistItem } from "./lib/data";
import { getTravelPreferences, getTripDraft, saveTravelPreferences, saveTripDraft } from "./lib/persistence";
import { supabase } from "./lib/supabase";
import { getLocaleTag, isLocaleLoaded, loadLocale, setActiveLanguage } from "./lib/i18n";
import type { Language, Profile, TravelPreferences, TripDraft } from "./types";


const emptyProfile: Profile = { id: "", display_name: "Traveller", onboarding_complete: false, language: "en" };
const localWishlistKey = (userId: string) => `india-tourism:wishlist:${userId}`;
const localProfileKey = (userId: string) => `india-tourism:profile:${userId}`;
const supportedLanguages: Language[] = ["en", "hi", "te", "ta", "kn", "ml", "bn", "mr"];

function isSupportedLanguage(value: unknown): value is Language {
  return typeof value === "string" && supportedLanguages.includes(value as Language);
}

function readLocalWishlist(userId: string): string[] {
  try { return JSON.parse(localStorage.getItem(localWishlistKey(userId)) ?? "[]") as string[]; } catch { return []; }
}
function writeLocalWishlist(userId: string, ids: string[]) {
  try { localStorage.setItem(localWishlistKey(userId), JSON.stringify(ids)); } catch { /* Keep the app usable when storage is unavailable. */ }
}
function readLocalProfile(userId: string): Partial<Profile> {
  try { return JSON.parse(localStorage.getItem(localProfileKey(userId)) ?? "{}"); } catch { return {}; }
}
function writeLocalProfile(userId: string, profile: Partial<Profile>) {
  try { localStorage.setItem(localProfileKey(userId), JSON.stringify(profile)); } catch { /* Keep the app usable when storage is unavailable. */ }
}

function LoadingScreen() {
  return <main className="loading-screen" aria-busy="true"><span className="loading-seal" aria-hidden="true">✳</span></main>;
}

function ProtectedArea({ session, profile, profileReady, value }: { session: Session | null; profile: Profile; profileReady: boolean; value: AppContextValue | null }) {
  const location = useLocation();
  if (!session) return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  if (!profileReady || !value) return <LoadingScreen />;
  const isOnboarding = location.pathname === "/onboarding";
  if (!profile.onboarding_complete && !isOnboarding) return <Navigate to="/onboarding" replace />;
  if (profile.onboarding_complete && isOnboarding) return <Navigate to="/discover" replace />;
  return <AppContext.Provider value={value}><Outlet /></AppContext.Provider>;
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [profileReady, setProfileReady] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [language, setLanguageState] = useState<Language>("en");
  const [preferences, setPreferences] = useState<TravelPreferences>({ slowTravel: true, culture: true, adventure: false, food: false });
  const [trip, setTrip] = useState<TripDraft>(getTripDraft("guest"));
  const [statusMessage, setStatusMessage] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [, forceLocaleRender] = useState(0);

  const displayLanguage = session && location.pathname !== "/signin" && location.pathname !== "/reset-password" ? language : "en";
  setActiveLanguage(displayLanguage);
  useEffect(() => {
    let active = true;
    document.documentElement.lang = getLocaleTag(displayLanguage);
    void loadLocale(displayLanguage).then(() => { if (active) forceLocaleRender((version) => version + 1); });
    return () => { active = false; };
  }, [displayLanguage]);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setAuthReady(true);
    }).catch(() => { if (active) setAuthReady(true); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setAuthReady(true);
      if (!nextSession) {
        setLanguageState("en");
        setActiveLanguage("en");
        setStatusMessage("");
        setAuthError("");
        setAuthMessage("");
      }
      if (event === "PASSWORD_RECOVERY") navigate("/reset-password", { replace: true });
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [navigate]);

  useEffect(() => {
    let active = true;
    const user = session?.user;
    if (!user) {
      setProfile(emptyProfile);
      setProfileReady(false);
      setWishlist([]);
      setLanguageState("en");
      setPreferences({ slowTravel: true, culture: true, adventure: false, food: false });
      setTrip(getTripDraft("guest"));
      setStatusMessage("");
      return () => { active = false; };
    }
    setProfileReady(false);
    setPreferences(getTravelPreferences(user.id));
    setTrip(getTripDraft(user.id));
    const localProfile = readLocalProfile(user.id);
    void Promise.all([getProfile(user.id), getWishlist(user.id)]).then(([profileResult, wishlistResult]) => {
      if (!active) return;
      const userName = user.user_metadata?.display_name ?? user.user_metadata?.name ?? user.email?.split("@")[0] ?? "Traveller";
      const cloudProfile = profileResult.profile;
      const localLanguage = isSupportedLanguage(localProfile.language) ? localProfile.language : undefined;
      const cloudLanguage = isSupportedLanguage(cloudProfile?.language) ? cloudProfile.language : undefined;
      const metadataLanguage = isSupportedLanguage(user.user_metadata?.preferred_language) ? user.user_metadata.preferred_language : undefined;
      const metadataOnboardingComplete = user.user_metadata?.onboarding_complete === true;
      const initialSignupProfile = metadataOnboardingComplete && cloudProfile?.onboarding_complete !== true;
      const merged: Profile = {
        id: user.id,
        display_name: cloudProfile?.display_name ?? localProfile.display_name ?? userName,
        onboarding_complete: initialSignupProfile ? true : cloudProfile?.onboarding_complete ?? localProfile.onboarding_complete ?? metadataOnboardingComplete,
        language: initialSignupProfile ? metadataLanguage ?? cloudLanguage ?? localLanguage ?? "en" : cloudLanguage ?? metadataLanguage ?? localLanguage ?? "en",
      };
      setProfile(merged);
      setLanguageState(merged.language);
      writeLocalProfile(user.id, merged);
      if (!profileResult.error && (!cloudProfile || initialSignupProfile) && (metadataLanguage || metadataOnboardingComplete)) {
        void saveProfile(user.id, merged.display_name, merged.language, merged.onboarding_complete).catch(() => undefined);
      }
      if (profileResult.error || wishlistResult.error) {
        setStatusMessage("Your account is active. Some details are being kept on this device until sync is available.");
      }
      const savedIds = wishlistResult.error ? readLocalWishlist(user.id) : wishlistResult.ids;
      setWishlist(savedIds);
      if (!wishlistResult.error) writeLocalWishlist(user.id, savedIds);
      setProfileReady(true);
    }).catch(() => {
      if (!active) return;
      const userName = user.user_metadata?.display_name ?? user.user_metadata?.name ?? user.email?.split("@")[0] ?? "Traveller";
      const metadataLanguage = isSupportedLanguage(user.user_metadata?.preferred_language) ? user.user_metadata.preferred_language : undefined;
      const localLanguage = isSupportedLanguage(localProfile.language) ? localProfile.language : undefined;
      const merged: Profile = {
        ...emptyProfile,
        ...localProfile,
        id: user.id,
        display_name: localProfile.display_name ?? userName,
        onboarding_complete: localProfile.onboarding_complete ?? user.user_metadata?.onboarding_complete === true,
        language: metadataLanguage ?? localLanguage ?? "en",
      };
      setProfile(merged);
      setLanguageState(merged.language);
      writeLocalProfile(user.id, merged);
      setWishlist(readLocalWishlist(user.id));
      setStatusMessage("Your account is active. Some details are being kept on this device until sync is available.");
      setProfileReady(true);
    });
    return () => { active = false; };
  }, [session?.user.id]);

  const userId = session?.user.id ?? "";
  const updateProfile = useCallback(async (name: string) => {
    if (!userId) return false;
    const next = { ...profile, id: userId, display_name: name.trim() || "Traveller" };
    setProfile(next);
    writeLocalProfile(userId, next);
    try {
      const error = await saveProfile(userId, next.display_name, next.language, next.onboarding_complete);
      if (error) { setStatusMessage("Your name is saved on this device; cloud profile sync is unavailable right now."); return false; }
      return true;
    } catch {
      setStatusMessage("Your name is saved on this device; cloud profile sync is unavailable right now.");
      return false;
    }
  }, [profile, userId]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setStatusMessage("");
    setAuthError("");
    setAuthMessage("");
    setLanguageState(nextLanguage);
    setActiveLanguage(nextLanguage);
    if (!userId) return;
    const next = { ...profile, language: nextLanguage };
    setProfile(next);
    writeLocalProfile(userId, next);
    void saveProfile(userId, next.display_name, nextLanguage, next.onboarding_complete)
      .then((error) => { if (error) setStatusMessage("Language saved on this device; cloud profile sync is unavailable right now."); })
      .catch(() => setStatusMessage("Language saved on this device; cloud profile sync is unavailable right now."));
  }, [profile, setStatusMessage, userId]);

  const completeOnboarding = useCallback(async (nextLanguage: Language) => {
    if (!userId) return;
    setLanguageState(nextLanguage);
    setActiveLanguage(nextLanguage);
    const next = { ...profile, id: userId, language: nextLanguage, onboarding_complete: true };
    setProfile(next);
    writeLocalProfile(userId, next);
    try {
      const error = await saveProfile(userId, next.display_name, nextLanguage, true);
      if (error) setStatusMessage("Your language choice is saved on this device; cloud sync is unavailable right now.");
    } catch {
      setStatusMessage("Your language choice is saved on this device; cloud sync is unavailable right now.");
    }
    navigate("/discover", { replace: true });
  }, [navigate, profile, userId]);

  const updatePreferences = useCallback((next: TravelPreferences) => {
    if (!userId) return;
    setPreferences(next);
    saveTravelPreferences(userId, next);
  }, [userId]);

  const toggleWishlist = useCallback(async (destinationId: string) => {
    if (!userId) return;
    const alreadySaved = wishlist.includes(destinationId);
    const next = alreadySaved ? wishlist.filter((id) => id !== destinationId) : [...wishlist, destinationId];
    setWishlist(next);
    writeLocalWishlist(userId, next);
    let syncFailed = false;
    try { syncFailed = Boolean(await setWishlistItem(userId, destinationId, alreadySaved)); }
    catch { syncFailed = true; }
    if (syncFailed) setStatusMessage(alreadySaved ? "Place removed from this device’s saved list; cloud sync is unavailable." : "Place saved on this device; cloud sync is unavailable right now.");
    else setStatusMessage(alreadySaved ? "Removed from your saved places." : "Saved for another day.");
  }, [userId, wishlist]);

  const updateTrip = useCallback((next: TripDraft) => {
    setTrip(next);
    if (userId) saveTripDraft(userId, next);
  }, [userId]);

  const contextValue = useMemo<AppContextValue | null>(() => {
    if (!session) return null;
    return { session, profile, language, preferences, wishlist, trip, statusMessage, setStatusMessage, setLanguage, updateProfile, updatePreferences, toggleWishlist, updateTrip, completeOnboarding };
  }, [session, profile, language, preferences, wishlist, trip, statusMessage, setLanguage, updateProfile, updatePreferences, toggleWishlist, updateTrip, completeOnboarding]);

  async function signIn(email: string, password: string) {
    setAuthBusy(true); setAuthError(""); setAuthMessage("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setAuthError("We couldn’t sign you in with those details. Check them and try again."); return; }
      navigate("/discover", { replace: true });
    } catch {
      setAuthError("We couldn’t reach the sign-in service. Check your connection and try again.");
    } finally { setAuthBusy(false); }
  }

  async function signUp(name: string, email: string, password: string, preferredLanguage: Language) {
    setAuthBusy(true); setAuthError(""); setAuthMessage("");
    try {
      const userMetadata = { display_name: name, preferred_language: preferredLanguage, onboarding_complete: true };
      const options = { data: userMetadata, emailRedirectTo: `${window.location.origin}/signin` };
      let result = await supabase.auth.signUp({ email, password, options });
      if (result.error && /redirect|url.*allow|not allowed/i.test(result.error.message)) {
        result = await supabase.auth.signUp({ email, password, options: { data: userMetadata } });
      }
      if (result.error) {
        const reason = result.error.message.toLowerCase();
        if (/already|registered|exists/.test(reason)) setAuthError("That email already has an account. Try signing in or resetting the password.");
        else if (/signup.*disabled|signups? not allowed/.test(reason)) setAuthError("New account creation is currently disabled for this site. Contact the site owner.");
        else if (/rate limit|too many|security purposes/.test(reason)) setAuthError("Too many account attempts. Please wait a little and try again.");
        else if (/password|weak/.test(reason)) setAuthError("That password does not meet the account security requirements. Try a stronger password.");
        else if (/email|invalid/.test(reason)) setAuthError("Enter a valid email address and try again.");
        else setAuthError(`Account creation failed: ${result.error.message}`);
        return;
      }
      if (result.data.user && !result.data.session && result.data.user.identities?.length === 0) {
        setAuthError("That email already has an account. Try signing in or resetting the password.");
        return;
      }
      if (!result.data.user) {
        setAuthError("We could not confirm that your account was created. Please try again.");
        return;
      }
      if (result.data.session) navigate("/discover", { replace: true });
      else setAuthMessage("Check your inbox for a confirmation link, then come back here to sign in. If the link opens the original site, finish confirmation there first.");
    } catch {
      setAuthError("We couldn’t reach the account service. Check your connection and try again.");
    } finally { setAuthBusy(false); }
  }

  async function recover(email: string) {
    setAuthBusy(true); setAuthError(""); setAuthMessage("");
    try {
      let result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
      if (result.error && /redirect|url.*allow|not allowed/i.test(result.error.message)) result = await supabase.auth.resetPasswordForEmail(email);
      if (result.error) { setAuthError("We couldn’t send the reset link. Check the email address and try again."); return; }
      setAuthMessage("If that email is connected to an account, a reset link is on its way.");
    } catch {
      setAuthError("We couldn’t reach the account service. Check your connection and try again.");
    }
    finally { setAuthBusy(false); }
  }

  if (!authReady || !isLocaleLoaded(displayLanguage)) return <LoadingScreen />;
  const onboardingPath = profile.onboarding_complete ? "/discover" : "/onboarding";

  return (
    <Routes>
      <Route path="/signin" element={session ? <Navigate to={onboardingPath} replace /> : <AuthPage onSignIn={signIn} onSignUp={signUp} onRecover={recover} busy={authBusy} error={authError} message={authMessage} />} />
      <Route path="/reset-password" element={<ResetPasswordPage onComplete={() => navigate(session ? "/discover" : "/signin", { replace: true })} />} />
      <Route element={<ProtectedArea session={session} profile={profile} profileReady={profileReady} value={contextValue} />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<AppShell />}>
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/explore" element={<CatalogPage mode="explore" />} />
          <Route path="/pilgrims" element={<CatalogPage mode="pilgrims" />} />
          <Route path="/saved" element={<CatalogPage mode="saved" />} />
          <Route path="/destination/:slug" element={<DestinationPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to={session ? onboardingPath : "/signin"} replace />} />
      <Route path="*" element={<Navigate to={session ? onboardingPath : "/signin"} replace />} />
    </Routes>
  );
}
