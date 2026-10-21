import { supabase } from "./supabase";
import type { Language, Profile } from "../types";

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, onboarding_complete, language")
    .eq("id", userId)
    .maybeSingle();
  if (error) return { profile: null as Profile | null, error };
  return {
    profile: data
      ? ({
          id: data.id,
          display_name: data.display_name ?? "Traveller",
          onboarding_complete: Boolean(data.onboarding_complete),
          language: (data.language ?? "en") as Language,
        } satisfies Profile)
      : null,
    error: null,
  };
}

export async function saveProfile(userId: string, displayName: string, language: Language, onboardingComplete?: boolean) {
  const record: Record<string, unknown> = {
    id: userId,
    display_name: displayName.trim() || "Traveller",
    language,
  };
  if (onboardingComplete !== undefined) record.onboarding_complete = onboardingComplete;
  const { error } = await supabase.from("profiles").upsert(record, { onConflict: "id" });
  return error;
}

export async function getWishlist(userId: string) {
  const { data, error } = await supabase
    .from("wishlist")
    .select("destination_id")
    .eq("user_id", userId);
  const items = (data ?? []) as { destination_id: string }[];
  return { ids: items.map((item) => item.destination_id), error };
}

export async function setWishlistItem(userId: string, destinationId: string, saved: boolean) {
  if (saved) {
    const { error } = await supabase.from("wishlist").delete().eq("user_id", userId).eq("destination_id", destinationId);
    return error;
  }
  const { error } = await supabase.from("wishlist").insert({ user_id: userId, destination_id: destinationId });
  return error;
}
