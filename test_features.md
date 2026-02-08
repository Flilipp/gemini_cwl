# Test Plan dla Nowych Funkcji

## Funkcje do Przetestowania

### ✅ Interfejs
- [ ] Zakładki przełączają się poprawnie (Cenzura, Regulacje, Efekty, Transformacje)
- [ ] Każda zakładka pokazuje właściwe kontrolki
- [ ] Przyciski są responsywne i dobrze wyglądają

### ✅ Regulacje Obrazu
- [ ] Jasność: suwak działa, wartość się aktualizuje
- [ ] Kontrast: suwak działa, wartość się aktualizuje
- [ ] Nasycenie: suwak działa, wartość się aktualizuje
- [ ] Ostrość: suwak działa, wartość się aktualizuje
- [ ] Reset Regulacji: przywraca domyślne wartości

### ✅ Efekty
- [ ] Filter Czarno-biały: obraz staje się monochromatyczny
- [ ] Filter Sepia: obraz dostaje vintage look
- [ ] Filter Inwersja: kolory są odwrócone
- [ ] Winietowanie: brzegi obrazu ciemnieją
- [ ] Temperatura: obraz staje się cieplejszy/chłodniejszy

### ✅ Transformacje
- [ ] Obrót 90°: obraz obraca się o 90° w prawo
- [ ] Obrót 180°: obraz obraca się do góry nogami
- [ ] Obrót 270°: obraz obraca się o 270° (lub 90° w lewo)
- [ ] Odbicie poziome: obraz odbija się jak w lustrze
- [ ] Odbicie pionowe: obraz odbija się góra-dół
- [ ] Przycinanie: można zaznaczyć i przyciąć obszar

### ✅ Historia
- [ ] Przycisk Cofnij wyłączony na początku
- [ ] Po zmianie, Cofnij się aktywuje
- [ ] Cofnij przywraca poprzedni stan
- [ ] Ponów przywraca cofniętą zmianę
- [ ] Historia działa dla wszystkich typów zmian

### ✅ Cenzura (istniejące funkcje)
- [ ] Automatyczne wykrywanie nadal działa
- [ ] Tryb rysowania nadal działa
- [ ] Wszystkie style cenzury działają
- [ ] Wyczyść Cenzurę nadal działa

### ✅ Ogólne
- [ ] Pobieranie obrazu zapisuje wszystkie zmiany
- [ ] Nowy Obraz resetuje wszystko
- [ ] Nie ma błędów w konsoli JavaScript
- [ ] Aplikacja nie zawiesza się

## Instrukcje Testowania

1. Otwórz `index.html` w przeglądarce
2. Otwórz Developer Console (F12) i sprawdź błędy
3. Wgraj testowe zdjęcie
4. Przejdź przez każdą zakładkę i przetestuj kontrolki
5. Wypróbuj kombinacje różnych efektów
6. Sprawdź czy Cofnij/Ponów działa poprawnie
7. Pobierz finalny obraz i sprawdź czy zawiera wszystkie zmiany

## Znane Ograniczenia

- Model AI może nie działać bez połączenia z internetem (CDN)
- Bardzo duże obrazy mogą być wolniejsze
- Historia ograniczona do 20 kroków (oszczędność pamięci)

## Wyniki Testów

Data: ___________
Tester: ___________

### Podsumowanie
- Wszystkie funkcje działają: [ ] TAK [ ] NIE
- Znalezione błędy: ___________
- Sugestie ulepszeń: ___________
