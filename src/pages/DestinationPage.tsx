import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, CalendarDays, CloudSun, Compass, ExternalLink, ThermometerSun, Users } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { destinations } from "../data/destinations";
import { useAppContext } from "../context";
import { fetchCurrentWeather, type CurrentWeather } from "../lib/weather";
import { setPageMeta } from "../lib/meta";
import { DestinationCard } from "../components/DestinationCard";
import { tr } from "../lib/i18n";
import { localizeDestination } from "../lib/localize";

export function DestinationPage() {
  const { slug } = useParams();
  const destination = destinations.find((item) => item.id === slug);
  const { wishlist, toggleWishlist, updateTrip, trip, setStatusMessage, language } = useAppContext();
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [weatherUnavailable, setWeatherUnavailable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const item = destinations.find((entry) => entry.id === slug);
    if (!item) return;
    const display = localizeDestination(item);
    setPageMeta(`${display.name} — ${tr("India Tourism")}`, display.description);
    const controller = new AbortController();
    void fetchCurrentWeather(item.lat, item.lon, controller.signal)
      .then((value) => { setWeather(value); setWeatherUnavailable(false); })
      .catch(() => setWeatherUnavailable(true));
    return () => controller.abort();
  }, [slug, language]);

  if (!destination) return <div className="not-found"><Compass size={25} /><h1>{tr("That place is still a little off the map.")}</h1><p>{tr("Try another region or return to the destination collection.")}</p><Link className="button button-primary" to="/explore">{tr("Explore India")} <ArrowRight size={16} /></Link></div>;

  const display = localizeDestination(destination);
  const saved = wishlist.includes(destination.id);
  const related = destinations.filter((item) => item.id !== destination.id && item.region === destination.region).slice(0, 3);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${destination.lat},${destination.lon}`;
  const destinationId = destination.id;

  function addToTrip() {
    const destinationIds = trip.destinationIds.includes(destinationId) ? trip.destinationIds : [...trip.destinationIds, destinationId];
    updateTrip({ ...trip, destinationIds });
    setStatusMessage(tr("{{0}} is in your trip draft.", { "0": display.name }));
    navigate("/planner");
  }

  const seasonParts = display.season.split(" · ");
  return (
    <div className="destination-detail page-enter">
      <Link className="back-link" to="/explore"><ArrowLeft size={16} /> {tr("Back to all places")}</Link>
      <section className="destination-hero" style={{ backgroundImage: `url("${destination.image}")` }}>
        <div className="destination-hero-shade" />
        <div className="destination-hero-copy">
          <div className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> {display.region.toUpperCase()} {tr("·")} {display.state.toUpperCase()}</div>
          <h1>{display.name}</h1>
          <p>{display.description}</p>
          <div className="tag-row">{display.categories.map((category) => <span className="tag tag-light" key={category}>{category}</span>)}</div>
        </div>
        <button type="button" aria-pressed={saved} className={`detail-save ${saved ? "is-saved" : ""}`} onClick={() => void toggleWishlist(destination.id)}><Bookmark size={16} fill={saved ? "currentColor" : "none"} /> {saved ? tr("Saved") : tr("Save place")}</button>
        <span className="destination-hero-coordinate">{destination.lat.toFixed(2)}° N &nbsp; {destination.lon.toFixed(2)}° E</span>
      </section>

      <div className="destination-detail-grid">
        <main className="destination-main-column">
          <div className="destination-story-head"><span className="story-lead-mark">“</span><p>{display.description}</p><span className="story-signature">{tr("A NOTE FROM INDIA TOURISM")}</span></div>
          <section className="destination-highlights">
            <div className="eyebrow"><span className="eyebrow-line" /> {tr("A FEW GOOD PLACES TO BEGIN")}</div>
            <h2>{tr("Let the day")} <em>{tr("unfold.")}</em></h2>
            <div className="highlight-list">{display.highlights.map((highlight, index) => <div className="highlight-item" key={`${destination.id}-highlight-${index}`}><span className="highlight-index">{String(index + 1).padStart(2, "0")}</span><span>{highlight}</span><span className="highlight-rule" /></div>)}</div>
          </section>
          {related.length > 0 && <section className="related-section"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> {tr("NEARBY IN SPIRIT")}</div><h2>{tr("Stay in the")} <em>{tr("neighbourhood.")}</em></h2></div><Link className="section-link" to="/explore">{tr("All places")} <ArrowRight size={15} /></Link></div><div className="destination-grid related-grid">{related.map((item, index) => <DestinationCard key={item.id} destination={item} index={index} />)}</div></section>}
        </main>

        <aside className="destination-facts-panel">
          <div className="fact-card live-fact"><div className="fact-card-label"><CloudSun size={17} /> {tr("RIGHT NOW")}</div>{weather ? <><strong>{Math.round(weather.temperature)}° <small>{tr(weather.label)}</small></strong><p>{tr("Feels like")} {Math.round(weather.feelsLike)}° · {tr("Humidity")} {weather.humidity}%</p><span className="weather-wind">{tr("Wind")} {Math.round(weather.wind)} km/h · Open-Meteo</span></> : <><strong>{weatherUnavailable ? tr("A little unknown") : tr("Checking the sky…")}</strong><p>{weatherUnavailable ? tr("Live weather is temporarily unavailable.") : tr("Fetching current conditions for this place.")}</p><span className="weather-wind">{tr("Conditions can change quickly at altitude.")}</span></>}</div>
          <div className="fact-card"><div className="fact-card-label"><CalendarDays size={16} /> {tr("A GOOD TIME TO GO")}</div><strong>{seasonParts[0]}</strong><p>{seasonParts[1] ?? display.season}</p></div>
          <div className="fact-card"><div className="fact-card-label"><Compass size={16} /> {tr("GIVE IT TIME")}</div><strong>{display.duration}</strong><p>{tr("A comfortable starting point for this route.")}</p></div>
          <div className="fact-card"><div className="fact-card-label"><Users size={16} /> {tr("ILLUSTRATIVE BUDGET")}</div><strong>{display.budget}</strong><p>{tr("Per person, excluding long-haul travel. Prices vary with season and style.")}</p></div>
          <div className="detail-action-stack"><button className="button button-primary full-width" type="button" onClick={addToTrip}>{tr("Add to a trip")} <ArrowRight size={17} /></button><a className="button button-outline full-width" href={mapsUrl} target="_blank" rel="noopener noreferrer">{tr("Open in Maps")} <ExternalLink size={15} /></a></div>
          <div className="local-note"><ThermometerSun size={16} /><p>{tr("Conditions and travel access can change. Check local guidance before you go.")}</p></div>
        </aside>
      </div>
    </div>
  );
}
