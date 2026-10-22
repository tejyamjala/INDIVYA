import 'package:flutter_test/flutter_test.dart';
import 'package:indivya_mobile/data/destinations.dart';
import 'package:indivya_mobile/main.dart';

void main() {
  test('catalogue uses unique IDs, valid coordinates and positive budgets', () {
    final ids = destinations.map((d) => d.id).toSet();
    expect(ids.length, destinations.length);
    for (final destination in destinations) {
      expect(destination.name, isNotEmpty);
      expect(destination.latitude, inInclusiveRange(-90, 90));
      expect(destination.longitude, inInclusiveRange(-180, 180));
      expect(destination.dailyBudget, greaterThan(0));
    }
  });

  test('Mira provides budget advice for budget questions', () {
    expect(miraReply('What is my budget?').toLowerCase(), contains('estimate'));
  });

  test('catalogue has pilgrimage and beach categories', () {
    expect(destinations.any((d) => d.categories.contains('Pilgrimage')), isTrue);
    expect(destinations.any((d) => d.categories.contains('Beach')), isTrue);
  });
}
