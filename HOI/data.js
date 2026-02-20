// ============================================================
// HOI-Inspired Grand Strategy Game — DATA FILE v2
// Coordinate system: x=(lon+11)*16, y=(72-lat)*19
// ============================================================

const GAME_DATA = {

    // ── TERRITORIES (45 regions) ──────────────────────────────
    territories: {
        // British Isles
        scotland: { name: 'Szkocja', owner: 'uk', vp: 3 },
        england: { name: 'Anglia i Walia', owner: 'uk', vp: 5 },
        ireland: { name: 'Irlandia', owner: 'neutral', vp: 2 },
        // Scandinavia
        nor_south: { name: 'Południe Norwegii', owner: 'neutral', vp: 3 },
        nor_north: { name: 'Północ Norwegii', owner: 'neutral', vp: 2 },
        swe_south: { name: 'Południe Szwecji', owner: 'neutral', vp: 3 },
        swe_north: { name: 'Północ Szwecji', owner: 'neutral', vp: 2 },
        finland: { name: 'Finlandia', owner: 'neutral', vp: 3 },
        denmark: { name: 'Dania', owner: 'neutral', vp: 3 },
        // Western Europe
        netherlands: { name: 'Holandia', owner: 'neutral', vp: 3 },
        belgium: { name: 'Belgia', owner: 'neutral', vp: 3 },
        fra_north: { name: 'Północna Francja', owner: 'france', vp: 5 },
        fra_south: { name: 'Południowa Francja', owner: 'france', vp: 4 },
        portugal: { name: 'Portugalia', owner: 'neutral', vp: 2 },
        spa_north: { name: 'Północna Hiszpania', owner: 'neutral', vp: 3 },
        spa_south: { name: 'Południowa Hiszpania', owner: 'neutral', vp: 3 },
        // Central Europe
        ger_north: { name: 'Prusy', owner: 'germany', vp: 4 },
        ger_west: { name: 'Nadrenia', owner: 'germany', vp: 4 },
        ger_center: { name: 'Saksonia', owner: 'germany', vp: 3 },
        ger_south: { name: 'Bawaria', owner: 'germany', vp: 3 },
        east_prussia: { name: 'Prusy Wschodnie', owner: 'germany', vp: 2 },
        switzerland: { name: 'Szwajcaria', owner: 'neutral', vp: 2 },
        austria: { name: 'Austria', owner: 'neutral', vp: 3 },
        czechia: { name: 'Czechosłowacja', owner: 'neutral', vp: 4 },
        // Italy
        italy_north: { name: 'Północne Włochy', owner: 'italy', vp: 4 },
        italy_south: { name: 'Południowe Włochy', owner: 'italy', vp: 3 },
        // Eastern Europe
        pol_west: { name: 'Zachodnia Polska', owner: 'poland', vp: 3 },
        pol_center: { name: 'Centralna Polska', owner: 'poland', vp: 4 },
        pol_east: { name: 'Wschodnia Polska', owner: 'poland', vp: 3 },
        baltics: { name: 'Kraje Bałtyckie', owner: 'neutral', vp: 3 },
        hungary: { name: 'Węgry', owner: 'neutral', vp: 3 },
        romania: { name: 'Rumunia', owner: 'neutral', vp: 4 },
        transylvania: { name: 'Transylwania', owner: 'neutral', vp: 2 },
        // Balkans
        yugoslavia: { name: 'Jugosławia', owner: 'neutral', vp: 3 },
        bulgaria: { name: 'Bułgaria', owner: 'neutral', vp: 2 },
        greece: { name: 'Grecja', owner: 'neutral', vp: 2 },
        albania: { name: 'Albania', owner: 'neutral', vp: 1 },
        // USSR regions
        ussr_leningrad: { name: 'Leningrad', owner: 'ussr', vp: 5 },
        ussr_moscow: { name: 'Moskwa', owner: 'ussr', vp: 8 },
        ussr_belarus: { name: 'Białoruś', owner: 'ussr', vp: 3 },
        ussr_ukraine: { name: 'Ukraina', owner: 'ussr', vp: 5 },
        ussr_south: { name: 'Południe ZSRR', owner: 'ussr', vp: 3 },
        ussr_north: { name: 'Północny ZSRR', owner: 'ussr', vp: 2 },
        // Turkey (neutral buffer)
        turkey: { name: 'Turcja', owner: 'neutral', vp: 2 },
    },

    // ── COUNTRIES ─────────────────────────────────────────────
    countries: {
        germany: {
            name: 'Niemcy', flag: '🇩🇪', color: '#5a5a5a', ideology: 'fascism',
            aiPersonality: 'expansionist',
            homeTerritories: ['ger_north', 'ger_west', 'ger_center', 'ger_south', 'east_prussia'],
            resources: { steel: 80, oil: 20, aluminum: 30, food: 60, ic: 45 },
            military: { infantry: 24, tanks: 6, planes: 8, ships: 4 },
            research: { land: 1, sea: 0, air: 1, industry: 1 },
            stats: { stability: 70, warSupport: 75, manpower: 500 },
            alliances: [], atWarWith: [], casusBelli: {}, completedFocuses: [],
            activeFocus: null, focusProgress: 0, technologies: [], productionQueue: [],
            focusTree: 'germany', activeResearch: null, researchProgress: 0, defenseBonus: 0,
        },
        poland: {
            name: 'Polska', flag: '🇵🇱', color: '#8B2020', ideology: 'democracy',
            aiPersonality: 'defender',
            homeTerritories: ['pol_west', 'pol_center', 'pol_east'],
            resources: { steel: 40, oil: 10, aluminum: 15, food: 50, ic: 20 },
            military: { infantry: 15, tanks: 2, planes: 3, ships: 0 },
            research: { land: 0, sea: 0, air: 0, industry: 0 },
            stats: { stability: 60, warSupport: 55, manpower: 300 },
            alliances: [], atWarWith: [], casusBelli: {}, completedFocuses: [],
            activeFocus: null, focusProgress: 0, technologies: [], productionQueue: [],
            focusTree: 'poland', activeResearch: null, researchProgress: 0, defenseBonus: 0,
        },
        france: {
            name: 'Francja', flag: '🇫🇷', color: '#1a4a8a', ideology: 'democracy',
            aiPersonality: 'defender',
            homeTerritories: ['fra_north', 'fra_south'],
            resources: { steel: 60, oil: 5, aluminum: 25, food: 70, ic: 30 },
            military: { infantry: 18, tanks: 4, planes: 5, ships: 6 },
            research: { land: 0, sea: 1, air: 0, industry: 0 },
            stats: { stability: 65, warSupport: 50, manpower: 400 },
            alliances: [], atWarWith: [], casusBelli: {}, completedFocuses: [],
            activeFocus: null, focusProgress: 0, technologies: [], productionQueue: [],
            focusTree: 'france', activeResearch: null, researchProgress: 0, defenseBonus: 0,
        },
        uk: {
            name: 'Wielka Brytania', flag: '🇬🇧', color: '#c8a022', ideology: 'democracy',
            aiPersonality: 'defender',
            homeTerritories: ['england', 'scotland'],
            resources: { steel: 55, oil: 15, aluminum: 20, food: 50, ic: 35 },
            military: { infantry: 15, tanks: 3, planes: 7, ships: 12 },
            research: { land: 0, sea: 1, air: 1, industry: 0 },
            stats: { stability: 70, warSupport: 55, manpower: 350 },
            alliances: [], atWarWith: [], casusBelli: {}, completedFocuses: [],
            activeFocus: null, focusProgress: 0, technologies: [], productionQueue: [],
            focusTree: 'uk', activeResearch: null, researchProgress: 0, defenseBonus: 0,
        },
        ussr: {
            name: 'ZSRR', flag: '🇷🇺', color: '#7a1a1a', ideology: 'communism',
            aiPersonality: 'industrialist',
            homeTerritories: ['ussr_leningrad', 'ussr_moscow', 'ussr_belarus', 'ussr_ukraine', 'ussr_south', 'ussr_north'],
            resources: { steel: 90, oil: 60, aluminum: 40, food: 80, ic: 40 },
            military: { infantry: 30, tanks: 8, planes: 10, ships: 3 },
            research: { land: 1, sea: 0, air: 0, industry: 1 },
            stats: { stability: 55, warSupport: 65, manpower: 750 },
            alliances: [], atWarWith: [], casusBelli: {}, completedFocuses: [],
            activeFocus: null, focusProgress: 0, technologies: [], productionQueue: [],
            focusTree: 'ussr', activeResearch: null, researchProgress: 0, defenseBonus: 0,
        },
        italy: {
            name: 'Włochy', flag: '🇮🇹', color: '#2d6a2d', ideology: 'fascism',
            aiPersonality: 'expansionist',
            homeTerritories: ['italy_north', 'italy_south'],
            resources: { steel: 35, oil: 5, aluminum: 20, food: 55, ic: 25 },
            military: { infantry: 14, tanks: 2, planes: 5, ships: 8 },
            research: { land: 0, sea: 1, air: 0, industry: 0 },
            stats: { stability: 60, warSupport: 60, manpower: 280 },
            alliances: [], atWarWith: [], casusBelli: {}, completedFocuses: [],
            activeFocus: null, focusProgress: 0, technologies: [], productionQueue: [],
            focusTree: 'italy', activeResearch: null, researchProgress: 0, defenseBonus: 0,
        },
    },

    // ── FOCUS TREES ───────────────────────────────────────────
    focusTrees: {
        germany: [
            { id: 'ger_rearm', name: 'Remilitaryzacja', icon: '⚔️', weeksToComplete: 5, requires: [], effects: { military: { infantry: 4 }, resources: { ic: 5 } }, description: '+4 dywizje i +5 IC' },
            { id: 'ger_anschluss', name: 'Anschluss', icon: '🏔️', weeksToComplete: 7, requires: ['ger_rearm'], effects: { territory: 'austria' }, description: 'Inkorporuj Austrię dyplomatycznie' },
            { id: 'ger_sudeten', name: 'Żądania Sudetów', icon: '🏗️', weeksToComplete: 6, requires: ['ger_rearm'], effects: { territory: 'czechia' }, description: 'Przejmij Czechosłowację' },
            { id: 'ger_4year', name: 'Plan Czteroletni', icon: '🏭', weeksToComplete: 6, requires: ['ger_rearm'], effects: { resources: { steel: 20, ic: 8 } }, description: '+20 stali, +8 IC' },
            { id: 'ger_panzer', name: 'Doktryna Pancerna', icon: '🚀', weeksToComplete: 8, requires: ['ger_4year'], effects: { military: { tanks: 5 }, researchBonus: 'land' }, description: '+5 czołgów' },
            { id: 'ger_luftwaffe', name: 'Luftwaffe', icon: '✈️', weeksToComplete: 7, requires: ['ger_rearm'], effects: { military: { planes: 6 }, researchBonus: 'air' }, description: '+6 samolotów' },
            { id: 'ger_axis', name: 'Oś Berlin-Rzym', icon: '🤝', weeksToComplete: 4, requires: ['ger_anschluss'], effects: { alliance: 'axis' }, description: 'Sojusz z Włochami' },
            { id: 'ger_fall_w', name: 'Fall Weiß', icon: '💥', weeksToComplete: 6, requires: ['ger_axis', 'ger_sudeten'], effects: { casusBelli: 'poland' }, description: 'Plan ataku na Polskę' },
            { id: 'ger_fall_g', name: 'Fall Gelb', icon: '⚡', weeksToComplete: 6, requires: ['ger_axis'], effects: { casusBelli: 'france' }, description: 'Plan ataku na Francję' },
            { id: 'ger_barbarossa', name: 'Barbarossa', icon: '❄️', weeksToComplete: 8, requires: ['ger_fall_g'], effects: { casusBelli: 'ussr', military: { tanks: 8 } }, description: 'Atak na ZSRR, +8 czołgów' },
        ],
        poland: [
            { id: 'pol_modern', name: 'Modernizacja Armii', icon: '⚔️', weeksToComplete: 6, requires: [], effects: { military: { infantry: 3, tanks: 1 } }, description: '+3 piechoty, +1 czołg' },
            { id: 'pol_cop', name: 'COP Przemysłowy', icon: '🏭', weeksToComplete: 7, requires: [], effects: { resources: { steel: 15, ic: 6 } }, description: '+15 stali, +6 IC' },
            { id: 'pol_allies', name: 'Sojusz z Zachodem', icon: '🤝', weeksToComplete: 5, requires: ['pol_modern'], effects: { alliance: 'allies' }, description: 'Dołącz do Aliantów' },
            { id: 'pol_cavalry', name: 'Brygady Kawalerii', icon: '🐴', weeksToComplete: 5, requires: ['pol_modern'], effects: { military: { infantry: 4 }, statBonus: { warSupport: 10 } }, description: '+4 kawaleria' },
            { id: 'pol_fortify', name: 'Fortyfikacje', icon: '🛡️', weeksToComplete: 8, requires: ['pol_cop'], effects: { defenseBonus: 15, statBonus: { stability: 5 } }, description: '+15% obrony' },
            { id: 'pol_air', name: 'Lotnictwo Polskie', icon: '✈️', weeksToComplete: 6, requires: ['pol_modern'], effects: { military: { planes: 4 } }, description: '+4 myśliwce' },
            { id: 'pol_power', name: 'Mocarstwowość', icon: '🌟', weeksToComplete: 8, requires: ['pol_allies', 'pol_fortify'], effects: { casusBelli: 'germany', statBonus: { warSupport: 15 } }, description: 'Kontrofensywa na Niemcy' },
        ],
        france: [
            { id: 'fra_maginot', name: 'Linia Maginota', icon: '🏰', weeksToComplete: 8, requires: [], effects: { defenseBonus: 25 }, description: '+25% obrony' },
            { id: 'fra_entente', name: 'Małe Entente', icon: '🤝', weeksToComplete: 5, requires: [], effects: { alliance: 'allies' }, description: 'Sojusz z UK i Polską' },
            { id: 'fra_industry', name: 'Zbrojenia Wojenne', icon: '🏭', weeksToComplete: 6, requires: [], effects: { resources: { ic: 8 }, military: { tanks: 2 } }, description: '+8 IC, +2 czołgi' },
            { id: 'fra_airforce', name: "Armée de l'Air", icon: '✈️', weeksToComplete: 7, requires: ['fra_industry'], effects: { military: { planes: 5 } }, description: '+5 eskadr' },
            { id: 'fra_chars', name: 'Czołgi Char B1', icon: '🚀', weeksToComplete: 7, requires: ['fra_industry'], effects: { military: { tanks: 4 }, researchBonus: 'land' }, description: '+4 bataliony czołgów' },
            { id: 'fra_colonies', name: 'Zasoby Kolonialne', icon: '🌍', weeksToComplete: 5, requires: ['fra_entente'], effects: { resources: { oil: 15, aluminum: 10 } }, description: '+15 ropy, +10 aluminium' },
        ],
        uk: [
            { id: 'uk_rearm', name: 'Remilitaryzacja', icon: '⚔️', weeksToComplete: 6, requires: [], effects: { military: { infantry: 3, ships: 3 } }, description: '+3 dywizje, +3 okręty' },
            { id: 'uk_raf', name: 'RAF', icon: '✈️', weeksToComplete: 7, requires: ['uk_rearm'], effects: { military: { planes: 6 } }, description: '+6 Spitfire i Hurricane' },
            { id: 'uk_naval', name: 'Supremacja Morska', icon: '⚓', weeksToComplete: 8, requires: ['uk_rearm'], effects: { military: { ships: 5 }, researchBonus: 'sea' }, description: '+5 okrętów' },
            { id: 'uk_allies', name: 'Pakty Obronne', icon: '🤝', weeksToComplete: 4, requires: [], effects: { alliance: 'allies' }, description: 'Alianci: UK+FR+PL' },
            { id: 'uk_industry', name: 'Gospodarka Wojenna', icon: '🏭', weeksToComplete: 6, requires: ['uk_rearm'], effects: { resources: { ic: 10, steel: 15 } }, description: '+10 IC, +15 stali' },
            { id: 'uk_radar', name: 'System Radarowy', icon: '📡', weeksToComplete: 8, requires: ['uk_raf'], effects: { defenseBonus: 10, researchBonus: 'air' }, description: 'Chain Home: +10% obrona' },
        ],
        ussr: [
            { id: 'ussr_5year', name: 'Pięciolatka', icon: '🏭', weeksToComplete: 8, requires: [], effects: { resources: { ic: 12, steel: 25 } }, description: '+12 IC, +25 stali' },
            { id: 'ussr_purge', name: 'Czystki w Armii', icon: '🔴', weeksToComplete: 5, requires: [], effects: { statBonus: { stability: -10, warSupport: 5 }, military: { infantry: -5, tanks: 2 } }, description: 'Reorganizacja armii' },
            { id: 'ussr_t34', name: 'Czołg T-34', icon: '🚀', weeksToComplete: 9, requires: ['ussr_5year'], effects: { military: { tanks: 8 }, researchBonus: 'land' }, description: '+8 batalionów T-34' },
            { id: 'ussr_komin', name: 'Komintern', icon: '🤝', weeksToComplete: 5, requires: [], effects: { alliance: 'komintern' }, description: 'Blok komunistyczny' },
            { id: 'ussr_winter', name: 'Zimowa Wojna', icon: '❄️', weeksToComplete: 6, requires: ['ussr_purge'], effects: { casusBelli: 'finland', military: { infantry: 3 } }, description: 'Atak na Finlandię' },
            { id: 'ussr_molotov', name: 'Pakt Ribbentrop-Mołotow', icon: '📜', weeksToComplete: 4, requires: ['ussr_komin'], effects: { nonAggressionWith: 'germany', resources: { oil: 20 } }, description: 'Pakt z Niemcami' },
        ],
        italy: [
            { id: 'ita_rearm', name: 'Remilitaryzacja', icon: '⚔️', weeksToComplete: 5, requires: [], effects: { military: { infantry: 3, ships: 2 } }, description: '+3 dywizje, +2 okręty' },
            { id: 'ita_mare', name: 'Mare Nostrum', icon: '⚓', weeksToComplete: 7, requires: ['ita_rearm'], effects: { military: { ships: 4 }, researchBonus: 'sea' }, description: 'Dominacja Śródziemna' },
            { id: 'ita_africa', name: 'Podbój Afryki', icon: '🌍', weeksToComplete: 6, requires: ['ita_rearm'], effects: { resources: { oil: 10, aluminum: 8 } }, description: 'Zasoby z kolonii' },
            { id: 'ita_axis', name: 'Oś Rzym-Berlin', icon: '🤝', weeksToComplete: 4, requires: ['ita_rearm'], effects: { alliance: 'axis' }, description: 'Dołącz do Osi' },
            { id: 'ita_balkan', name: 'Ekspansja Bałkańska', icon: '💥', weeksToComplete: 6, requires: ['ita_axis'], effects: { casusBelli: 'yugoslavia' }, description: 'Atak na Jugosławię' },
            { id: 'ita_industry', name: 'Industrializacja', icon: '🏭', weeksToComplete: 7, requires: ['ita_rearm'], effects: { resources: { ic: 7, steel: 12 } }, description: '+7 IC, +12 stali' },
        ],
    },

    // ── TECHNOLOGIES ──────────────────────────────────────────
    technologies: {
        infantry_1: { name: 'Broń Piechoty I', category: 'land', weeksToResearch: 6, bonus: { infantryAttack: 10 } },
        infantry_2: { name: 'Broń Piechoty II', category: 'land', weeksToResearch: 10, requires: ['infantry_1'], bonus: { infantryAttack: 15 } },
        artillery: { name: 'Artyleria', category: 'land', weeksToResearch: 8, bonus: { infantryAttack: 12, infantryDefense: 5 } },
        armor_1: { name: 'Czołgi lekkie', category: 'land', weeksToResearch: 8, bonus: { tankAttack: 15 } },
        armor_2: { name: 'Czołgi średnie', category: 'land', weeksToResearch: 12, requires: ['armor_1'], bonus: { tankAttack: 20, tankDefense: 10 } },
        motorized: { name: 'Zmotoryzowanie', category: 'land', weeksToResearch: 7, bonus: { speed: 20 } },
        fighters_1: { name: 'Myśliwce I', category: 'air', weeksToResearch: 7, bonus: { airAttack: 15 } },
        fighters_2: { name: 'Myśliwce II', category: 'air', weeksToResearch: 11, requires: ['fighters_1'], bonus: { airAttack: 20 } },
        bombers: { name: 'Bombowce', category: 'air', weeksToResearch: 9, bonus: { bombingDamage: 20 } },
        cas: { name: 'Wsparcie Lotnicze', category: 'air', weeksToResearch: 8, bonus: { infantryAttack: 8, tankAttack: 8 } },
        destroyer: { name: 'Niszczyciele', category: 'sea', weeksToResearch: 8, bonus: { navalAttack: 10 } },
        submarine: { name: 'Okręty Podwodne', category: 'sea', weeksToResearch: 10, bonus: { navalAttack: 20 } },
        carrier: { name: 'Lotniskowiec', category: 'sea', weeksToResearch: 14, requires: ['destroyer'], bonus: { navalAttack: 30, airAttack: 10 } },
        basic_ind: { name: 'Podstawy Przemysłu', category: 'industry', weeksToResearch: 6, bonus: { ic: 5 } },
        adv_ind: { name: 'Zaawansowany Przemysł', category: 'industry', weeksToResearch: 10, requires: ['basic_ind'], bonus: { ic: 8 } },
        oil_ref: { name: 'Rafinacja Ropy', category: 'industry', weeksToResearch: 7, bonus: { oilProduction: 10 } },
        synth_oil: { name: 'Syntetyczna Ropa', category: 'industry', weeksToResearch: 12, requires: ['oil_ref'], bonus: { oilProduction: 20 } },
        radar: { name: 'Radar', category: 'industry', weeksToResearch: 9, bonus: { defenseBonus: 8 } },
        encryption: { name: 'Kryptografia', category: 'industry', weeksToResearch: 8, bonus: { intelligence: 15 } },
    },

    // ── EQUIPMENT ─────────────────────────────────────────────
    equipment: {
        rifles: { name: 'Karabiny', cost: 3, prodWeeks: 2, unitType: 'infantry', stat: { attack: 1 } },
        artillery_e: { name: 'Artyleria', cost: 8, prodWeeks: 4, unitType: 'infantry', stat: { attack: 2, defense: 1 } },
        light_tank: { name: 'Czołg lekki', cost: 12, prodWeeks: 5, unitType: 'tanks', stat: { attack: 3 } },
        medium_tank: { name: 'Czołg średni', cost: 18, prodWeeks: 7, unitType: 'tanks', stat: { attack: 4, defense: 2 } },
        fighter: { name: 'Myśliwiec', cost: 10, prodWeeks: 4, unitType: 'planes', stat: { airAttack: 3 } },
        bomber: { name: 'Bombowiec', cost: 15, prodWeeks: 6, unitType: 'planes', stat: { bombingDamage: 4 } },
        destroyer_e: { name: 'Niszczyciel', cost: 20, prodWeeks: 8, unitType: 'ships', stat: { navalAttack: 3 } },
    },

    // ── AI PROFILES ───────────────────────────────────────────
    aiProfiles: {
        expansionist: { focusPriority: ['military', 'alliance', 'casusBelli'], warThreshold: 0.7, alliancePreference: 'axis' },
        defender: { focusPriority: ['military', 'defense', 'alliance'], warThreshold: 1.5, alliancePreference: 'allies' },
        industrialist: { focusPriority: ['industry', 'military', 'alliance'], warThreshold: 1.2, alliancePreference: 'komintern' },
    },

    // ── ALLIANCES ─────────────────────────────────────────────
    alliances: {
        axis: { name: 'Oś', leader: 'germany', members: [], color: '#8B0000', ideology: 'fascism' },
        allies: { name: 'Alianci', leader: 'uk', members: [], color: '#1F618D', ideology: 'democracy' },
        komintern: { name: 'Komintern', leader: 'ussr', members: [], color: '#7a1a1a', ideology: 'communism' },
    },

    // ── NEIGHBORS ─────────────────────────────────────────────
    neighbors: {
        germany: ['poland', 'france', 'netherlands', 'belgium', 'denmark', 'austria', 'italy', 'ussr'],
        poland: ['germany', 'ussr', 'france'],
        france: ['germany', 'belgium', 'netherlands', 'italy', 'uk'],
        uk: ['france', 'poland'],
        ussr: ['poland', 'france', 'germany', 'italy'],
        italy: ['france', 'germany', 'ussr'],
    },

    // ── SETTINGS ──────────────────────────────────────────────
    settings: {
        startYear: 1936,
        weekDurationMs: 1500,
        victoryVP: 70,
        speedOptions: [500, 1000, 1500, 3000],
        speedLabels: ['x4', 'x2', 'x1', 'x½'],
    },
};
