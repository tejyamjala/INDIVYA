import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'data/destinations.dart';
import 'models/destination.dart';
import 'services/travel_services.dart';

const forest = Color(0xFF24584A);
const sand = Color(0xFFF7F4ED);
const supabaseUrl = String.fromEnvironment('SUPABASE_URL');
const supabaseAnonKey = String.fromEnvironment('SUPABASE_ANON_KEY');
bool get hasSupabaseConfig => supabaseUrl.isNotEmpty && supabaseAnonKey.isNotEmpty;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (hasSupabaseConfig) await Supabase.initialize(url: supabaseUrl, anonKey: supabaseAnonKey);
  runApp(const IndivyaApp());
}

class IndivyaApp extends StatelessWidget {
  const IndivyaApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'INDIVYA · India Tourism',
    debugShowCheckedModeBanner: false,
    theme: ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(seedColor: forest, primary: forest),
      scaffoldBackgroundColor: sand,
      appBarTheme: const AppBarTheme(backgroundColor: sand, foregroundColor: Color(0xFF20322D), elevation: 0),
      cardTheme: CardThemeData(color: Colors.white, elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22))),
      inputDecorationTheme: InputDecorationTheme(filled: true, fillColor: Colors.white, border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none)),
    ),
    home: const IndivyaHome(),
  );
}

enum HomeTab { discover, explore, pilgrims, planner, saved, profile }

class IndivyaHome extends StatefulWidget {
  const IndivyaHome({super.key});
  @override
  State<IndivyaHome> createState() => _IndivyaHomeState();
}

class _IndivyaHomeState extends State<IndivyaHome> {
  HomeTab tab = HomeTab.discover;
  String query = '';
  String category = 'All';
  String language = 'en';
  int days = 4;
  int travellers = 2;
  final Set<String> saved = {};
  final Set<String> trip = {'leh-ladakh'};
  bool ready = false;
  User? user;

  @override
  void initState() { super.initState(); _restore(); }

  Future<void> _restore() async {
    final prefs = await SharedPreferences.getInstance();
    saved.addAll(prefs.getStringList('indivya.saved') ?? []);
    trip..clear()..addAll(prefs.getStringList('indivya.trip') ?? ['leh-ladakh']);
    language = prefs.getString('indivya.language') ?? 'en';
    if (hasSupabaseConfig) user = Supabase.instance.client.auth.currentUser;
    if (mounted) setState(() => ready = true);
  }

  Future<void> _persist() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('indivya.saved', saved.toList());
    await prefs.setStringList('indivya.trip', trip.toList());
    await prefs.setString('indivya.language', language);
  }

  void _toggleSaved(Destination d) {
    setState(() { if (!saved.add(d.id)) saved.remove(d.id); });
    _persist();
  }

  List<Destination> get visible {
    Iterable<Destination> list = destinations;
    if (tab == HomeTab.pilgrims) list = list.where((d) => d.categories.contains('Pilgrimage'));
    if (tab == HomeTab.saved) list = list.where((d) => saved.contains(d.id));
    if (query.isNotEmpty) {
      final q = query.toLowerCase();
      list = list.where((d) => (d.name + ' ' + d.state + ' ' + d.region + ' ' + d.description).toLowerCase().contains(q));
    }
    if (category != 'All') list = list.where((d) => d.categories.contains(category));
    return list.toList();
  }

  String get pageTitle {
    switch (tab) {
      case HomeTab.discover: return 'Find your next India';
      case HomeTab.explore: return 'Explore destinations';
      case HomeTab.pilgrims: return 'Sacred journeys';
      case HomeTab.planner: return 'Plan your journey';
      case HomeTab.saved: return 'Saved places';
      case HomeTab.profile: return 'Your profile';
    }
  }

  @override
  Widget build(BuildContext context) {
    const tabs = [
      (HomeTab.discover, Icons.explore_outlined, 'Discover'),
      (HomeTab.explore, Icons.travel_explore, 'Explore'),
      (HomeTab.pilgrims, Icons.temple_hindu_outlined, 'Pilgrims'),
      (HomeTab.planner, Icons.route_outlined, 'Planner'),
      (HomeTab.saved, Icons.bookmark_border, 'Saved'),
      (HomeTab.profile, Icons.person_outline, 'Profile'),
    ];
    return Scaffold(
      body: SafeArea(child: !ready ? const Center(child: CircularProgressIndicator()) : CustomScrollView(slivers: [
        SliverToBoxAdapter(child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 14, 20, 12),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Container(width: 44, height: 44, decoration: BoxDecoration(color: forest, borderRadius: BorderRadius.circular(15)), child: const Icon(Icons.explore, color: Colors.white)),
              const SizedBox(width: 12),
              const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('INDIVYA', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, letterSpacing: 2)),
                Text('A little closer to incredible India', style: TextStyle(fontSize: 12, color: Colors.black54)),
              ])),
              IconButton(onPressed: () => setState(() => tab = HomeTab.profile), icon: const Icon(Icons.person_outline)),
            ]),
            const SizedBox(height: 22),
            Text(pageTitle, style: const TextStyle(fontSize: 29, height: 1.12, fontWeight: FontWeight.w800)),
            const SizedBox(height: 7),
            const Text('Culture, coastlines, mountains and moments to remember.', style: TextStyle(color: Colors.black54)),
            if (tab == HomeTab.discover) ...[
              const SizedBox(height: 18), _hero(), const SizedBox(height: 20),
              const Text('Places worth discovering', style: TextStyle(fontSize: 21, fontWeight: FontWeight.w800)),
            ],
            if (tab == HomeTab.explore || tab == HomeTab.pilgrims || tab == HomeTab.saved) ...[
              const SizedBox(height: 16),
              TextField(decoration: const InputDecoration(hintText: 'Search destinations or states', prefixIcon: Icon(Icons.search)), onChanged: (v) => setState(() => query = v)),
              const SizedBox(height: 10),
              SizedBox(height: 42, child: ListView(scrollDirection: Axis.horizontal, children: [
                for (final value in ['All','Nature','Culture','Beach','Adventure','Heritage','Pilgrimage'])
                  Padding(padding: const EdgeInsets.only(right: 8), child: ChoiceChip(label: Text(value), selected: category == value, onSelected: (_) => setState(() => category = value))),
              ])),
            ],
          ]),
        )),
        if (tab == HomeTab.planner) SliverToBoxAdapter(child: _planner()),
        if (tab == HomeTab.profile) SliverToBoxAdapter(child: _profile()),
        if (tab != HomeTab.planner && tab != HomeTab.profile)
          SliverPadding(padding: const EdgeInsets.fromLTRB(18, 10, 18, 28), sliver: SliverList(delegate: SliverChildBuilderDelegate(
            (context, index) => _card(visible[index]), childCount: visible.length,
          ))),
      ])),
      bottomNavigationBar: NavigationBar(
        selectedIndex: tabs.indexWhere((item) => item.$1 == tab),
        onDestinationSelected: (i) => setState(() { tab = tabs[i].$1; query = ''; category = 'All'; }),
        destinations: [for (final item in tabs) NavigationDestination(icon: Icon(item.$2), label: item.$3)],
      ),
    );
  }

  Widget _hero() => Container(
    height: 205, clipBehavior: Clip.antiAlias,
    decoration: BoxDecoration(borderRadius: BorderRadius.circular(26), color: forest),
    child: Stack(fit: StackFit.expand, children: [
      Image.network('https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=85', fit: BoxFit.cover, errorBuilder: (_, __, ___) => Container(color: forest)),
      Container(decoration: const BoxDecoration(gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Colors.transparent, Color(0xD9000000)]))),
      const Padding(padding: EdgeInsets.all(20), child: Column(mainAxisAlignment: MainAxisAlignment.end, crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('A journey for every kind of wonder', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w800)),
        SizedBox(height: 5),
        Text('Find a place that feels like yours.', style: TextStyle(color: Colors.white70)),
      ])),
    ]),
  );

  Widget _card(Destination d) => Padding(
    padding: const EdgeInsets.only(bottom: 14),
    child: InkWell(
      borderRadius: BorderRadius.circular(22),
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => DestinationPage(destination: d, saved: saved.contains(d.id), onSave: () => _toggleSaved(d)))),
      child: Card(clipBehavior: Clip.antiAlias, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        SizedBox(height: 160, width: double.infinity, child: Stack(fit: StackFit.expand, children: [
          Image.network(d.imageUrl, fit: BoxFit.cover, errorBuilder: (_, __, ___) => Container(color: const Color(0xFFE4EEE7), child: const Icon(Icons.landscape, size: 52, color: forest))),
          Positioned(right: 10, top: 10, child: IconButton.filledTonal(onPressed: () => _toggleSaved(d), icon: Icon(saved.contains(d.id) ? Icons.bookmark : Icons.bookmark_border), style: IconButton.styleFrom(backgroundColor: Colors.white.withValues(alpha: .95)))),
          Positioned(left: 12, bottom: 10, child: Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6), decoration: BoxDecoration(color: Colors.white.withValues(alpha: .93), borderRadius: BorderRadius.circular(30)), child: Text(d.region, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12)))),
        ])),
        Padding(padding: const EdgeInsets.all(16), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(d.name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
          Text(d.state, style: const TextStyle(color: Colors.black54)),
          const SizedBox(height: 8),
          Text(d.description, maxLines: 2, overflow: TextOverflow.ellipsis),
          const SizedBox(height: 8),
          Wrap(spacing: 5, children: [for (final tag in d.categories.take(3)) Chip(label: Text(tag, style: const TextStyle(fontSize: 11)), visualDensity: VisualDensity.compact, side: BorderSide.none)]),
          Row(children: [
            const Icon(Icons.calendar_month_outlined, size: 16, color: forest),
            const SizedBox(width: 5), Text(d.duration, style: const TextStyle(fontSize: 12, color: Colors.black54)),
            const Spacer(), Text('From ₹' + d.dailyBudget.toString() + '/day', style: const TextStyle(fontWeight: FontWeight.w800, color: forest)),
          ]),
        ])),
      ])),
    ),
  );

  Widget _planner() {
    final selected = destinations.where((d) => trip.contains(d.id)).toList();
    final estimate = selected.fold<int>(0, (sum, d) => sum + d.dailyBudget) * days * travellers;
    return Padding(padding: const EdgeInsets.all(20), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Card(child: Padding(padding: const EdgeInsets.all(18), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text('Build your itinerary', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
        Row(children: [const Expanded(child: Text('Trip length')), Text(days.toString() + ' days')]),
        Slider(value: days.toDouble(), min: 1, max: 14, divisions: 13, onChanged: (v) => setState(() => days = v.round())),
        Row(children: [const Expanded(child: Text('Travellers')), Text(travellers.toString())]),
        Slider(value: travellers.toDouble(), min: 1, max: 12, divisions: 11, onChanged: (v) => setState(() => travellers = v.round())),
      ]))),
      const SizedBox(height: 12),
      const Text('Add places', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
      for (final d in destinations)
        CheckboxListTile(contentPadding: EdgeInsets.zero, value: trip.contains(d.id), title: Text(d.name), subtitle: Text(d.state + ' · ₹' + d.dailyBudget.toString() + '/person/day'), onChanged: (v) { setState(() { if (v == true) { trip.add(d.id); } else { trip.remove(d.id); } }); _persist(); }),
      Card(color: forest, child: Padding(padding: const EdgeInsets.all(18), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text('Indicative group budget', style: TextStyle(color: Colors.white70)),
        Text('₹' + estimate.toString(), style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Colors.white)),
        Text(days.toString() + ' days · ' + travellers.toString() + ' travellers', style: const TextStyle(color: Colors.white70)),
        const Text('Planning estimate only; prices are not live quotes.', style: TextStyle(color: Colors.white70, fontSize: 12)),
      ]))),
    ]));
  }

  Widget _profile() => Padding(padding: const EdgeInsets.all(20), child: Column(children: [
    Card(child: Padding(padding: const EdgeInsets.all(18), child: Column(children: [
      const CircleAvatar(radius: 34, backgroundColor: Color(0xFFE4EEE7), child: Icon(Icons.person, size: 34, color: forest)),
      const SizedBox(height: 12),
      Text(user?.email ?? 'Guest traveller', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
      Text(hasSupabaseConfig ? 'Account services configured' : 'Saved places stay on this device'),
      const SizedBox(height: 14),
      DropdownButtonFormField<String>(value: language, decoration: const InputDecoration(labelText: 'Preferred language'), items: const [
        DropdownMenuItem(value:'en', child:Text('English')), DropdownMenuItem(value:'hi', child:Text('हिन्दी')), DropdownMenuItem(value:'te', child:Text('తెలుగు')), DropdownMenuItem(value:'ta', child:Text('தமிழ்')), DropdownMenuItem(value:'kn', child:Text('ಕನ್ನಡ')), DropdownMenuItem(value:'ml', child:Text('മലയാളം')), DropdownMenuItem(value:'bn', child:Text('বাংলা')), DropdownMenuItem(value:'mr', child:Text('मराठी')),
      ], onChanged: (v) { if (v != null) { setState(() => language = v); _persist(); } }),
      if (hasSupabaseConfig && user == null) const Padding(padding: EdgeInsets.only(top: 10), child: Text('Authentication configuration detected; mobile sign-in flow requires deep-link validation.')),
      if (hasSupabaseConfig && user != null) OutlinedButton(onPressed: () async { await Supabase.instance.client.auth.signOut(); setState(() => user = null); }, child: const Text('Sign out')),
    ]))),
    Card(child: ListTile(leading: const Icon(Icons.chat_bubble_outline, color: forest), title: const Text('Mira · travel companion'), subtitle: const Text('Ask for destination ideas, trip pacing or planning tips.'), onTap: _showMira)),
    const Padding(padding: EdgeInsets.all(12), child: Text('Initial mobile port. Full translation coverage, profile parity and account sync need further verification.', style: TextStyle(color: Colors.black54))),
  ]));

  void _showMira() {
    final prompt = TextEditingController();
    String answer = 'Tell me your interests, budget and trip length for general destination-planning guidance.';
    showDialog<void>(context: context, builder: (dialogContext) => StatefulBuilder(builder: (context, update) => AlertDialog(
      title: const Text('Mira · travel companion'),
      content: Column(mainAxisSize: MainAxisSize.min, children: [
        Text(answer), const SizedBox(height: 12),
        TextField(controller: prompt, decoration: const InputDecoration(hintText: 'Ask a travel question')),
      ]),
      actions: [
        TextButton(onPressed: () => Navigator.pop(dialogContext), child: const Text('Close')),
        FilledButton(onPressed: () => update(() => answer = miraReply(prompt.text)), child: const Text('Ask Mira')),
      ],
    )));
  }
}

class DestinationPage extends StatefulWidget {
  const DestinationPage({super.key, required this.destination, required this.saved, required this.onSave});
  final Destination destination;
  final bool saved;
  final VoidCallback onSave;
  @override
  State<DestinationPage> createState() => _DestinationPageState();
}

class _DestinationPageState extends State<DestinationPage> {
  String? weather;
  @override
  void initState() { super.initState(); _weather(); }
  Future<void> _weather() async {
    try {
      final result = await TravelServices.weather(widget.destination.latitude, widget.destination.longitude);
      if (mounted) setState(() => weather = result);
    } catch (_) { if (mounted) setState(() => weather = 'Weather temporarily unavailable'); }
  }
  @override
  Widget build(BuildContext context) {
    final d = widget.destination;
    return Scaffold(
      body: CustomScrollView(slivers: [
        SliverAppBar(pinned: true, expandedHeight: 260, flexibleSpace: FlexibleSpaceBar(background: Image.network(d.imageUrl, fit: BoxFit.cover, errorBuilder: (_, __, ___) => Container(color: forest)), title: Text(d.name))),
        SliverToBoxAdapter(child: Padding(padding: const EdgeInsets.all(20), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(d.state + ' · ' + d.region, style: const TextStyle(color: forest, fontWeight: FontWeight.w700)),
          const SizedBox(height: 10), Text(d.description, style: const TextStyle(fontSize: 16, height: 1.5)),
          const SizedBox(height: 14), Wrap(spacing: 6, children: [for (final tag in d.categories) Chip(label: Text(tag))]),
          ListTile(contentPadding: EdgeInsets.zero, leading: const Icon(Icons.wb_sunny_outlined, color: forest), title: const Text('Best season'), subtitle: Text(d.season)),
          ListTile(contentPadding: EdgeInsets.zero, leading: const Icon(Icons.calendar_month_outlined, color: forest), title: const Text('Suggested duration'), subtitle: Text(d.duration)),
          ListTile(contentPadding: EdgeInsets.zero, leading: const Icon(Icons.account_balance_wallet_outlined, color: forest), title: const Text('Indicative daily budget'), subtitle: Text('₹' + d.dailyBudget.toString() + ' per person')),
          ListTile(contentPadding: EdgeInsets.zero, leading: const Icon(Icons.cloud_outlined, color: forest), title: const Text('Weather'), subtitle: Text(weather ?? 'Loading forecast…')),
          const Text('Highlights', style: TextStyle(fontSize: 21, fontWeight: FontWeight.w800)),
          for (final h in d.highlights) ListTile(contentPadding: EdgeInsets.zero, leading: const Icon(Icons.check_circle_outline, color: forest), title: Text(h)),
          FilledButton.icon(onPressed: () => TravelServices.openMaps(d.name, d.latitude, d.longitude), icon: const Icon(Icons.map_outlined), label: const Text('Open in Maps')),
          OutlinedButton.icon(onPressed: widget.onSave, icon: Icon(widget.saved ? Icons.bookmark : Icons.bookmark_border), label: Text(widget.saved ? 'Saved place' : 'Save place')),
        ]))),
      ]),
    );
  }
}

String miraReply(String value) {
  final q = value.toLowerCase();
  if (q.contains('budget') || q.contains('cost') || q.contains('cheap')) return 'Use destination daily-budget estimates and adjust days and travellers in Planner. These are estimates, not live quotes.';
  if (q.contains('weather') || q.contains('season')) return 'Check each destination detail page for seasonal guidance and the current Open-Meteo forecast.';
  if (q.contains('temple') || q.contains('pilgrim') || q.contains('spiritual')) return 'Open Pilgrims to explore sacred destinations. Leave time for queues and local transport.';
  if (q.contains('beach') || q.contains('sea')) return 'Use Explore and select Beach. Check monsoon and sea conditions before water activities.';
  return 'Tell me your interests, budget and trip length. Confirm live prices, transit schedules and opening hours before booking.';
}
