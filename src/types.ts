export type Language = "en" | "hi" | "te" | "ta" | "kn" | "ml" | "bn" | "mr";

export type Destination = {
  id: string;
  name: string;
  state: string;
  region: string;
  categories: string[];
  description: string;
  season: string;
  duration: string;
  budget: string;
  budgetMin: number;
  budgetMax: number;
  lat: number;
  lon: number;
  highlights: string[];
  image: string;
  accent: string;
  kind?: "pilgrim";
};

export type Profile = {
  id: string;
  display_name: string;
  onboarding_complete: boolean;
  language: Language;
};

export type TravelPreferences = {
  slowTravel: boolean;
  culture: boolean;
  adventure: boolean;
  food: boolean;
};

export type TripPace = "Relaxed" | "Balanced" | "Packed";

export type TripDraft = {
  destinationIds: string[];
  days: number;
  travellers: number;
  pace: TripPace;
  interests: string[];
};
