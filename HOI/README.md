# HOI MVP

Na bazie opisu z `HOI/index.html` zbudowałem działające MVP jako prostą aplikację front-end (HTML/CSS/JS), która odtwarza 4 główne moduły mechaniczne:

## Co zostało zrobione

1. **Globalna maszyna stanów (mapa + ticki godzinowe)**
   - Dodano zegar gry (tick = 1h).
   - Dodano mini-mapę jako listę połączonych węzłów/prowincji.
   - Dywizja porusza się po węzłach co kilka ticków.

2. **Silnik ekonomiczny (production queue)**
   - Symulacja wejścia: fabryki + surowce.
   - Efficiency rośnie z czasem, przyspieszając produkcję.
   - Po osiągnięciu progu produkcyjnego dodawany jest ekwipunek do stockpile.

3. **Combat logic (stat-checker)**
   - Jedna runda walki porównuje statystyki obu stron.
   - Uwzględniono losowy modyfikator (RNG) oraz prosty wpływ warunków (teren/pogoda).
   - Spadek Organization/Strength.
   - Jeśli Organization spadnie do 0, uruchamiany jest odwrót (zgodnie z MVP logic).

4. **System skryptowy (content layer)**
   - Przycisk focusa z warunkiem PP >= 75.
   - Efekt skryptu: -75 PP, +1 fabryka i wpis do event logu (event_id=102).

## Struktura plików

- `index.html` — interfejs MVP
- `styles.css` — styl wizualny paneli
- `app.js` — logika ticków, ekonomii, walki i skryptów

## Jak uruchomić

Wystarczy otworzyć plik `HOI/index.html` w przeglądarce.
