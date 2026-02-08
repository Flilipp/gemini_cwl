# Testing & Deployment Guide

## 🧪 Testowanie Lokalne

### Wymagania
- Przeglądarka (Chrome, Firefox, Edge, Safari)
- Python 3 (lub dowolny inny serwer HTTP)
- Połączenie internetowe (do pobrania modeli AI przy pierwszym uruchomieniu)

### Krok 1: Uruchom lokalny serwer

```bash
# W katalogu projektu:
python3 -m http.server 8080

# Alternatywnie z Node.js:
# npx http-server -p 8080

# Alternatywnie z PHP:
# php -S localhost:8080
```

### Krok 2: Otwórz w przeglądarce

Przejdź do: `http://localhost:8080/index.html`

### Krok 3: Czekaj na załadowanie modeli

Przy pierwszym uruchomieniu modele AI (około 20-30MB) będą pobrane i cache'owane.
Powinno pokazać się "Modele załadowane pomyślnie!" w konsoli.

### Krok 4: Testuj!

**Test 1: NSFW Detection**
1. Wybierz tryb "Treści NSFW"
2. Wgraj zdjęcie testowe
3. Kliknij "Wykryj Automatycznie"
4. Sprawdź czy działa klasyfikacja

**Test 2: Body Parts Detection (Beta)**
1. Wybierz tryb "Części Ciała"
2. Kliknij "Wybierz Kategorie" i zaznacz np. "Twarz", "Ręce"
3. Wgraj zdjęcie osoby
4. Kliknij "Wykryj Automatycznie"
5. Sprawdź czy wybrane części są cenzurowane

**Test 3: Mobile Responsiveness**
1. Otwórz DevTools (F12)
2. Przełącz na widok mobilny
3. Testuj wszystkie funkcje
4. Sprawdź czy UI jest responsywne

## 🚀 Wdrożenie na Firebase

### Krok 1: Setup Firebase

```bash
# Zainstaluj Firebase CLI
npm install -g firebase-tools

# Zaloguj się
firebase login
```

### Krok 2: Utwórz projekt Firebase

1. Idź do https://console.firebase.google.com/
2. Kliknij "Add Project" / "Dodaj projekt"
3. Podaj nazwę (np. "censorcraft-beta")
4. ID projektu będzie automatycznie wygenerowane
5. Skopiuj ID projektu

### Krok 3: Zaktualizuj konfigurację

Edytuj `.firebaserc`:
```json
{
  "projects": {
    "default": "twoj-projekt-id-tutaj"
  }
}
```

### Krok 4: Deploy!

```bash
firebase deploy --only hosting
```

### Krok 5: Gotowe!

Aplikacja będzie dostępna pod:
`https://twoj-projekt-id.web.app`

## 📱 Dostęp z telefonu

Po wdrożeniu możesz otworzyć URL na telefonie i używać aplikacji!

Tips:
- Dodaj do ekranu głównego (działa jak aplikacja)
- Wszystko działa offline po pierwszym załadowaniu
- Modele AI są cache'owane lokalnie

## 🐛 Troubleshooting

### "Model się nie ładuje"
- Sprawdź połączenie internetowe
- Otwórz Developer Console (F12) i sprawdź błędy
- Spróbuj wyczyścić cache przeglądarki

### "Nie wykrywa części ciała"
- Upewnij się że na zdjęciu jest wyraźnie widoczna osoba
- Spróbuj zwiększyć jasność/kontrast zdjęcia
- Czasami trzeba kliknąć 2 razy "Wykryj Automatycznie"

### "Aplikacja nie działa na telefonie"
- Upewnij się że używasz HTTPS (Firebase Hosting zapewnia to automatycznie)
- Niektóre stare przeglądarki mobilne mogą nie wspierać TensorFlow.js
- Użyj Chrome/Safari na iOS, Chrome/Samsung Internet na Android

## 📊 Wydajność

**Rozmiary modeli:**
- BodyPix: ~12MB
- NSFWJS: ~5MB
- TensorFlow.js: ~3MB

**Pierwsze załadowanie:** 10-30 sekund (pobieranie modeli)
**Następne:** 1-3 sekundy (modele z cache)

**Wykrywanie:**
- NSFW: 1-3 sekundy
- Części ciała: 3-7 sekund (bardziej złożone)

## 🎯 Reddit WIP Post Template

```markdown
[WIP] CensorCraft - Free Beta-Friendly Censorship Tool (Looking for Feedback!)

Hey everyone!

I've been working on a free, privacy-focused censorship tool specifically designed for the Beta community, and I'd love your feedback on the work-in-progress.

**What it does:**
- 🔞 Detects NSFW content (porn/hentai/sexy)  
- 🧍 Detects and censors specific body parts (face, eyes, chest, hands, armpits, navel, genitals, feet, legs, buttocks)
- 🎨 Multiple censorship styles (blur, pixelate, black bars, emoji, etc.)
- 📱 Works on phone/desktop
- 🔒 100% private - everything runs locally in your browser

**Try it here:** https://your-project-id.web.app

**Features I'm working on:**
- [List what you're planning next]

**What I need help with:**
- Does it work on your device?
- Which body parts would you like to see added?
- Any bugs or issues?
- Feature requests?

Everything is processed locally in your browser - no data is sent to any servers. It's completely free and open-source!

Let me know what you think!
```

## 🎉 Next Steps

1. Test thoroughly locally
2. Deploy to Firebase
3. Share WIP on Reddit
4. Gather feedback
5. Iterate!

Good luck! 🚀
