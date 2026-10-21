import { createContext, useContext } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Language, Profile, TravelPreferences, TripDraft } from "./types";

export type AppContextValue = {
  session: Session;
  profile: Profile;
  language: Language;
  preferences: TravelPreferences;
  wishlist: string[];
  trip: TripDraft;
  statusMessage: string;
  setStatusMessage: (message: string) => void;
  setLanguage: (language: Language) => void;
  updateProfile: (name: string) => Promise<boolean>;
  updatePreferences: (preferences: TravelPreferences) => void;
  toggleWishlist: (destinationId: string) => Promise<void>;
  updateTrip: (trip: TripDraft) => void;
  completeOnboarding: (language: Language) => Promise<void>;
};

export const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error("useAppContext must be used inside the authenticated app");
  return value;
}
