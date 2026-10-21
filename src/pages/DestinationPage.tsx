import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, CalendarDays, CloudSun, Compass, ExternalLink, ThermometerSun, Users } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { destinations } from "../data/destinations";
import { useAppContext } from "../context";
import { fetchCurrentWeather, type CurrentWeather } from "../lib/weather";
import { setPageMeta } from "../lib/meta";
import { DestinationCard } from "../components/DestinationCard";

export function DestinationPage() {
  const { slug } = useParams();
  const destination = destinations.find((item) => item.id === slug);
  const { wishlist, toggleWishlist, updateTrip, trip, setStatusMessage } = useAppContext();
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [weatherUnavailable, setWeatherUnavailable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const item = destinations.find((entry) => entry.id === slug);
    if (!item) return;
    setPageMeta(`${item.name} — India Tourism`, item.description);
    const controller = new AbortController();
    void fetchCurrentWeather(item.lat, item.lon, controller.signal)
      .then((value) => { setWeather(value); setWeatherUnavailable(false); })
      .catch(() => setWeatherUnavailable(true));
    return () => controller.abort();
  }, [slug]);

  if (!destination) return <div className="not-found"><Compass size={25} /><h1>That place is still a little off the map.</h1><p>Try another region or return to the destination collection.</p><Link className="button button-primary" to="/explore">Explore India <ArrowRight size={16} /></Link></div>;

  const saved = wishlist.includes(destination.id);
  const related = destinations.filter((item) => item.id !== destination.id && item.region === destination.region).slice(0, 3);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${destination.lat},${destination.lon}`;
  const destinationId = destination.id;
  const destinationName = destination.name;

  function addToTrip() {
    const destinationIds = trip.destinationIds.includes(destinationId) ? trip.destinationIds : [...trip.destinationIds, destinationId];
    updateTrip({ ...trip, destinationIds });
    setStatusMessage(`${destinationName} is in your trip draft.`);
    navigate("/planner");
  }

  return (
    <div className="destination-detail page-enter">
      <Link className="back-link" to="/explore"><ArrowLeft size={16} /> Back to all places</Link>
      <section className="destination-hero" style={{ backgroundImage: `url("${destination.image}")` }}>
        <div className="destination-hero-shade" />
        <div className="destination-hero-copy"><div className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> {destination.region.toUpperCase()} · {destination.state.toUpperCase()}</div><h1>{destination.name}</h1><p>{destination.description}</p><div className="tag-row">{destination.categories.map((category) => <span className="tag tag-light" key={category}>{category}</span>)}</div></div>
        <button type="button" aria-pressed={saved} className={`detail-save ${saved ? "is-saved" : ""}`} onClick={() => void toggleWishlist(destination.id)}><Bookmark size={16} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save place"}</button>
        <span className="destination-hero-coordinate">{destination.lat.toFixed(2)}° N &nbsp; {destination.lon.toFixed(2)}° E</span>
      </section>

      <div className="destination-detail-grid">
        <main className="destination-main-column">
          <div className="destination-story-head"><span className="story-lead-mark">“</span><p>{destination.description}</p><span className="story-signature">A NOTE FROM INDIA TOURISM</span></div>
          <section className="destination-highlights"><div className="eyebrow"><span className="eyebrow-line" /> A FEW GOOD PLACES TO BEGIN</div><h2>Let the day <em>unfold.</em></h2><div className="highlight-list">{destination.highlights.map((highlight, index) => <div className="highlight-item" key={highlight}><span className="highlight-index">0{index + 1}</span><span>{highlight}</span><span className="highlight-rule" /></div>)}</div></section>
          {related.length > 0 && <section className="related-section"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> NEARBY IN SPIRIT</div><h2>Stay in the <em>neighbourhood.</em></h2></div><Link className="section-link" to="/explore">All places <ArrowRight size={15} /></Link></div><div className="destination-grid related-grid">{related.map((item, index) => <DestinationCard key={item.id} destination={item} index={index} />)}</div></section>}
        </main>

        <aside className="destination-facts-panel">
          <div className="fact-card live-fact"><div className="fact-card-label"><CloudSun size={17} /> RIGHT NOW</div>{weather ? <><strong>{Math.round(weather.temperature)}° <small>{weather.label}</small></strong><p>Feels like {Math.round(weather.feelsLike)}° · Humidity {weather.humidity}%</p><span className="weather-wind">Wind {Math.round(weather.wind)} km/h · Open-Meteo</span></> : <><strong>{weatherUnavailable ? "A little unknown" : "Checking the sky…"}</strong><p>{weatherUnavailable ? "Live weather is temporarily unavailable." : "Fetching current conditions for this place."}</p><span className="weather-wind">Conditions can change quickly at altitude.</span></>}</div>
          <div className="fact-card"><div className="fact-card-label"><CalendarDays size={16} /> A GOOD TIME TO GO</div><strong>{destination.season.split(" · ")[0]}</strong><p>{destination.season.split(" · ")[1] ?? destination.season}</p></div>
          <div className="fact-card"><div className="fact-card-label"><Compass size={16} /> GIVE IT TIME</div><strong>{destination.duration}</strong><p>A comfortable starting point for this route.</p></div>
          <div className="fact-card"><div className="fact-card-label"><Users size={16} /> ILLUSTRATIVE BUDGET</div><strong>{destination.budget}</strong><p>Per person, excluding long-haul travel. Prices vary with season and style.</p></div>
          <div className="detail-action-stack"><button className="button button-primary full-width" type="button" onClick={addToTrip}>Add to a trip <ArrowRight size={17} /></button><a className="button button-outline full-width" href={mapsUrl} target="_blank" rel="noopener noreferrer">Open in Maps <ExternalLink size={15} /></a></div>
          <div className="local-note"><ThermometerSun size={16} /><p>Conditions and travel access can change. Check local guidance before you go.</p></div>
        </aside>
      </div>
    </div>
  );
}
