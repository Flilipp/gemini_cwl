# Firebase Hosting Setup

## Krok 1: Instalacja Firebase CLI

```bash
npm install -g firebase-tools
```

## Krok 2: Logowanie do Firebase

```bash
firebase login
```

## Krok 3: Inicjalizacja projektu (jeśli jeszcze nie masz)

1. Idź do [Firebase Console](https://console.firebase.google.com/)
2. Utwórz nowy projekt lub wybierz istniejący
3. Skopiuj ID projektu

## Krok 4: Aktualizacja konfiguracji

Edytuj plik `.firebaserc` i zamień `your-project-id` na swój prawdziwy Firebase Project ID:

```json
{
  "projects": {
    "default": "twoj-projekt-id"
  }
}
```

## Krok 5: Deploy aplikacji

```bash
firebase deploy --only hosting
```

## Gotowe!

Twoja aplikacja będzie dostępna pod adresem:
`https://twoj-projekt-id.web.app`

## Aktualizacja aplikacji

Po każdej zmianie w kodzie, po prostu uruchom:

```bash
firebase deploy --only hosting
```

## Dostęp z telefonu

Po wdrożeniu, aplikacja będzie dostępna z dowolnego urządzenia (komputer, telefon, tablet) pod adresem Firebase Hosting URL.

## Tips dla mobile:

- Aplikacja jest w 100% responsywna
- Działa offline (po pierwszym załadowaniu)
- Wszystko działa lokalnie w przeglądarce (prywatność!)
- Modele AI pobierają się raz i są cache'owane

## Reddit WIP Post - Przykładowy tekst:

```
[WIP] CensorCraft - Free Beta-Friendly Censorship Tool

Hey r/[your_subreddit],

I'm working on a free, privacy-focused censorship tool specifically for the Beta community.

Features:
- 🔞 NSFW content detection
- 🧍 Body part detection (face, eyes, chest, hands, feet, etc.)
- 🎨 Multiple censorship styles (blur, pixelate, bars, emoji)
- 📱 Works on mobile
- 🔒 100% private - everything runs in your browser

Try it here: https://your-project-id.web.app

Looking for feedback! What features would you want to see?
```
