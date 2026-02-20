# HOI MVP

Na bazie opisu z `HOI/index.html` zbudowałem działające MVP jako prostą aplikację front-end (HTML/CSS/JS), która odtwarza 4 główne moduły mechaniczne oraz dodaje widok mapy Europy i świata.

## Co zostało zrobione

1. **Globalna maszyna stanów (mapa + ticki godzinowe)**
   - Dodano zegar gry (tick = 1h).
   - Dodano dwie mapy strategiczne w SVG: **Europa** oraz **Świat**.
   - Dodano przełącznik map (Europa/Świat).
   - Dywizja porusza się po węzłach co kilka ticków i jest wizualnie zaznaczona na mapie.

2. **Silnik ekonomiczny (production queue)**
   - Symulacja wejścia: fabryki + surowce.
   - Efficiency rośnie z czasem, przyspieszając produkcję.
   - Po osiągnięciu progu produkcyjnego dodawany jest ekwipunek do stockpile.

3. **Combat logic (stat-checker)**
   - Jedna runda walki porównuje statystyki obu stron.
   - Uwzględniono losowy modyfikator (RNG) oraz prosty wpływ warunków (teren/pogoda).
   - Spadek Organization/Strength.
   - Jeśli Organization spadnie do 0, uruchamiany jest odwrót.

4. **System skryptowy (content layer)**
   - Przycisk focusa z warunkiem PP >= 75.
   - Efekt skryptu: -75 PP, +1 fabryka i wpis do event logu (event_id=102).

## Struktura plików

- `index.html` — interfejs MVP
- `styles.css` — styl wizualny paneli i map
- `app.js` — logika ticków, ekonomii, walki, skryptów i przełączania map

## Jak uruchomić

Wystarczy otworzyć plik `HOI/index.html` w przeglądarce.
