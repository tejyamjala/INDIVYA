import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Compass, MapPin, Search, Sparkles, Sun, Waves } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DestinationCard } from "../components/DestinationCard";
import { destinations, featuredDestinations, pilgrimageDestinations } from "../data/destinations";
import { fetchDelhiWeather } from "../lib/weather";
import { setPageMeta } from "../lib/meta";
import { useAppContext } from "../context";
import { tr } from "../lib/i18n";
import { localizeDestination } from "../lib/localize";


const moods = [
  { label: "Mountain air", detail: "High passes & pine mornings", category: "Mountains", icon: "△", color: "#e4eee8" },
  { label: "Salt & sunlight", detail: "A slower sort of coast", category: "Beaches", icon: "≈", color: "#e4efed" },
  { label: "Stories in stone", detail: "Heritage with a heartbeat", category: "Heritage", icon: "◌", color: "#f4e9dc" },
  { label: "A quieter path", detail: "Sacred places & stillness", category: "Pilgrim", icon: "✳", color: "#eee9dd" },
];

export function DiscoverPage() {
  const { profile, language } = useAppContext();
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState<number | null>(null);
  const navigate = useNavigate();
  const firstName = profile.display_name.split(" ")[0] || tr("Traveller");

  useEffect(() => {
    setPageMeta("Discover India — India Tourism", "A slower, more personal way to find your next somewhere in India.");
    const controller = new AbortController();
    void fetchDelhiWeather(controller.signal).then(setWeather).catch(() => setWeather(null));
    return () => controller.abort();
  }, [language]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = search.trim();
    navigate(value ? `/explore?search=${encodeURIComponent(value)}` : "/explore");
  }

  const heroSource = destinations.find((item) => item.id === "leh-ladakh") ?? destinations[0];
  const hero = localizeDestination(heroSource);
  const inspiration = featuredDestinations.filter((item) => item.id !== heroSource.id).slice(0, 4);

  return (
    <div className="discover-page page-enter">
      <section className="welcome-row">
        <div><div className="eyebrow"><span className="eyebrow-line" /> {tr("A JOURNEY IN EVERY DIRECTION")}</div><h1>{tr("Good to have you here,")}{" "}<em>{firstName}{tr(".")}</em></h1><p>{tr("India is vast. Your next somewhere can start small.")}</p></div>
        <div className="welcome-weather"><span className="weather-icon"><Sun size={18} /></span><div><small>{tr("New Delhi, right now")}</small><strong>{weather === null ? tr("A little unknown") : tr("{{0}}° · Clear skies", { "0": (weather) })}</strong></div><span className="weather-divider" /><span className="local-date">{tr("Take it slow")}</span></div>
      </section>

      <section className="discover-hero" style={{ backgroundImage: `url("${hero.image}")` }}>
        <div className="discover-hero-shade" />
        <div className="discover-hero-content">
          <div className="hero-kicker"><span className="hero-kicker-dot" /> {tr("THE LONG WAY NORTH")}</div>
          <h2>{tr("Somewhere")}<br /><em>{tr("above the clouds.")}</em></h2>
          <p>{tr("High passes, still lakes and ancient monasteries. Give Ladakh time to meet you.")}</p>
          <div className="hero-actions"><Link className="button button-light" to={`/destination/${hero.id}`}>{tr("Explore")}{" "}{hero.name}<ArrowRight size={17} /></Link><span className="hero-duration"><MapPin size={14} /> {hero.duration}</span></div>
        </div>
        <div className="discover-hero-caption"><span>{tr("34°09′ N &nbsp; 77°34′ E")}</span><span>{tr("PHOTO JOURNAL &nbsp; 01 / 04")}</span></div>
      </section>

      <section className="search-strip">
        <div className="search-strip-copy"><span className="search-strip-mark"><Compass size={19} /></span><div><strong>{tr("Have a feeling in mind?")}</strong><span>{tr("Let’s find the place that fits.")}</span></div></div>
        <form className="home-search" onSubmit={handleSearch}><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={tr("Search places, states, experiences")} aria-label={tr("Search destinations")} /><button type="submit" aria-label={tr("Search")}><ArrowRight size={18} /></button></form>
        <Link to="/explore" className="search-all-link">{tr("All places")}{" "}<ArrowUpRight size={15} /></Link>
      </section>

      <section className="mood-section section-spacing">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> {tr("BEGIN WITH A FEELING")}</div><h2>{tr("What are you")}{" "}<em>{tr("longing for?")}</em></h2></div><p>{tr("Not sure where to go? Start with")}<br />{tr("the kind of day you want to have.")}</p></div>
        <div className="mood-list">
          {moods.map((mood, index) => <Link key={mood.category} to={mood.category === "Pilgrim" ? "/pilgrims" : `/explore?category=${encodeURIComponent(mood.category)}`} className="mood-card" style={{ backgroundColor: mood.color }}><span className="mood-symbol">{mood.icon}</span><span className="mood-copy"><strong>{tr(mood.label)}</strong><small>{tr(mood.detail)}</small></span><span className="mood-index">{String(index + 1).padStart(2, "0")}</span><ArrowUpRight size={17} className="mood-arrow" /></Link>)}
        </div>
      </section>

      <section className="section-spacing inspiration-section">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> {tr("LITTLE PLACES, BIG FEELINGS")}</div><h2>{tr("Worth taking")}{" "}<em>{tr("the long way.")}</em></h2></div><Link className="section-link" to="/explore">{tr("Meet all")}{" "}{destinations.length} {tr("places")}{" "}<ArrowRight size={16} /></Link></div>
        <div className="destination-grid">{inspiration.map((item, index) => <DestinationCard key={item.id} destination={item} index={index} />)}</div>
      </section>

      <section className="pilgrim-feature section-spacing">
        <div className="pilgrim-feature-art"><span className="pilgrim-art-ring ring-one" /><span className="pilgrim-art-ring ring-two" /><span className="pilgrim-art-symbol">{tr("ॐ")}</span><span className="pilgrim-art-caption">{tr("A quiet moment on the way.")}</span></div>
        <div className="pilgrim-feature-copy"><div className="eyebrow"><span className="eyebrow-line" /> {tr("SACRED JOURNEYS")}</div><h2>{tr("Some roads")}<br />{tr("lead")}{" "}<em>{tr("inward.")}</em></h2><p>{tr("From Himalayan shrines to ancient river cities, find a pilgrimage that moves at your own pace.")}</p><div className="pilgrim-feature-stats"><span><strong>{pilgrimageDestinations.length}</strong><small>{tr("places of devotion")}</small></span><span><strong>{tr("4")}</strong><small>{tr("corners of India")}</small></span></div><Link className="button button-dark" to="/pilgrims">{tr("Explore sacred India")}{" "}<ArrowRight size={17} /></Link></div>
      </section>

      <section className="planner-banner section-spacing"><div className="planner-banner-icon"><Waves size={25} /></div><div><div className="eyebrow">{tr("A TRIP THAT FEELS LIKE YOU")}</div><h2>{tr("Let a good idea become")}{" "}<em>{tr("a real plan.")}</em></h2><p>{tr("Choose your days, your pace, your kind of somewhere. We’ll give you a first draft.")}</p></div><Link to="/planner" className="button button-outline">{tr("Open trip planner")}{" "}<ArrowRight size={17} /></Link><Sparkles className="planner-banner-spark" size={29} /></section>

      <section className="home-outro"><span className="outro-star">{tr("✳")}</span><p>{tr("India won’t fit in one trip.")}<br /><em>{tr("That’s the lovely part.")}</em></p><Link to="/explore">{tr("Find your first somewhere")}{" "}<ArrowUpRight size={15} /></Link></section>
    </div>
  );
}
