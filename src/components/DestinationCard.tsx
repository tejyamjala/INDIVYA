import { useState } from "react";
import { ArrowUpRight, Bookmark, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { Destination } from "../types";
import { formatRupees } from "../lib/format";
import { localizeDestination } from "../lib/localize";
import { useAppContext } from "../context";
import { tr } from "../lib/i18n";

export function DestinationCard({ destination, index = 0 }: { destination: Destination; index?: number }) {
  const { wishlist, toggleWishlist, language } = useAppContext();
  const [imageFailed, setImageFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const display = localizeDestination(destination);
  const saved = wishlist.includes(destination.id);

  async function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setSaving(true);
    await toggleWishlist(destination.id);
    setSaving(false);
  }

  return (
    <article className="destination-card" style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}>
      <Link className="destination-card-link" to={`/destination/${destination.id}`} aria-label={tr("Explore {{0}}", { "0": display.name })}>
        <div className="destination-card-image" style={{ backgroundColor: destination.accent }}>
          {!imageFailed && <img src={destination.image} alt={tr("{{0}}, {{1}}", { "0": display.name, "1": display.state })} loading="lazy" onError={() => setImageFailed(true)} />}
          {imageFailed && <div className="image-fallback"><span>{display.name}</span><i>{display.region}</i></div>}
          <span className="image-region"><MapPin size={13} /> {display.region}</span>
          <span className="image-number">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="destination-card-content">
          <div className="destination-card-title-row"><div><h3>{display.name}</h3><p>{display.state}</p></div><span className="card-arrow"><ArrowUpRight size={17} /></span></div>
          <p className="destination-card-description">{display.description}</p>
          <div className="destination-card-bottom"><span>{display.duration}</span><span className="card-budget">{tr("From")} {formatRupees(destination.budgetMin, language)}</span></div>
          <div className="tag-row">{display.categories.slice(0, 2).map((category) => <span className="tag" key={category}>{category}</span>)}</div>
        </div>
      </Link>
      <button className={`save-card-button ${saved ? "is-saved" : ""}`} type="button" onClick={toggle} disabled={saving} aria-pressed={saved} aria-label={saved ? tr("Remove {{0}} from saved places", { "0": display.name }) : tr("Save {{0}}", { "0": display.name })} title={saved ? tr("Saved") : tr("Save place")}>
        <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
      </button>
    </article>
  );
}
