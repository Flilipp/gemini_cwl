# Project: CensorCraft (lub inna nazwa, którą wybierzesz)

**Darmowe, open-source'owe i w 100% prywatne narzędzie do automatycznej cenzury, które działa w Twojej przeglądarce.**

[![Status Projektu: MVP Ukończone](https://img.shields.io/badge/status-MVP%20ukończone-green.svg)](https://github.com/Flilipp/gemini_cwl)
[![Licencja: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## O co chodzi?

Project CensorCraft to odpowiedź na potrzebę społeczności - proste, darmowe i skuteczne narzędzie do cenzurowania zdjęć i wideo bez konieczności instalowania skomplikowanego oprogramowania czy wysyłania prywatnych plików na zewnętrzne serwery.

Wszystko, co robisz, dzieje się **lokalnie na Twoim urządzeniu**. Twoje pliki nigdy nie opuszczają Twojego komputera.

## 🎉 Gotowe do Użycia!

**MVP jest już dostępne!** Możesz używać CensorCraft już teraz:

1. Otwórz `index.html` w przeglądarce
2. Przeciągnij zdjęcie lub kliknij "Wybierz Zdjęcie"
3. AI automatycznie wykryje osoby i je ocenzuruje
4. Pobierz ocenzurowany obraz!

📚 **Dokumentacja:**
- [INSTRUKCJA.md](INSTRUKCJA.md) - jak używać aplikacji
- [DEVELOPER.md](DEVELOPER.md) - dokumentacja techniczna
- [FEATURES.md](FEATURES.md) - pełna lista funkcji

## ✨ Kluczowe Funkcje (Zaimplementowane!)

*   ✅ **Automatyczne Wykrywanie:** Sztuczna inteligencja automatycznie rozpoznaje osoby i je cenzuruje (COCO-SSD).
*   ✅ **Różne Style Cenzury:** Wybieraj spośród czarnych pasków, pikselizacji i rozmycia.
*   ✅ **Pełna Kontrola Ręczna:** Tryb rysowania - zaznaczaj własne obszary do ocenzurowania.
*   ✅ **Przetwarzanie po Stronie Klienta:** 100% prywatności. Aplikacja działa w przeglądarce, a Twoje pliki nie są nigdzie wysyłane.
*   ✅ **Darmowe i Open-Source:** Na zawsze, dla wszystkich. Bez reklam, bez subskrypcji.

## 🚀 Jak to Działa? (Technologia)

Magia dzieje się dzięki bibliotece **TensorFlow.js**. Pozwala ona na uruchamianie modeli sztucznej inteligencji bezpośrednio w przeglądarce. Oznacza to, że cała "ciężka praca" związana z analizą obrazu jest wykonywana przez Twój komputer lub telefon, a nie przez nasz serwer (bo go nie potrzebujemy!).

## 💖 Chcesz Pomóc? Jesteś w dobrym miejscu!

Ten projekt jest tworzony przez społeczność, dla społeczności. Każda pomoc jest na wagę złota, nawet jeśli nie jesteś programistą!

**Jak możesz wnieść swój wkład:**

1.  ⭐ **Daj gwiazdkę temu repozytorium!** - To zwiększa jego widoczność.
2.  💡 **Podziel się pomysłem** - Otwórz nową dyskusję w zakładce [Issues](https://github.com/twoj-nick/twoje-repo/issues) i opisz funkcję, której Ci brakuje.
3.  🐛 **Zgłoś błąd** - Jeśli coś nie działa, daj nam znać w [Issues](https://github.com/twoj-nick/twoje-repo/issues).
4.  💻 **Napisz kod** - Jeśli znasz się na HTML, CSS lub JavaScript, to jest idealne miejsce, by zacząć:
    *   Zrób `fork` tego repozytorium.
    *   Wprowadź swoje zmiany.
    *   Stwórz `Pull Request` z opisem tego, co zrobiłeś.

**Dołącz do nas na Discordzie:** [Wstaw tutaj link do swojego serwera Discord, gdy go założysz]

## 📋 Szybki Start

### Użytkownicy

1. Pobierz repozytorium lub sklonuj: `git clone https://github.com/Flilipp/gemini_cwl.git`
2. Otwórz plik `index.html` w przeglądarce
3. Gotowe! Zobacz [INSTRUKCJA.md](INSTRUKCJA.md) po więcej szczegółów

### Deweloperzy

```bash
# Sklonuj repozytorium
git clone https://github.com/Flilipp/gemini_cwl.git
cd gemini_cwl

# Uruchom lokalny serwer (opcjonalne)
python -m http.server 8080

# Otwórz w przeglądarce
# http://localhost:8080
```

Zobacz [DEVELOPER.md](DEVELOPER.md) po dokumentację techniczną.

## 🗺️ Mapa Drogowa (Roadmap)

*   **[✅] Faza 1: MVP (Minimum Viable Product)** - UKOŃCZONE!
    *   ✅ Stworzenie podstawowego interfejsu do wgrywania zdjęć (+ drag & drop).
    *   ✅ Implementacja modelu AI do wykrywania (COCO-SSD + TensorFlow.js).
    *   ✅ Dodanie trzech opcji cenzury (czarny pasek, pikselizacja, blur).
    *   ✅ Opcja pobrania ocenzurowanego obrazu.
    *   ✅ Tryb ręcznego rysowania obszarów cenzury.
*   **[ ] Faza 2: Rozbudowa Funkcji**
    *   Dodanie większej liczby stylów cenzury (piksele, blur).
    *   Wprowadzenie narzędzi do manualnej edycji.
*   **[ ] Faza 3: Dalszy Rozwój**
    *   Wsparcie dla plików wideo i GIF.
    *   Optymalizacja wydajności.

## 📜 Licencja

Ten projekt jest udostępniany na licencji MIT. Oznacza to, że możesz z nim robić, co chcesz, o ile zachowasz oryginalną informację o licencji.
