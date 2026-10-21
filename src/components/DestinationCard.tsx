import { useState } from "react";
import { ArrowUpRight, Bookmark, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { Destination } from "../types";
import { formatRupees } from "../lib/format";
import { useAppContext } from "../context";

export function DestinationCard({ destination, index = 0 }: { destination: Destination; index?: number }) {
  const { wishlist, toggleWishlist } = useAppContext();
  const [imageFailed, setImageFailed] = useState(false);
  const [saving, setSaving] = useState(false);
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
      <Link className="destination-card-link" to={`/destination/${destination.id}`} aria-label={`Explore ${destination.name}`}>
        <div className="destination-card-image" style={{ backgroundColor: destination.accent }}>
          {!imageFailed && <img src={destination.image} alt={`${destination.name}, ${destination.state}`} loading="lazy" onError={() => setImageFailed(true)} />}
          {imageFailed && <div className="image-fallback"><span>{destination.name}</span><i>{destination.region}</i></div>}
          <span className="image-region"><MapPin size={13} /> {destination.region}</span>
          <span className="image-number">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="destination-card-content">
          <div className="destination-card-title-row"><div><h3>{destination.name}</h3><p>{destination.state}</p></div><span className="card-arrow"><ArrowUpRight size={17} /></span></div>
          <p className="destination-card-description">{destination.description}</p>
          <div className="destination-card-bottom"><span>{destination.duration}</span><span className="card-budget">From {formatRupees(destination.budgetMin)}</span></div>
          <div className="tag-row">{destination.categories.slice(0, 2).map((category) => <span className="tag" key={category}>{category}</span>)}</div>
        </div>
      </Link>
      <button className={`save-card-button ${saved ? "is-saved" : ""}`} type="button" onClick={toggle} disabled={saving} aria-pressed={saved} aria-label={saved ? `Remove ${destination.name} from saved places` : `Save ${destination.name}`} title={saved ? "Saved" : "Save place"}>
        <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
      </button>
    </article>
  );
}
