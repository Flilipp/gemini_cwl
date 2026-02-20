# 🎖️ Grand Strategy 1936 — WWII Browser Game

Gra strategiczna inspirowana Hearts of Iron IV, działająca w przeglądarce. **Single-player** — grasz jednym z 5 mocarstw, reszta sterowana przez AI Boty.

## 🎮 Jak grać

1. Otwórz `HOI/index.html` w przeglądarce
2. Wybierz kraj
3. Zarządzaj polityką, ekonomią i armią
4. Zdobądź 60 Victory Points aby wygrać

## 🗺️ Dostępne kraje

| Kraj | Ideologia | AI (gdy bot) | Trudność |
|-----|-----------|-------------|---------|
| 🇩🇪 Niemcy | Faszyzm | Ekspansjonista | ★★★★☆ |
| 🇵🇱 Polska | Demokracja | Obrońca | ★★★★★ |
| 🇫🇷 Francja | Demokracja | Obrońca | ★★★☆☆ |
| 🇬🇧 Wielka Brytania | Demokracja | Obrońca | ★★☆☆☆ |
| 🇷🇺 ZSRR | Komunizm | Industrialista | ★★★☆☆ |

## ⚙️ Mechaniki

### 🌲 Fokusy polityczne
Każdy kraj ma 6-10 unikalnych focusów — wybierz ścieżkę rozwoju (militaryzacja, dyplomacja, gospodarka, sojusze).

### 🏭 Ekonomia
- Zasoby: Stal (⚙️), Ropa (🛢️), Aluminium, Jedzenie
- Przemysłowa Pojemność (IC) napędza produkcję
- Zamów produkcję: karabiny, artyleria, czołgi, samoloty, okręty

### 🔬 Technologie
20 technologii w 4 kategoriach: Lądowe, Lotnicze, Morskie, Przemysłowe.

### ⚔️ Armia i walka
- Jednostki: Piechota, Czołgi, Lotnictwo, Marynarka
- Deklaruj wojnę przez uzasadnienie (Casus Belli — czeka 8 tygodni)
- Bitwy rozstrzygane co 4 tygodnie

### 🤝 Dyplomacja
- 3 bloki: **Oś** (Niemcy), **Alianci** (UK/Francja), **Komintern** (ZSRR)
- Dołącz do sojuszu → sojusznicy wchodzą do twoich wojen

### 🤖 AI Boty
- **Ekspansjonista** — atakuje gdy ma przewagę militarną
- **Obrońca** — szuka sojuszy, buduje obronę
- **Industrialista** — skupia się na ekonomii, wchodzi w wojny późno

## 📁 Struktura plików

```
HOI/
├── index.html    — Główna strona gry (mapa SVG Europy + UI)
├── styles.css    — Stylizacja (ciemny motyw militarny)
├── game.js       — Silnik gry (GameEngine, UIController, MapController)
└── data.js       — Dane gry (kraje, fokusy, technologie, terytoria)
```

## 🏆 Warunki zwycięstwa

- Zbierz **60 Victory Points** (VP zdobywane za terytoria)
- Lub miej więcej VP niż AI po **roku 1945**
- Przegrasz jeśli Twój kraj zostanie całkowicie podbity
