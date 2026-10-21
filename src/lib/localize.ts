import { tr } from "./i18n";
import type { Destination } from "../types";

export function localizeDestination(destination: Destination): Destination {
  return {
    ...destination,
    name: tr(destination.name),
    state: tr(destination.state),
    region: tr(destination.region),
    categories: destination.categories.map((category) => tr(category)),
    description: tr(destination.description),
    season: tr(destination.season),
    duration: tr(destination.duration),
    budget: tr(destination.budget),
    highlights: destination.highlights.map((highlight) => tr(highlight)),
  };
}
