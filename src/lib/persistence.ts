import type { TravelPreferences, TripDraft } from "../types";

const defaultPreferences: TravelPreferences = {
  slowTravel: true,
  culture: true,
  adventure: false,
  food: false,
};

export const defaultTrip: TripDraft = {
  destinationIds: ["leh-ladakh"],
  days: 4,
  travellers: 2,
  pace: "Balanced",
  interests: ["Culture", "Nature"],
};

function readValue<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeValue<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing/storage limits should not block destination discovery.
  }
}

const preferencesKey = (userId: string) => `india-tourism:preferences:${userId}`;
const tripKey = (userId: string) => `india-tourism:trip:${userId}`;

export function getTravelPreferences(userId: string): TravelPreferences {
  return { ...defaultPreferences, ...readValue(preferencesKey(userId), defaultPreferences) };
}

export function saveTravelPreferences(userId: string, preferences: TravelPreferences) {
  writeValue(preferencesKey(userId), preferences);
}

export function getTripDraft(userId: string): TripDraft {
  const value = readValue<TripDraft>(tripKey(userId), defaultTrip);
  return { ...defaultTrip, ...value, destinationIds: value.destinationIds ?? defaultTrip.destinationIds };
}

export function saveTripDraft(userId: string, draft: TripDraft) {
  writeValue(tripKey(userId), draft);
}
