import 'package:flutter_test/flutter_test.dart';
import 'package:indivya_mobile/data/destinations.dart';

/// Validates the core migrated catalog invariants without network access or
/// requiring platform emulators.
void main() {
  test('destination IDs are unique and the catalog is populated', () {
    expect(destinations, isNotEmpty);
    final ids = destinations.map((destination) => destination.id).toList();
    expect(ids.toSet().length, ids.length);
  });

  test('destination records include viable detail and planning data', () {
    for (final destination in destinations) {
      expect(destination.name, isNotEmpty);
      expect(destination.state, isNotEmpty);
      expect(destination.categories, isNotEmpty);
      expect(destination.highlights, isNotEmpty);
      expect(destination.latitude, inInclusiveRange(-90, 90));
      expect(destination.longitude, inInclusiveRange(-180, 180));
      expect(destination.dailyBudget, greaterThan(0));
      expect(destination.budgetMax, greaterThanOrEqualTo(destination.budgetMin));
    }
  });

  test('pilgrimage catalog contains only destinations tagged as pilgrimage', () {
    expect(pilgrimageDestinations, isNotEmpty);
    expect(pilgrimageDestinations.every((destination) => destination.pilgrim), isTrue);
  });
}
