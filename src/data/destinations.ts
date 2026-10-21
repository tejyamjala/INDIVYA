import type { Destination } from "../types";

type SourceDestination = {
  id: string; name: string; state: string; region: string; categories: string[];
  description: string; bestSeason: string; months: string; duration: string;
  budget: string; latitude: number; longitude: number; highlights: string[]; image: string;
};

const sourceDestinations: SourceDestination[] = [
  {
    "id": "leh-ladakh",
    "name": "Leh & Ladakh",
    "state": "Ladakh",
    "region": "North India",
    "categories": [
      "Mountains",
      "Adventure",
      "Offbeat"
    ],
    "description": "High-altitude horizons, ancient monasteries and roads that turn every bend into a memory.",
    "bestSeason": "Summer",
    "months": "May – September",
    "duration": "5–8 days",
    "budget": "₹18,000 – ₹35,000",
    "latitude": 34.1526,
    "longitude": 77.5771,
    "highlights": [
      "Pangong Lake",
      "Thiksey Monastery",
      "Nubra Valley",
      "Khardung La"
    ],
    "image": "https://images.pexels.com/photos/31838207/pexels-photo-31838207.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "varkala",
    "name": "Varkala",
    "state": "Kerala",
    "region": "South India",
    "categories": [
      "Beaches",
      "Wellness",
      "Nature"
    ],
    "description": "A red-cliff coastline where slow mornings, Ayurvedic rituals and Arabian Sea sunsets meet.",
    "bestSeason": "Winter",
    "months": "October – February",
    "duration": "3–4 days",
    "budget": "₹9,000 – ₹18,000",
    "latitude": 8.7379,
    "longitude": 76.7163,
    "highlights": [
      "Papanasam Beach",
      "Cliff cafés",
      "Janardhana Temple",
      "Kappil Lake"
    ],
    "image": "https://images.pexels.com/photos/27566375/pexels-photo-27566375.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "jaipur",
    "name": "Jaipur",
    "state": "Rajasthan",
    "region": "North India",
    "categories": [
      "Heritage",
      "Culture",
      "Food"
    ],
    "description": "The Pink City glows with royal forts, craft traditions and the warm pulse of Rajasthani life.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "2–4 days",
    "budget": "₹7,000 – ₹16,000",
    "latitude": 26.9124,
    "longitude": 75.7873,
    "highlights": [
      "Amber Fort",
      "Hawa Mahal",
      "Jantar Mantar",
      "Jal Mahal"
    ],
    "image": "https://images.pexels.com/photos/33516663/pexels-photo-33516663.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "goa",
    "name": "Goa",
    "state": "Goa",
    "region": "West India",
    "categories": [
      "Beaches",
      "Food",
      "Romantic"
    ],
    "description": "Palm-lined shores, Portuguese lanes and long lunches made for lingering.",
    "bestSeason": "Winter",
    "months": "November – February",
    "duration": "3–5 days",
    "budget": "₹10,000 – ₹24,000",
    "latitude": 15.2993,
    "longitude": 74.124,
    "highlights": [
      "Palolem Beach",
      "Fontainhas",
      "Dudhsagar Falls",
      "Basilica of Bom Jesus"
    ],
    "image": "https://images.pexels.com/photos/37943870/pexels-photo-37943870.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "agra",
    "name": "Agra",
    "state": "Uttar Pradesh",
    "region": "North India",
    "categories": [
      "Heritage",
      "Romantic",
      "Culture"
    ],
    "description": "A city of marble poetry, Mughal gardens and one unforgettable sunrise.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "1–2 days",
    "budget": "₹4,000 – ₹10,000",
    "latitude": 27.1767,
    "longitude": 78.0081,
    "highlights": [
      "Taj Mahal",
      "Agra Fort",
      "Mehtab Bagh",
      "Itmad-ud-Daulah"
    ],
    "image": "https://images.pexels.com/photos/6147573/pexels-photo-6147573.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "mcleodganj",
    "name": "McLeod Ganj",
    "state": "Himachal Pradesh",
    "region": "North India",
    "categories": [
      "Mountains",
      "Spiritual",
      "Nature"
    ],
    "description": "Pine forests, mountain cafés and a thoughtful rhythm in the foothills of the Dhauladhar.",
    "bestSeason": "Spring & Autumn",
    "months": "March – June, September – November",
    "duration": "3–5 days",
    "budget": "₹8,000 – ₹18,000",
    "latitude": 32.2426,
    "longitude": 76.3213,
    "highlights": [
      "Triund Trek",
      "Namgyal Monastery",
      "Bhagsu Waterfall",
      "Dal Lake"
    ],
    "image": "https://images.pexels.com/photos/37763593/pexels-photo-37763593.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "manali",
    "name": "Manali",
    "state": "Himachal Pradesh",
    "region": "North India",
    "categories": [
      "Mountains",
      "Adventure",
      "Romantic"
    ],
    "description": "A pine-scented mountain town with river valleys, snow roads and an easy sense of escape.",
    "bestSeason": "Spring & Summer",
    "months": "March – June, October – February",
    "duration": "4–6 days",
    "budget": "₹10,000 – ₹24,000",
    "latitude": 32.2396,
    "longitude": 77.1887,
    "highlights": [
      "Solang Valley",
      "Old Manali",
      "Rohtang Pass",
      "Hidimba Temple"
    ],
    "image": "https://images.pexels.com/photos/29494184/pexels-photo-29494184.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "gokarna",
    "name": "Gokarna",
    "state": "Karnataka",
    "region": "West India",
    "categories": [
      "Beaches",
      "Spiritual",
      "Offbeat"
    ],
    "description": "A quieter coast of hidden coves, temple bells and sunsets that arrive without ceremony.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "2–4 days",
    "budget": "₹6,000 – ₹14,000",
    "latitude": 14.5479,
    "longitude": 74.3188,
    "highlights": [
      "Kudle Beach",
      "Om Beach",
      "Half Moon Beach",
      "Mahabaleshwar Temple"
    ],
    "image": "https://images.pexels.com/photos/17344039/pexels-photo-17344039.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "tirupati",
    "name": "Tirupati",
    "state": "Andhra Pradesh",
    "region": "South India",
    "categories": [
      "Spiritual",
      "Culture",
      "Family"
    ],
    "description": "A deeply spiritual journey through forested hills, living traditions and the energy of Tirumala.",
    "bestSeason": "Winter",
    "months": "November – February",
    "duration": "1–2 days",
    "budget": "₹4,000 – ₹9,000",
    "latitude": 13.6288,
    "longitude": 79.4192,
    "highlights": [
      "Tirumala Temple",
      "Kapila Theertham",
      "Sri Govindaraja Swamy Temple",
      "Silathoranam"
    ],
    "image": "https://images.pexels.com/photos/36771235/pexels-photo-36771235.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "ooty",
    "name": "Ooty",
    "state": "Tamil Nadu",
    "region": "South India",
    "categories": [
      "Mountains",
      "Nature",
      "Family"
    ],
    "description": "Misty Nilgiri mornings, heritage trains and tea country wrapped in soft green hills.",
    "bestSeason": "Spring & Summer",
    "months": "March – June",
    "duration": "3–4 days",
    "budget": "₹7,000 – ₹16,000",
    "latitude": 11.4102,
    "longitude": 76.695,
    "highlights": [
      "Ooty Lake",
      "Nilgiri Mountain Railway",
      "Doddabetta Peak",
      "Tea Museum"
    ],
    "image": "https://images.pexels.com/photos/9411142/pexels-photo-9411142.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "munnar",
    "name": "Munnar",
    "state": "Kerala",
    "region": "South India",
    "categories": [
      "Nature",
      "Mountains",
      "Romantic"
    ],
    "description": "Endless tea gardens, cool highland air and winding roads through Kerala’s green heart.",
    "bestSeason": "Winter & Summer",
    "months": "September – May",
    "duration": "3–5 days",
    "budget": "₹8,000 – ₹18,000",
    "latitude": 10.0889,
    "longitude": 77.0595,
    "highlights": [
      "Tea plantations",
      "Eravikulam National Park",
      "Mattupetty Dam",
      "Top Station"
    ],
    "image": "https://images.pexels.com/photos/36623929/pexels-photo-36623929.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "meghalaya",
    "name": "Meghalaya",
    "state": "Meghalaya",
    "region": "East India",
    "categories": [
      "Nature",
      "Adventure",
      "Offbeat"
    ],
    "description": "Living root bridges, cloud forests and waterfalls hidden in one of India’s wildest landscapes.",
    "bestSeason": "Autumn & Winter",
    "months": "October – April",
    "duration": "5–7 days",
    "budget": "₹14,000 – ₹28,000",
    "latitude": 25.467,
    "longitude": 91.3662,
    "highlights": [
      "Cherrapunji",
      "Living Root Bridges",
      "Dawki River",
      "Krang Shuri Falls"
    ],
    "image": "https://images.pexels.com/photos/19469039/pexels-photo-19469039.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "darjeeling",
    "name": "Darjeeling",
    "state": "West Bengal",
    "region": "East India",
    "categories": [
      "Mountains",
      "Food",
      "Heritage"
    ],
    "description": "Toy-train whistles, first-flush tea and Kanchenjunga appearing at the edge of the morning.",
    "bestSeason": "Spring & Autumn",
    "months": "March – May, October – November",
    "duration": "3–5 days",
    "budget": "₹9,000 – ₹20,000",
    "latitude": 27.041,
    "longitude": 88.2663,
    "highlights": [
      "Tiger Hill",
      "Darjeeling Himalayan Railway",
      "Tea estates",
      "Batasia Loop"
    ],
    "image": "https://images.pexels.com/photos/103875/pexels-photo-103875.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "coorg",
    "name": "Coorg",
    "state": "Karnataka",
    "region": "South India",
    "categories": [
      "Nature",
      "Mountains",
      "Romantic"
    ],
    "description": "Mist-covered coffee country with forest trails, generous food and slow highland mornings.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "3–4 days",
    "budget": "₹8,000 – ₹18,000",
    "latitude": 12.3375,
    "longitude": 75.8069,
    "highlights": [
      "Coffee estates",
      "Abbey Falls",
      "Raja’s Seat",
      "Madikeri Fort"
    ],
    "image": "https://images.pexels.com/photos/33046721/pexels-photo-33046721.png?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "alleppey",
    "name": "Alleppey",
    "state": "Kerala",
    "region": "South India",
    "categories": [
      "Nature",
      "Romantic",
      "Family"
    ],
    "description": "Quiet canals, village palms and a houseboat drifting through Kerala’s most dreamlike landscape.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "2–3 days",
    "budget": "₹8,000 – ₹20,000",
    "latitude": 9.4981,
    "longitude": 76.3388,
    "highlights": [
      "Vembanad Lake",
      "Houseboat cruise",
      "Alleppey Beach",
      "Kuttanad villages"
    ],
    "image": "https://images.pexels.com/photos/17928231/pexels-photo-17928231.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "bhubaneswar",
    "name": "Bhubaneswar",
    "state": "Odisha",
    "region": "East India",
    "categories": [
      "Heritage",
      "Spiritual",
      "Culture"
    ],
    "description": "A living temple city where ancient stone, local craft and modern Odisha meet with quiet confidence.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "2–3 days",
    "budget": "₹5,000 – ₹12,000",
    "latitude": 20.2961,
    "longitude": 85.8245,
    "highlights": [
      "Lingaraj Temple",
      "Udayagiri Caves",
      "Dhauli Shanti Stupa",
      "Odisha State Museum"
    ],
    "image": "https://images.pexels.com/photos/19843349/pexels-photo-19843349.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "puri",
    "name": "Puri",
    "state": "Odisha",
    "region": "East India",
    "categories": [
      "Beaches",
      "Spiritual",
      "Culture"
    ],
    "description": "A pilgrimage coast filled with temple rituals, sea air and the vivid life of Odisha’s shoreline.",
    "bestSeason": "Winter",
    "months": "October – February",
    "duration": "2–3 days",
    "budget": "₹5,000 – ₹12,000",
    "latitude": 19.8135,
    "longitude": 85.8312,
    "highlights": [
      "Jagannath Temple",
      "Puri Beach",
      "Raghurajpur village",
      "Konark Sun Temple"
    ],
    "image": "https://images.pexels.com/photos/38128917/pexels-photo-38128917.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "pondicherry",
    "name": "Pondicherry",
    "state": "Tamil Nadu",
    "region": "South India",
    "categories": [
      "Beaches",
      "Heritage",
      "Food",
      "Romantic"
    ],
    "description": "French-quarter lanes, Tamil warmth, cafés and a seafront made for walking slowly.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "2–4 days",
    "budget": "₹7,000 – ₹16,000",
    "latitude": 11.9416,
    "longitude": 79.8083,
    "highlights": [
      "French Quarter",
      "Promenade Beach",
      "Auroville",
      "Sri Aurobindo Ashram"
    ],
    "image": "https://images.pexels.com/photos/38199872/pexels-photo-38199872.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "hampi",
    "name": "Hampi",
    "state": "Karnataka",
    "region": "South India",
    "categories": [
      "Heritage",
      "Adventure",
      "Offbeat"
    ],
    "description": "Boulder landscapes and temple ruins that make the past feel close enough to touch.",
    "bestSeason": "Winter",
    "months": "October – February",
    "duration": "2–4 days",
    "budget": "₹6,000 – ₹15,000",
    "latitude": 15.335,
    "longitude": 76.46,
    "highlights": [
      "Virupaksha Temple",
      "Vittala Temple",
      "Hampi Bazaar",
      "Matanga Hill"
    ],
    "image": "https://images.pexels.com/photos/38605003/pexels-photo-38605003.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "rishikesh",
    "name": "Rishikesh",
    "state": "Uttarakhand",
    "region": "North India",
    "categories": [
      "Adventure",
      "Spiritual",
      "Nature"
    ],
    "description": "River mornings, forested foothills and a place to move, breathe and begin again.",
    "bestSeason": "Spring & Autumn",
    "months": "March – May, September – November",
    "duration": "3–5 days",
    "budget": "₹7,000 – ₹18,000",
    "latitude": 30.0869,
    "longitude": 78.2676,
    "highlights": [
      "Ganga Aarti",
      "River rafting",
      "Beatles Ashram",
      "Neer Garh Waterfall"
    ],
    "image": "https://images.pexels.com/photos/36123978/pexels-photo-36123978.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "andaman",
    "name": "Andaman Islands",
    "state": "Andaman & Nicobar",
    "region": "East India",
    "categories": [
      "Beaches",
      "Nature",
      "Adventure"
    ],
    "description": "Turquoise water, rainforest edges and an island rhythm that makes time feel wonderfully loose.",
    "bestSeason": "Winter",
    "months": "November – April",
    "duration": "5–8 days",
    "budget": "₹22,000 – ₹45,000",
    "latitude": 11.6234,
    "longitude": 92.7265,
    "highlights": [
      "Radhanagar Beach",
      "Cellular Jail",
      "Snorkelling",
      "Ross Island"
    ],
    "image": "https://images.pexels.com/photos/37943870/pexels-photo-37943870.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "gangtok-sikkim",
    "name": "Gangtok",
    "state": "Sikkim",
    "region": "East India",
    "categories": ["Mountains", "Culture", "Nature", "Spiritual", "Food"],
    "description": "Sikkim’s highland capital pairs Kanchenjunga-facing viewpoints with Buddhist monasteries, lively markets and a walkable mountain-city rhythm.",
    "bestSeason": "Spring & Autumn",
    "months": "March – May, October – mid-December",
    "duration": "4–5 days",
    "budget": "₹12,000 – ₹22,000",
    "latitude": 27.338936,
    "longitude": 88.606506,
    "highlights": ["MG Marg promenade", "Tashi View Point", "Rumtek & Enchey monasteries", "Tsomgo Lake excursion"],
    "image": "https://images.pexels.com/photos/37763593/pexels-photo-37763593.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "kaziranga-national-park",
    "name": "Kaziranga National Park",
    "state": "Assam",
    "region": "East India",
    "categories": ["Nature", "Adventure", "Offbeat", "Family"],
    "description": "A Brahmaputra floodplain of tall grasslands, wetlands and woodland, Kaziranga is one of India’s best settings for seeing the one-horned rhinoceros.",
    "bestSeason": "Peak wildlife season",
    "months": "November – April",
    "duration": "2–3 days",
    "budget": "₹12,000 – ₹30,000",
    "latitude": 26.6667,
    "longitude": 93.4167,
    "highlights": ["Jeep safari through the park ranges", "One-horned rhinoceros sightings", "Wetland birdwatching", "Tea gardens & Karbi Hills"],
    "image": "https://images.pexels.com/photos/19469039/pexels-photo-19469039.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "kolkata-west-bengal",
    "name": "Kolkata",
    "state": "West Bengal",
    "region": "East India",
    "categories": ["Heritage", "Culture", "Food", "Spiritual", "Nature"],
    "description": "An atmospheric Hooghly-side metropolis where colonial landmarks, Bengali literature, devotional sites and neighbourhood food traditions share the stage.",
    "bestSeason": "Cool, dry season",
    "months": "October – March",
    "duration": "3–4 days",
    "budget": "₹12,000 – ₹30,000",
    "latitude": 22.5726,
    "longitude": 88.3639,
    "highlights": ["Victoria Memorial", "Howrah Bridge & Hooghly riverfront", "Indian Museum & Maidan", "Kumartuli artisan quarter"],
    "image": "https://images.pexels.com/photos/6147573/pexels-photo-6147573.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "ziro-valley-arunachal-pradesh",
    "name": "Ziro Valley",
    "state": "Arunachal Pradesh",
    "region": "East India",
    "categories": ["Mountains", "Culture", "Nature", "Offbeat", "Adventure"],
    "description": "A highland basin of pine ridges, rice terraces and Apatani villages, Ziro offers a quieter Himalayan escape rooted in living agricultural traditions.",
    "bestSeason": "Spring & Autumn",
    "months": "March – May, September – November",
    "duration": "4–5 days",
    "budget": "₹18,000 – ₹30,000",
    "latitude": 27.59497,
    "longitude": 93.83854,
    "highlights": ["Apatani villages & rice terraces", "Kile Pakho viewpoint", "Talley Valley Wildlife Sanctuary", "Pine Grove & Siikhe Lake"],
    "image": "https://images.pexels.com/photos/31838207/pexels-photo-31838207.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "sundarbans-west-bengal",
    "name": "Indian Sundarbans",
    "state": "West Bengal",
    "region": "East India",
    "categories": ["Nature", "Adventure", "Offbeat", "Family"],
    "description": "A tide-shaped maze of mangrove islands and creeks explored by permitted boat, with wildlife cruises, watchtowers and village-edge landscapes.",
    "bestSeason": "Winter / dry season",
    "months": "October – March",
    "duration": "3 days / 2 nights",
    "budget": "₹8,000 – ₹15,000",
    "latitude": 21.945,
    "longitude": 88.895833,
    "highlights": ["Boat safari through tidal creeks", "Sajnekhali Ecotourism Centre", "Sudhanyakhali Watchtower", "Netidhopani Watchtower"],
    "image": "https://images.pexels.com/photos/37943870/pexels-photo-37943870.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "mumbai-maharashtra",
    "name": "Mumbai",
    "state": "Maharashtra",
    "region": "West India",
    "categories": ["Heritage", "Culture", "Food", "Beaches", "Nature"],
    "description": "Maharashtra’s Arabian Sea metropolis brings Victorian Gothic landmarks, Art Deco streets, island caves, markets and a lively film-and-food culture together.",
    "bestSeason": "Winter / dry season",
    "months": "October – February",
    "duration": "3–5 days",
    "budget": "₹10,000 – ₹40,000",
    "latitude": 19.076,
    "longitude": 72.8777,
    "highlights": ["Gateway of India & Elephanta Caves", "Chhatrapati Shivaji Maharaj Terminus", "Marine Drive & Girgaum Chowpatty", "Sanjay Gandhi National Park"],
    "image": "https://images.pexels.com/photos/37943870/pexels-photo-37943870.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "udaipur-rajasthan-west-india",
    "name": "Udaipur",
    "state": "Rajasthan",
    "region": "West India",
    "categories": ["Heritage", "Culture", "Romantic", "Nature"],
    "description": "The historic Mewar capital is arranged around Lake Pichola, where palaces, havelis, temples and evening performances create a scenic royal city break.",
    "bestSeason": "Winter & early spring",
    "months": "October – March",
    "duration": "3 days / 2 nights",
    "budget": "₹12,000 – ₹30,000",
    "latitude": 24.57127,
    "longitude": 73.691544,
    "highlights": ["City Palace complex", "Lake Pichola boat ride", "Bagore Ki Haveli", "Sajjangarh Monsoon Palace"],
    "image": "https://images.pexels.com/photos/33516663/pexels-photo-33516663.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "rann-of-kutch-great-rann-dhordo",
    "name": "Rann of Kutch",
    "state": "Gujarat",
    "region": "West India",
    "categories": ["Offbeat", "Culture", "Nature", "Adventure"],
    "description": "The Great Rann becomes a striking white salt landscape in the dry months, best paired with Kutchi embroidery, folk music, village craft and food around Dhordo.",
    "bestSeason": "Winter / dry season",
    "months": "November – February",
    "duration": "2–3 days",
    "budget": "₹8,000 – ₹30,000",
    "latitude": 23.8063981,
    "longitude": 69.5125024,
    "highlights": ["White Rann sunrise & sunset", "Seasonal Rann Utsav", "Kalo Dungar (Black Hills)", "Banni craft villages"],
    "image": "https://images.pexels.com/photos/33518945/pexels-photo-33518945.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "mahabaleshwar-maharashtra",
    "name": "Mahabaleshwar",
    "state": "Maharashtra",
    "region": "West India",
    "categories": ["Mountains", "Nature", "Adventure", "Heritage", "Food"],
    "description": "A Western Ghats hill station of forested plateaus, dramatic valley viewpoints, waterfalls and cool-weather escapes, with Maratha history and strawberry treats along the way.",
    "bestSeason": "Monsoon & winter",
    "months": "June – February",
    "duration": "2–3 days / 2 nights",
    "budget": "₹6,000 – ₹18,000",
    "latitude": 17.921721,
    "longitude": 73.655602,
    "highlights": ["Arthur’s Seat viewpoint", "Venna Lake", "Pratapgad Fort", "Lingmala Waterfall"],
    "image": "https://images.pexels.com/photos/9411142/pexels-photo-9411142.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "jaisalmer-rajasthan",
    "name": "Jaisalmer",
    "state": "Rajasthan",
    "region": "West India",
    "categories": ["Heritage", "Culture", "Adventure", "Nature"],
    "description": "Rajasthan’s desert-edge Golden City centres on a living sandstone fort and medieval trading lanes, then opens into a Thar circuit of dunes, camps and folk evenings.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "2–3 days",
    "budget": "₹10,000 – ₹30,000",
    "latitude": 26.911661,
    "longitude": 70.922928,
    "highlights": ["Jaisalmer Fort", "Sam Sand Dunes safari", "Patwon Ki Haveli", "Desert National Park"],
    "image": "https://images.pexels.com/photos/33516663/pexels-photo-33516663.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "somnath",
    "name": "Somnath",
    "state": "Gujarat",
    "region": "West India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Heritage"
    ],
    "description": "The first of the twelve Jyotirlingas, standing by the Arabian Sea with centuries of devotion in its stones.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "1–2 days",
    "budget": "₹4,000 – ₹10,000",
    "latitude": 20.888,
    "longitude": 70.4017,
    "highlights": [
      "Somnath Temple",
      "Triveni Sangam",
      "Bhalka Tirth",
      "Sound & Light Show"
    ],
    "image": "https://images.pexels.com/photos/32604468/pexels-photo-32604468.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "mallikarjuna",
    "name": "Mallikarjuna (Srisailam)",
    "state": "Andhra Pradesh",
    "region": "South India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Nature"
    ],
    "description": "One of the twelve Jyotirlingas, nestled in the Nallamala hills beside the Krishna River.",
    "bestSeason": "Winter",
    "months": "October – February",
    "duration": "2–3 days",
    "budget": "₹5,000 – ₹12,000",
    "latitude": 16.0734,
    "longitude": 78.8695,
    "highlights": [
      "Bhramaramba Temple",
      "Srisailam Dam",
      "Akka Mahadevi Caves",
      "Patala Ganga"
    ],
    "image": "https://images.pexels.com/photos/2796964/pexels-photo-2796964.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "mahakaleshwar",
    "name": "Mahakaleshwar (Ujjain)",
    "state": "Madhya Pradesh",
    "region": "Central India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Culture"
    ],
    "description": "The only Jyotirlinga facing south, on the banks of the Shipra River in one of India’s oldest sacred cities.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "2–3 days",
    "budget": "₹5,000 – ₹12,000",
    "latitude": 23.1825,
    "longitude": 75.7684,
    "highlights": [
      "Mahakaleshwar Temple",
      "Bhasma Aarti",
      "Kal Bhairav Temple",
      "Ram Ghat"
    ],
    "image": "https://images.pexels.com/photos/38087489/pexels-photo-38087489.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "omkareshwar",
    "name": "Omkareshwar",
    "state": "Madhya Pradesh",
    "region": "Central India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Nature"
    ],
    "description": "An island shaped like Om in the Narmada, home to one of the twelve Jyotirlingas.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "1–2 days",
    "budget": "₹4,000 – ₹9,000",
    "latitude": 22.2394,
    "longitude": 76.1452,
    "highlights": [
      "Omkareshwar Temple",
      "Mamleshwar Temple",
      "Narmada Parikrama",
      "Siddhanath Temple"
    ],
    "image": "https://images.pexels.com/photos/35378814/pexels-photo-35378814.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "kedarnath",
    "name": "Kedarnath",
    "state": "Uttarakhand",
    "region": "North India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Mountains",
      "Adventure"
    ],
    "description": "The northernmost Jyotirlinga, reached by a high-altitude trek through the Garhwal Himalaya.",
    "bestSeason": "Summer & Autumn",
    "months": "May – June, September – October",
    "duration": "3–5 days",
    "budget": "₹12,000 – ₹25,000",
    "latitude": 30.7346,
    "longitude": 79.0669,
    "highlights": [
      "Kedarnath Temple",
      "Trek from Gaurikund",
      "Bhairavnath Temple",
      "Vasuki Tal"
    ],
    "image": "https://images.pexels.com/photos/16152405/pexels-photo-16152405.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "bhimashankar",
    "name": "Bhimashankar",
    "state": "Maharashtra",
    "region": "West India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Nature"
    ],
    "description": "A Jyotirlinga deep in the Sahyadri forests, source of the Bhima River and a wildlife sanctuary.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "1–2 days",
    "budget": "₹4,000 – ₹10,000",
    "latitude": 19.0713,
    "longitude": 73.5265,
    "highlights": [
      "Bhimashankar Temple",
      "Wildlife Sanctuary",
      "Hanuman Lake",
      "Nagphani Point"
    ],
    "image": "https://images.pexels.com/photos/14069124/pexels-photo-14069124.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "vishwanath",
    "name": "Kashi Vishwanath (Varanasi)",
    "state": "Uttar Pradesh",
    "region": "North India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Heritage",
      "Culture"
    ],
    "description": "The spiritual heart of India, where the Ganges flows past one of the most revered Jyotirlingas.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "2–4 days",
    "budget": "₹6,000 – ₹15,000",
    "latitude": 25.3108,
    "longitude": 83.0106,
    "highlights": [
      "Kashi Vishwanath Temple",
      "Ganga Aarti at Dashashwamedh Ghat",
      "Boat ride on the Ganges",
      "Sarnath"
    ],
    "image": "https://images.pexels.com/photos/30854355/pexels-photo-30854355.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "trimbakeshwar",
    "name": "Trimbakeshwar (Nashik)",
    "state": "Maharashtra",
    "region": "West India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Nature"
    ],
    "description": "The Jyotirlinga at the source of the Godavari, set against the Brahmagiri hills near Nashik.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "1–2 days",
    "budget": "₹4,000 – ₹10,000",
    "latitude": 19.9334,
    "longitude": 73.5361,
    "highlights": [
      "Trimbakeshwar Temple",
      "Kushavart Kund",
      "Brahmagiri Trek",
      "Anjaneri Hills"
    ],
    "image": "https://images.pexels.com/photos/5593067/pexels-photo-5593067.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "vaidyanath",
    "name": "Vaidyanath (Deoghar)",
    "state": "Jharkhand",
    "region": "East India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Culture"
    ],
    "description": "The Jyotirlinga where Shiva is worshipped as the divine physician, in the heart of Deoghar.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "2–3 days",
    "budget": "₹5,000 – ₹12,000",
    "latitude": 24.487,
    "longitude": 86.6952,
    "highlights": [
      "Baidyanath Temple",
      "Basukinath Temple",
      "Satsang Ashram",
      "Nandan Pahar"
    ],
    "image": "https://images.pexels.com/photos/31598124/pexels-photo-31598124.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "nageshvara",
    "name": "Nageshvara (Dwarka)",
    "state": "Gujarat",
    "region": "West India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Beaches"
    ],
    "description": "The Jyotirlinga that protects from poison, near the ancient sea-city of Dwarka.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "2–3 days",
    "budget": "₹6,000 – ₹14,000",
    "latitude": 22.2394,
    "longitude": 68.9678,
    "highlights": [
      "Nageshwar Temple",
      "Dwarkadhish Temple",
      "Bet Dwarka",
      "Rukmini Temple"
    ],
    "image": "https://images.pexels.com/photos/36530015/pexels-photo-36530015.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "rameshwaram",
    "name": "Rameshwaram",
    "state": "Tamil Nadu",
    "region": "South India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Beaches"
    ],
    "description": "The southern Jyotirlinga on an island between India and Sri Lanka, tied to the Ramayana.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "2–3 days",
    "budget": "₹6,000 – ₹14,000",
    "latitude": 9.2876,
    "longitude": 79.3129,
    "highlights": [
      "Ramanathaswamy Temple",
      "Dhanushkodi",
      "Agni Theertham",
      "Pamban Bridge"
    ],
    "image": "https://images.pexels.com/photos/32654427/pexels-photo-32654427.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "grishneshwar",
    "name": "Grishneshwar (Ellora)",
    "state": "Maharashtra",
    "region": "West India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Heritage"
    ],
    "description": "The smallest and last of the twelve Jyotirlingas, beside the UNESCO Ellora Caves.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "1–2 days",
    "budget": "₹4,000 – ₹10,000",
    "latitude": 20.0267,
    "longitude": 75.178,
    "highlights": [
      "Grishneshwar Temple",
      "Ellora Caves",
      "Kailasa Temple",
      "Daulatabad Fort"
    ],
    "image": "https://images.pexels.com/photos/31912391/pexels-photo-31912391.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "amarnath",
    "name": "Amarnath Cave",
    "state": "Jammu & Kashmir",
    "region": "North India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Mountains",
      "Adventure"
    ],
    "description": "A sacred ice lingam that forms naturally each summer in a high Himalayan cave.",
    "bestSeason": "Summer",
    "months": "July – August",
    "duration": "3–5 days",
    "budget": "₹15,000 – ₹30,000",
    "latitude": 34.215,
    "longitude": 75.5,
    "highlights": [
      "Amarnath Cave",
      "Pahalgam route",
      "Baltal route",
      "Chandanwari"
    ],
    "image": "https://images.pexels.com/photos/7099651/pexels-photo-7099651.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "tirupati-pilgrim",
    "name": "Tirupati Balaji",
    "state": "Andhra Pradesh",
    "region": "South India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Culture"
    ],
    "description": "The most visited temple in the world, atop the Venkadadri hills and devoted to Lord Venkateswara.",
    "bestSeason": "Winter",
    "months": "November – February",
    "duration": "2–3 days",
    "budget": "₹5,000 – ₹12,000",
    "latitude": 13.6288,
    "longitude": 79.4192,
    "highlights": [
      "Tirumala Temple",
      "Sri Padmavathi Temple",
      "Kapila Theertham",
      "Akasa Ganga"
    ],
    "image": "https://images.pexels.com/photos/36771235/pexels-photo-36771235.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "vaishno-devi",
    "name": "Vaishno Devi",
    "state": "Jammu & Kashmir",
    "region": "North India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Mountains"
    ],
    "description": "A mountain shrine to the Mother Goddess, reached by a 13 km uphill trek from Katra.",
    "bestSeason": "Spring & Autumn",
    "months": "March – June, September – November",
    "duration": "2–3 days",
    "budget": "₹7,000 – ₹16,000",
    "latitude": 33.031,
    "longitude": 74.949,
    "highlights": [
      "Vaishno Devi Bhawan",
      "Katra base",
      "Ardhkuwari Cave",
      "Bhairon Temple"
    ],
    "image": "https://images.pexels.com/photos/5575815/pexels-photo-5575815.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "badrinath",
    "name": "Badrinath",
    "state": "Uttarakhand",
    "region": "North India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Mountains",
      "Nature"
    ],
    "description": "One of the four Char Dham shrines, where Lord Vishnu sits between the Nar and Naray mountains.",
    "bestSeason": "Summer & Autumn",
    "months": "May – June, September – October",
    "duration": "2–4 days",
    "budget": "₹10,000 – ₹22,000",
    "latitude": 30.7423,
    "longitude": 79.4936,
    "highlights": [
      "Badrinath Temple",
      "Tapt Kund",
      "Mana Village",
      "Neelkanth Peak"
    ],
    "image": "https://images.pexels.com/photos/19019326/pexels-photo-19019326.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "jagannath-puri",
    "name": "Jagannath Puri",
    "state": "Odisha",
    "region": "East India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Culture",
      "Beaches"
    ],
    "description": "Home of Lord Jagannath and the legendary Rath Yatra, on the coast of Odisha.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "2–3 days",
    "budget": "₹5,000 – ₹12,000",
    "latitude": 19.8135,
    "longitude": 85.8312,
    "highlights": [
      "Jagannath Temple",
      "Rath Yatra",
      "Puri Beach",
      "Konark Sun Temple"
    ],
    "image": "https://images.pexels.com/photos/33518945/pexels-photo-33518945.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "meenakshi",
    "name": "Meenakshi Temple (Madurai)",
    "state": "Tamil Nadu",
    "region": "South India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Heritage",
      "Culture"
    ],
    "description": "A thousand-year-old Dravidian temple complex devoted to Goddess Meenakshi and Lord Sundareshwarar.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "2–3 days",
    "budget": "₹6,000 – ₹14,000",
    "latitude": 9.9195,
    "longitude": 78.1194,
    "highlights": [
      "Meenakshi Temple",
      "Thousand Pillar Hall",
      "Vaigai River",
      "Thirumalai Nayakkar Palace"
    ],
    "image": "https://images.pexels.com/photos/39341994/pexels-photo-39341994.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    "id": "golden-temple",
    "name": "Golden Temple (Amritsar)",
    "state": "Punjab",
    "region": "North India",
    "categories": [
      "Pilgrim",
      "Spiritual",
      "Culture",
      "Heritage"
    ],
    "description": "The holiest shrine of Sikhism, its golden sanctum mirrored in a sacred pool of langar and seva.",
    "bestSeason": "Winter",
    "months": "October – March",
    "duration": "2–3 days",
    "budget": "₹6,000 – ₹15,000",
    "latitude": 31.62,
    "longitude": 74.8765,
    "highlights": [
      "Harmandir Sahib",
      "Langar Hall",
      "Jallianwala Bagh",
      "Wagah Border"
    ],
    "image": "https://images.pexels.com/photos/18275890/pexels-photo-18275890.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  }
];

const palette: Record<string, string> = {
  Mountains: "#52776d", Beaches: "#4f8a8b", Pilgrim: "#a7774a",
  Heritage: "#b96f55", Nature: "#6c896d", default: "#b88a57",
};

function budgetBounds(label: string): [number, number] {
  const values = [...label.matchAll(/[\d,]+/g)].map(([value]) => Number(value.replaceAll(",", "")));
  return [values[0] ?? 0, values[1] ?? values[0] ?? 0];
}

export const destinations: Destination[] = sourceDestinations.map((item) => {
  const [budgetMin, budgetMax] = budgetBounds(item.budget);
  const category = item.categories.find((value) => palette[value]) ?? "default";
  return {
    id: item.id, name: item.name, state: item.state, region: item.region,
    categories: item.categories, description: item.description,
    season: `${item.bestSeason} · ${item.months}`, duration: item.duration,
    budget: item.budget, budgetMin, budgetMax, lat: item.latitude, lon: item.longitude,
    highlights: item.highlights, image: item.image, accent: palette[category] ?? palette.default,
    ...(item.categories.includes("Pilgrim") ? { kind: "pilgrim" as const } : {}),
  };
});

export const pilgrimageDestinations = destinations.filter((item) => item.kind === "pilgrim");
export const featuredDestinations = ["leh-ladakh", "varkala", "jaipur", "meghalaya", "hampi", "rishikesh"]
  .map((id) => destinations.find((item) => item.id === id))
  .filter((item): item is Destination => Boolean(item));
