# ⚡ CHEAT SHEET - Automatyczne Wdrożenie

## 🎯 TL;DR (Najkrótsze możliwe)

### Setup (TYLKO RAZ):
```bash
firebase init hosting:github
```

### Codziennie:
```bash
git push origin main
```

### Sprawdź:
```
https://censouircraft.web.app
```

**TO WSZYSTKO!** 🎉

---

## 📋 Pełne komendy:

### Pierwszy raz (setup):
```bash
# 1. Zainstaluj Firebase CLI (jeśli nie masz)
npm install -g firebase-tools

# 2. Zaloguj się
firebase login

# 3. Skonfiguruj auto-deploy
firebase init hosting:github
# Wybierz: Flilipp/gemini_cwl
# Odpowiedz: Yes na auto-deploy
```

### Normalny workflow:
```bash
# Edytuj pliki...

# Commit
git add .
git commit -m "Opis zmian"

# Push (auto-deploy!)
git push origin main

# Czekaj 1-2 minuty
# Sprawdź: https://censouircraft.web.app
# Gotowe!
```

---

## 🔗 Ważne linki:

| Co | Link |
|---|---|
| **Aplikacja Live** | https://censouircraft.web.app |
| **GitHub Actions** | https://github.com/Flilipp/gemini_cwl/actions |
| **Firebase Console** | https://console.firebase.google.com/project/censouircraft |
| **Repo** | https://github.com/Flilipp/gemini_cwl |

---

## 📚 Dokumentacja:

| Plik | Co zawiera |
|---|---|
| `INSTRUKCJA_AUTO_DEPLOY.md` | 🇵🇱 **Pełna instrukcja PO POLSKU** |
| `AUTO_DEPLOY_README.md` | Quick start (ENG) |
| `HOW_IT_WORKS.md` | Diagram jak to działa |
| `GITHUB_ACTIONS_SETUP.md` | Szczegóły techniczne |

---

## 🐛 Szybkie rozwiązania:

### Błąd: "Missing service account"
```bash
firebase init hosting:github
```

### Deployment nie działa
1. Sprawdź: https://github.com/Flilipp/gemini_cwl/actions
2. Zobacz logi
3. Popraw błąd
4. Push ponownie

### Chcę ręcznie wdrożyć
```bash
firebase deploy --only hosting
```

---

## ✅ Checklist pierwszego razu:

- [ ] `npm install -g firebase-tools`
- [ ] `firebase login`
- [ ] `firebase init hosting:github`
- [ ] Wybieram `Flilipp/gemini_cwl`
- [ ] Potwierdzam setup
- [ ] Test: `git push origin main`
- [ ] Sprawdzam: https://censouircraft.web.app
- [ ] **DZIAŁA!** 🎉

---

**Pytania? Otwórz `INSTRUKCJA_AUTO_DEPLOY.md`** 📖
