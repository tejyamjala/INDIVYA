import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:indivya_mobile/main.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  testWidgets('INDIVYA app opens on the Discover screen',
      (WidgetTester tester) async {
    await tester.pumpWidget(const IndivyaApp());
    await tester.pumpAndSettle();

    expect(find.text('INDIVYA'), findsOneWidget);
    expect(find.text('Handpicked for you'), findsOneWidget);

    // Scroll the Discover ListView to build its later sections.
    await tester.scrollUntilVisible(
      find.text('Journeys with meaning'),
      400,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();

    expect(find.text('Journeys with meaning'), findsOneWidget);
  });
}
