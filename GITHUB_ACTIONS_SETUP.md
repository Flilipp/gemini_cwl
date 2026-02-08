# 🚀 Automatyczne Wdrożenie Firebase przez GitHub Actions

## ✅ Co zostało skonfigurowane:

Aplikacja **automatycznie** wdraża się na Firebase Hosting przy każdym pushu na branch `main` lub `master`!

- **Projekt Firebase ID**: `censouircraft`
- **URL po wdrożeniu**: `https://censouircraft.web.app`

## 🔧 KROK 1: Konfiguracja Firebase Service Account (JEDNORAZOWO!)

Musisz **raz** skonfigurować secret w GitHub, aby Actions miały dostęp do Firebase.

### A) Wygeneruj Service Account Key:

```bash
# 1. Zaloguj się do Firebase CLI (jeśli jeszcze nie jesteś zalogowany)
firebase login

# 2. Wygeneruj service account key dla projektu censouircraft
firebase init hosting:github
```

Podczas `firebase init hosting:github`:
1. Wybierz swoje repo: `Flilipp/gemini_cwl`
2. Firebase CLI automatycznie:
   - Wygeneruje service account key
   - Utworzy secret `FIREBASE_SERVICE_ACCOUNT_CENSOUIRCRAFT` w GitHub
   - Skonfiguruje workflows (które już masz!)

**ALTERNATYWNIE** (jeśli nie chcesz używać `firebase init`):

### B) Ręczna konfiguracja Service Account:

1. **Przejdź do Firebase Console**:
   - https://console.firebase.google.com/project/censouircraft/settings/serviceaccounts/adminsdk

2. **Wygeneruj nowy klucz**:
   - Kliknij "Generate new private key"
   - Pobierze się plik JSON z kluczem

3. **Dodaj secret do GitHub**:
   - Idź do: https://github.com/Flilipp/gemini_cwl/settings/secrets/actions
   - Kliknij "New repository secret"
   - Name: `FIREBASE_SERVICE_ACCOUNT_CENSOUIRCRAFT`
   - Value: **CAŁA ZAWARTOŚĆ** pliku JSON (skopiuj i wklej)
   - Kliknij "Add secret"

## 🎯 KROK 2: Gotowe! Testuj!

Po skonfigurowaniu secretu:

```bash
# Zrób dowolną zmianę w projekcie
echo "Test auto-deploy" >> README.md

# Commit i push
git add .
git commit -m "Test auto-deploy"
git push origin main

# GitHub Actions automatycznie wdroży na Firebase!
```

## 📊 Sprawdzanie statusu:

1. Przejdź do: https://github.com/Flilipp/gemini_cwl/actions
2. Zobacz status wdrożenia w zakładce "Actions"
3. Zielony checkmark ✅ = sukces!
4. Aplikacja dostępna pod: https://censouircraft.web.app

## 🔄 Jak to działa:

```
1. Robisz zmiany w kodzie
2. git push origin main
3. GitHub Actions automatycznie:
   - Pobiera kod z repo
   - Wdraża na Firebase Hosting
   - Gotowe w ~1-2 minuty!
```

## ⚡ Co się wdraża:

GitHub Actions wdraża pliki bezpośrednio z repo zgodnie z `firebase.json`:
- `index.html`
- `app.js`
- `styles.css`
- Wszystko zgodne z konfiguracją w `firebase.json`

## 🐛 Troubleshooting:

### "Error: Missing service account secret"
→ Wykonaj KROK 1 powyżej - dodaj secret `FIREBASE_SERVICE_ACCOUNT_CENSOUIRCRAFT`

### "Permission denied"
→ Upewnij się że service account ma uprawnienia do projektu `censouircraft`

### "Deployment failed"
→ Sprawdź logi w: https://github.com/Flilipp/gemini_cwl/actions

## 📱 Efekt:

Po każdym pushu:
- ✅ Automatyczne wdrożenie
- ✅ Aplikacja dostępna pod https://censouircraft.web.app
- ✅ Działa na telefonie i komputerze
- ✅ **ZERO ręcznej pracy!**

## 🎉 Dodatkowe:

### Preview dla Pull Requestów:

GitHub Actions również tworzy **preview** dla każdego Pull Requesta!
- Każdy PR dostaje unikalny preview URL
- Możesz przetestować zmiany przed mergem
- Automatyczne cleanup po zamknięciu PR

### Sprawdzanie URL:

Po wdrożeniu sprawdź:
```
https://censouircraft.web.app
```

Powinien działać od razu! 🚀

---

**PODSUMOWANIE:**
1. ⚙️ Skonfiguruj secret (KROK 1) - **tylko raz**
2. 🚀 Push do main - **automatyczny deploy**
3. ✅ Aplikacja live na https://censouircraft.web.app

**Koniec z ręcznym deploymentem! Wszystko automatyczne! 🎊**
