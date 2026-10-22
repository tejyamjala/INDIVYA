import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';

/// Contains external travel utilities used by the native app: Open-Meteo current
/// weather and a safe external Maps handoff. Weather is best-effort and never
/// blocks destination browsing when the network is unavailable.
class CurrentWeather {
  const CurrentWeather({required this.temperature, required this.label, required this.feelsLike, required this.humidity, required this.wind});

  final double temperature;
  final String label;
  final double feelsLike;
  final int humidity;
  final double wind;
}

const Map<int, String> _weatherLabels = {
  0: 'Clear sky',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Cloudy',
  45: 'Misty',
  48: 'Misty',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Steady drizzle',
  61: 'Light rain',
  63: 'Rain showers',
  65: 'Rain',
  71: 'Light snow',
  73: 'Snow showers',
  75: 'Snow',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Heavy showers',
  95: 'Thunderstorms',
};

Future<CurrentWeather> fetchCurrentWeather(double latitude, double longitude) async {
  final uri = Uri.https('api.open-meteo.com', '/v1/forecast', {
    'latitude': '$latitude',
    'longitude': '$longitude',
    'current': 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    'timezone': 'auto',
  });
  final response = await http.get(uri).timeout(const Duration(seconds: 12));
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw Exception('Weather service returned ${response.statusCode}');
  }
  final payload = jsonDecode(response.body) as Map<String, dynamic>;
  final current = payload['current'] as Map<String, dynamic>?;
  if (current == null) throw const FormatException('Weather data is missing');
  final code = (current['weather_code'] as num?)?.toInt() ?? -1;
  return CurrentWeather(
    temperature: (current['temperature_2m'] as num).toDouble(),
    feelsLike: (current['apparent_temperature'] as num).toDouble(),
    humidity: (current['relative_humidity_2m'] as num).toInt(),
    wind: (current['wind_speed_10m'] as num).toDouble(),
    label: _weatherLabels[code] ?? 'Current conditions',
  );
}

Future<void> openDestinationInMaps(String destinationName, double latitude, double longitude) async {
  final uri = Uri.https('www.google.com', '/maps/search/', {'api': '1', 'query': '$latitude,$longitude $destinationName'});
  if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
    throw Exception('Could not open Maps');
  }
}

Future<void> searchInMaps(String query) async {
  final uri = Uri.https('www.google.com', '/maps/search/', {'api': '1', 'query': query});
  if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
    throw Exception('Could not open Maps');
  }
}
