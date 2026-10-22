import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';

/// Provides external travel integrations used by destination detail screens.
class TravelServices {
  static Future<String> weather(double latitude, double longitude) async {
    final uri = Uri.https('api.open-meteo.com', '/v1/forecast', {
      'latitude': latitude.toString(),
      'longitude': longitude.toString(),
      'current': 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code',
    });
    final response = await http.get(uri).timeout(const Duration(seconds: 12));
    if (response.statusCode != 200) throw Exception('Weather service failed with status ' + response.statusCode.toString());
    final json = jsonDecode(response.body) as Map<String, dynamic>;
    final current = json['current'] as Map<String, dynamic>?;
    if (current == null) throw const FormatException('Weather payload has no current conditions');
    final temperature = current['temperature_2m'];
    final humidity = current['relative_humidity_2m'];
    return 'Temperature: ' + (temperature?.toString() ?? '—') + '°C · Humidity: ' + (humidity?.toString() ?? '—') + '%';
  }

  static Future<void> openMaps(String name, double latitude, double longitude) async {
    final uri = Uri.https('www.google.com', '/maps/search/', {
      'api': '1',
      'query': latitude.toString() + ',' + longitude.toString() + ' (' + name + ')',
    });
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      throw Exception('Could not open Maps');
    }
  }
}
