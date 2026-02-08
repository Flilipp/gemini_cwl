# ⚡ SZYBKI START - Automatyczne Wdrożenie Firebase

## 🎉 Skonfigurowane! 

Twoja aplikacja **CensorCraft** jest gotowa do automatycznego wdrożenia na Firebase!

- **Firebase Project ID**: `censouircraft`
- **URL aplikacji**: `https://censouircraft.web.app`

## 🚀 Co musisz zrobić (TYLKO RAZ):

### Krok 1: Zainstaluj Firebase CLI (jeśli nie masz)

```bash
npm install -g firebase-tools
```

### Krok 2: Skonfiguruj GitHub Actions (JEDNORAZOWO!)

```bash
# Zaloguj się do Firebase
firebase login

# Uruchom automatyczną konfigurację GitHub Actions
firebase init hosting:github
```

**Podczas `firebase init hosting:github`:**
1. Wybierz repo: `Flilipp/gemini_cwl`
2. Potwierdź setup workflows (już są skonfigurowane)
3. Firebase automatycznie doda secret do GitHub!

### Krok 3: Gotowe! Push i ciesz się!

```bash
# Zrób jakąkolwiek zmianę
echo "Test" >> README.md

# Commit i push
git add .
git commit -m "Test auto-deploy"
git push origin main

# GitHub Actions automatycznie wdroży aplikację!
# Sprawdź: https://censouircraft.web.app
```

## 📊 Sprawdzanie Statusu

- **GitHub Actions**: https://github.com/Flilipp/gemini_cwl/actions
- **Aplikacja Live**: https://censouircraft.web.app
- **Firebase Console**: https://console.firebase.google.com/project/censouircraft

## 📚 Więcej Info

- `GITHUB_ACTIONS_SETUP.md` - Szczegółowa instrukcja
- `QUICKSTART.md` - Kompletny przewodnik
- `BETA_GUIDE.md` - Instrukcja użytkownika

## 🎯 TL;DR (Najkrótsze możliwe)

```bash
# Raz:
firebase init hosting:github

# Potem zawsze:
git push origin main
# Aplikacja wdroży się automatycznie!
```

---

**To wszystko! Po konfiguracji secretu, każdy push = automatyczny deploy! 🚀**
