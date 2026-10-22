import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'data/destinations.dart';
import 'models/destination.dart';
import 'services/travel_services.dart';

/// Application entry point and native mobile presentation for INDIVYA.
/// Provides discovery, search and filters, destination details, live weather,
/// a multi-destination budget planner, locally persisted saved places, language
/// selection, optional Supabase authentication/profile/wishlist sync, Maps
/// handoff, and a deterministic contextual Mira assistant.
///
/// Notes: The first migration pass keeps the existing React website intact.
/// TODOs for full parity, verification steps, and external configuration are
/// documented in docs/MOBILE_MIGRATION.md.
const String supabaseUrl = String.fromEnvironment('SUPABASE_URL');
const String supabaseAnonKey = String.fromEnvironment('SUPABASE_ANON_KEY');
bool get hasSupabaseConfig =>
    supabaseUrl.isNotEmpty && supabaseAnonKey.isNotEmpty;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (hasSupabaseConfig) {
    await Supabase.initialize(
        url: supabaseUrl, publishableKey: supabaseAnonKey);
  }
  runApp(const IndivyaApp());
}

const Color ink = Color(0xFF20322D);
const Color forest = Color(0xFF24584A);
const Color sage = Color(0xFFE4EEE7);
const Color sand = Color(0xFFF7F4ED);
const Color terracotta = Color(0xFFB86E4B);

const Map<String, Map<String, String>> translations = {
  'hi': {
    'Discover': 'खोजें',
    'Explore': 'अन्वेषण',
    'Pilgrims': 'तीर्थ',
    'Trip planner': 'यात्रा योजना',
    'Saved': 'सहेजे गए',
    'Profile': 'प्रोफ़ाइल',
    'Find your next India': 'अपनी अगली भारत यात्रा खोजें',
    'Explore destinations': 'गंतव्य देखें',
    'Search destinations': 'गंतव्य खोजें',
    'Plan your journey': 'अपनी यात्रा की योजना बनाएं',
    'Save place': 'जगह सहेजें',
    'Saved places': 'सहेजी गई जगहें',
    'Open in Maps': 'मैप्स में खोलें',
    'Best season': 'सबसे अच्छा मौसम',
    'Suggested duration': 'सुझाई गई अवधि',
    'Highlights': 'मुख्य आकर्षण',
    'Sign in': 'साइन इन',
    'Sign out': 'साइन आउट',
    'Language': 'भाषा'
  },
  'te': {
    'Discover': 'కనుగొనండి',
    'Explore': 'అన్వేషించండి',
    'Pilgrims': 'పుణ్యక్షేత్రాలు',
    'Trip planner': 'ప్రయాణ ప్రణాళిక',
    'Saved': 'సేవ్ చేసినవి',
    'Profile': 'ప్రొఫైల్',
    'Find your next India': 'మీ తదుపరి భారత యాత్రను కనుగొనండి',
    'Explore destinations': 'ప్రదేశాలను అన్వేషించండి',
    'Search destinations': 'ప్రదేశాలను వెతకండి',
    'Plan your journey': 'మీ ప్రయాణాన్ని ప్లాన్ చేయండి',
    'Save place': 'ప్రదేశాన్ని సేవ్ చేయండి',
    'Saved places': 'సేవ్ చేసిన ప్రదేశాలు',
    'Open in Maps': 'మ్యాప్స్‌లో తెరవండి',
    'Best season': 'మంచి సీజన్',
    'Suggested duration': 'సూచించిన వ్యవధి',
    'Highlights': 'ప్రత్యేక ఆకర్షణలు',
    'Sign in': 'సైన్ ఇన్',
    'Sign out': 'సైన్ అవుట్',
    'Language': 'భాష'
  },
  'ta': {
    'Discover': 'கண்டறியுங்கள்',
    'Explore': 'ஆராயுங்கள்',
    'Pilgrims': 'புனிதத் தலங்கள்',
    'Trip planner': 'பயணத் திட்டம்',
    'Saved': 'சேமித்தவை',
    'Profile': 'சுயவிவரம்',
    'Find your next India': 'உங்கள் அடுத்த இந்தியப் பயணத்தைக் கண்டறியுங்கள்',
    'Explore destinations': 'இடங்களை ஆராயுங்கள்',
    'Search destinations': 'இடங்களைத் தேடுங்கள்',
    'Plan your journey': 'உங்கள் பயணத்தைத் திட்டமிடுங்கள்',
    'Save place': 'இடத்தைச் சேமி',
    'Saved places': 'சேமித்த இடங்கள்',
    'Open in Maps': 'வரைபடத்தில் திற',
    'Best season': 'சிறந்த பருவம்',
    'Suggested duration': 'பரிந்துரைக்கப்படும் காலம்',
    'Highlights': 'சிறப்பம்சங்கள்',
    'Sign in': 'உள்நுழை',
    'Sign out': 'வெளியேறு',
    'Language': 'மொழி'
  },
  'kn': {
    'Discover': 'ಕಂಡುಹಿಡಿಯಿರಿ',
    'Explore': 'ಅನ್ವೇಷಿಸಿ',
    'Pilgrims': 'ತೀರ್ಥಕ್ಷೇತ್ರಗಳು',
    'Trip planner': 'ಪ್ರಯಾಣ ಯೋಜನೆ',
    'Saved': 'ಉಳಿಸಿದವು',
    'Profile': 'ಪ್ರೊಫೈಲ್',
    'Find your next India': 'ನಿಮ್ಮ ಮುಂದಿನ ಭಾರತದ ಪ್ರವಾಸ ಕಂಡುಹಿಡಿಯಿರಿ',
    'Explore destinations': 'ಸ್ಥಳಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    'Search destinations': 'ಸ್ಥಳಗಳನ್ನು ಹುಡುಕಿ',
    'Plan your journey': 'ನಿಮ್ಮ ಪ್ರಯಾಣ ಯೋಜಿಸಿ',
    'Save place': 'ಸ್ಥಳ ಉಳಿಸಿ',
    'Saved places': 'ಉಳಿಸಿದ ಸ್ಥಳಗಳು',
    'Open in Maps': 'ನಕ್ಷೆಯಲ್ಲಿ ತೆರೆಯಿರಿ',
    'Best season': 'ಉತ್ತಮ ಋತು',
    'Suggested duration': 'ಶಿಫಾರಸು ಅವಧಿ',
    'Highlights': 'ಮುಖ್ಯ ಆಕರ್ಷಣೆಗಳು',
    'Sign in': 'ಸೈನ್ ಇನ್',
    'Sign out': 'ಸೈನ್ ಔಟ್',
    'Language': 'ಭಾಷೆ'
  },
  'ml': {
    'Discover': 'കണ്ടെത്തുക',
    'Explore': 'പര്യവേക്ഷണം',
    'Pilgrims': 'തീർത്ഥാടന കേന്ദ്രങ്ങൾ',
    'Trip planner': 'യാത്രാ പദ്ധതി',
    'Saved': 'സൂക്ഷിച്ചവ',
    'Profile': 'പ്രൊഫൈൽ',
    'Find your next India': 'അടുത്ത ഇന്ത്യ യാത്ര കണ്ടെത്തൂ',
    'Explore destinations': 'സ്ഥലങ്ങൾ കാണുക',
    'Search destinations': 'സ്ഥലങ്ങൾ തിരയുക',
    'Plan your journey': 'യാത്ര ആസൂത്രണം ചെയ്യുക',
    'Save place': 'സ്ഥലം സൂക്ഷിക്കുക',
    'Saved places': 'സൂക്ഷിച്ച സ്ഥലങ്ങൾ',
    'Open in Maps': 'മാപ്പിൽ തുറക്കുക',
    'Best season': 'മികച്ച കാലം',
    'Suggested duration': 'ശുപാർശ ചെയ്യുന്ന ദൈർഘ്യം',
    'Highlights': 'പ്രധാന ആകർഷണങ്ങൾ',
    'Sign in': 'സൈൻ ഇൻ',
    'Sign out': 'സൈൻ ഔട്ട്',
    'Language': 'ഭാഷ'
  },
  'bn': {
    'Discover': 'আবিষ্কার',
    'Explore': 'অন্বেষণ',
    'Pilgrims': 'তীর্থস্থান',
    'Trip planner': 'ভ্রমণ পরিকল্পনা',
    'Saved': 'সংরক্ষিত',
    'Profile': 'প্রোফাইল',
    'Find your next India': 'আপনার পরবর্তী ভারত ভ্রমণ খুঁজুন',
    'Explore destinations': 'গন্তব্য অন্বেষণ করুন',
    'Search destinations': 'গন্তব্য খুঁজুন',
    'Plan your journey': 'ভ্রমণের পরিকল্পনা করুন',
    'Save place': 'স্থান সংরক্ষণ করুন',
    'Saved places': 'সংরক্ষিত স্থান',
    'Open in Maps': 'ম্যাপে খুলুন',
    'Best season': 'সেরা ঋতু',
    'Suggested duration': 'প্রস্তাবিত সময়',
    'Highlights': 'বিশেষ আকর্ষণ',
    'Sign in': 'সাইন ইন',
    'Sign out': 'সাইন আউট',
    'Language': 'ভাষা'
  },
  'mr': {
    'Discover': 'शोधा',
    'Explore': 'भटकंती',
    'Pilgrims': 'तीर्थस्थळे',
    'Trip planner': 'प्रवास नियोजन',
    'Saved': 'जतन केलेले',
    'Profile': 'प्रोफाइल',
    'Find your next India': 'तुमचा पुढील भारत प्रवास शोधा',
    'Explore destinations': 'ठिकाणे शोधा',
    'Search destinations': 'ठिकाणे शोधा',
    'Plan your journey': 'तुमच्या प्रवासाचे नियोजन करा',
    'Save place': 'ठिकाण जतन करा',
    'Saved places': 'जतन केलेली ठिकाणे',
    'Open in Maps': 'Maps मध्ये उघडा',
    'Best season': 'भेट देण्याचा उत्तम काळ',
    'Suggested duration': 'सुचवलेला कालावधी',
    'Highlights': 'मुख्य आकर्षणे',
    'Sign in': 'साइन इन',
    'Sign out': 'साइन आउट',
    'Language': 'भाषा'
  },
};

String tr(String source, String language) =>
    translations[language]?[source] ?? source;

class IndivyaApp extends StatelessWidget {
  const IndivyaApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
        title: 'INDIVYA · India Tourism',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
              seedColor: forest,
              primary: forest,
              secondary: terracotta,
              surface: Colors.white),
          scaffoldBackgroundColor: sand,
          appBarTheme: const AppBarTheme(
              backgroundColor: sand,
              foregroundColor: ink,
              elevation: 0,
              centerTitle: false),
          cardTheme: CardThemeData(
              color: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(22))),
          inputDecorationTheme: InputDecorationTheme(
              filled: true,
              fillColor: Colors.white,
              border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none),
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 14)),
        ),
        home: const IndivyaHome(),
      );
}

enum AppTab { discover, explore, pilgrims, planner, saved, profile }

class IndivyaHome extends StatefulWidget {
  const IndivyaHome({super.key});

  @override
  State<IndivyaHome> createState() => _IndivyaHomeState();
}

class _IndivyaHomeState extends State<IndivyaHome> {
  AppTab _tab = AppTab.discover;
  Set<String> _savedIds = {};
  Set<String> _tripIds = {'leh-ladakh'};
  int _days = 4;
  int _travellers = 2;
  String _pace = 'Balanced';
  String _budgetStyle = 'Balanced';
  String _language = 'en';
  String _displayName = 'Traveller';
  User? _user;
  StreamSubscription<AuthState>? _authSubscription;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    final prefs = await SharedPreferences.getInstance();
    _savedIds = (prefs.getStringList('savedIds') ?? []).toSet();
    _tripIds = (prefs.getStringList('tripIds') ?? ['leh-ladakh']).toSet();
    _days = prefs.getInt('tripDays') ?? 4;
    _travellers = prefs.getInt('travellers') ?? 2;
    _pace = prefs.getString('pace') ?? 'Balanced';
    _budgetStyle = prefs.getString('budgetStyle') ?? 'Balanced';
    _language = prefs.getString('language') ?? 'en';
    if (hasSupabaseConfig) {
      _user = Supabase.instance.client.auth.currentUser;
      _authSubscription =
          Supabase.instance.client.auth.onAuthStateChange.listen((data) {
        if (!mounted) return;
        setState(() => _user = data.session?.user);
        if (data.session?.user != null) _syncRemoteState();
      });
      if (_user != null) await _syncRemoteState();
    }
    if (!mounted) return;
    setState(() => _loading = false);
  }

  Future<void> _persist() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('savedIds', _savedIds.toList());
    await prefs.setStringList('tripIds', _tripIds.toList());
    await prefs.setInt('tripDays', _days);
    await prefs.setInt('travellers', _travellers);
    await prefs.setString('pace', _pace);
    await prefs.setString('budgetStyle', _budgetStyle);
    await prefs.setString('language', _language);
  }

  Future<void> _syncRemoteState() async {
    if (!hasSupabaseConfig || _user == null) return;
    final client = Supabase.instance.client;
    try {
      final profile = await client
          .from('profiles')
          .select('display_name, language')
          .eq('id', _user!.id)
          .maybeSingle();
      if (profile != null && mounted) {
        setState(() {
          _displayName =
              (profile['display_name'] as String?)?.trim().isNotEmpty == true
                  ? profile['display_name'] as String
                  : _displayName;
          final savedLanguage = profile['language'] as String?;
          if (savedLanguage != null &&
                  translations.containsKey(savedLanguage) ||
              savedLanguage == 'en') _language = savedLanguage!;
        });
      }
      final rows = await client
          .from('wishlist')
          .select('destination_id')
          .eq('user_id', _user!.id);
      final remote =
          (rows as List).map((row) => row['destination_id'] as String).toSet();
      if (mounted && remote.isNotEmpty) setState(() => _savedIds = remote);
      await _persist();
    } catch (_) {}
  }

  Future<void> _toggleSaved(Destination destination) async {
    final saving = !_savedIds.contains(destination.id);
    setState(() {
      if (saving) {
        _savedIds.add(destination.id);
      } else {
        _savedIds.remove(destination.id);
      }
    });
    await _persist();
    if (hasSupabaseConfig && _user != null) {
      try {
        final table = Supabase.instance.client.from('wishlist');
        if (saving) {
          await table
              .insert({'user_id': _user!.id, 'destination_id': destination.id});
        } else {
          await table
              .delete()
              .eq('user_id', _user!.id)
              .eq('destination_id', destination.id);
        }
      } catch (_) {}
    }
  }

  Future<void> _setLanguage(String code) async {
    setState(() => _language = code);
    await _persist();
    if (hasSupabaseConfig && _user != null) {
      try {
        await Supabase.instance.client.from('profiles').upsert(
            {'id': _user!.id, 'display_name': _displayName, 'language': code},
            onConflict: 'id');
      } catch (_) {}
    }
  }

  @override
  void dispose() {
    _authSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final labels = [
      'Discover',
      'Explore',
      'Pilgrims',
      'Trip planner',
      'Saved',
      'Profile'
    ];
    final icons = [
      Icons.explore_outlined,
      Icons.travel_explore,
      Icons.temple_hindu_outlined,
      Icons.route_outlined,
      Icons.bookmark_border,
      Icons.person_outline
    ];
    final selectedIcons = [
      Icons.explore,
      Icons.travel_explore,
      Icons.temple_hindu,
      Icons.route,
      Icons.bookmark,
      Icons.person
    ];
    return Scaffold(
      appBar: AppBar(
        title: Row(children: [
          Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                  color: forest, borderRadius: BorderRadius.circular(12)),
              child: const Icon(Icons.landscape_outlined,
                  color: Colors.white, size: 21)),
          const SizedBox(width: 10),
          const Text('INDIVYA',
              style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.1))
        ]),
        actions: [
          IconButton(
              tooltip: tr('Profile', _language),
              onPressed: () => setState(() => _tab = AppTab.profile),
              icon: CircleAvatar(
                  radius: 17,
                  backgroundColor: sage,
                  child: Icon(
                      _user == null ? Icons.person_outline : Icons.person,
                      color: forest,
                      size: 19)))
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SafeArea(child: _buildTab()),
      floatingActionButton: _tab == AppTab.profile
          ? null
          : FloatingActionButton.extended(
              onPressed: _showMira,
              backgroundColor: forest,
              foregroundColor: Colors.white,
              icon: const Icon(Icons.auto_awesome),
              label: const Text('Ask Mira')),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab.index,
        onDestinationSelected: (index) =>
            setState(() => _tab = AppTab.values[index]),
        destinations: List.generate(
            labels.length,
            (index) => NavigationDestination(
                icon: Icon(icons[index]),
                selectedIcon: Icon(selectedIcons[index]),
                label: tr(labels[index], _language))),
      ),
    );
  }

  Widget _buildTab() {
    switch (_tab) {
      case AppTab.discover:
        return DiscoverScreen(
            language: _language,
            savedIds: _savedIds,
            onSave: _toggleSaved,
            onOpen: _openDestination,
            onExplore: () => setState(() => _tab = AppTab.explore),
            onPlan: () => setState(() => _tab = AppTab.planner));
      case AppTab.explore:
        return CatalogScreen(
            language: _language,
            savedIds: _savedIds,
            onSave: _toggleSaved,
            onOpen: _openDestination);
      case AppTab.pilgrims:
        return CatalogScreen(
            language: _language,
            pilgrimsOnly: true,
            savedIds: _savedIds,
            onSave: _toggleSaved,
            onOpen: _openDestination);
      case AppTab.planner:
        return PlannerScreen(
            language: _language,
            tripIds: _tripIds,
            days: _days,
            travellers: _travellers,
            pace: _pace,
            budgetStyle: _budgetStyle,
            onChanged: (ids, days, travellers, pace, style) async {
              setState(() {
                _tripIds = ids;
                _days = days;
                _travellers = travellers;
                _pace = pace;
                _budgetStyle = style;
              });
              await _persist();
            },
            onOpen: _openDestination);
      case AppTab.saved:
        final items =
            destinations.where((item) => _savedIds.contains(item.id)).toList();
        return SavedScreen(
            language: _language,
            items: items,
            onOpen: _openDestination,
            onSave: _toggleSaved);
      case AppTab.profile:
        return ProfileScreen(
            language: _language,
            displayName: _displayName,
            email: _user?.email,
            onLanguage: _setLanguage,
            onSignIn: _showAuth,
            onSignOut: _signOut,
            onNameChanged: _saveName);
    }
  }

  Future<void> _openDestination(Destination destination) async {
    await Navigator.of(context).push(MaterialPageRoute<void>(
        builder: (_) => DestinationDetailScreen(
            destination: destination,
            isSaved: _savedIds.contains(destination.id),
            onSave: () => _toggleSaved(destination))));
    if (mounted) setState(() {});
  }

  Future<void> _showAuth() async {
    if (!hasSupabaseConfig) {
      _showMessage(
          'Set SUPABASE_URL and SUPABASE_ANON_KEY to enable account access.');
      return;
    }
    await Navigator.of(context).push(MaterialPageRoute<void>(
        builder: (_) => AuthScreen(onComplete: () async {
              if (mounted)
                setState(
                    () => _user = Supabase.instance.client.auth.currentUser);
              await _syncRemoteState();
            })));
  }

  Future<void> _signOut() async {
    if (hasSupabaseConfig) await Supabase.instance.client.auth.signOut();
    if (!mounted) return;
    setState(() {
      _user = null;
      _displayName = 'Traveller';
      _language = 'en';
    });
    await _persist();
  }

  Future<void> _saveName(String name) async {
    final clean = name.trim();
    if (clean.isEmpty) return;
    setState(() => _displayName = clean);
    if (hasSupabaseConfig && _user != null) {
      try {
        await Supabase.instance.client.from('profiles').upsert(
            {'id': _user!.id, 'display_name': clean, 'language': _language},
            onConflict: 'id');
      } catch (_) {}
    }
  }

  void _showMessage(String message) => ScaffoldMessenger.of(context)
      .showSnackBar(SnackBar(content: Text(message)));

  Future<void> _showMira() async {
    final controller = TextEditingController();
    String answer =
        'Ask about nearby highlights, budgets, beaches, mountains, pilgrimage routes, seasons or trip planning.';
    await showDialog<void>(
        context: context,
        builder: (dialogContext) => StatefulBuilder(
            builder: (context, setDialogState) => AlertDialog(
                  title: const Row(children: [
                    Icon(Icons.auto_awesome, color: forest),
                    SizedBox(width: 8),
                    Text('Mira · Travel companion')
                  ]),
                  content: SingleChildScrollView(
                      child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                        Text(answer),
                        const SizedBox(height: 16),
                        TextField(
                            controller: controller,
                            decoration: const InputDecoration(
                                hintText: 'Ask about your trip'),
                            onSubmitted: (value) => setDialogState(
                                () => answer = _miraReply(value)))
                      ])),
                  actions: [
                    TextButton(
                        onPressed: () => Navigator.pop(dialogContext),
                        child: const Text('Close')),
                    FilledButton(
                        onPressed: () => setDialogState(
                            () => answer = _miraReply(controller.text)),
                        child: const Text('Ask Mira'))
                  ],
                )));
    controller.dispose();
  }

  String _miraReply(String question) {
    final q = question.toLowerCase();
    if (q.contains('budget') || q.contains('cheap') || q.contains('cost'))
      return 'For lower illustrative budgets, consider Agra, Tirupati, Gokarna, Hampi or Puri. Costs in the trip planner are estimates, not live prices.';
    if (q.contains('beach') || q.contains('sea'))
      return 'Consider Varkala for red cliffs, Gokarna for quieter coves, Goa for food and heritage, or Pondicherry for a coastal city break.';
    if (q.contains('mountain') || q.contains('snow') || q.contains('trek'))
      return 'Leh & Ladakh offers high-altitude scenery. Manali and McLeod Ganj are alternative Himalayan trips; check seasonal access before departure.';
    if (q.contains('temple') ||
        q.contains('pilgrim') ||
        q.contains('spiritual'))
      return 'Explore Varanasi, Tirupati, Rameshwaram, Badrinath, Vaishno Devi and the Golden Temple. Confirm opening times, permits and local guidance.';
    if (q.contains('plan') || q.contains('trip') || q.contains('itinerary'))
      return 'Open Trip planner, choose destinations, number of days and travellers, then review the draft itinerary and illustrative category breakdown.';
    final matched = destinations
        .where((item) =>
            q.contains(item.name.toLowerCase()) ||
            item.categories
                .any((category) => q.contains(category.toLowerCase())))
        .take(3)
        .map((item) => item.name)
        .toList();
    if (matched.isNotEmpty)
      return 'You could start with ${matched.join(', ')}. Open a destination for highlights, seasonal guidance, live weather and a Google Maps handoff.';
    return 'Tell me what matters most: beaches, heritage, food, nature, mountains or a pilgrimage. I can suggest destinations from the built-in India travel catalog. This version uses local travel guidance and is not connected to a generative AI service.';
  }
}

class DiscoverScreen extends StatelessWidget {
  const DiscoverScreen(
      {super.key,
      required this.language,
      required this.savedIds,
      required this.onSave,
      required this.onOpen,
      required this.onExplore,
      required this.onPlan});
  final String language;
  final Set<String> savedIds;
  final Future<void> Function(Destination) onSave;
  final Future<void> Function(Destination) onOpen;
  final VoidCallback onExplore;
  final VoidCallback onPlan;

  @override
  Widget build(BuildContext context) {
    return ListView(
        padding: const EdgeInsets.fromLTRB(18, 6, 18, 112),
        children: [
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1D4B3F), Color(0xFF638777)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(28),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 11, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.16),
                    borderRadius: BorderRadius.circular(40),
                  ),
                  child: const Text(
                    'MADE FOR THE CURIOUS',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
                const SizedBox(height: 18),
                Text(
                  tr('Find your next India', language),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 31,
                    height: 1.04,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Sacred cities, open roads, quiet coastlines. Build a trip that feels like yours.',
                  style: TextStyle(color: Colors.white70, height: 1.45),
                ),
                const SizedBox(height: 22),
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: [
                    FilledButton.icon(
                      onPressed: onExplore,
                      icon: const Icon(Icons.travel_explore),
                      label: Text(tr('Explore destinations', language)),
                      style: FilledButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: forest,
                      ),
                    ),
                    OutlinedButton.icon(
                      onPressed: onPlan,
                      icon: const Icon(Icons.route),
                      label: const Text('Plan a trip'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white,
                        side: const BorderSide(color: Colors.white70),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 28),
          const SectionHeading(
              title: 'Handpicked for you',
              subtitle: 'Places worth taking the long way for'),
          const SizedBox(height: 14),
          SizedBox(
              height: 270,
              child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: featuredDestinations.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 14),
                  itemBuilder: (context, index) {
                    final item = featuredDestinations[index];
                    return SizedBox(
                        width: 246,
                        child: DestinationCard(
                            destination: item,
                            isSaved: savedIds.contains(item.id),
                            onOpen: () => onOpen(item),
                            onSave: () => onSave(item),
                            featured: true));
                  })),
          const SizedBox(height: 28),
          const SectionHeading(
              title: 'Journeys with meaning',
              subtitle: 'Pilgrimage places, rituals and living heritage'),
          const SizedBox(height: 14),
          ...pilgrimageDestinations.take(3).map((item) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: DestinationCard(
                  destination: item,
                  isSaved: savedIds.contains(item.id),
                  onOpen: () => onOpen(item),
                  onSave: () => onSave(item)))),
          const SizedBox(height: 18),
          Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                  color: const Color(0xFFF0E4D4),
                  borderRadius: BorderRadius.circular(22)),
              child: const Row(children: [
                Icon(Icons.tips_and_updates_outlined,
                    color: terracotta, size: 30),
                SizedBox(width: 12),
                Expanded(
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                      Text('A note on budgets',
                          style: TextStyle(
                              fontWeight: FontWeight.w800, color: ink)),
                      SizedBox(height: 3),
                      Text(
                          'Planner totals are illustrative estimates. Check current transport, stay rates and entry requirements before booking.',
                          style: TextStyle(height: 1.35, color: ink))
                    ]))
              ])),
        ]);
  }
}

class SectionHeading extends StatelessWidget {
  const SectionHeading(
      {super.key, required this.title, required this.subtitle});
  final String title;
  final String subtitle;
  @override
  Widget build(BuildContext context) =>
      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(title,
            style: const TextStyle(
                color: ink, fontWeight: FontWeight.w800, fontSize: 21)),
        const SizedBox(height: 3),
        Text(subtitle,
            style: TextStyle(color: ink.withValues(alpha: 0.63), fontSize: 13))
      ]);
}

class DestinationCard extends StatelessWidget {
  const DestinationCard(
      {super.key,
      required this.destination,
      required this.isSaved,
      required this.onOpen,
      required this.onSave,
      this.featured = false});
  final Destination destination;
  final bool isSaved;
  final VoidCallback onOpen;
  final VoidCallback onSave;
  final bool featured;

  @override
  Widget build(BuildContext context) {
    if (featured)
      return Material(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          clipBehavior: Clip.antiAlias,
          child: InkWell(
              onTap: onOpen,
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                        child: Stack(fit: StackFit.expand, children: [
                      Image.network(destination.image,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(
                              color: sage,
                              child: const Icon(Icons.landscape,
                                  size: 48, color: forest))),
                      Positioned(
                          top: 10,
                          right: 10,
                          child: IconButton.filledTonal(
                              onPressed: onSave,
                              icon: Icon(isSaved
                                  ? Icons.bookmark
                                  : Icons.bookmark_border),
                              style: IconButton.styleFrom(
                                  backgroundColor:
                                      Colors.white.withValues(alpha: 0.92))))
                    ])),
                    Padding(
                        padding: const EdgeInsets.fromLTRB(14, 12, 14, 14),
                        child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(destination.name,
                                  style: const TextStyle(
                                      fontSize: 17,
                                      fontWeight: FontWeight.w800,
                                      color: ink)),
                              const SizedBox(height: 4),
                              Text(
                                  '${destination.state} · ${destination.duration}',
                                  style: const TextStyle(
                                      color: Colors.black54, fontSize: 12)),
                              const SizedBox(height: 8),
                              Text(destination.budget,
                                  style: const TextStyle(
                                      color: forest,
                                      fontWeight: FontWeight.w700))
                            ]))
                  ])));
    return Card(
        child: InkWell(
            borderRadius: BorderRadius.circular(22),
            onTap: onOpen,
            child: Padding(
                padding: const EdgeInsets.all(10),
                child: Row(children: [
                  ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: SizedBox(
                          width: 112,
                          height: 116,
                          child: Image.network(destination.image,
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => Container(
                                  color: sage,
                                  child: const Icon(Icons.landscape,
                                      color: forest, size: 38))))),
                  const SizedBox(width: 13),
                  Expanded(
                      child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                        Wrap(
                            spacing: 5,
                            runSpacing: 5,
                            children: destination.categories
                                .take(2)
                                .map((category) => Chip(
                                    label: Text(category,
                                        style: const TextStyle(fontSize: 10)),
                                    visualDensity: VisualDensity.compact,
                                    padding: EdgeInsets.zero,
                                    backgroundColor: sage,
                                    side: BorderSide.none))
                                .toList()),
                        Text(destination.name,
                            style: const TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 16,
                                color: ink)),
                        const SizedBox(height: 3),
                        Text('${destination.state} · ${destination.duration}',
                            style: const TextStyle(
                                fontSize: 11, color: Colors.black54)),
                        const SizedBox(height: 7),
                        Text(destination.budget,
                            style: const TextStyle(
                                fontWeight: FontWeight.w700,
                                color: forest,
                                fontSize: 12))
                      ])),
                  IconButton(
                      onPressed: onSave,
                      tooltip: isSaved ? 'Remove saved place' : 'Save place',
                      icon: Icon(
                          isSaved ? Icons.bookmark : Icons.bookmark_border,
                          color: forest))
                ]))));
  }
}

class CatalogScreen extends StatefulWidget {
  const CatalogScreen(
      {super.key,
      required this.language,
      required this.savedIds,
      required this.onSave,
      required this.onOpen,
      this.pilgrimsOnly = false});
  final String language;
  final Set<String> savedIds;
  final Future<void> Function(Destination) onSave;
  final Future<void> Function(Destination) onOpen;
  final bool pilgrimsOnly;
  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  String _query = '';
  String _category = 'All';
  @override
  Widget build(BuildContext context) {
    final pool = widget.pilgrimsOnly ? pilgrimageDestinations : destinations;
    final categoryValues =
        pool.expand((item) => item.categories).toSet().toList()..sort();
    final categories = ['All', ...categoryValues];
    final filtered = pool.where((item) {
      final q = _query.toLowerCase().trim();
      final matchesQuery = q.isEmpty ||
          '${item.name} ${item.state} ${item.region} ${item.description} ${item.categories.join(' ')}'
              .toLowerCase()
              .contains(q);
      final matchesCategory =
          _category == 'All' || item.categories.contains(_category);
      return matchesQuery && matchesCategory;
    }).toList();
    return ListView(
        padding: const EdgeInsets.fromLTRB(18, 4, 18, 112),
        children: [
          Text(
              widget.pilgrimsOnly
                  ? 'Sacred journeys'
                  : tr('Explore destinations', widget.language),
              style: const TextStyle(
                  fontSize: 27, fontWeight: FontWeight.w900, color: ink)),
          const SizedBox(height: 6),
          Text(
              widget.pilgrimsOnly
                  ? 'A directory of sacred places and pilgrimage routes across India.'
                  : 'Search by place, state, region or the kind of journey you want.',
              style: const TextStyle(color: Colors.black54)),
          const SizedBox(height: 16),
          TextField(
              onChanged: (value) => setState(() => _query = value),
              decoration: InputDecoration(
                  hintText: tr('Search destinations', widget.language),
                  prefixIcon: const Icon(Icons.search),
                  suffixIcon: _query.isEmpty
                      ? null
                      : IconButton(
                          onPressed: () => setState(() => _query = ''),
                          icon: const Icon(Icons.close)))),
          const SizedBox(height: 12),
          SizedBox(
              height: 42,
              child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: categories.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (_, index) => ChoiceChip(
                      label: Text(categories[index]),
                      selected: _category == categories[index],
                      onSelected: (_) =>
                          setState(() => _category = categories[index])))),
          const SizedBox(height: 10),
          Text('${filtered.length} places',
              style: const TextStyle(color: Colors.black54, fontSize: 12)),
          const SizedBox(height: 10),
          if (filtered.isEmpty)
            const EmptyState(
                title: 'No places found',
                subtitle: 'Try another name or clear the selected category.')
          else
            ...filtered.map((item) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: DestinationCard(
                    destination: item,
                    isSaved: widget.savedIds.contains(item.id),
                    onOpen: () => widget.onOpen(item),
                    onSave: () => widget.onSave(item)))),
        ]);
  }
}

class DestinationDetailScreen extends StatefulWidget {
  const DestinationDetailScreen(
      {super.key,
      required this.destination,
      required this.isSaved,
      required this.onSave});
  final Destination destination;
  final bool isSaved;
  final Future<void> Function() onSave;
  @override
  State<DestinationDetailScreen> createState() =>
      _DestinationDetailScreenState();
}

class _DestinationDetailScreenState extends State<DestinationDetailScreen> {
  CurrentWeather? _weather;
  bool _weatherLoading = true;
  String? _weatherError;
  bool _saved = false;
  @override
  void initState() {
    super.initState();
    _saved = widget.isSaved;
    _loadWeather();
  }

  Future<void> _loadWeather() async {
    try {
      final result = await fetchCurrentWeather(
          widget.destination.latitude, widget.destination.longitude);
      if (mounted)
        setState(() {
          _weather = result;
          _weatherLoading = false;
        });
    } catch (_) {
      if (mounted)
        setState(() {
          _weatherLoading = false;
          _weatherError =
              'Current weather is unavailable. Check your connection.';
        });
    }
  }

  @override
  Widget build(BuildContext context) {
    final d = widget.destination;
    return Scaffold(
        appBar: AppBar(title: Text(d.name), actions: [
          IconButton(
              onPressed: () async {
                await widget.onSave();
                if (mounted) setState(() => _saved = !_saved);
              },
              icon: Icon(_saved ? Icons.bookmark : Icons.bookmark_border),
              tooltip: 'Save place')
        ]),
        body: ListView(padding: const EdgeInsets.only(bottom: 28), children: [
          SizedBox(
              height: 270,
              child: Stack(fit: StackFit.expand, children: [
                Image.network(d.image,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                        color: sage,
                        child: const Icon(Icons.landscape,
                            size: 80, color: forest))),
                Positioned(
                    left: 18,
                    bottom: 18,
                    child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                            color: forest,
                            borderRadius: BorderRadius.circular(30)),
                        child: Text(d.region,
                            style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w700))))
              ])),
          Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(d.name,
                        style: const TextStyle(
                            fontSize: 29,
                            fontWeight: FontWeight.w900,
                            color: ink)),
                    const SizedBox(height: 5),
                    Text('${d.state} · ${d.categories.join('  /  ')}',
                        style: const TextStyle(color: Colors.black54)),
                    const SizedBox(height: 14),
                    Text(d.description,
                        style: const TextStyle(fontSize: 15, height: 1.55)),
                    const SizedBox(height: 18),
                    Row(children: [
                      Expanded(
                          child: _InfoTile(
                              icon: Icons.wb_sunny_outlined,
                              label: tr('Best season', 'en'),
                              value: d.season)),
                      const SizedBox(width: 10),
                      Expanded(
                          child: _InfoTile(
                              icon: Icons.schedule,
                              label: tr('Suggested duration', 'en'),
                              value: d.duration))
                    ]),
                    const SizedBox(height: 12),
                    Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(17),
                        decoration: BoxDecoration(
                            color: sage,
                            borderRadius: BorderRadius.circular(20)),
                        child: _weatherLoading
                            ? const Row(children: [
                                SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(
                                        strokeWidth: 2)),
                                SizedBox(width: 10),
                                Text('Checking current weather…')
                              ])
                            : _weather != null
                                ? Row(children: [
                                    const Icon(Icons.cloud_outlined,
                                        color: forest, size: 34),
                                    const SizedBox(width: 12),
                                    Expanded(
                                        child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                          Text(
                                              '${_weather!.temperature.round()}°C · ${_weather!.label}',
                                              style: const TextStyle(
                                                  fontWeight: FontWeight.w800,
                                                  fontSize: 17)),
                                          Text(
                                              'Feels like ${_weather!.feelsLike.round()}°C · Humidity ${_weather!.humidity}% · Wind ${_weather!.wind.round()} km/h',
                                              style: const TextStyle(
                                                  fontSize: 12,
                                                  color: Colors.black54))
                                        ]))
                                  ])
                                : Text(_weatherError ?? 'Weather unavailable')),
                    const SizedBox(height: 18),
                    Text(d.budget,
                        style: const TextStyle(
                            fontSize: 23,
                            color: forest,
                            fontWeight: FontWeight.w900)),
                    const Text(
                        'Indicative destination budget; not a live quote.',
                        style: TextStyle(fontSize: 12, color: Colors.black54)),
                    const SizedBox(height: 23),
                    Text(tr('Highlights', 'en'),
                        style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                            color: ink)),
                    const SizedBox(height: 10),
                    ...d.highlights.map((highlight) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 7),
                        child: Row(children: [
                          const Icon(Icons.check_circle_outline,
                              color: forest, size: 20),
                          const SizedBox(width: 10),
                          Expanded(
                              child: Text(highlight,
                                  style: const TextStyle(fontSize: 15)))
                        ]))),
                    const SizedBox(height: 22),
                    FilledButton.icon(
                        onPressed: () async {
                          try {
                            await openDestinationInMaps(
                                d.name, d.latitude, d.longitude);
                          } catch (_) {
                            if (context.mounted)
                              ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                      content: Text('Could not open Maps.')));
                          }
                        },
                        icon: const Icon(Icons.map_outlined),
                        label: Text(tr('Open in Maps', 'en')),
                        style: FilledButton.styleFrom(
                            minimumSize: const Size.fromHeight(52))),
                    const SizedBox(height: 10),
                    OutlinedButton.icon(
                        onPressed: () async {
                          await searchInMaps(
                              'hotels and restaurants near ${d.name}');
                        },
                        icon: const Icon(Icons.hotel_outlined),
                        label: const Text('Find stays and food nearby'),
                        style: OutlinedButton.styleFrom(
                            minimumSize: const Size.fromHeight(50))),
                  ]))
        ]));
  }
}

class _InfoTile extends StatelessWidget {
  const _InfoTile(
      {required this.icon, required this.label, required this.value});
  final IconData icon;
  final String label;
  final String value;
  @override
  Widget build(BuildContext context) => Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
          color: Colors.white, borderRadius: BorderRadius.circular(18)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Icon(icon, color: terracotta),
        const SizedBox(height: 8),
        Text(label,
            style: const TextStyle(fontSize: 11, color: Colors.black54)),
        const SizedBox(height: 4),
        Text(value,
            style: const TextStyle(
                fontWeight: FontWeight.w800, fontSize: 13, color: ink))
      ]));
}

class PlannerScreen extends StatelessWidget {
  const PlannerScreen(
      {super.key,
      required this.language,
      required this.tripIds,
      required this.days,
      required this.travellers,
      required this.pace,
      required this.budgetStyle,
      required this.onChanged,
      required this.onOpen});
  final String language;
  final Set<String> tripIds;
  final int days;
  final int travellers;
  final String pace;
  final String budgetStyle;
  final Future<void> Function(Set<String>, int, int, String, String) onChanged;
  final Future<void> Function(Destination) onOpen;

  double get _paceMultiplier =>
      {'Relaxed': 0.82, 'Balanced': 1.0, 'Packed': 1.28}[pace] ?? 1;
  double get _budgetMultiplier =>
      {'Value': 0.72, 'Balanced': 1.0, 'Luxury': 1.95}[budgetStyle] ?? 1;
  int get _dailyBase {
    final selected =
        destinations.where((item) => tripIds.contains(item.id)).toList();
    if (selected.isEmpty) return 0;
    return (selected.map((item) => item.dailyBudget).reduce((a, b) => a + b) /
            selected.length)
        .round();
  }

  int get _perPerson =>
      (_dailyBase * days * _paceMultiplier * _budgetMultiplier).round();
  int get _groupTotal => _perPerson * travellers;
  Map<String, int> get _costs => {
        'Stays': (_groupTotal * 0.38).round(),
        'Food': (_groupTotal * 0.23).round(),
        'Outings & experiences': (_groupTotal * 0.13).round(),
        'Shopping': (_groupTotal * 0.08).round(),
        'Travel': (_groupTotal * 0.12).round(),
        'Incidentals': (_groupTotal * 0.06).round()
      };
  String _money(int value) =>
      '₹${value.toString().replaceAllMapped(RegExp(r'\B(?=(\d{3})+(?!\d))'), (_) => ',')}';

  @override
  Widget build(BuildContext context) {
    final selected =
        destinations.where((item) => tripIds.contains(item.id)).toList();
    return ListView(
      padding: const EdgeInsets.fromLTRB(18, 6, 18, 112),
      children: [
        const Text(
          'Plan your journey',
          style:
              TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: ink),
        ),
        const SizedBox(height: 6),
        const Text(
          'Build a flexible draft across multiple places. Estimates are illustrative, not live quotes.',
          style: TextStyle(color: Colors.black54, height: 1.4),
        ),
        const SizedBox(height: 19),
        Container(
          padding: const EdgeInsets.all(19),
          decoration: BoxDecoration(
            color: forest,
            borderRadius: BorderRadius.circular(24),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'ESTIMATED GROUP BUDGET',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _money(_groupTotal),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 34,
                  fontWeight: FontWeight.w900,
                ),
              ),
              Text(
                '${_money(_perPerson)} per person · $days days · $travellers travellers',
                style: const TextStyle(color: Colors.white70),
              ),
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: _Counter(
                      label: 'Days',
                      value: days,
                      minimum: 1,
                      maximum: 30,
                      onChanged: (value) => onChanged(
                        tripIds,
                        value,
                        travellers,
                        pace,
                        budgetStyle,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _Counter(
                      label: 'Travellers',
                      value: travellers,
                      minimum: 1,
                      maximum: 20,
                      onChanged: (value) => onChanged(
                        tripIds,
                        days,
                        value,
                        pace,
                        budgetStyle,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        const SectionHeading(
          title: 'Trip style',
          subtitle: 'Shape the rhythm and comfort level',
        ),
        const SizedBox(height: 11),
        Row(
          children: [
            Expanded(
              child: _DropdownField(
                label: 'Daily pace',
                value: pace,
                values: const ['Relaxed', 'Balanced', 'Packed'],
                onChanged: (value) => onChanged(
                  tripIds,
                  days,
                  travellers,
                  value,
                  budgetStyle,
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _DropdownField(
                label: 'Spending',
                value: budgetStyle,
                values: const ['Value', 'Balanced', 'Luxury'],
                onChanged: (value) => onChanged(
                  tripIds,
                  days,
                  travellers,
                  pace,
                  value,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 21),
        const SectionHeading(
          title: 'Choose destinations',
          subtitle: 'Select one or more destinations for your draft',
        ),
        const SizedBox(height: 10),
        ...destinations.map(
          (item) => CheckboxListTile(
            value: tripIds.contains(item.id),
            onChanged: (checked) {
              final updated = tripIds.toSet();
              if (checked == true) {
                updated.add(item.id);
              } else {
                updated.remove(item.id);
              }
              onChanged(updated, days, travellers, pace, budgetStyle);
            },
            title: Text(
              item.name,
              style: const TextStyle(fontWeight: FontWeight.w700),
            ),
            subtitle: Text(
              '${item.state} · ${item.budget}',
              style: const TextStyle(fontSize: 12),
            ),
            activeColor: forest,
            contentPadding: const EdgeInsets.symmetric(horizontal: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
        ),
        const SizedBox(height: 18),
        const SectionHeading(
          title: 'Budget breakdown',
          subtitle: 'Indicative group-level allocation',
        ),
        const SizedBox(height: 12),
        ..._costs.entries.map(
          (entry) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        entry.key,
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ),
                    Text(
                      _money(entry.value),
                      style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        color: forest,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                LinearProgressIndicator(
                  value: _groupTotal == 0 ? 0 : entry.value / _groupTotal,
                  minHeight: 6,
                  borderRadius: BorderRadius.circular(10),
                  backgroundColor: sage,
                  color: terracotta,
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 18),
        const SectionHeading(
          title: 'Draft itinerary',
          subtitle: 'A simple day-by-day starting point',
        ),
        const SizedBox(height: 12),
        if (selected.isEmpty)
          const EmptyState(
            title: 'Choose a destination',
            subtitle: 'Select a place above to create a starter itinerary.',
          )
        else
          ...List.generate(days, (index) {
            final destination = selected[index % selected.length];
            final highlight =
                destination.highlights[index % destination.highlights.length];
            final dayStyle = pace == 'Relaxed'
                ? 'Slow morning'
                : pace == 'Packed'
                    ? 'Full day'
                    : 'Balanced day';
            return Card(
              margin: const EdgeInsets.only(bottom: 10),
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: sage,
                  foregroundColor: forest,
                  child: Text(
                    '${index + 1}',
                    style: const TextStyle(fontWeight: FontWeight.w800),
                  ),
                ),
                title: Text(
                  'Day ${index + 1} · ${destination.name}',
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
                subtitle: Text('$dayStyle · Explore $highlight'),
                trailing: IconButton(
                  onPressed: () => onOpen(destination),
                  icon: const Icon(Icons.arrow_forward_ios, size: 16),
                ),
              ),
            );
          }),
        const SizedBox(height: 6),
        OutlinedButton.icon(
          onPressed: () async {
            await searchInMaps(selected.map((item) => item.name).join(' to '));
          },
          icon: const Icon(Icons.map_outlined),
          label: const Text('Open route search in Maps'),
        ),
      ],
    );
  }
}

class _Counter extends StatelessWidget {
  const _Counter(
      {required this.label,
      required this.value,
      required this.minimum,
      required this.maximum,
      required this.onChanged});
  final String label;
  final int value;
  final int minimum;
  final int maximum;
  final ValueChanged<int> onChanged;
  @override
  Widget build(BuildContext context) =>
      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(label,
            style: const TextStyle(color: Colors.white70, fontSize: 12)),
        const SizedBox(height: 7),
        Container(
            decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(14)),
            child: Row(children: [
              IconButton(
                  onPressed:
                      value > minimum ? () => onChanged(value - 1) : null,
                  icon: const Icon(Icons.remove, color: Colors.white)),
              Expanded(
                  child: Text('$value',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w800,
                          fontSize: 17))),
              IconButton(
                  onPressed:
                      value < maximum ? () => onChanged(value + 1) : null,
                  icon: const Icon(Icons.add, color: Colors.white))
            ]))
      ]);
}

class _DropdownField extends StatelessWidget {
  const _DropdownField(
      {required this.label,
      required this.value,
      required this.values,
      required this.onChanged});
  final String label;
  final String value;
  final List<String> values;
  final ValueChanged<String> onChanged;
  @override
  Widget build(BuildContext context) =>
      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(label,
            style: const TextStyle(fontSize: 12, color: Colors.black54)),
        const SizedBox(height: 6),
        DropdownButtonFormField<String>(
            initialValue: value,
            isExpanded: true,
            decoration: const InputDecoration(
                contentPadding:
                    EdgeInsets.symmetric(horizontal: 11, vertical: 5)),
            items: values
                .map((item) => DropdownMenuItem(
                    value: item,
                    child: Text(item, overflow: TextOverflow.ellipsis)))
                .toList(),
            onChanged: (value) {
              if (value != null) onChanged(value);
            })
      ]);
}

class SavedScreen extends StatelessWidget {
  const SavedScreen(
      {super.key,
      required this.language,
      required this.items,
      required this.onOpen,
      required this.onSave});
  final String language;
  final List<Destination> items;
  final Future<void> Function(Destination) onOpen;
  final Future<void> Function(Destination) onSave;
  @override
  Widget build(BuildContext context) =>
      ListView(padding: const EdgeInsets.fromLTRB(18, 6, 18, 112), children: [
        Text(tr('Saved places', language),
            style: const TextStyle(
                fontSize: 28, fontWeight: FontWeight.w900, color: ink)),
        const SizedBox(height: 6),
        const Text('Your shortlist for the next journey.',
            style: TextStyle(color: Colors.black54)),
        const SizedBox(height: 16),
        if (items.isEmpty)
          const EmptyState(
              title: 'Nothing saved yet',
              subtitle: 'Use the bookmark on any destination to keep it here.')
        else
          ...items.map((item) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: DestinationCard(
                  destination: item,
                  isSaved: true,
                  onOpen: () => onOpen(item),
                  onSave: () => onSave(item))))
      ]);
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen(
      {super.key,
      required this.language,
      required this.displayName,
      required this.email,
      required this.onLanguage,
      required this.onSignIn,
      required this.onSignOut,
      required this.onNameChanged});
  final String language;
  final String displayName;
  final String? email;
  final ValueChanged<String> onLanguage;
  final VoidCallback onSignIn;
  final VoidCallback onSignOut;
  final ValueChanged<String> onNameChanged;
  static const languageNames = {
    'en': 'English',
    'hi': 'हिन्दी · Hindi',
    'te': 'తెలుగు · Telugu',
    'ta': 'தமிழ் · Tamil',
    'kn': 'ಕನ್ನಡ · Kannada',
    'ml': 'മലയാളം · Malayalam',
    'bn': 'বাংলা · Bengali',
    'mr': 'मराठी · Marathi'
  };
  @override
  Widget build(BuildContext context) =>
      ListView(padding: const EdgeInsets.fromLTRB(18, 6, 18, 112), children: [
        Text(tr('Profile', language),
            style: const TextStyle(
                fontSize: 28, fontWeight: FontWeight.w900, color: ink)),
        const SizedBox(height: 16),
        Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
                color: forest, borderRadius: BorderRadius.circular(24)),
            child: Row(children: [
              const CircleAvatar(
                  radius: 28,
                  backgroundColor: Colors.white24,
                  child: Icon(Icons.person_outline,
                      size: 30, color: Colors.white)),
              const SizedBox(width: 14),
              Expanded(
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                    Text(displayName,
                        style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            color: Colors.white)),
                    const SizedBox(height: 4),
                    Text(email ?? 'Browse as a guest',
                        style: const TextStyle(color: Colors.white70))
                  ]))
            ])),
        const SizedBox(height: 22),
        const SectionHeading(
            title: 'Preferences',
            subtitle: 'Personalise the way you explore India'),
        const SizedBox(height: 12),
        Card(
            child: ListTile(
                leading: const Icon(Icons.language, color: forest),
                title: Text(tr('Language', language)),
                subtitle: Text(languageNames[language] ?? 'English'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () async {
                  final result = await showModalBottomSheet<String>(
                      context: context,
                      builder: (context) => SafeArea(
                          child: ListView(
                              shrinkWrap: true,
                              children: languageNames.entries
                                  .map((entry) => ListTile(
                                      title: Text(entry.value),
                                      trailing: language == entry.key
                                          ? const Icon(Icons.check,
                                              color: forest)
                                          : null,
                                      onTap: () =>
                                          Navigator.pop(context, entry.key)))
                                  .toList())));
                  if (result != null) onLanguage(result);
                })),
        Card(
            child: ListTile(
                leading: const Icon(Icons.edit_outlined, color: forest),
                title: const Text('Traveller name'),
                subtitle: const Text('Edit the name displayed on your profile'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () async {
                  final controller = TextEditingController(text: displayName);
                  final result = await showDialog<String>(
                      context: context,
                      builder: (context) => AlertDialog(
                              title: const Text('Traveller name'),
                              content: TextField(
                                  controller: controller,
                                  autofocus: true,
                                  decoration:
                                      const InputDecoration(labelText: 'Name')),
                              actions: [
                                TextButton(
                                    onPressed: () => Navigator.pop(context),
                                    child: const Text('Cancel')),
                                FilledButton(
                                    onPressed: () =>
                                        Navigator.pop(context, controller.text),
                                    child: const Text('Save'))
                              ]));
                  controller.dispose();
                  if (result != null) onNameChanged(result);
                })),
        const SizedBox(height: 12),
        if (email == null)
          FilledButton.icon(
              onPressed: onSignIn,
              icon: const Icon(Icons.lock_outline),
              label: Text(tr('Sign in', language)),
              style: FilledButton.styleFrom(
                  minimumSize: const Size.fromHeight(50)))
        else
          OutlinedButton.icon(
              onPressed: onSignOut,
              icon: const Icon(Icons.logout),
              label: Text(tr('Sign out', language)),
              style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50))),
        const SizedBox(height: 20),
        const Text(
            'Travel details are best-effort planning guidance. Always confirm current weather, local advisories, opening hours, entry requirements and live prices before travel.',
            style: TextStyle(color: Colors.black54, fontSize: 12, height: 1.5))
      ]);
}

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key, required this.onComplete});
  final Future<void> Function() onComplete;
  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _formKey = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  String _mode = 'signin';
  String _language = 'en';
  bool _busy = false;
  String? _error;
  String? _message;
  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _busy = true;
      _error = null;
      _message = null;
    });
    try {
      final auth = Supabase.instance.client.auth;
      if (_mode == 'signin') {
        await auth.signInWithPassword(
            email: _email.text.trim(), password: _password.text);
        await widget.onComplete();
        if (mounted) Navigator.pop(context);
      } else if (_mode == 'signup') {
        final response = await auth
            .signUp(email: _email.text.trim(), password: _password.text, data: {
          'display_name': _name.text.trim(),
          'preferred_language': _language,
          'onboarding_complete': true
        });
        if (response.session != null) {
          await Supabase.instance.client.from('profiles').upsert({
            'id': response.user!.id,
            'display_name': _name.text.trim(),
            'language': _language,
            'onboarding_complete': true
          }, onConflict: 'id');
          await widget.onComplete();
          if (mounted) Navigator.pop(context);
        } else {
          setState(() => _message =
              'Check your email to confirm the new account, then sign in.');
        }
      } else {
        await auth.resetPasswordForEmail(_email.text.trim());
        setState(() => _message =
            'If the account exists, a password-reset email has been sent.');
      }
    } on AuthException catch (error) {
      setState(() => _error = error.message);
    } catch (error) {
      setState(() => _error =
          'Request failed. Check the Supabase configuration and network connection.');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('INDIVYA account')),
      body: Center(
          child: SingleChildScrollView(
              padding: const EdgeInsets.all(22),
              child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 480),
                  child: Form(
                      key: _formKey,
                      child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Container(
                                height: 78,
                                width: 78,
                                decoration: BoxDecoration(
                                    color: forest,
                                    borderRadius: BorderRadius.circular(26)),
                                child: const Icon(Icons.landscape_outlined,
                                    color: Colors.white, size: 44)),
                            const SizedBox(height: 20),
                            Text(
                                _mode == 'signin'
                                    ? 'Welcome back'
                                    : _mode == 'signup'
                                        ? 'Start exploring'
                                        : 'Reset password',
                                style: const TextStyle(
                                    fontSize: 30,
                                    fontWeight: FontWeight.w900,
                                    color: ink)),
                            const SizedBox(height: 8),
                            const Text(
                                'Sign in to sync your saved destinations and travel preferences.',
                                style: TextStyle(color: Colors.black54)),
                            const SizedBox(height: 24),
                            if (_mode == 'signup') ...[
                              TextFormField(
                                  controller: _name,
                                  decoration: const InputDecoration(
                                      labelText: 'Name',
                                      prefixIcon: Icon(Icons.person_outline)),
                                  validator: (value) =>
                                      value == null || value.trim().isEmpty
                                          ? 'Enter your name.'
                                          : null),
                              const SizedBox(height: 12),
                              DropdownButtonFormField<String>(
                                  initialValue: _language,
                                  decoration: const InputDecoration(
                                      labelText: 'Preferred language'),
                                  items: ProfileScreen.languageNames.entries
                                      .map((entry) => DropdownMenuItem(
                                          value: entry.key,
                                          child: Text(entry.value)))
                                      .toList(),
                                  onChanged: (value) {
                                    if (value != null)
                                      setState(() => _language = value);
                                  }),
                              const SizedBox(height: 12)
                            ],
                            TextFormField(
                                controller: _email,
                                keyboardType: TextInputType.emailAddress,
                                decoration: const InputDecoration(
                                    labelText: 'Email',
                                    prefixIcon: Icon(Icons.mail_outline)),
                                validator: (value) =>
                                    value == null || !value.contains('@')
                                        ? 'Enter a valid email.'
                                        : null),
                            if (_mode != 'forgot') ...[
                              const SizedBox(height: 12),
                              TextFormField(
                                  controller: _password,
                                  obscureText: true,
                                  decoration: const InputDecoration(
                                      labelText: 'Password',
                                      prefixIcon: Icon(Icons.lock_outline)),
                                  validator: (value) =>
                                      value == null || value.length < 6
                                          ? 'Use at least 6 characters.'
                                          : null)
                            ],
                            if (_error != null)
                              Padding(
                                  padding: const EdgeInsets.only(top: 12),
                                  child: Text(_error!,
                                      style:
                                          const TextStyle(color: Colors.red))),
                            if (_message != null)
                              Padding(
                                  padding: const EdgeInsets.only(top: 12),
                                  child: Text(_message!,
                                      style: const TextStyle(color: forest))),
                            const SizedBox(height: 18),
                            FilledButton(
                                onPressed: _busy ? null : _submit,
                                style: FilledButton.styleFrom(
                                    minimumSize: const Size.fromHeight(52)),
                                child: _busy
                                    ? const SizedBox(
                                        width: 22,
                                        height: 22,
                                        child: CircularProgressIndicator(
                                            strokeWidth: 2))
                                    : Text(_mode == 'signin'
                                        ? 'Sign in'
                                        : _mode == 'signup'
                                            ? 'Create account'
                                            : 'Send reset email')),
                            const SizedBox(height: 8),
                            TextButton(
                                onPressed: () => setState(() {
                                      _mode = _mode == 'signin'
                                          ? 'signup'
                                          : 'signin';
                                      _error = null;
                                      _message = null;
                                    }),
                                child: Text(_mode == 'signup'
                                    ? 'Already have an account? Sign in'
                                    : 'New here? Create an account')),
                            if (_mode != 'forgot')
                              TextButton(
                                  onPressed: () => setState(() {
                                        _mode = 'forgot';
                                        _error = null;
                                        _message = null;
                                      }),
                                  child: const Text('Forgot password?'))
                            else
                              TextButton(
                                  onPressed: () => setState(() {
                                        _mode = 'signin';
                                        _error = null;
                                        _message = null;
                                      }),
                                  child: const Text('Back to sign in'))
                          ]))))));
}

class EmptyState extends StatelessWidget {
  const EmptyState({super.key, required this.title, required this.subtitle});
  final String title;
  final String subtitle;
  @override
  Widget build(BuildContext context) => Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 34),
      decoration: BoxDecoration(
          color: Colors.white, borderRadius: BorderRadius.circular(22)),
      child: Column(children: [
        const Icon(Icons.travel_explore, color: forest, size: 42),
        const SizedBox(height: 12),
        Text(title,
            style: const TextStyle(
                fontSize: 18, fontWeight: FontWeight.w800, color: ink)),
        const SizedBox(height: 5),
        Text(subtitle,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.black54, height: 1.4))
      ]));
}
