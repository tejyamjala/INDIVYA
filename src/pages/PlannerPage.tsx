import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUp, CalendarDays, Check, CircleDollarSign, Clock3, Compass, MapPin, Plus, Sparkles, Trash2, Users } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { destinations } from "../data/destinations";
import { useAppContext } from "../context";
import { formatRupees, midpointBudget } from "../lib/format";
import { setPageMeta } from "../lib/meta";
import { localizeDestination } from "../lib/localize";
import type { Destination, TripBudgetStyle, TripDraft, TripPace } from "../types";
import { tr } from "../lib/i18n";

const paces: { value: TripPace; title: string; detail: string }[] = [
  { value: "Relaxed", title: "Room to breathe", detail: "Fewer stops, longer pauses" },
  { value: "Balanced", title: "A little of everything", detail: "A steady, thoughtful rhythm" },
  { value: "Packed", title: "Make the most of it", detail: "Full days, plenty to see" },
];

const spendingStyles: { value: TripBudgetStyle; detail: string; multiplier: number; shares: Record<string, number> }[] = [
  { value: "Value", detail: "Simple stays, local meals and public transport.", multiplier: 0.8, shares: { Stays: 0.28, Food: 0.24, "Outings & experiences": 0.12, Shopping: 0.07, Travel: 0.22, Incidentals: 0.07 } },
  { value: "Balanced", detail: "Comfortable stays and a mix of local travel.", multiplier: 1, shares: { Stays: 0.35, Food: 0.22, "Outings & experiences": 0.15, Shopping: 0.08, Travel: 0.14, Incidentals: 0.06 } },
  { value: "Luxury", detail: "Premium stays, private transfers and curated outings.", multiplier: 2.4, shares: { Stays: 0.44, Food: 0.19, "Outings & experiences": 0.14, Shopping: 0.08, Travel: 0.10, Incidentals: 0.05 } },
];

const paceMultipliers: Record<TripPace, number> = { Relaxed: 0.92, Balanced: 1, Packed: 1.12 };
const dayIdeas = [
  "Arrive gently and find your bearings",
  "Follow a local story, then leave room for a detour",
  "Take the morning slowly; keep the afternoon open",
  "Choose one last favourite before you go",
];
const interestOptions = ["Culture", "Nature", "Food", "Adventure", "Spiritual", "Wellness"];
const budgetCategories = [
  { name: "Stays", color: "#1d716d" },
  { name: "Food", color: "#cf9166" },
  { name: "Outings & experiences", color: "#d9b878" },
  { name: "Shopping", color: "#7e9d86" },
  { name: "Travel", color: "#698296" },
  { name: "Incidentals", color: "#b8b6a7" },
];

function typicalStay(destination: Destination) {
  const value = destination.duration.match(/(\d+)\s*[–-]?\s*(\d+)?/);
  if (!value) return 3;
  return value[2] ? (Number(value[1]) + Number(value[2])) / 2 : Number(value[1]);
}

export function PlannerPage() {
  const { trip, updateTrip, setStatusMessage, language } = useAppContext();
  const [params, setParams] = useSearchParams();
  const [addition, setAddition] = useState("");

  useEffect(() => { setPageMeta("Trip planner — India Tourism", "Shape a thoughtful India trip around your days, pace, interests and budget."); }, [language]);
  useEffect(() => {
    const add = params.get("add");
    if (!add) return;
    const updated = trip.destinationIds.includes(add) ? trip.destinationIds : [...trip.destinationIds, add];
    if (updated !== trip.destinationIds) updateTrip({ ...trip, destinationIds: updated });
    setParams({}, { replace: true });
  }, [params, setParams, trip, updateTrip]);

  const selected = useMemo(
    () => trip.destinationIds.map((id) => destinations.find((item) => item.id === id)).filter((item): item is Destination => Boolean(item)),
    [trip.destinationIds],
  );
  const selectedDisplay = selected.map(localizeDestination);

  function patch(value: Partial<TripDraft>) { updateTrip({ ...trip, ...value }); }
  function addDestination(id: string) {
    if (!id || trip.destinationIds.includes(id)) return;
    patch({ destinationIds: [...trip.destinationIds, id] });
    setAddition("");
    setStatusMessage(tr("Place added to your trip draft."));
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

  const spending = spendingStyles.find((item) => item.value === trip.budgetStyle) ?? spendingStyles[1];
  const basePerPerson = selected.length
    ? (selected.reduce((sum, item) => sum + midpointBudget(item.budgetMin, item.budgetMax) / Math.max(typicalStay(item), 1), 0) / selected.length) * trip.days
    : 0;
  const perPersonTotal = Math.round(basePerPerson * spending.multiplier * paceMultipliers[trip.pace]);
  const groupTotal = perPersonTotal * trip.travellers;
  const budget = budgetCategories.map((item) => ({ ...item, percent: spending.shares[item.name] ?? 0 }));

  return (
    <div className="planner-page page-enter">
      <section className="planner-intro">
        <div><div className="eyebrow"><span className="eyebrow-line" /> {tr("THE FIRST DRAFT OF SOMETHING GOOD")}</div><h1>{tr("Make room for")} <em>{tr("the road.")}</em></h1><p>{tr("A thoughtful plan leaves a little space for the things you didn’t plan.")}</p></div>
        <div className="draft-save-label"><span className="draft-save-dot" /> {tr("Draft saved on this device")}</div>
      </section>

      <div className="planner-layout">
        <div className="planner-main">
          <section className="planner-section trip-stops-section">
            <div className="planner-section-heading"><span className="planner-step">01</span><div><h2>{tr("Where will you wander?")}</h2><p>{tr("Choose a few places. You can change your mind later.")}</p></div></div>
            <div className="trip-stops-list">
              {selected.map((item, index) => {
                const display = selectedDisplay[index];
                return <article className="trip-stop" key={item.id}>
                  <span className="trip-stop-index">{String(index + 1).padStart(2, "0")}</span>
                  <img src={item.image} alt={tr("{{0}}, {{1}}", { "0": display.name, "1": display.state })} loading="lazy" />
                  <div className="trip-stop-info"><Link to={`/destination/${item.id}`}><strong>{display.name}</strong></Link><span><MapPin size={13} /> {display.state} · {display.duration}</span></div>
                  <div className="stop-order-actions"><button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={tr("Move {{0}} earlier", { "0": display.name })}><ArrowUp size={15} /></button><button type="button" onClick={() => move(index, 1)} disabled={index === selected.length - 1} aria-label={tr("Move {{0}} later", { "0": display.name })}><ArrowDown size={15} /></button></div>
                  <button className="remove-stop" type="button" onClick={() => removeDestination(item.id)} aria-label={tr("Remove {{0}}", { "0": display.name })}><Trash2 size={16} /></button>
                </article>;
              })}
              <div className="add-stop-row"><select aria-label={tr("Add a destination")} value={addition} onChange={(event) => setAddition(event.target.value)}><option value="">{tr("Choose a place to add…")}</option>{destinations.filter((item) => !trip.destinationIds.includes(item.id)).map((item) => { const display = localizeDestination(item); return <option value={item.id} key={item.id}>{display.name} · {display.state}</option>; })}</select><button type="button" className="button button-outline" onClick={() => addDestination(addition)} disabled={!addition}><Plus size={16} /> {tr("Add place")}</button><Link to="/explore" className="text-link">{tr("Browse all")} <ArrowRight size={14} /></Link></div>
            </div>
          </section>

          <section className="planner-section">
            <div className="planner-section-heading"><span className="planner-step">02</span><div><h2>{tr("Set your rhythm.")}</h2><p>{tr("A few details make the estimate and itinerary feel more like yours.")}</p></div></div>
            <div className="planner-number-fields">
              <label className="number-field"><span><CalendarDays size={16} /> {tr("Days on the road")}</span><div><button type="button" onClick={() => patch({ days: Math.max(1, trip.days - 1) })} aria-label={tr("Remove a day")}>−</button><input type="number" min="1" max="45" value={trip.days} onChange={(event) => patch({ days: Math.min(45, Math.max(1, Number(event.target.value) || 1)) })} /><button type="button" onClick={() => patch({ days: Math.min(45, trip.days + 1) })} aria-label={tr("Add a day")}>+</button></div></label>
              <label className="number-field"><span><Users size={16} /> {tr("Travellers")}</span><div><button type="button" onClick={() => patch({ travellers: Math.max(1, trip.travellers - 1) })} aria-label={tr("Remove a traveller")}>−</button><input type="number" min="1" max="20" value={trip.travellers} onChange={(event) => patch({ travellers: Math.min(20, Math.max(1, Number(event.target.value) || 1)) })} /><button type="button" onClick={() => patch({ travellers: Math.min(20, trip.travellers + 1) })} aria-label={tr("Add a traveller")}>+</button></div></label>
            </div>
            <div className="pace-heading"><span><Clock3 size={16} /> {tr("Your kind of pace")}</span></div>
            <div className="pace-options">{paces.map((pace) => <button type="button" key={pace.value} aria-pressed={trip.pace === pace.value} className={`pace-option ${trip.pace === pace.value ? "selected" : ""}`} onClick={() => patch({ pace: pace.value })}><span className="pace-radio">{trip.pace === pace.value && <span />}</span><strong>{tr(pace.title)}</strong><small>{tr(pace.detail)}</small></button>)}</div>
            <div className="spending-heading"><span><CircleDollarSign size={16} /> {tr("Spending comfort")}</span><small>{tr("Shapes the cost estimate")}</small></div>
            <div className="spending-options">{spendingStyles.map((style) => <button type="button" key={style.value} aria-pressed={trip.budgetStyle === style.value} className={`spending-option ${trip.budgetStyle === style.value ? "selected" : ""}`} onClick={() => patch({ budgetStyle: style.value })}><span className="pace-radio">{trip.budgetStyle === style.value && <span />}</span><strong>{tr(style.value)}</strong><small>{tr(style.detail)}</small></button>)}</div>
            <div className="interest-heading"><span><Sparkles size={16} /> {tr("What makes a trip yours?")}</span><small>{tr("Choose a few interests")}</small></div>
            <div className="interest-options">{interestOptions.map((interest) => <button type="button" key={interest} aria-pressed={trip.interests.includes(interest)} className={`interest-chip ${trip.interests.includes(interest) ? "selected" : ""}`} onClick={() => toggleInterest(interest)}>{trip.interests.includes(interest) && <Check size={13} />}{tr(interest)}</button>)}</div>
          </section>
        </div>

        <aside className="planner-aside">
          <section className="itinerary-card">
            <div className="itinerary-card-top"><span className="itinerary-icon"><Compass size={19} /></span><span className="itinerary-label">{tr("YOUR FIRST DRAFT")}</span></div>
            <h2>{tr("A day-by-day")} <em>{tr("beginning.")}</em></h2>
            <p className="itinerary-summary">{tr("{{0}} days · {{1}} travellers · {{2}} pace", { "0": trip.days, "1": trip.travellers, "2": tr(trip.pace) })}</p>
            {selected.length ? <div className="day-list">{Array.from({ length: trip.days }, (_, index) => { const place = selected[Math.floor(index * selected.length / trip.days) % selected.length]; const display = localizeDestination(place); return <div className="day-row" key={index}><span className="day-number">{tr("DAY")} {String(index + 1).padStart(2, "0")}</span><div><strong>{display.name}</strong><small>{tr(dayIdeas[index % dayIdeas.length])}</small></div><span className="day-pin"><MapPin size={14} /></span></div>; })}</div> : <div className="itinerary-empty"><Compass size={20} /><p>{tr("Add a place to begin shaping your route.")}</p><Link to="/explore">{tr("Find a destination")} <ArrowRight size={14} /></Link></div>}
            <div className="itinerary-interest"><span>{tr("YOUR INTERESTS")}</span><div>{trip.interests.length ? trip.interests.map((interest) => <i key={interest}>{tr(interest)}</i>) : <small>{tr("Add an interest to personalise your draft.")}</small>}</div></div>
          </section>

          <section className="budget-card">
            <div className="budget-card-heading"><span><CircleDollarSign size={18} /> {tr("Estimated budget")}</span><small>{tr("INR · {{0}} travellers", { "0": trip.travellers })}</small></div>
            <strong className="budget-total">{selected.length ? formatRupees(groupTotal, language) : tr("—")}</strong>
            <p className="budget-subtitle">{tr("{{0}} days · {{1}} comfort tier", { "0": trip.days, "1": tr(trip.budgetStyle) })}</p>
            <div className="budget-person-total"><span>{tr("Per person")}</span><strong>{selected.length ? formatRupees(perPersonTotal, language) : tr("—")}</strong></div>
            <div className="budget-bars" role="img" aria-label={tr("Estimated spending breakdown")}>{budget.map((item) => <span key={item.name} style={{ width: `${item.percent * 100}%`, background: item.color }} />)}</div>
            <div className="budget-legend">{budget.map((item) => <div key={item.name}><span className="legend-dot" style={{ background: item.color }} /><span>{tr(item.name)}</span><strong>{selected.length ? formatRupees(groupTotal * item.percent, language) : tr("—")}</strong></div>)}</div>
            {!selected.length && <p className="budget-empty-note">{tr("Choose at least one place to see an estimate.")}</p>}
            <p className="budget-disclaimer">{tr("Illustrative planning estimate based on destination budgets, days, travellers, pace and comfort tier — not a live quote. Actual prices vary by season and availability.")}</p>
          </section>
          <div className="planner-help"><span>✳</span><p>{tr("Plans are made to be changed.")}<br /><strong>{tr("That’s part of the fun.")}</strong></p></div>
        </aside>
      </div>
    </div>
  );
}
