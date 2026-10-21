import type { Destination } from "../types";

export type BudgetTier = "Value" | "Balanced" | "Luxury";
export type NearbyPlace = {
  name: string;
  type: string;
  description: string;
  travelTime: string;
  mode: string;
  query: string;
};
export type StayRecommendation = {
  name: string;
  area: string;
  tier: BudgetTier;
  price: string;
  why: string;
  query: string;
};
export type RestaurantRecommendation = {
  name: string;
  area: string;
  tier: BudgetTier;
  price: string;
  cuisine: string;
  why: string;
  query: string;
};
export type TravelGuide = {
  nearby: NearbyPlace[];
  stays: StayRecommendation[];
  restaurants: RestaurantRecommendation[];
};

const curatedGuides: Record<string, TravelGuide> = {
  "gangtok-sikkim": {
    nearby: [
      { name: "Rumtek Monastery", type: "Monastery", description: "A peaceful hillside monastery and one of Sikkim’s most important Buddhist centres.", travelTime: "45–60 min by car", mode: "Drive", query: "Rumtek Monastery Sikkim" },
      { name: "Tashi View Point", type: "Viewpoint", description: "A quick morning outing for Himalayan and Kanchenjunga panoramas.", travelTime: "20–30 min by car", mode: "Drive", query: "Tashi View Point Gangtok" },
      { name: "Tsomgo Lake", type: "Day trip", description: "A high-altitude lake reached by a permit-dependent mountain road.", travelTime: "1.5–2 hr by car", mode: "Drive", query: "Tsomgo Lake Sikkim" },
    ],
    stays: [
      { name: "Hotel Namnang", area: "Near Namnang Road", tier: "Value", price: "₹1,800–₹3,000/night", why: "Simple rooms close to central Gangtok and local transport.", query: "Hotel Namnang Gangtok" },
      { name: "The Nettle and Fern Hotel", area: "Gangtok town", tier: "Balanced", price: "₹4,000–₹7,000/night", why: "Comfortable base with easy access to MG Marg and views.", query: "The Nettle and Fern Hotel Gangtok" },
      { name: "Mayfair Spa Resort & Casino", area: "Rumdumra", tier: "Luxury", price: "₹12,000+/night", why: "A resort-style stay with gardens, spa facilities and space to slow down.", query: "Mayfair Spa Resort Gangtok" },
    ],
    restaurants: [
      { name: "Taste of Tibet", area: "MG Marg area", tier: "Value", price: "₹300–₹700/person", cuisine: "Tibetan & Sikkimese", why: "A friendly stop for momos, thukpa and local comfort food.", query: "Taste of Tibet Gangtok" },
      { name: "Cafe Live & Loud", area: "MG Marg", tier: "Balanced", price: "₹700–₹1,400/person", cuisine: "Cafe & Asian", why: "Good for an easy evening with music and a broad menu.", query: "Cafe Live and Loud Gangtok" },
      { name: "Sol Cafe", area: "Deorali", tier: "Luxury", price: "₹1,200–₹2,000/person", cuisine: "Contemporary Indian", why: "A polished option for a longer dinner and mountain-town atmosphere.", query: "Sol Cafe Gangtok" },
    ],
  },
  "kaziranga-national-park": {
    nearby: [
      { name: "Kohora Central Range", type: "Safari zone", description: "The most convenient range for a first jeep safari through Kaziranga’s grasslands.", travelTime: "10–20 min by car", mode: "Drive", query: "Kohora Central Range Kaziranga" },
      { name: "Orchid Park", type: "Garden & culture", description: "A relaxed stop for orchids, local performances and a taste of Assamese culture.", travelTime: "20–30 min by car", mode: "Drive", query: "Kaziranga Orchid Park" },
      { name: "Kakochang Waterfall", type: "Nature", description: "A forest-and-tea-country outing near the park for a change of pace.", travelTime: "1–1.5 hr by car", mode: "Drive", query: "Kakochang Waterfall Assam" },
    ],
    stays: [
      { name: "Bon Villa Retreat", area: "Kohora", tier: "Value", price: "₹2,000–₹3,500/night", why: "A practical safari base close to the Central Range gate.", query: "Bon Villa Retreat Kaziranga" },
      { name: "IORA The Retreat", area: "Kohora", tier: "Balanced", price: "₹5,000–₹9,000/night", why: "Comfortable rooms and an easy setup for arranging park excursions.", query: "IORA The Retreat Kaziranga" },
      { name: "Diphlu River Lodge", area: "Kohora", tier: "Luxury", price: "₹14,000+/night", why: "A nature-led lodge with thoughtful experiences near the park landscape.", query: "Diphlu River Lodge Kaziranga" },
    ],
    restaurants: [
      { name: "Maihang Restaurant", area: "Kohora", tier: "Value", price: "₹300–₹700/person", cuisine: "Assamese", why: "A good introduction to local rice, fish and thali-style meals.", query: "Maihang Restaurant Kaziranga" },
      { name: "Landmark Woods Restaurant", area: "Kohora", tier: "Balanced", price: "₹600–₹1,200/person", cuisine: "Indian & regional", why: "Convenient for a relaxed meal after a safari drive.", query: "Landmark Woods Kaziranga restaurant" },
      { name: "Diphlu River Lodge Dining", area: "Kohora", tier: "Luxury", price: "₹1,200–₹2,000/person", cuisine: "Assamese & Indian", why: "A destination meal focused on regional ingredients and lodge hospitality.", query: "Diphlu River Lodge restaurant" },
    ],
  },
  "kolkata-west-bengal": {
    nearby: [
      { name: "Victoria Memorial", type: "Heritage", description: "Marble galleries and gardens that make an easy first Kolkata morning.", travelTime: "15–30 min by car", mode: "Drive", query: "Victoria Memorial Kolkata" },
      { name: "Kumartuli", type: "Artisan quarter", description: "A working neighbourhood of clay-image makers and quiet lanes by the river.", travelTime: "25–40 min by car", mode: "Drive", query: "Kumartuli Kolkata" },
      { name: "Belur Math", type: "Spiritual & heritage", description: "A serene riverside campus with architecture influenced by several Indian traditions.", travelTime: "45–60 min by car", mode: "Drive", query: "Belur Math Kolkata" },
    ],
    stays: [
      { name: "Hotel Cecil", area: "Central Kolkata", tier: "Value", price: "₹1,800–₹3,200/night", why: "A simple base for central sights and public transport.", query: "Hotel Cecil Kolkata" },
      { name: "The Astor", area: "Park Street", tier: "Balanced", price: "₹5,000–₹8,000/night", why: "A heritage-style stay near food, culture and evening walks.", query: "The Astor Kolkata hotel" },
      { name: "The Oberoi Grand", area: "New Market", tier: "Luxury", price: "₹14,000+/night", why: "Classic hospitality in the heart of the city’s heritage core.", query: "The Oberoi Grand Kolkata" },
    ],
    restaurants: [
      { name: "K.C. Das", area: "Bhowanipore / central city", tier: "Value", price: "₹150–₹400/person", cuisine: "Bengali sweets & snacks", why: "An easy, affordable taste of rasgulla, sandesh and Bengali treats.", query: "K C Das Kolkata" },
      { name: "6 Ballygunge Place", area: "Ballygunge", tier: "Balanced", price: "₹700–₹1,400/person", cuisine: "Bengali", why: "A reliable sit-down introduction to home-style Bengali cooking.", query: "6 Ballygunge Place Kolkata" },
      { name: "Peter Cat", area: "Park Street", tier: "Luxury", price: "₹1,200–₹2,000/person", cuisine: "Anglo-Indian & Continental", why: "A Kolkata classic for a memorable Park Street dinner.", query: "Peter Cat Park Street Kolkata" },
    ],
  },
  "ziro-valley-arunachal-pradesh": {
    nearby: [
      { name: "Hapoli", type: "Town & market", description: "The valley’s practical base for cafés, supplies and local transport.", travelTime: "10–20 min by car", mode: "Drive", query: "Hapoli Ziro Arunachal Pradesh" },
      { name: "Kile Pakho", type: "Viewpoint", description: "A short outing for broad views over the Ziro plateau and rice fields.", travelTime: "30–45 min by car", mode: "Drive", query: "Kile Pakho Ziro" },
      { name: "Talley Valley", type: "Wildlife sanctuary", description: "A forested excursion that needs a local guide and weather-aware planning.", travelTime: "2–3 hr by car", mode: "Drive", query: "Talley Valley Wildlife Sanctuary" },
    ],
    stays: [
      { name: "Ngunu Ziro Homestay", area: "Hapoli", tier: "Value", price: "₹1,500–₹2,800/night", why: "A local homestay experience that keeps the trip grounded and affordable.", query: "Ngunu Ziro Homestay" },
      { name: "Siiro Resort", area: "Ziro", tier: "Balanced", price: "₹4,000–₹7,000/night", why: "Comfortable rooms with a quiet valley setting.", query: "Siiro Resort Ziro" },
      { name: "Ziro Palace Inn", area: "Hapoli", tier: "Luxury", price: "₹8,000+/night", why: "A more polished base for travellers who want comfort after road journeys.", query: "Ziro Palace Inn" },
    ],
    restaurants: [
      { name: "Local Apatani Homestay Meal", area: "Hapoli villages", tier: "Value", price: "₹250–₹500/person", cuisine: "Apatani", why: "Ask your host for a home-cooked meal and local seasonal ingredients.", query: "Apatani food Ziro" },
      { name: "Ngunu Ziro Cafe", area: "Hapoli", tier: "Balanced", price: "₹500–₹1,000/person", cuisine: "Cafe & regional", why: "A relaxed stop between village walks and viewpoint drives.", query: "Ngunu Ziro cafe" },
      { name: "Siiro Resort Dining", area: "Ziro", tier: "Luxury", price: "₹1,000–₹1,800/person", cuisine: "Indian & regional", why: "Convenient for a quieter dinner when you are staying outside town.", query: "Siiro Resort Ziro restaurant" },
    ],
  },
  "sundarbans-west-bengal": {
    nearby: [
      { name: "Sajnekhali Watchtower", type: "Wildlife", description: "A key interpretation and birdwatching stop in the Indian Sundarbans.", travelTime: "20–40 min by boat", mode: "Boat", query: "Sajnekhali Watchtower Sundarbans" },
      { name: "Sudhanyakhali Watchtower", type: "Wildlife", description: "A classic safari stop where forest-edge sightings are possible.", travelTime: "30–60 min by boat", mode: "Boat", query: "Sudhanyakhali Watchtower Sundarbans" },
      { name: "Netidhopani", type: "Forest & heritage", description: "A remote watchtower and old temple area reached as part of a longer cruise.", travelTime: "1–2 hr by boat", mode: "Boat", query: "Netidhopani Watchtower Sundarbans" },
    ],
    stays: [
      { name: "Sajnekhali Tourist Lodge", area: "Sajnekhali", tier: "Value", price: "₹1,500–₹3,000/night", why: "A practical base when access and safari logistics matter most.", query: "Sajnekhali Tourist Lodge" },
      { name: "Sundarban Tiger Camp", area: "Dayapur", tier: "Balanced", price: "₹4,000–₹7,000/night", why: "Comfortable cottages with organised boat excursions.", query: "Sundarban Tiger Camp Dayapur" },
      { name: "Sundarban Jungle Camp", area: "Gosaba / Dayapur", tier: "Luxury", price: "₹9,000+/night", why: "A more immersive eco-stay with curated forest experiences.", query: "Sundarban Jungle Camp" },
    ],
    restaurants: [
      { name: "Local Fish Thali", area: "Gosaba", tier: "Value", price: "₹250–₹500/person", cuisine: "Bengali", why: "The most authentic value option is often a fresh meal arranged by your lodge.", query: "Bengali fish thali Gosaba" },
      { name: "Tiger Camp Dining", area: "Dayapur", tier: "Balanced", price: "₹500–₹1,000/person", cuisine: "Bengali & Indian", why: "Convenient after a full day on the water, with local dishes on request.", query: "Sundarban Tiger Camp restaurant" },
      { name: "Jungle Camp Dining", area: "Dayapur", tier: "Luxury", price: "₹1,000–₹1,800/person", cuisine: "Regional & Indian", why: "A slower lodge dinner with advance notice for special menus.", query: "Sundarban Jungle Camp restaurant" },
    ],
  },
  "mumbai-maharashtra": {
    nearby: [
      { name: "Gateway of India", type: "Heritage", description: "Mumbai’s iconic harbourfront starting point for the Elephanta ferry.", travelTime: "20–45 min by car", mode: "Drive", query: "Gateway of India Mumbai" },
      { name: "Elephanta Caves", type: "UNESCO heritage", description: "Island cave temples reached by ferry from the Gateway waterfront.", travelTime: "1 hr ferry + walk", mode: "Ferry", query: "Elephanta Caves Mumbai ferry" },
      { name: "Sanjay Gandhi National Park", type: "Nature", description: "A surprising green escape within the wider Mumbai metropolitan area.", travelTime: "45–90 min by car", mode: "Drive", query: "Sanjay Gandhi National Park Mumbai" },
    ],
    stays: [
      { name: "Hotel Suba Palace", area: "Colaba", tier: "Value", price: "₹3,000–₹5,500/night", why: "A compact base near the Gateway and South Mumbai walks.", query: "Hotel Suba Palace Mumbai" },
      { name: "Abode Bombay", area: "Colaba", tier: "Balanced", price: "₹6,000–₹10,000/night", why: "A characterful boutique stay in a very walkable neighbourhood.", query: "Abode Bombay hotel" },
      { name: "The Taj Mahal Palace", area: "Colaba", tier: "Luxury", price: "₹25,000+/night", why: "A landmark stay opposite the Gateway with full-service hospitality.", query: "Taj Mahal Palace Mumbai" },
    ],
    restaurants: [
      { name: "Cannon Pav Bhaji", area: "CST", tier: "Value", price: "₹150–₹350/person", cuisine: "Mumbai street food", why: "A quick, iconic city bite close to the heritage district.", query: "Cannon Pav Bhaji Mumbai" },
      { name: "Britannia & Co.", area: "Ballard Estate", tier: "Balanced", price: "₹500–₹1,000/person", cuisine: "Parsi", why: "A Mumbai institution for berry pulao and Parsi comfort food.", query: "Britannia and Co Mumbai" },
      { name: "Masque", area: "Lower Parel", tier: "Luxury", price: "₹4,000+/person", cuisine: "Indian tasting menu", why: "A destination meal for travellers who want an ambitious modern Indian menu.", query: "Masque restaurant Mumbai" },
    ],
  },
  "udaipur-rajasthan-west-india": {
    nearby: [
      { name: "City Palace", type: "Heritage", description: "The essential palace complex above Lake Pichola and Udaipur’s old city.", travelTime: "10–20 min by car", mode: "Drive", query: "City Palace Udaipur" },
      { name: "Sajjangarh Monsoon Palace", type: "Viewpoint", description: "A hilltop sunset stop with wide Aravalli and lake views.", travelTime: "30–45 min by car", mode: "Drive", query: "Sajjangarh Monsoon Palace Udaipur" },
      { name: "Bagore Ki Haveli", type: "Culture", description: "A lakeside haveli with a popular evening folk performance.", travelTime: "10–20 min by car", mode: "Drive", query: "Bagore Ki Haveli Udaipur" },
    ],
    stays: [
      { name: "Hotel Mewar Haveli", area: "Lake Pichola", tier: "Value", price: "₹2,000–₹4,000/night", why: "A good-value old-city base with lake-area access.", query: "Hotel Mewar Haveli Udaipur" },
      { name: "Amet Haveli", area: "Lake Pichola", tier: "Balanced", price: "₹7,000–₹12,000/night", why: "A heritage atmosphere and memorable lake-facing setting.", query: "Amet Haveli Udaipur" },
      { name: "The Leela Palace Udaipur", area: "Lake Pichola", tier: "Luxury", price: "₹35,000+/night", why: "Full-service lake views and a special-occasion royal stay.", query: "The Leela Palace Udaipur" },
    ],
    restaurants: [
      { name: "Natraj Dining Hall", area: "Surajpole", tier: "Value", price: "₹250–₹500/person", cuisine: "Rajasthani thali", why: "A filling local thali at an approachable price.", query: "Natraj Dining Hall Udaipur" },
      { name: "Krishna Dining", area: "Old City", tier: "Balanced", price: "₹600–₹1,200/person", cuisine: "North Indian & Rajasthani", why: "A convenient choice after palace and lake walks.", query: "Krishna Dining Udaipur" },
      { name: "Sheesh Mahal", area: "The Leela Palace", tier: "Luxury", price: "₹2,000+/person", cuisine: "Indian fine dining", why: "An atmospheric dinner overlooking the lake and old city.", query: "Sheesh Mahal Udaipur restaurant" },
    ],
  },
  "rann-of-kutch-great-rann-dhordo": {
    nearby: [
      { name: "White Rann Viewpoint", type: "Salt desert", description: "The signature sunrise and sunset landscape near Dhordo.", travelTime: "15–30 min by car", mode: "Drive", query: "White Rann Dhordo" },
      { name: "Kalo Dungar", type: "Viewpoint", description: "The Black Hills offer the widest elevated view toward the Great Rann.", travelTime: "1.5–2 hr by car", mode: "Drive", query: "Kalo Dungar Gujarat" },
      { name: "Hodka Craft Village", type: "Craft & culture", description: "Meet Kutchi makers and browse embroidery, leather, pottery and mud work.", travelTime: "20–40 min by car", mode: "Drive", query: "Hodka village Kutch crafts" },
    ],
    stays: [
      { name: "Rann Riders", area: "Dasada / Kutch route", tier: "Value", price: "₹3,000–₹5,000/night", why: "A practical eco-style base for travellers balancing cost and access.", query: "Rann Riders Gujarat" },
      { name: "Shaam-e-Sarhad Village Resort", area: "Hodka", tier: "Balanced", price: "₹5,000–₹9,000/night", why: "A culturally rooted stay with craft-village access.", query: "Shaam e Sarhad Village Resort Hodka" },
      { name: "Rann Utsav Tent City", area: "Dhordo", tier: "Luxury", price: "₹12,000+/night", why: "The most convenient all-in-one seasonal experience near the White Rann.", query: "Rann Utsav Tent City Dhordo" },
    ],
    restaurants: [
      { name: "Kutchi Home Thali", area: "Hodka villages", tier: "Value", price: "₹250–₹500/person", cuisine: "Kutchi vegetarian", why: "A direct way to taste local bajra rotla, kadhi and seasonal sides.", query: "Kutchi thali Hodka" },
      { name: "Shaam-e-Sarhad Dining", area: "Hodka", tier: "Balanced", price: "₹600–₹1,000/person", cuisine: "Kutchi & Gujarati", why: "A dependable regional meal close to the craft villages.", query: "Shaam e Sarhad restaurant" },
      { name: "Rann Utsav Dining", area: "Dhordo", tier: "Luxury", price: "₹1,000–₹1,800/person", cuisine: "Gujarati & Indian", why: "Convenient buffet-style dining if you are staying inside the tent city.", query: "Rann Utsav Tent City restaurant" },
    ],
  },
  "mahabaleshwar-maharashtra": {
    nearby: [
      { name: "Venna Lake", type: "Lake", description: "An easy boating and lakeside-walk stop close to town.", travelTime: "10–20 min by car", mode: "Drive", query: "Venna Lake Mahabaleshwar" },
      { name: "Pratapgad Fort", type: "Heritage", description: "A dramatic Maratha fort reached by a scenic road through the hills.", travelTime: "45–60 min by car", mode: "Drive", query: "Pratapgad Fort Maharashtra" },
      { name: "Lingmala Waterfall", type: "Waterfall", description: "A seasonal monsoon highlight surrounded by green Western Ghats scenery.", travelTime: "20–30 min by car", mode: "Drive", query: "Lingmala Waterfall Mahabaleshwar" },
    ],
    stays: [
      { name: "Hotel Pankaj Executive", area: "Market Road", tier: "Value", price: "₹1,800–₹3,000/night", why: "A straightforward town base near shops and restaurants.", query: "Hotel Pankaj Executive Mahabaleshwar" },
      { name: "Brightland Resort & Spa", area: "Kates Point Road", tier: "Balanced", price: "₹6,000–₹10,000/night", why: "A comfortable resort with space, views and spa-style downtime.", query: "Brightland Resort Mahabaleshwar" },
      { name: "Le Meridien Mahabaleshwar Resort & Spa", area: "Pangari", tier: "Luxury", price: "₹15,000+/night", why: "A polished forest resort for a slower Western Ghats break.", query: "Le Meridien Mahabaleshwar Resort" },
    ],
    restaurants: [
      { name: "Mapro Garden", area: "Panchgani Road", tier: "Value", price: "₹250–₹600/person", cuisine: "Cafe & strawberry treats", why: "A family-friendly stop for sandwiches, pizza and local fruit products.", query: "Mapro Garden Mahabaleshwar restaurant" },
      { name: "Farmhouse Bistro", area: "Market Road", tier: "Balanced", price: "₹600–₹1,200/person", cuisine: "Indian & Continental", why: "A relaxed sit-down option after viewpoint drives.", query: "Farmhouse Bistro Mahabaleshwar" },
      { name: "Chingari", area: "Le Meridien", tier: "Luxury", price: "₹1,500+/person", cuisine: "Indian fine dining", why: "A more polished dinner in a resort setting.", query: "Chingari restaurant Mahabaleshwar" },
    ],
  },
  "jaisalmer-rajasthan": {
    nearby: [
      { name: "Jaisalmer Fort", type: "Heritage", description: "A living sandstone fort with temples, lanes, shops and local homes.", travelTime: "10–20 min by car", mode: "Drive", query: "Jaisalmer Fort" },
      { name: "Sam Sand Dunes", type: "Desert safari", description: "The classic sunset camel or jeep safari and camp circuit outside the city.", travelTime: "45–60 min by car", mode: "Drive", query: "Sam Sand Dunes Jaisalmer" },
      { name: "Desert National Park", type: "Wildlife", description: "A stark Thar landscape with chinkara, desert fox and seasonal birdlife.", travelTime: "1–1.5 hr by car", mode: "Drive", query: "Desert National Park Jaisalmer" },
    ],
    stays: [
      { name: "Hotel Tokyo Palace", area: "Near Jaisalmer Fort", tier: "Value", price: "₹1,800–₹3,200/night", why: "A popular budget base with fort access and a rooftop feel.", query: "Hotel Tokyo Palace Jaisalmer" },
      { name: "1st Gate Home Fusion", area: "Fort Road", tier: "Balanced", price: "₹5,000–₹9,000/night", why: "Boutique comfort with views and an easy old-city location.", query: "1st Gate Home Fusion Jaisalmer" },
      { name: "Suryagarh Jaisalmer", area: "Sam Road", tier: "Luxury", price: "₹20,000+/night", why: "A destination desert palace for a full-service special stay.", query: "Suryagarh Jaisalmer" },
    ],
    restaurants: [
      { name: "Dhanraj Bhojonalaya", area: "Fort Road", tier: "Value", price: "₹200–₹500/person", cuisine: "Rajasthani vegetarian", why: "A filling local thali close to the fort at a gentle price.", query: "Dhanraj Bhojonalaya Jaisalmer" },
      { name: "The Lalgarh", area: "Sam Road", tier: "Balanced", price: "₹600–₹1,200/person", cuisine: "Indian & Continental", why: "A comfortable dinner option for travellers staying near the desert road.", query: "The Lalgarh Jaisalmer restaurant" },
      { name: "Wyra Rooftop Restaurant", area: "Jaisalmer Marriott", tier: "Luxury", price: "₹1,500+/person", cuisine: "Indian & international", why: "A sunset-friendly rooftop dinner with a more polished setting.", query: "Wyra Rooftop Restaurant Jaisalmer" },
    ],
  },
};

function mapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function getTravelGuide(destination: Destination): TravelGuide {
  const curated = curatedGuides[destination.id];
  if (curated) return curated;
  const nearby = destination.highlights.slice(0, 3).map((highlight, index) => ({
    name: highlight,
    type: "Nearby highlight",
    description: `A good first stop to pair with your ${destination.name} visit.`,
    travelTime: index === 0 ? "10–30 min by car" : index === 1 ? "30–60 min by car" : "1–2 hr by car",
    mode: "Drive",
    query: `${highlight}, ${destination.name}`,
  }));
  return {
    nearby,
    stays: [
      { name: `${destination.name} local guesthouse`, area: "Central area", tier: "Value", price: `${destination.budgetMin ? `₹${Math.max(1200, Math.round(destination.budgetMin / 8 / 100) * 100).toLocaleString("en-IN")}–₹${Math.max(2200, Math.round(destination.budgetMin / 4 / 100) * 100).toLocaleString("en-IN")}` : "₹1,500–₹3,000"}/night`, why: "A simple local base close to everyday transport and food.", query: `budget guesthouse ${destination.name}` },
      { name: `${destination.name} town hotel`, area: "Central area", tier: "Balanced", price: "₹4,000–₹8,000/night", why: "A comfortable middle-ground option for most travellers.", query: `recommended hotel ${destination.name}` },
      { name: `${destination.name} resort stay`, area: "Scenic outskirts", tier: "Luxury", price: "₹10,000+/night", why: "More space, views and on-site comfort when the stay is part of the experience.", query: `luxury resort ${destination.name}` },
    ],
    restaurants: [
      { name: `${destination.name} local thali`, area: "Central area", tier: "Value", price: "₹200–₹500/person", cuisine: "Regional", why: "Look for the busy local option near the market for the best value.", query: `local thali restaurant ${destination.name}` },
      { name: `${destination.name} neighbourhood cafe`, area: "Central area", tier: "Balanced", price: "₹600–₹1,200/person", cuisine: "Indian & cafe", why: "A relaxed middle-budget meal between sightseeing stops.", query: `best cafe restaurant ${destination.name}` },
      { name: `${destination.name} signature dining`, area: "Top hotels", tier: "Luxury", price: "₹1,500+/person", cuisine: "Indian & international", why: "Choose a well-reviewed hotel restaurant for a more polished evening.", query: `fine dining restaurant ${destination.name}` },
    ],
  };
}

export function withMapLinks(guide: TravelGuide) {
  return {
    nearby: guide.nearby.map((item) => ({ ...item, mapsUrl: mapsSearch(item.query) })),
    stays: guide.stays.map((item) => ({ ...item, mapsUrl: mapsSearch(item.query) })),
    restaurants: guide.restaurants.map((item) => ({ ...item, mapsUrl: mapsSearch(item.query) })),
  };
}
