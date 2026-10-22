class Destination {
  const Destination({
    required this.id,
    required this.name,
    required this.state,
    required this.region,
    required this.description,
    required this.season,
    required this.duration,
    required this.dailyBudget,
    required this.categories,
    required this.highlights,
    required this.imageUrl,
    required this.latitude,
    required this.longitude,
  });

  final String id;
  final String name;
  final String state;
  final String region;
  final String description;
  final String season;
  final String duration;
  final int dailyBudget;
  final List<String> categories;
  final List<String> highlights;
  final String imageUrl;
  final double latitude;
  final double longitude;
}
