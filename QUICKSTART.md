# 🎉 GOTOWE! CensorCraft Beta Edition - WIP Release Ready

## Co zostało zaimplementowane:

### ✅ TRYB 1: Wykrywanie NSFW (całe zdjęcie)
- Model: **NSFWJS**
- Kategorie: Pornografia, Hentai, Prowokacyjne
- Działanie: Klasyfikuje całe zdjęcie i cenzuruje jeśli wykryje treści NSFW

### ✅ TRYB 2: Wykrywanie Części Ciała (Beta Community)
- Model: **BodyPix** (segmentacja ciała)
- Części do wyboru:
  - ✓ Twarz
  - ✓ Oczy
  - ✓ Piersi/Klatka
  - ✓ Ręce/Dłonie
  - ✓ Pachy
  - ✓ Brzuch/Pępek
  - ✓ Genitalia
  - ✓ Stopy
  - ✓ Nogi
  - ✓ Pośladki

### ✅ Style Cenzury
- Czarny pasek
- Pikselizacja
- Rozmycie
- Emoji (😎🙈🤐)
- Biały pasek

### ✅ Firebase Hosting
- Gotowe pliki konfiguracyjne
- Instrukcje deployment
- Dostęp z telefonu po wdrożeniu

## 🚀 JAK ZACZĄĆ:

### 1. Automatyczne Wdrożenie (Zalecane! ✨)

**GitHub Actions automatycznie wdraża aplikację na Firebase!**

```bash
# 1. Skonfiguruj Firebase secret (JEDNORAZOWO):
firebase login
firebase init hosting:github
# Wybierz repo: Flilipp/gemini_cwl
# Automatycznie skonfiguruje secret!

# 2. Push do main:
git add .
git commit -m "Your changes"
git push origin main

# 3. Gotowe! Aplikacja wdroży się automatycznie!
# Sprawdź: https://censouircraft.web.app
```

**Zobacz**: `GITHUB_ACTIONS_SETUP.md` dla szczegółowej instrukcji!

### 2. Testowanie Lokalne (przed pushem)

```bash
# W katalogu projektu:
python3 -m http.server 8080

# Otwórz w przeglądarce:
# http://localhost:8080/index.html
```

**Czekaj ~30 sekund** aż modele się załadują przy pierwszym uruchomieniu!

### 2. Testuj Funkcje

**Test NSFW:**
1. Wybierz "🔞 Treści NSFW"
2. Kliknij "⚙️ Wybierz Kategorie" → zaznacz Pornografia/Hentai
3. Wgraj zdjęcie testowe
4. Kliknij "🤖 Wykryj Automatycznie"

**Test Beta (części ciała):**
1. Wybierz "🧍 Części Ciała (Beta)"
2. Kliknij "⚙️ Wybierz Kategorie" → zaznacz np. Twarz, Ręce
3. Wgraj zdjęcie osoby
4. Kliknij "🤖 Wykryj Automatycznie"

### 3. Wdrożenie - JUŻ SKONFIGUROWANE! ✅

**Aplikacja wdraża się AUTOMATYCZNIE przez GitHub Actions!**

Projekt Firebase ID: `censouircraft`
URL: `https://censouircraft.web.app`

**Jednorazowa konfiguracja (jeśli jeszcze nie zrobiłeś):**

```bash
# Skonfiguruj Firebase secret dla GitHub Actions:
firebase login
firebase init hosting:github
# Wybierz: Flilipp/gemini_cwl
# Potwierdź automatyczną konfigurację

# Gotowe! Teraz każdy push automatycznie wdraża aplikację!
```

**Codzienne użytkowanie:**

```bash
# Po prostu pushuj zmiany:
git add .
git commit -m "Moje zmiany"
git push origin main

# GitHub Actions automatycznie wdroży na:
# https://censouircraft.web.app
```

**Ręczne wdrożenie (opcjonalne):**

```bash
firebase deploy --only hosting
```

### 4. Share on Reddit! 🎯

Template postu w pliku `TESTING_DEPLOYMENT.md`

## 📚 Dokumentacja:

- **BETA_GUIDE.md** - Instrukcja dla użytkowników (po polsku)
- **TESTING_DEPLOYMENT.md** - Jak testować i wdrożyć
- **FIREBASE_SETUP.md** - Setup Firebase krok po kroku

## 🔥 Najważniejsze:

1. **100% PRYWATNE** - wszystko działa w przeglądarce, nic nie jest wysyłane nigdzie
2. **Działa na telefonie** - po wdrożeniu na Firebase
3. **Dwa tryby** - NSFW całościowy + segmentacja części ciała
4. **Wybieralne kategorie** - zaznaczasz co ma być cenzurowane
5. **Wiele stylów** - blur, pixelate, black bars, emoji itd.

## ⚠️ Przed publikacją na Reddit:

1. ✅ Przetestuj lokalnie OBA tryby
2. ✅ Sprawdź na telefonie (po deploy)
3. ✅ Przygotuj przykładowe screenshoty
4. ✅ Napisz listę "Known Issues" jeśli są
5. ✅ Przygotuj się na feedback!

## 💡 Tips:

- Modele ładują się ~20-30 sekund przy pierwszym uruchomieniu
- Po załadowaniu są cache'owane - później działa szybciej
- BodyPix detection zajmuje 3-7 sekund (normalne!)
- Jeśli coś nie działa - sprawdź Console (F12) w przeglądarce

## 🎮 Gotowe do akcji!

Wszystkie pliki są w repo. Przetestuj, wdróż, share na Reddit i zbieraj feedback!

**Good luck with your WIP release! 🚀**

---

Made for the Beta community with ❤️
