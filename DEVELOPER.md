# CensorCraft - Dokumentacja Developerska

## 🏗️ Architektura Aplikacji

CensorCraft to aplikacja single-page, działająca w całości w przeglądarce (client-side). Nie wymaga backendu ani serwera.

### Struktura Plików

```
gemini_cwl/
├── index.html          # Główny plik HTML z interfejsem użytkownika
├── styles.css          # Arkusz stylów (CSS)
├── app.js             # Główna logika aplikacji (JavaScript)
├── README.md          # Ogólna dokumentacja projektu
├── INSTRUKCJA.md      # Instrukcja użytkowania dla użytkowników końcowych
└── .gitignore         # Wykluczenia Git
```

### Technologie

- **HTML5** - struktura interfejsu
- **CSS3** - stylowanie (gradients, flexbox, grid)
- **Vanilla JavaScript (ES6+)** - logika aplikacji
- **TensorFlow.js** - framework ML do wykrywania obiektów
- **COCO-SSD Model** - wstępnie wytrenowany model do wykrywania obiektów

---

## 🧠 Komponenty Aplikacji

### Klasa `CensorCraft`

Główna klasa aplikacji, która zarządza wszystkimi funkcjami.

#### Konstruktor
```javascript
constructor()
```
Inicjalizuje aplikację:
- Tworzy referencje do elementów DOM
- Konfiguruje canvas'y (główny i overlay)
- Podpina event listenery
- Ładuje model AI

#### Główne Metody

##### `loadModel()`
```javascript
async loadModel()
```
- Ładuje model COCO-SSD z CDN
- Wyświetla loading spinner
- Obsługuje błędy ładowania

##### `loadImage(file)`
```javascript
loadImage(file)
```
- Wczytuje plik obrazu używając FileReader API
- Wyświetla obraz na canvas
- Automatycznie uruchamia detekcję (jeśli włączona)

##### `displayImage()`
```javascript
displayImage()
```
- Skaluje obraz do maksymalnych wymiarów (800x600px)
- Zachowuje proporcje obrazu
- Ustawia wymiary canvas'ów

##### `detectAndCensor()`
```javascript
async detectAndCensor()
```
- Używa modelu COCO-SSD do wykrycia osób
- Tworzy obszary cenzury (górne 30% wykrytej osoby - głowa)
- Automatycznie aplikuje wybraną metodę cenzury

##### `applyCensorship()`
```javascript
applyCensorship()
```
- Aplikuje cenzurę do wszystkich zaznaczonych obszarów
- Wspiera 3 style: blackbar, pixelate, blur

##### `pixelateArea(area)`
```javascript
pixelateArea(area)
```
- Implementuje efekt pikselizacji
- Dzieli obszar na bloki 20x20px
- Wypełnia każdy blok średnim kolorem

##### `blurArea(area)`
```javascript
blurArea(area)
```
- Implementuje efekt rozmycia
- Używa Canvas filter API
- Aplikuje blur wielokrotnie dla silniejszego efektu

---

## 🎨 UI/UX Design

### Paleta Kolorów

- **Primary Gradient**: `#667eea` → `#764ba2`
- **Background**: White `#ffffff`
- **Secondary**: `#f8f9ff`
- **Text**: `#333333`
- **Borders**: `#e0e0e0`

### Responsywność

Aplikacja jest w pełni responsywna:
- Desktop: Grid layout z canvas po lewej, kontrolami po prawej
- Mobile (<768px): Stack layout, wszystko w jednej kolumnie

### Animacje

- Smooth transitions (0.3s ease)
- Hover effects na przyciskach
- Loading spinner
- Drag-over indication

---

## 🔧 Customizacja i Rozwój

### Dodawanie Nowych Stylów Cenzury

1. Dodaj opcję w `index.html`:
```html
<option value="newstyle">Nowy Styl</option>
```

2. Dodaj metodę w `app.js`:
```javascript
newStyleArea(area) {
    // Twoja implementacja
}
```

3. Dodaj case w `applyCensorship()`:
```javascript
else if (style === 'newstyle') {
    this.newStyleArea(area);
}
```

### Zmiana Modelu AI

Aby użyć innego modelu TensorFlow.js:

1. Dodaj skrypt modelu w `index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/model-name"></script>
```

2. Zmodyfikuj `loadModel()`:
```javascript
this.model = await modelName.load();
```

3. Dostosuj `detectAndCensor()` do API nowego modelu

### Dodawanie Nowych Funkcji

Przykład: Zapisywanie ustawień w localStorage:

```javascript
// Zapisywanie
saveSettings() {
    localStorage.setItem('censorStyle', this.censorStyleSelect.value);
    localStorage.setItem('autoDetect', this.autoDetectCheckbox.checked);
}

// Wczytywanie
loadSettings() {
    const style = localStorage.getItem('censorStyle');
    if (style) this.censorStyleSelect.value = style;
    
    const autoDetect = localStorage.getItem('autoDetect');
    if (autoDetect !== null) this.autoDetectCheckbox.checked = autoDetect === 'true';
}
```

---

## 🚀 Deployment

### GitHub Pages

1. Wejdź w Settings → Pages
2. Wybierz branch (np. `main`)
3. Wybierz folder `/` (root)
4. Kliknij Save

Aplikacja będzie dostępna pod: `https://username.github.io/repo-name/`

### Netlify

1. Przeciągnij folder na [netlify.com/drop](https://app.netlify.com/drop)
2. Lub podłącz repozytorium GitHub

### Vercel

```bash
npm i -g vercel
vercel
```

---

## 🧪 Testowanie

### Testowanie Manualne

1. **Upload obrazu**
   - Kliknięcie przycisku
   - Drag & drop
   - Różne formaty (JPG, PNG, GIF)

2. **Detekcja AI**
   - Zdjęcia z osobami
   - Zdjęcia bez osób
   - Zdjęcia z wieloma osobami

3. **Style cenzury**
   - Czarny pasek
   - Pikselizacja
   - Rozmycie

4. **Tryb ręczny**
   - Rysowanie obszarów
   - Wielokrotne obszary
   - Usuwanie obszarów

5. **Download**
   - Sprawdź jakość obrazu
   - Sprawdź czy cenzura jest zachowana

### Testowanie w Różnych Przeglądarkach

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ⚠️ IE11 - nie wspierany (brak ES6)

---

## 🐛 Debugging

### Console Logs

Aplikacja loguje ważne wydarzenia:
```javascript
console.log('Ładowanie modelu COCO-SSD...');
console.log('Model załadowany pomyślnie!');
console.log('Wykryto obiekty:', predictions);
```

### Typowe Problemy

#### Model nie ładuje się
```javascript
// Check in console
console.error('Błąd ładowania modelu:', error);
```
**Rozwiązanie**: Sprawdź połączenie internetowe, CORS

#### Canvas jest pusty
```javascript
// Sprawdź czy obraz się załadował
console.log('Image loaded:', this.image);
console.log('Canvas size:', this.canvas.width, this.canvas.height);
```

#### Detekcja nie działa
```javascript
// Sprawdź predictions
console.log('Predictions:', predictions);
console.log('People detected:', people.length);
```

---

## 📊 Performance

### Optymalizacje

1. **Lazy loading modelu** - model ładuje się w tle
2. **Image scaling** - maksymalny rozmiar 800x600px
3. **Debouncing** - dla częstych event'ów
4. **Canvas cache** - przechowywanie oryginalnego obrazu

### Metryki

- **Model size**: ~5MB (COCO-SSD)
- **Load time**: 2-5s (pierwsze załadowanie)
- **Detection time**: 100-500ms (zależnie od obrazu)
- **Memory usage**: ~50-150MB

---

## 🔐 Bezpieczeństwo

### Content Security Policy (CSP)

Zalecane nagłówki:
```
Content-Security-Policy: default-src 'self'; 
    script-src 'self' https://cdn.jsdelivr.net; 
    style-src 'self' 'unsafe-inline';
```

### Privacy

- **Brak analytics** - zero śledzenia
- **Brak zewnętrznych API** - tylko CDN dla bibliotek
- **Local processing** - wszystko w przeglądarce
- **No cookies** - brak cookies

---

## 🤝 Contributing

### Workflow

1. Fork repozytorium
2. Stwórz branch: `git checkout -b feature/nazwa`
3. Commituj zmiany: `git commit -m 'Add feature'`
4. Push: `git push origin feature/nazwa`
5. Stwórz Pull Request

### Code Style

- **Indentacja**: 4 spacje
- **Naming**: camelCase dla zmiennych/metod
- **Comments**: po polsku lub angielsku
- **Semicolons**: używamy

---

## 📝 Licencja

MIT License - zobacz `README.md`

---

## 📧 Kontakt

- GitHub Issues: [github.com/Flilipp/gemini_cwl/issues](https://github.com/Flilipp/gemini_cwl/issues)
- Discussions: [github.com/Flilipp/gemini_cwl/discussions](https://github.com/Flilipp/gemini_cwl/discussions)
