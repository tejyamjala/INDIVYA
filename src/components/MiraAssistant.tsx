import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Bot, ChevronDown, CornerDownLeft, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../context";
import { destinations } from "../data/destinations";
import { getTravelGuide } from "../data/travelGuide";
import { tr } from "../lib/i18n";
import { localizeDestination } from "../lib/localize";
import type { Destination } from "../types";

type Message = { role: "mira" | "you"; text: string; values?: Record<string, string | number> };
type Reply = Pick<Message, "text" | "values">;
const starterMessages: Message[] = [{ role: "mira", text: "Namaste — I’m Mira. I can help with the place you’re viewing, nearby stops, travel time, hotels, food, budgets or just help you figure out what you mean. What’s on your mind?" }];
const prompts = ["What is good near here?", "Find a budget stay", "Where should I eat?", "Help me choose a place"];
const intentTerms = {
  budget: ["budget", "cost", "cheap", "afford", "price", "expensive", "money"],
  pilgrimage: ["pilgrim", "temple", "spiritual", "sacred", "holy", "devotion"],
  beach: ["beach", "sea", "coast", "island"],
  mountain: ["mountain", "hill", "snow", "trek", "himalaya"],
  season: ["season", "when", "weather", "month", "best time"],
  plan: ["plan", "itinerary", "trip", "days", "route", "escape", "travel"],
  food: ["food", "eat", "cuisine", "dish", "restaurant", "dinner", "lunch", "hungry"],
  stay: ["hotel", "resort", "stay", "sleep", "room", "accommodation", "place to stay"],
  nearby: ["near", "nearby", "around", "close", "visit", "sight", "attraction", "what can i do"],
  greeting: ["hi", "hello", "hey", "namaste", "good morning", "good evening"],
  thanks: ["thanks", "thank you", "thx", "helpful"],
};
function hasIntent(question: string, terms: string[]) {
  const normalized = question.normalize("NFC").toLocaleLowerCase();
  return terms.some((term) => [term, tr(term)].some((candidate) => normalized.includes(candidate.normalize("NFC").toLocaleLowerCase())));
}
function getReply(question: string, context: { current?: Destination; tripNames: string[]; savedCount: number }): Reply {
  const place = context.current ? localizeDestination(context.current) : undefined;
  const guide = context.current ? getTravelGuide(context.current) : undefined;
  if (hasIntent(question, intentTerms.greeting)) return { text: "Hello — I’m glad you’re here. Tell me where your curiosity is pulling you, or ask me about the place on your screen." };
  if (hasIntent(question, intentTerms.thanks)) return { text: "You’re very welcome. I’m here whenever you want to compare places, make the route gentler or find the next good meal." };
  if (guide && hasIntent(question, intentTerms.nearby)) return { text: "Near {{0}}, I’d start with {{1}} ({{2}}), then consider {{3}} ({{4}}). I’ve added travel times and Maps links on this page so you can check the route before you go.", values: { "0": place!.name, "1": guide.nearby[0]?.name ?? "the local highlights", "2": guide.nearby[0]?.travelTime ?? "a short ride", "3": guide.nearby[1]?.name ?? "the next stop", "4": guide.nearby[1]?.travelTime ?? "a little farther out" } };
  if (guide && hasIntent(question, intentTerms.stay)) {
    const tier = hasIntent(question, ["luxury", "premium", "special"]) ? "Luxury" : hasIntent(question, ["comfortable", "mid range", "mid-range", "balanced"]) ? "Balanced" : "Value";
    const stay = guide.stays.find((item) => item.tier === tier) ?? guide.stays[0];
    return { text: "For {{0}}, I’d look at {{1}} in the {{2}} tier: {{3}}. It is around {{4}} and suits this kind of trip because {{5}}. Use the Maps link beside it to check current reviews and availability.", values: { "0": place!.name, "1": stay.name, "2": stay.tier.toLowerCase(), "3": stay.area, "4": stay.price, "5": stay.why } };
  }
  if (guide && hasIntent(question, intentTerms.food)) {
    const tier = hasIntent(question, ["luxury", "premium", "special"]) ? "Luxury" : hasIntent(question, ["cheap", "budget", "afford"]) ? "Value" : "Balanced";
    const restaurant = guide.restaurants.find((item) => item.tier === tier) ?? guide.restaurants[1];
    return { text: "For food near {{0}}, {{1}} is a good {{2}}-budget idea in {{3}}. Expect roughly {{4}} for {{5}}; the page has more options and a direct Maps search.", values: { "0": place!.name, "1": restaurant.name, "2": restaurant.tier.toLowerCase(), "3": restaurant.area, "4": restaurant.price, "5": restaurant.cuisine } };
  }
  if (place && (hasIntent(question, ["here", "this place", "weather"]) || hasIntent(question, intentTerms.season))) return { text: "{{0}} is best in {{1}}, and {{2}} is a comfortable amount of time. I’d keep {{3}} in mind first. Weather and access can change, so check the live conditions and local guidance close to departure.", values: { "0": place.name, "1": place.season.toLowerCase(), "2": place.duration, "3": place.highlights.slice(0, 2).join(` ${tr("and")} `) } };
  if (hasIntent(question, intentTerms.budget)) {
    const places = destinations.filter((item) => item.budgetMin > 0).sort((a, b) => a.budgetMin - b.budgetMin).slice(0, 3).map(localizeDestination);
    return { text: "For a gentler spend, start with {{0}}. Those are illustrative estimates, not live quotes. If you mean the place on your screen, ask me for a value, balanced or luxury stay and I’ll narrow it down.", values: { "0": places.map((item) => `${item.name} (${item.budget})`).join(", ") } };
  }
  if (hasIntent(question, intentTerms.pilgrimage)) return { text: "For a sacred journey, you could begin with Varanasi, Rameshwaram or the Golden Temple in Amritsar. Tell me whether you want quiet, architecture, a shorter route or a deeper pilgrimage and I’ll shape the suggestion." };
  if (hasIntent(question, intentTerms.beach)) return { text: "For a quieter coast, try Varkala’s red cliffs or Gokarna’s tucked-away coves. Goa is lively and easy to pair with food and heritage; the Andamans are for a longer island rhythm. What matters more to you: swimming, sunsets, food or quiet?" };
  if (hasIntent(question, intentTerms.mountain)) return { text: "If you want altitude and open horizons, Leh & Ladakh is a big, beautiful journey. For a gentler hill escape, try Munnar, Ooty or McLeod Ganj. Do you want dramatic scenery, easy walks or adventure?" };
  if (hasIntent(question, intentTerms.plan)) {
    if (context.tripNames.length) return { text: "Your draft currently includes {{0}}. Tell me how many days you have and what you want to prioritise — slow mornings, food, culture, nature or adventure — and I’ll help you choose what to keep. You have {{1}} saved places too.", values: { "0": context.tripNames.join(", "), "1": context.savedCount } };
    return { text: "Let’s make it easy. Tell me your starting city, number of days, approximate budget and one feeling you want from the trip. I’ll help you turn that into a small, realistic route." };
  }
  if (place) return { text: "I’m with you. For {{0}}, you can ask me things like ‘what is nearby?’, ‘find a budget hotel’, ‘where should I eat?’, ‘how long does it take to get there?’ or ‘what is the best time to visit?’.", values: { "0": place.name } };
  return { text: "Tell me what you’re drawn to — quiet beaches, old cities, mountain air, a spiritual journey or food worth travelling for. If you’re unsure, share your days and budget and I’ll ask the right follow-up question." };
}
export function MiraAssistant() {
  const { trip, wishlist, language } = useAppContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const current = useMemo(() => { const slug = location.pathname.match(/^\/destination\/([^/]+)/)?.[1]; return slug ? destinations.find((item) => item.id === slug) : undefined; }, [location.pathname]);
  const tripNames = trip.destinationIds.map((id) => { const destination = destinations.find((item) => item.id === id); return destination ? localizeDestination(destination).name : undefined; }).filter((name): name is string => Boolean(name));
  const displayCurrent = current ? localizeDestination(current) : undefined;
  useEffect(() => { setMessages(starterMessages); setInput(""); }, [language]);
  function send(text: string) { const trimmed = text.trim(); if (!trimmed) return; const reply = getReply(trimmed, { current, tripNames, savedCount: wishlist.length }); setMessages((currentMessages) => [...currentMessages, { role: "you", text: trimmed }, { role: "mira", ...reply }]); setInput(""); }
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); send(input); }
  return <div className={`mira-widget ${open ? "is-open" : ""}`}>
    {open && <section className="mira-panel" aria-label={tr("Mira travel companion")}>
      <header className="mira-head"><span className="mira-avatar"><Sparkles size={18} /></span><div><strong>Mira</strong><small>{tr("Your India travel companion")}</small></div><button type="button" onClick={() => setOpen(false)} aria-label={tr("Close Mira")}><X size={17} /></button></header>
      <div className="mira-context"><span className="mira-context-dot" /> {displayCurrent ? tr("Thinking about {{0}}", { "0": displayCurrent.name }) : tripNames.length ? tr("Plan in progress · {{0}}", { "0": tripNames[0] }) : tr("Ready when you are")}</div>
      <div className="mira-messages" aria-live="polite">{messages.map((message, index) => <div className={`mira-message ${message.role === "you" ? "from-you" : "from-mira"}`} key={`${message.role}-${index}`}>{message.role === "mira" && <span className="mira-message-icon"><Bot size={13} /></span>}<p>{message.role === "mira" ? tr(message.text, message.values) : message.text}</p></div>)}</div>
      {messages.length === 1 && <div className="mira-prompts">{prompts.map((prompt) => <button type="button" key={prompt} onClick={() => send(prompt)}>{tr(prompt)}<CornerDownLeft size={12} /></button>)}</div>}
      <form className="mira-input-row" onSubmit={handleSubmit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder={tr("Ask Mira anything…")} aria-label={tr("Ask Mira a question")} /><button type="submit" aria-label={tr("Send message")} disabled={!input.trim()}><Send size={16} /></button></form>
      <p className="mira-note">{tr("Friendly travel guidance based on this place and your question. Always check live availability and local advisories.")}</p>
    </section>}
    <button className="mira-launcher" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? tr("Close Mira") : tr("Open Mira travel companion")}><span className="mira-launcher-icon">{open ? <ChevronDown size={18} /> : <MessageCircle size={19} />}</span><span>{open ? tr("Close") : tr("Ask Mira")}</span><span className="mira-launcher-spark"><Sparkles size={13} /></span></button>
  </div>;
}
