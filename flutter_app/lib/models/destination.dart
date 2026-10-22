/// Defines the typed destination model used by discovery, detail, wishlist,
/// weather, Maps handoff, and trip planning throughout the Flutter app.
class Destination {
  const Destination({
    required this.id,
    required this.name,
    required this.state,
    required this.region,
    required this.categories,
    required this.description,
    required this.season,
    required this.duration,
    required this.budget,
    required this.budgetMin,
    required this.budgetMax,
    required this.dailyBudget,
    required this.latitude,
    required this.longitude,
    required this.highlights,
    required this.image,
    this.pilgrim = false,
  });

  final String id;
  final String name;
  final String state;
  final String region;
  final List<String> categories;
  final String description;
  final String season;
  final String duration;
  final String budget;
  final int budgetMin;
  final int budgetMax;
  final int dailyBudget;
  final double latitude;
  final double longitude;
  final List<String> highlights;
  final String image;
  final bool pilgrim;
}
