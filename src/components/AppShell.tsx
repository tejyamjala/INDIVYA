import { useState } from "react";
import { Bookmark, Compass, Menu, Plane, Search, Sparkles, UserRound, X } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAppContext } from "../context";
import { t } from "../lib/i18n";
import { MiraAssistant } from "./MiraAssistant";

export function AppShell() {
  const { profile, language, statusMessage, setStatusMessage } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const items = [
    { to: "/discover", label: t(language, "discover"), icon: Compass },
    { to: "/explore", label: t(language, "explore"), icon: Search },
    { to: "/pilgrims", label: t(language, "pilgrims"), icon: Sparkles },
    { to: "/planner", label: t(language, "planner"), icon: Plane },
    { to: "/saved", label: t(language, "saved"), icon: Bookmark },
  ];
  const firstName = profile.display_name.split(" ")[0] || "Traveller";

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/discover" aria-label="India Tourism Discover">
          <span className="brand-seal"><Compass size={19} strokeWidth={1.8} /></span>
          <span className="brand-name">India <em>Tourism</em></span>
        </Link>
        <button className="mobile-menu-toggle" type="button" onClick={() => setMobileMenuOpen((value) => !value)} aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}>{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <nav className={`main-nav ${mobileMenuOpen ? "mobile-open" : ""}`} aria-label="Main navigation">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
              <Icon size={16} strokeWidth={1.8} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="profile-entry" to="/profile" aria-label={`${t(language, "profile")}: ${firstName}`}>
            <span className="profile-avatar">{firstName.slice(0, 1).toUpperCase()}</span><span className="profile-entry-name">{firstName}</span>
          </Link>
        </div>
      </header>
      <main className="main-content"><Outlet /></main>
      <footer className="site-footer"><span>India Tourism</span><span>Find your own way through India.</span><Link to="/profile"><UserRound size={14} /> {t(language, "profile")}</Link></footer>
      {statusMessage && <div className="status-toast" role="status"><span>{statusMessage}</span><button type="button" onClick={() => setStatusMessage("")} aria-label="Dismiss message"><X size={15} /></button></div>}
      <MiraAssistant />
    </div>
  );
}
