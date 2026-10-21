import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Mountain, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";

type Mode = "signin" | "signup" | "forgot";

type Props = {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (name: string, email: string, password: string) => Promise<void>;
  onRecover: (email: string) => Promise<void>;
  busy: boolean;
  error: string;
  message: string;
};

const backgroundVideo = "/manus-storage/india-tourism-mountains-to-beach_07f09fbf.mp4";
const poster = "https://images.pexels.com/photos/31838207/pexels-photo-31838207.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1900";

export function AuthPage({ onSignIn, onSignUp, onRecover, busy, error, message }: Props) {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMotionAllowed(!query.matches);
    const onChange = (event: MediaQueryListEvent) => setMotionAllowed(!event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "signin") await onSignIn(email.trim(), password);
    if (mode === "signup") await onSignUp(name.trim(), email.trim(), password);
    if (mode === "forgot") await onRecover(email.trim());
  }

  const title = mode === "signin" ? "Find your way back." : mode === "signup" ? "Your next chapter starts here." : "A fresh start is close.";
  const subtitle = mode === "signin"
    ? "Sign in to pick up where your curiosity left off."
    : mode === "signup"
      ? "Create a traveller account and keep your India close."
      : "We’ll send a secure link to reset your password.";

  return (
    <main className="auth-page">
      <div className="auth-backdrop" aria-hidden="true">
        {motionAllowed && <video className="auth-video" src={backgroundVideo} poster={poster} autoPlay muted playsInline />}
        {!motionAllowed && <img className="auth-poster" src={poster} alt="Clouds wrapping the Himalayan mountains" />}
        <div className="auth-scrim" />
      </div>

      <header className="auth-topbar">
        <a className="brand brand-light" href="/signin" aria-label="India Tourism home">
          <span className="brand-seal"><Mountain size={20} strokeWidth={1.8} /></span>
          <span className="brand-name">India <em>Tourism</em></span>
        </a>
        <div className="auth-top-note"><span className="live-dot" /> A journey in every direction</div>
      </header>

      <section className="auth-body">
        <div className="auth-story">
          <div className="eyebrow auth-eyebrow"><span className="eyebrow-line" /> THE ROAD IS YOURS</div>
          <h1>India, in all<br /><em>her many moods.</em></h1>
          <p>Find the quiet coast, the high pass, the temple bell at first light. Your next somewhere is waiting.</p>
          <div className="auth-story-foot"><span className="story-ornament" /> Made for the way you want to travel.</div>
        </div>

        <div className="auth-card-wrap">
          <div className="auth-card">
            <div className="auth-card-heading">
              <span className="auth-card-kicker">A LITTLE CLOSER TO INDIA</span>
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <label className="field-label">
                  Your name
                  <span className="input-shell"><Sparkles size={17} /><input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="What should we call you?" required /></span>
                </label>
              )}
              <label className="field-label">
                Email address
                <span className="input-shell"><Mail size={17} /><input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></span>
              </label>
              {mode !== "forgot" && (
                <label className="field-label">
                  Password
                  <span className="input-shell"><LockKeyhole size={17} /><input autoComplete={mode === "signup" ? "new-password" : "current-password"} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} placeholder="At least 6 characters" required /><button className="visibility-button" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
                </label>
              )}
              {mode === "signin" && <button className="text-button forgot-link" type="button" onClick={() => setMode("forgot")}>Forgot password?</button>}
              {error && <p className="form-message form-error" role="alert">{error}</p>}
              {message && <p className="form-message form-success" role="status">{message}</p>}
              <button className="button button-primary auth-submit" type="submit" disabled={busy}>
                <span>{busy ? "One moment…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}</span>
                {!busy && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="auth-card-switch">
              {mode === "signin" && <>New to the journey? <button className="text-button" type="button" onClick={() => setMode("signup")}>Create an account</button></>}
              {mode === "signup" && <>Already travelling with us? <button className="text-button" type="button" onClick={() => setMode("signin")}>Sign in</button></>}
              {mode === "forgot" && <>Remembered it? <button className="text-button" type="button" onClick={() => setMode("signin")}>Back to sign in</button></>}
            </div>
            <p className="auth-privacy">Your account keeps your saved places and trip ideas together.</p>
          </div>
          <div className="auth-card-caption"><span className="caption-mark">✳</span> Take the scenic route.</div>
        </div>
      </section>

      <footer className="auth-footer"><span>© India Tourism</span><span>From the mountains to the sea</span><span className="footer-dashes">— &nbsp; — &nbsp; —</span></footer>
    </main>
  );
}

export function ResetPasswordPage({ onComplete }: { onComplete: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password.length < 6) return setError("Choose a password with at least 6 characters.");
    if (password !== confirm) return setError("Those passwords don’t match yet.");
    setBusy(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) { setError("That reset link may have expired. Request a fresh link and try again."); return; }
      setDone(true);
    } catch {
      setError("We couldn’t update your password. Check your connection and try again.");
    } finally { setBusy(false); }
  }

  return (
    <main className="reset-page">
      <div className="reset-panel">
        <span className="brand-seal reset-seal"><Mountain size={20} /></span>
        <div className="eyebrow"><span className="eyebrow-line" /> ACCOUNT SECURITY</div>
        <h1>{done ? "All set." : "Choose a new password."}</h1>
        <p>{done ? "Your password has been updated. You can return to your journey." : "Pick something memorable to you and hard to guess."}</p>
        {done ? <button className="button button-primary" type="button" onClick={onComplete}>Continue to India <ArrowRight size={18} /></button> : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field-label">New password<span className="input-shell"><LockKeyhole size={17} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required /></span></label>
            <label className="field-label">Confirm password<span className="input-shell"><LockKeyhole size={17} /><input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} minLength={6} required /></span></label>
            {error && <p className="form-message form-error" role="alert">{error}</p>}
            <button className="button button-primary auth-submit" type="submit" disabled={busy}>{busy ? "Updating…" : "Update password"}<ArrowRight size={18} /></button>
          </form>
        )}
      </div>
    </main>
  );
}
