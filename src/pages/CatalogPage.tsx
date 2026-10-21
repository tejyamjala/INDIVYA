import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bookmark, Compass, Filter, Heart, Search, Sparkles, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { DestinationCard } from "../components/DestinationCard";
import { destinations, pilgrimageDestinations } from "../data/destinations";
import { useAppContext } from "../context";
import { setPageMeta } from "../lib/meta";
import type { Destination } from "../types";
import { tr } from "../lib/i18n";
import { localizeDestination } from "../lib/localize";


type CatalogMode = "explore" | "pilgrims" | "saved";
const regions = ["All India", ...Array.from(new Set(destinations.map((item) => item.region))).sort()];
const categories = ["All interests", ...Array.from(new Set(destinations.flatMap((item) => item.categories).filter((item) => item !== "Pilgrim"))).sort()];

const pageCopy: Record<CatalogMode, { kicker: string; title: string; italic: string; description: string }> = {
  explore: { kicker: "THE INDIA YOU HAVEN’T MET YET", title: "A whole country,", italic: "at your pace.", description: "Search by place, region or feeling. There’s no one right way through India." },
  pilgrims: { kicker: "A MORE MEANINGFUL WAY TO WANDER", title: "Sacred India,", italic: "one step at a time.", description: "Temples, shrines, river cities and mountain paths. A little context for the journeys that move you." },
  saved: { kicker: "YOUR OWN LITTLE COLLECTION", title: "Places to", italic: "come back to.", description: "Keep the places you love together. Your next trip might already be on this list." },
};

export function CatalogPage({ mode }: { mode: CatalogMode }) {
  const { wishlist, language } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "All interests");
  const [region, setRegion] = useState("All India");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const copy = pageCopy[mode];

  useEffect(() => {
    setPageMeta(`${mode === "explore" ? "Explore" : mode === "pilgrims" ? "Pilgrims" : "Saved places"} — India Tourism`, copy.description);
  }, [mode, copy.description, language]);

  useEffect(() => {
    setQuery(searchParams.get("search") ?? "");
    setCategory(searchParams.get("category") ?? "All interests");
  }, [searchParams]);

  const source = useMemo<Destination[]>(() => {
    if (mode === "pilgrims") return pilgrimageDestinations;
    if (mode === "saved") return destinations.filter((item) => wishlist.includes(item.id));
    return destinations;
  }, [mode, wishlist]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return source.filter((item) => {
      const display = localizeDestination(item);
      const matchesText = !needle || [item.name, item.state, item.region, item.description, ...item.categories, ...item.highlights].join(" ").toLowerCase().includes(needle);
      const matchesCategory = category === "All interests" || item.categories.includes(category);
      const matchesRegion = region === "All India" || item.region === region;
      const matchesLocalizedText = !needle || [display.name, display.state, display.region, display.description, ...display.categories, ...display.highlights].join(" ").toLowerCase().includes(needle);
      return (matchesText || matchesLocalizedText) && matchesCategory && matchesRegion;
    });
  }, [source, query, category, region, language]);

  function clearFilters() {
    setQuery(""); setCategory("All interests"); setRegion("All India"); setSearchParams({});
  }

  return (
    <div className="catalog-page page-enter">
      <section className={`catalog-intro catalog-intro-${mode}`}>
        <div className="catalog-intro-main"><div className="eyebrow"><span className="eyebrow-line" /> {tr(copy.kicker)}</div><h1>{tr(copy.title)}<br /><em>{tr(copy.italic)}</em></h1><p>{tr(copy.description)}</p></div>
        <div className="catalog-intro-note"><span className="catalog-note-icon">{mode === "pilgrims" ? <Sparkles size={20} /> : mode === "saved" ? <Bookmark size={20} /> : <Compass size={20} />}</span><span>{mode === "pilgrims" ? <><strong>{tr("19 places")}</strong><small>{tr("of devotion & discovery")}</small></> : mode === "saved" ? <><strong>{wishlist.length} {tr("saved")}</strong><small>{tr("in your collection")}</small></> : <><strong>{destinations.length} {tr("destinations")}</strong><small>{tr("and counting, across India")}</small></>}</span></div>
      </section>

      <section className="catalog-controls" aria-label={tr("Filter destinations")}>
        <label className="catalog-search"><Search size={18} /><input aria-label={tr("Search destinations")} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={mode === "pilgrims" ? tr("Search sacred places or states") : tr("Search places, states or experiences")} /><span className="search-shortcut">{tr("⌕")}</span></label>
        <button className={`filter-toggle ${filtersOpen ? "active" : ""}`} type="button" aria-expanded={filtersOpen} aria-controls="catalog-filters" onClick={() => setFiltersOpen((value) => !value)}><Filter size={16} /> {tr("Filters")}{" "}{(category !== "All interests" || region !== "All India") && <span className="filter-dot" />}</button>
        {(category !== "All interests" || region !== "All India" || query) && <button className="clear-filter" type="button" onClick={clearFilters}>{tr("Clear all")}{" "}<X size={13} /></button>}
      </section>

      <section id="catalog-filters" className={`catalog-filter-panel ${filtersOpen ? "visible" : ""}`} aria-label={tr("Destination filters")} aria-hidden={!filtersOpen}>
        <div className="filter-group"><span>{tr("Interest")}</span><div className="filter-chips"><button type="button" aria-pressed={category === "All interests"} className={category === "All interests" ? "selected" : ""} onClick={() => setCategory("All interests")}>{tr("All interests")}</button>{categories.slice(1).map((value) => <button key={value} type="button" aria-pressed={category === value} className={category === value ? "selected" : ""} onClick={() => setCategory(value)}>{tr(value)}</button>)}</div></div>
        <label className="region-select"><span>{tr("Region")}</span><select value={region} onChange={(event) => setRegion(event.target.value)}>{regions.map((value) => <option key={value} value={value}>{tr(value)}</option>)}</select></label>
      </section>

      <div className="catalog-results-header"><p><strong>{filtered.length}</strong> {filtered.length === 1 ? tr("place") : tr("places")} {mode === "pilgrims" ? tr("of devotion") : mode === "saved" ? tr("in your collection") : tr("to find your way through")}</p><span>{mode === "pilgrims" ? tr("A little context for your journey") : tr("Curated for the curious")}</span></div>
      {filtered.length > 0 ? <div className="destination-grid">{filtered.map((item, index) => <DestinationCard key={item.id} destination={item} index={index} />)}</div> : (
        <div className="empty-state"><span className="empty-state-icon">{mode === "saved" ? <Heart size={24} /> : <Search size={24} />}</span><h2>{mode === "saved" && wishlist.length === 0 ? tr("Your collection begins here.") : tr("Nothing quite like that yet.")}</h2><p>{mode === "saved" && wishlist.length === 0 ? tr("Tap the bookmark on any place that catches your eye. We’ll keep it close.") : tr("Try a different search or loosen one of your filters.")}</p>{mode === "saved" ? <Link className="button button-primary" to="/explore">{tr("Find a place")}{" "}<ArrowRight size={17} /></Link> : <button className="button button-outline" type="button" onClick={clearFilters}>{tr("Clear filters")}{" "}<X size={15} /></button>}</div>
      )}
    </div>
  );
}
