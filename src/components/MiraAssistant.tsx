import { useMemo, useState, type FormEvent } from "react";
import { Bot, ChevronDown, CornerDownLeft, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../context";
import { destinations } from "../data/destinations";
import type { Destination } from "../types";

type Message = { role: "mira" | "you"; text: string };
const starterMessages: Message[] = [{ role: "mira", text: "Namaste — I’m Mira. Tell me what kind of India you’re hoping to meet." }];
const prompts = ["A gentle 3-day escape", "Best season for the mountains?", "Help me plan around my budget"];

function getReply(question: string, context: { route: string; current?: Destination; tripNames: string[]; savedCount: number }) {
  const q = question.toLowerCase();
  if (context.current && (q.includes("here") || q.includes("this place") || q.includes("weather"))) {
    return `${context.current.name} is best in ${context.current.season.toLowerCase()}, and ${context.current.duration} is a comfortable amount of time. ${context.current.highlights.slice(0, 2).join(" and ")} are lovely places to begin. The live conditions are on the destination page; do check local guidance before heading out.`;
  }
  if (/budget|cost|cheap|afford/.test(q)) {
    const place = destinations.filter((item) => item.budgetMin > 0).sort((a, b) => a.budgetMin - b.budgetMin).slice(0, 3);
    return `For a gentler spend, start with ${place.map((item) => `${item.name} (${item.budget})`).join(", ")}. Those are illustrative estimates, not live quotes. I’ve shaped your current draft around ${context.tripNames.length ? context.tripNames.join(", ") : "no destinations yet"}; the planner can show a rough split.`;
  }
  if (/pilgrim|temple|spiritual|sacred|holy|devot/.test(q)) {
    return "For a sacred journey, you could begin with Varanasi, Rameshwaram or the Golden Temple in Amritsar. The Pilgrims directory has 19 sites, with regional details and seasonal pointers to help you shape a thoughtful route.";
  }
  if (/beach|sea|coast|island/.test(q)) {
    return "For a quieter coast, try Varkala’s red cliffs or Gokarna’s tucked-away coves. Goa is lively and easy to pair with food and heritage; the Andamans are for a longer island rhythm. Winter is a lovely starting point for most of them.";
  }
  if (/mountain|hill|snow|trek|himalaya/.test(q)) {
    return "If you want altitude and open horizons, Leh & Ladakh is a big, beautiful journey — plan extra days to acclimatise. For a gentler hill escape, try Munnar, Ooty or McLeod Ganj. Spring to early autumn suits many mountain routes, but conditions change quickly.";
  }
  if (/season|when|weather|month/.test(q)) {
    return "October to March is a comfortable window for many heritage and coastal journeys. Himalayan routes often open in late spring and summer; monsoon transforms the Western Ghats into a deep green. Always check local forecasts and official advisories close to departure.";
  }
  if (/plan|itinerary|trip|days|route/.test(q)) {
    return context.tripNames.length
      ? `Your draft currently includes ${context.tripNames.join(" and ")}. In ${context.route.includes("planner") ? "the planner" : "the trip planner"}, add your days, traveller count, pace and interests; I’ll keep this plan in view while we explore. You have ${context.savedCount} saved place${context.savedCount === 1 ? "" : "s"} for later inspiration.`
      : "I’d start small: choose one region, then give it room. Add a place you love to the trip planner, choose your days and pace, and let the draft itinerary give you a first shape.";
  }
  if (/food|eat|cuisine|dish/.test(q)) return "For a food-led route, Jaipur brings Rajasthani thalis and market snacks; Varkala and Kerala are rich with coastal flavours; Darjeeling is lovely for tea. Tell me a region or dietary preference and I’ll narrow it down.";
  return `Tell me what you’re drawn to — quiet beaches, old cities, mountain air, a spiritual journey or food worth travelling for — and I’ll suggest a few places to begin. You’ve saved ${context.savedCount} place${context.savedCount === 1 ? "" : "s"} so far.`;
}

export function MiraAssistant() {
  const { trip, wishlist } = useAppContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const current = useMemo(() => {
    const slug = location.pathname.match(/^\/destination\/([^/]+)/)?.[1];
    return slug ? destinations.find((item) => item.id === slug) : undefined;
  }, [location.pathname]);
  const tripNames = trip.destinationIds.map((id) => destinations.find((item) => item.id === id)?.name).filter((name): name is string => Boolean(name));

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = getReply(trimmed, { route: location.pathname, current, tripNames, savedCount: wishlist.length });
    setMessages((currentMessages) => [...currentMessages, { role: "you", text: trimmed }, { role: "mira", text: reply }]);
    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(input);
  }

  return (
    <div className={`mira-widget ${open ? "is-open" : ""}`}>
      {open && <section className="mira-panel" aria-label="Mira travel companion">
        <header className="mira-head"><span className="mira-avatar"><Sparkles size={18} /></span><div><strong>Mira</strong><small>Your India travel companion</small></div><button type="button" onClick={() => setOpen(false)} aria-label="Close Mira"><X size={17} /></button></header>
        <div className="mira-context"><span className="mira-context-dot" /> {current ? `Thinking about ${current.name}` : tripNames.length ? `Plan in progress · ${tripNames[0]}` : "Ready when you are"}</div>
        <div className="mira-messages" aria-live="polite">
          {messages.map((message, index) => <div className={`mira-message ${message.role === "you" ? "from-you" : "from-mira"}`} key={`${message.role}-${index}`}>{message.role === "mira" && <span className="mira-message-icon"><Bot size={13} /></span>}<p>{message.text}</p></div>)}
        </div>
        {messages.length === 1 && <div className="mira-prompts">{prompts.map((prompt) => <button type="button" key={prompt} onClick={() => send(prompt)}>{prompt}<CornerDownLeft size={12} /></button>)}</div>}
        <form className="mira-input-row" onSubmit={handleSubmit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask Mira anything…" aria-label="Ask Mira a question" /><button type="submit" aria-label="Send message" disabled={!input.trim()}><Send size={16} /></button></form>
        <p className="mira-note">A thoughtful starting point — always check local travel advisories.</p>
      </section>}
      <button className="mira-launcher" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close Mira" : "Open Mira travel companion"}>
        <span className="mira-launcher-icon">{open ? <ChevronDown size={18} /> : <MessageCircle size={19} />}</span><span>{open ? "Close" : "Ask Mira"}</span><span className="mira-launcher-spark"><Sparkles size={13} /></span>
      </button>
    </div>
  );
}
