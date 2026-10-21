import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUp, CalendarDays, Check, CircleDollarSign, Clock3, Compass, MapPin, Plus, Sparkles, Trash2, Users } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { destinations } from "../data/destinations";
import { useAppContext } from "../context";
import { formatRupees, midpointBudget } from "../lib/format";
import { setPageMeta } from "../lib/meta";
import type { Destination, TripDraft, TripPace } from "../types";

const paces: { value: TripPace; title: string; detail: string }[] = [
  { value: "Relaxed", title: "Room to breathe", detail: "Fewer stops, longer pauses" },
  { value: "Balanced", title: "A little of everything", detail: "A steady, thoughtful rhythm" },
  { value: "Packed", title: "Make the most of it", detail: "Full days, plenty to see" },
];
const interestOptions = ["Culture", "Nature", "Food", "Adventure", "Spiritual", "Wellness"];
const dayIdeas = ["Arrive gently and find your bearings", "Follow a local story, then leave room for a detour", "Take the morning slowly; keep the afternoon open", "Choose one last favourite before you go"];

function typicalStay(destination: Destination) {
  const value = destination.duration.match(/(\d+)\s*[–-]?\s*(\d+)?/);
  if (!value) return 3;
  return value[2] ? (Number(value[1]) + Number(value[2])) / 2 : Number(value[1]);
}

export function PlannerPage() {
  const { trip, updateTrip, setStatusMessage } = useAppContext();
  const [params, setParams] = useSearchParams();
  const [addition, setAddition] = useState("");

  useEffect(() => { setPageMeta("Trip planner — India Tourism", "Shape a thoughtful India trip around your days, pace, interests and budget."); }, []);
  useEffect(() => {
    const add = params.get("add");
    if (!add) return;
    const updated = trip.destinationIds.includes(add) ? trip.destinationIds : [...trip.destinationIds, add];
    if (updated !== trip.destinationIds) updateTrip({ ...trip, destinationIds: updated });
    setParams({}, { replace: true });
  }, [params, setParams, trip, updateTrip]);

  const selected = useMemo(() => trip.destinationIds.map((id) => destinations.find((item) => item.id === id)).filter((item): item is Destination => Boolean(item)), [trip.destinationIds]);

  function patch(value: Partial<TripDraft>) { updateTrip({ ...trip, ...value }); }
  function addDestination(id: string) {
    if (!id || trip.destinationIds.includes(id)) return;
    patch({ destinationIds: [...trip.destinationIds, id] });
    setAddition("");
    setStatusMessage("Place added to your trip draft.");
  }
  function removeDestination(id: string) { patch({ destinationIds: trip.destinationIds.filter((value) => value !== id) }); }
  function move(index: number, direction: -1 | 1) {
    const next = [...trip.destinationIds];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    patch({ destinationIds: next });
  }
  function toggleInterest(interest: string) {
    patch({ interests: trip.interests.includes(interest) ? trip.interests.filter((item) => item !== interest) : [...trip.interests, interest] });
  }

  const basePerPerson = selected.length ? selected.reduce((sum, item) => sum + midpointBudget(item.budgetMin, item.budgetMax) / Math.max(typicalStay(item), 1), 0) * (trip.days / selected.length) : 0;
  const total = Math.round(basePerPerson * Math.max(trip.travellers, 1));
  const budget = [
    { name: "Stays", percent: 0.36, color: "#1d716d" },
    { name: "Getting around", percent: 0.22, color: "#cf9166" },
    { name: "Food & chai", percent: 0.2, color: "#d9b878" },
    { name: "Experiences", percent: 0.14, color: "#7e9d86" },
    { name: "A little extra", percent: 0.08, color: "#b8b6a7" },
  ];

  return (
    <div className="planner-page page-enter">
      <section className="planner-intro"><div><div className="eyebrow"><span className="eyebrow-line" /> THE FIRST DRAFT OF SOMETHING GOOD</div><h1>Make room for <em>the road.</em></h1><p>A thoughtful plan leaves a little space for the things you didn’t plan.</p></div><div className="draft-save-label"><span className="draft-save-dot" /> Draft saved on this device</div></section>

      <div className="planner-layout">
        <div className="planner-main">
          <section className="planner-section trip-stops-section"><div className="planner-section-heading"><span className="planner-step">01</span><div><h2>Where will you wander?</h2><p>Choose a few places. You can change your mind later.</p></div></div>
            <div className="trip-stops-list">
              {selected.map((item, index) => <article className="trip-stop" key={item.id}><span className="trip-stop-index">{String(index + 1).padStart(2, "0")}</span><img src={item.image} alt="" loading="lazy" /><div className="trip-stop-info"><Link to={`/destination/${item.id}`}><strong>{item.name}</strong></Link><span><MapPin size={13} /> {item.state} · {item.duration}</span></div><div className="stop-order-actions"><button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${item.name} earlier`}><ArrowUp size={15} /></button><button type="button" onClick={() => move(index, 1)} disabled={index === selected.length - 1} aria-label={`Move ${item.name} later`}><ArrowDown size={15} /></button></div><button className="remove-stop" type="button" onClick={() => removeDestination(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={16} /></button></article>)}
              <div className="add-stop-row"><select aria-label="Add a destination" value={addition} onChange={(event) => setAddition(event.target.value)}><option value="">Choose a place to add…</option>{destinations.filter((item) => !trip.destinationIds.includes(item.id)).map((item) => <option value={item.id} key={item.id}>{item.name} · {item.state}</option>)}</select><button type="button" className="button button-outline" onClick={() => addDestination(addition)} disabled={!addition}><Plus size={16} /> Add place</button><Link to="/explore" className="text-link">Browse all <ArrowRight size={14} /></Link></div>
            </div>
          </section>

          <section className="planner-section"><div className="planner-section-heading"><span className="planner-step">02</span><div><h2>Set your rhythm.</h2><p>A few details make the estimate and itinerary feel more like yours.</p></div></div>
            <div className="planner-number-fields"><label className="number-field"><span><CalendarDays size={16} /> Days on the road</span><div><button type="button" onClick={() => patch({ days: Math.max(1, trip.days - 1) })} aria-label="Remove a day">−</button><input type="number" min="1" max="45" value={trip.days} onChange={(event) => patch({ days: Math.min(45, Math.max(1, Number(event.target.value) || 1)) })} /><button type="button" onClick={() => patch({ days: Math.min(45, trip.days + 1) })} aria-label="Add a day">+</button></div></label><label className="number-field"><span><Users size={16} /> Travellers</span><div><button type="button" onClick={() => patch({ travellers: Math.max(1, trip.travellers - 1) })} aria-label="Remove a traveller">−</button><input type="number" min="1" max="20" value={trip.travellers} onChange={(event) => patch({ travellers: Math.min(20, Math.max(1, Number(event.target.value) || 1)) })} /><button type="button" onClick={() => patch({ travellers: Math.min(20, trip.travellers + 1) })} aria-label="Add a traveller">+</button></div></label></div>
            <div className="pace-heading"><span><Clock3 size={16} /> Your kind of pace</span></div><div className="pace-options">{paces.map((pace) => <button type="button" key={pace.value} aria-pressed={trip.pace === pace.value} className={`pace-option ${trip.pace === pace.value ? "selected" : ""}`} onClick={() => patch({ pace: pace.value })}><span className="pace-radio">{trip.pace === pace.value && <span />}</span><strong>{pace.title}</strong><small>{pace.detail}</small></button>)}</div>
            <div className="interest-heading"><span><Sparkles size={16} /> What makes a trip yours?</span><small>Choose a few interests</small></div><div className="interest-options">{interestOptions.map((interest) => <button type="button" key={interest} aria-pressed={trip.interests.includes(interest)} className={`interest-chip ${trip.interests.includes(interest) ? "selected" : ""}`} onClick={() => toggleInterest(interest)}>{trip.interests.includes(interest) && <Check size={13} />}{interest}</button>)}</div>
          </section>
        </div>

        <aside className="planner-aside">
          <section className="itinerary-card"><div className="itinerary-card-top"><span className="itinerary-icon"><Compass size={19} /></span><span className="itinerary-label">YOUR FIRST DRAFT</span></div><h2>A day-by-day <em>beginning.</em></h2><p className="itinerary-summary">{trip.days} days · {trip.travellers} {trip.travellers === 1 ? "traveller" : "travellers"} · {trip.pace.toLowerCase()} pace</p>
            {selected.length ? <div className="day-list">{Array.from({ length: trip.days }, (_, index) => { const place = selected[Math.floor(index * selected.length / trip.days) % selected.length]; return <div className="day-row" key={index}><span className="day-number">DAY {String(index + 1).padStart(2, "0")}</span><div><strong>{place.name}</strong><small>{dayIdeas[index % dayIdeas.length]}</small></div><span className="day-pin"><MapPin size={14} /></span></div>; })}</div> : <div className="itinerary-empty"><Compass size={20} /><p>Add a place to begin shaping your route.</p><Link to="/explore">Find a destination <ArrowRight size={14} /></Link></div>}
            <div className="itinerary-interest"><span>YOUR INTERESTS</span><div>{trip.interests.length ? trip.interests.map((interest) => <i key={interest}>{interest}</i>) : <small>Add an interest to personalise your draft.</small>}</div></div>
          </section>
          <section className="budget-card"><div className="budget-card-heading"><span><CircleDollarSign size={18} /> THE ROUGH NUMBERS</span><small>INR · {trip.travellers} {trip.travellers === 1 ? "traveller" : "travellers"}</small></div><strong className="budget-total">{selected.length ? formatRupees(total) : "—"}</strong><p className="budget-subtitle">Illustrative estimate for {trip.days} days</p><div className="budget-bars">{budget.map((item) => <span key={item.name} style={{ width: `${item.percent * 100}%`, background: item.color }} />)}</div><div className="budget-legend">{budget.map((item) => <div key={item.name}><span className="legend-dot" style={{ background: item.color }} /><span>{item.name}</span><strong>{selected.length ? formatRupees(total * item.percent) : "—"}</strong></div>)}</div><p className="budget-disclaimer">A planning guide, not a live quote. Actual prices depend on season, availability and travel style.</p></section>
          <div className="planner-help"><span>✳</span><p>Plans are made to be changed.<br /><strong>That’s part of the fun.</strong></p></div>
        </aside>
      </div>
    </div>
  );
}
