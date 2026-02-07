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

Dostępne są 3 style cenzury:

- **Czarny Pasek** - klasyczne czarne prostokąty
- **Pikselizacja** - efekt rozmytych pikseli
- **Rozmycie** - efekt gaussowskiego rozmycia

Zmień styl w menu rozwijanym i kliknij ponownie "Wykryj Automatycznie" aby zastosować nowy styl.

### Krok 4: Tryb Ręczny

Jeśli automatyczne wykrywanie nie działa lub chcesz dodać dodatkowe obszary:

1. Kliknij **"✏️ Rysuj Obszar Cenzury"**
2. Kursor zmieni się w krzyżyk
3. Kliknij i przeciągnij na obrazie, aby narysować prostokąt cenzury
4. Puszczając przycisk myszy, obszar zostanie ocenzurowany
5. Możesz dodać wiele obszarów
6. Kliknij ponownie przycisk, aby wyłączyć tryb rysowania

### Krok 5: Pobierz Ocenzurowany Obraz

1. Kliknij **"⬇️ Pobierz Ocenzurowany Obraz"**
2. Plik `censored-image.png` zostanie pobrany na Twój komputer

### Dodatkowe Funkcje

- **🗑️ Wyczyść Wszystko** - usuwa wszystkie obszary cenzury, przywraca oryginalny obraz
- **🔄 Nowy Obraz** - resetuje aplikację, pozwala wgrać nowe zdjęcie

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
2. **Łącz metody** - użyj AI + trybu ręcznego dla najlepszych efektów
3. **Eksperymentuj ze stylami** - różne style cenzury nadają się do różnych zastosowań
4. **Pikselizacja** działa najlepiej na dużych obszarach
5. **Rozmycie** wygląda najbardziej naturalnie

---

## 🤝 Potrzebujesz Pomocy?

- Zgłoś problem w [Issues](https://github.com/Flilipp/gemini_cwl/issues)
- Sprawdź [README.md](README.md) projektu
- Dołącz do społeczności na Discord (link wkrótce)

---

**Miłego cenzurowania! 🎨**
