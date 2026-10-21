import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Bot, ChevronDown, CornerDownLeft, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../context";
import { destinations } from "../data/destinations";
import { tr } from "../lib/i18n";
import { localizeDestination } from "../lib/localize";
import type { Destination } from "../types";

type Message = { role: "mira" | "you"; text: string; values?: Record<string, string | number> };
type Reply = Pick<Message, "text" | "values">;
const starterMessages: Message[] = [{ role: "mira", text: "Namaste — I’m Mira. Tell me what kind of India you’re hoping to meet." }];
const prompts = ["A gentle 3-day escape", "Best season for the mountains?", "Help me plan around my budget"];

const intentTerms = {
  budget: ["budget", "cost", "cheap", "afford"],
  pilgrimage: ["pilgrim", "temple", "spiritual", "sacred", "holy", "devotion"],
  beach: ["beach", "sea", "coast", "island"],
  mountain: ["mountain", "hill", "snow", "trek", "himalaya"],
  season: ["season", "when", "weather", "month"],
  plan: ["plan", "itinerary", "trip", "days", "route", "escape"],
  food: ["food", "eat", "cuisine", "dish"],
};

function hasIntent(question: string, terms: string[]) {
  const normalized = question.normalize("NFC").toLocaleLowerCase();
  return terms.some((term) => [term, tr(term)].some((candidate) => normalized.includes(candidate.normalize("NFC").toLocaleLowerCase())));
}

function getReply(question: string, context: { route: string; current?: Destination; tripNames: string[]; savedCount: number }): Reply {
  if (context.current && hasIntent(question, ["here", "this place", "weather"])) {
    const place = localizeDestination(context.current);
    return {
      text: "{{0}} is best in {{1}}, and {{2}} is a comfortable amount of time. {{3}} are lovely places to begin. The live conditions are on the destination page; do check local guidance before heading out.",
      values: {
        "0": place.name,
        "1": place.season.toLowerCase(),
        "2": place.duration,
        "3": place.highlights.slice(0, 2).join(` ${tr("and")} `),
      },
    };
  }
  if (hasIntent(question, intentTerms.budget)) {
    const places = destinations.filter((item) => item.budgetMin > 0).sort((a, b) => a.budgetMin - b.budgetMin).slice(0, 3).map(localizeDestination);
    return {
      text: "For a gentler spend, start with {{0}}. Those are illustrative estimates, not live quotes. I’ve shaped your current draft around {{1}}; the planner can show a rough split.",
      values: {
        "0": places.map((item) => `${item.name} (${item.budget})`).join(", "),
        "1": context.tripNames.length ? context.tripNames.join(", ") : tr("no destinations yet"),
      },
    };
  }
  if (hasIntent(question, intentTerms.pilgrimage)) return { text: "For a sacred journey, you could begin with Varanasi, Rameshwaram or the Golden Temple in Amritsar. The Pilgrims directory has 19 sites, with regional details and seasonal pointers to help you shape a thoughtful route." };
  if (hasIntent(question, intentTerms.beach)) return { text: "For a quieter coast, try Varkala’s red cliffs or Gokarna’s tucked-away coves. Goa is lively and easy to pair with food and heritage; the Andamans are for a longer island rhythm. Winter is a lovely starting point for most of them." };
  if (hasIntent(question, intentTerms.mountain)) return { text: "If you want altitude and open horizons, Leh & Ladakh is a big, beautiful journey — plan extra days to acclimatise. For a gentler hill escape, try Munnar, Ooty or McLeod Ganj. Spring to early autumn suits many mountain routes, but conditions change quickly." };
  if (hasIntent(question, intentTerms.season)) return { text: "October to March is a comfortable window for many heritage and coastal journeys. Himalayan routes often open in late spring and summer; monsoon transforms the Western Ghats into a deep green. Always check local forecasts and official advisories close to departure." };
  if (hasIntent(question, intentTerms.plan)) {
    if (context.tripNames.length) return {
      text: "Your draft currently includes {{0}}. In your trip planner, add your days, traveller count, pace and interests; I’ll keep this plan in view while we explore. You have {{1}} saved places for later inspiration.",
      values: { "0": context.tripNames.join(", "), "1": context.savedCount },
    };
    return { text: "I’d start small: choose one region, then give it room. Add a place you love to the trip planner, choose your days and pace, and let the draft itinerary give you a first shape." };
  }
  if (hasIntent(question, intentTerms.food)) return { text: "For a food-led route, Jaipur brings Rajasthani thalis and market snacks; Varkala and Kerala are rich with coastal flavours; Darjeeling is lovely for tea. Tell me a region or dietary preference and I’ll narrow it down." };
  return {
    text: "Tell me what you’re drawn to — quiet beaches, old cities, mountain air, a spiritual journey or food worth travelling for — and I’ll suggest a few places to begin. Your saved places: {{0}}.",
    values: { "0": context.savedCount },
  };
}

export function MiraAssistant() {
  const { trip, wishlist, language } = useAppContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const current = useMemo(() => {
    const slug = location.pathname.match(/^\/destination\/([^/]+)/)?.[1];
    return slug ? destinations.find((item) => item.id === slug) : undefined;
  }, [location.pathname]);
  const tripNames = trip.destinationIds.map((id) => {
    const destination = destinations.find((item) => item.id === id);
    return destination ? localizeDestination(destination).name : undefined;
  }).filter((name): name is string => Boolean(name));
  const displayCurrent = current ? localizeDestination(current) : undefined;

  useEffect(() => {
    setMessages(starterMessages);
    setInput("");
  }, [language]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = getReply(trimmed, { route: location.pathname, current, tripNames, savedCount: wishlist.length });
    setMessages((currentMessages) => [...currentMessages, { role: "you", text: trimmed }, { role: "mira", ...reply }]);
    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(input);
  }

  return (
    <div className={`mira-widget ${open ? "is-open" : ""}`}>
      {open && <section className="mira-panel" aria-label={tr("Mira travel companion")}>
        <header className="mira-head"><span className="mira-avatar"><Sparkles size={18} /></span><div><strong>Mira</strong><small>{tr("Your India travel companion")}</small></div><button type="button" onClick={() => setOpen(false)} aria-label={tr("Close Mira")}><X size={17} /></button></header>
        <div className="mira-context"><span className="mira-context-dot" /> {displayCurrent ? tr("Thinking about {{0}}", { "0": displayCurrent.name }) : tripNames.length ? tr("Plan in progress · {{0}}", { "0": tripNames[0] }) : tr("Ready when you are")}</div>
        <div className="mira-messages" aria-live="polite">
          {messages.map((message, index) => <div className={`mira-message ${message.role === "you" ? "from-you" : "from-mira"}`} key={`${message.role}-${index}`}>{message.role === "mira" && <span className="mira-message-icon"><Bot size={13} /></span>}<p>{message.role === "mira" ? tr(message.text, message.values) : message.text}</p></div>)}
        </div>
        {messages.length === 1 && <div className="mira-prompts">{prompts.map((prompt) => <button type="button" key={prompt} onClick={() => send(prompt)}>{tr(prompt)}<CornerDownLeft size={12} /></button>)}</div>}
        <form className="mira-input-row" onSubmit={handleSubmit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder={tr("Ask Mira anything…")} aria-label={tr("Ask Mira a question")} /><button type="submit" aria-label={tr("Send message")} disabled={!input.trim()}><Send size={16} /></button></form>
        <p className="mira-note">{tr("A thoughtful starting point — always check local travel advisories.")}</p>
      </section>}
      <button className="mira-launcher" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? tr("Close Mira") : tr("Open Mira travel companion")}>
        <span className="mira-launcher-icon">{open ? <ChevronDown size={18} /> : <MessageCircle size={19} />}</span><span>{open ? tr("Close") : tr("Ask Mira")}</span><span className="mira-launcher-spark"><Sparkles size={13} /></span>
      </button>
    </div>
  );
}
