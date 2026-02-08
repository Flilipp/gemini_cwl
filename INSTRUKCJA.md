# Instrukcja Użytkowania CensorCraft

## 🚀 Jak Uruchomić Aplikację

CensorCraft to aplikacja webowa działająca w przeglądarce. Nie wymaga instalacji!

### Metoda 1: Użycie Plików Lokalnie

1. Pobierz wszystkie pliki z repozytorium
2. Otwórz plik `index.html` w swojej przeglądarce (Chrome, Firefox, Edge, Safari)
3. Gotowe! Aplikacja jest gotowa do użycia

### Metoda 2: Uruchomienie z Lokalnym Serwerem (Zalecane)

Jeśli chcesz uniknąć problemów z CORS:

```bash
# Używając Python (wbudowany w większość systemów)
python -m http.server 8080

# Lub używając Node.js
npx http-server -p 8080

# Lub używając PHP
php -S localhost:8080
```

Następnie otwórz w przeglądarce: `http://localhost:8080`

---

## 📖 Jak Używać CensorCraft

### Interfejs Zakładkowy

Kontrole edycji są zorganizowane w 4 zakładki:
- **🔒 Cenzura** - automatyczne i ręczne cenzurowanie
- **🎨 Regulacje** - jasność, kontrast, nasycenie, ostrość
- **✨ Efekty** - filtry kolorów, winietowanie, temperatura
- **🔄 Transformacje** - obrót, odbicie, przycinanie

### Krok 1: Wgraj Zdjęcie

Możesz wgrać zdjęcie na 3 sposoby:

- **Kliknij "Wybierz Zdjęcie"** - otworzy się okno wyboru pliku
- **Przeciągnij i upuść** - po prostu przeciągnij zdjęcie na strefę upload
- **Kliknij na całą strefę upload** - także otworzy wybór pliku

### Krok 2: Automatyczna Cenzura (AI)

Po wgraniu zdjęcia:

1. Aplikacja automatycznie spróbuje wykryć osoby na zdjęciu (jeśli zaznaczono opcję "Automatyczne wykrywanie")
2. Wykryte obszary (twarze) zostaną automatycznie ocenzurowane
3. Jeśli AI nie wykryło niczego, możesz użyć trybu ręcznego

### Krok 3: Wybór Stylu Cenzury

Dostępne są różne style cenzury:

- **Czarny Pasek** - klasyczne czarne prostokąty
- **Pikselizacja** - efekt rozmytych pikseli
- **Rozmycie** - efekt gaussowskiego rozmycia
- **Emoji 😎** - zabawne emotikony jako cenzura
- **Biały Pasek** - białe prostokąty
- **Własna Tekstura 🎨** - użyj własnego wzoru do cenzury

#### Jak używać Własnej Tekstury:
1. Wybierz "Własna Tekstura 🎨" z listy stylów
2. Pojawi się przycisk "📁 Wybierz Teksturę"
3. Kliknij przycisk i wybierz obraz, który chcesz użyć jako wzór cenzury
4. Tekstura zostanie powtórzona (tiled) na wszystkich obszarach cenzury

Zmień styl w menu rozwijanym i kliknij ponownie "Wykryj Automatycznie" aby zastosować nowy styl.

### Krok 4: Tryb Ręczny

Jeśli automatyczne wykrywanie nie działa lub chcesz dodać dodatkowe obszary:

#### Rysowanie Prostokątów:
1. Kliknij **"✏️ Rysuj Obszar Cenzury"**
2. Kursor zmieni się w krzyżyk
3. Kliknij i przeciągnij na obrazie, aby narysować prostokąt cenzury
4. Puszczając przycisk myszy, obszar zostanie ocenzurowany
5. Możesz dodać wiele obszarów
6. Kliknij ponownie przycisk, aby wyłączyć tryb rysowania

#### Rysowanie Łuków i Krzywych:
1. Kliknij **"🌙 Rysuj Łuki i Krzywe"**
2. Klikaj na obrazie aby dodawać punkty
3. Punkty będą automatycznie połączone płynnymi krzywymi
4. Po dodaniu kilku punktów, kliknij ponownie przycisk aby zakończyć
5. Obszar obejmujący wszystkie punkty zostanie ocenzurowany
6. Świetne do cenzurowania nieregularnych kształtów!

### Krok 5: Pobierz Ocenzurowany Obraz

1. Kliknij **"⬇️ Pobierz Obraz"**
2. Plik `edited-image.png` zostanie pobrany na Twój komputer

### Nowe Funkcje - Zaawansowana Edycja

#### Regulacje Obrazu (Zakładka 🎨 Regulacje)

- **Jasność** - rozjaśnij lub przyciemnij obraz (-100 do +100)
- **Kontrast** - zwiększ lub zmniejsz kontrast (0-200%)
- **Nasycenie** - intensywność kolorów (0-200%)
- **Ostrość** - wyostrz obraz dla większej klarowności (0-100)
- **Resetuj Regulacje** - przywróć domyślne ustawienia

#### Efekty Artystyczne (Zakładka ✨ Efekty)

- **Filtry Kolorów**:
  - Brak - oryginalny obraz
  - Czarno-biały - klasyczny efekt monochromatyczny
  - Sepia - efekt starego zdjęcia
  - Odwróć - inwersja kolorów
- **Winietowanie** - przyciemnienie brzegów obrazu (0-100%)
- **Temperatura** - cieplejsze (pomarańczowe) lub chłodniejsze (niebieskie) tony

#### Transformacje (Zakładka 🔄 Transformacje)

- **Obrót** - obróć obraz o 90°, 180° lub 270°
- **Odbicie** - odbij obraz w poziomie lub pionie
- **Przytnij Obraz** - wytnij fragment obrazu:
  1. Kliknij przycisk "✂️ Przytnij Obraz"
  2. Kliknij i przeciągnij na obrazie aby zaznaczyć obszar
  3. Puszczając myszką obraz zostanie przycięty

#### Cofnij/Ponów

- **↶ Cofnij** - cofnij ostatnią zmianę (do 20 kroków wstecz)
- **↷ Ponów** - przywróć cofniętą zmianę

### Wskazówki dla Zaawansowanych Użytkowników

1. **Workflow Edycji**: Najpierw zastosuj transformacje i przycinanie, potem regulacje i efekty, na końcu cenzurę
2. **Historia Zmian**: Każda zmiana jest zapisywana - możesz cofnąć się do 20 kroków
3. **Łączenie Funkcji**: Możesz łączyć wszystkie funkcje - np. obrócić, dodać filtr sepia i ocenzurować
4. **Eksperymentuj**: Używaj przycisków Cofnij/Ponów aby swobodnie eksperymentować

### Dodatkowe Funkcje

- **🗑️ Wyczyść Cenzurę** - usuwa wszystkie obszary cenzury, przywraca obraz
- **🔄 Nowy Obraz** - resetuje aplikację, pozwala wgrać nowe zdjęcie
- **↶ Cofnij / ↷ Ponów** - zarządzaj historią zmian

---

## 🔒 Prywatność

**Wszystko dzieje się lokalnie w Twojej przeglądarce!**

- Twoje zdjęcia NIE są wysyłane na żaden serwer
- Nie zbieramy żadnych danych
- Cała obróbka odbywa się w przeglądarce dzięki TensorFlow.js
- Możesz używać aplikacji offline (po załadowaniu modelu AI)

---

## ⚙️ Wymagania Techniczne

- Nowoczesna przeglądarka (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- JavaScript musi być włączony
- Połączenie z internetem (tylko do pierwszego załadowania modelu AI)

---

## 🐛 Rozwiązywanie Problemów

### AI nie wykrywa osób na zdjęciu

- Upewnij się, że osoby są wyraźnie widoczne na zdjęciu
- Spróbuj użyć zdjęcia w lepszej jakości
- Użyj trybu ręcznego do dodania cenzury

### Aplikacja nie ładuje się

- Sprawdź czy JavaScript jest włączony w przeglądarce
- Sprawdź połączenie z internetem (wymagane do załadowania bibliotek)
- Spróbuj odświeżyć stronę (Ctrl+F5 / Cmd+Shift+R)

### Model AI nie ładuje się

- Sprawdź połączenie z internetem
- Sprawdź czy nie masz blokera reklam, który blokuje CDN
- Odczekaj chwilę - model może się jeszcze ładować

---

## 💡 Wskazówki

1. **Najlepsze rezultaty** - używaj zdjęć w dobrej jakości z wyraźnie widocznymi osobami
2. **Łącz metody** - użyj AI + trybu ręcznego + zaawansowanej edycji dla najlepszych efektów
3. **Eksperymentuj ze stylami** - różne style cenzury nadają się do różnych zastosowań
4. **Workflow**: Transformacje → Regulacje → Efekty → Cenzura
5. **Używaj Cofnij/Ponów** - nie bój się eksperymentować, zawsze możesz cofnąć zmiany
6. **Pikselizacja** działa najlepiej na dużych obszarach
7. **Rozmycie** wygląda najbardziej naturalnie
8. **Filtry** - sepia i czarno-biały mogą pomóc ukryć więcej szczegółów

---

## 🤝 Potrzebujesz Pomocy?

- Zgłoś problem w [Issues](https://github.com/Flilipp/gemini_cwl/issues)
- Sprawdź [README.md](README.md) projektu
- Dołącz do społeczności na Discord (link wkrótce)

---

**Miłego cenzurowania! 🎨**
