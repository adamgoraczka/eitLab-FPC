# Historia zmian

## 5.4 (2026-09-05)
- Klamka drzwi jak w rzeczywistej szafie (uchylna, 26×140 mm, zamek u dołu) o stałej wielkości niezależnie od szafy; numer wersji przy tytule

## 5.3 (2026-09-05)
- Widok drzwi: wyraźna klamka z zamkiem, zawiasy, wybór strony zawiasów (klamka po lewej/prawej) i drzwi dwuskrzydłowe per szafa; kolumny zawiasy/skrzydła w CSV (SZAFA)

## 5.2 (2026-09-05)
- Pozioma tabela opisów pod widokiem maskownicy (przycisk „Tabela opisów”): kolumny = aparaty w kolejności na maskownicy, wiersze: symbol, nazwa/pola, model, grupa (podpis górny i dolny), ikona; Tab/Enter – następny aparat, ↓/↑ – wiersz; podświetlenie aparat ↔ kolumna; przejście do poprzedniej/następnej maskownicy
- Kontrola mieszczenia się tekstu na żywo: pole na czerwono (z podpowiedzią, do ilu % zmniejszono) i czerwony tekst na rysunku
- Wklejanie bloku komórek z arkusza (Ctrl+V, w prawo od zaznaczonej komórki, wiersz po wierszu; pola tabelki jako `a|b|c`), zaznaczanie zakresu Shift+klik i kopiowanie do arkusza (Ctrl+C), cofanie wklejenia jednym krokiem
- Wzorce w Bibliotece: zapis grupy lub całej maskownicy jako wzorca (z opcją stałych symboli), wstawianie z zakładki Aparaty (do lewej / do prawej / jako nowa maskownica), eksport/import wzorców JSON, synchronizacja z Drive i kopia bazy
- Eksport/import opisów jednego rzędu (CSV) oraz „Importuj tylko opisy” – nadpisanie nazw, modeli, symboli i ikon po pozycjach bez zmiany układu

## 5.1 (2026-09-05)
- Domyślnie czcionki z wypełnieniem (Liberation Sans), biblioteka własnych TTF/OTF z próbką, osobna czcionka INFO
- Symbole graficzne w ramkach (22 wbudowane, import SVG), warstwa ICON
- Osobna wysokość tekstu w polach tabelek wielopolowych, ostrzeżenia o zmniejszonym tekście
- Tekst kodu/modelu pionowo przy wąskich aparatach
- PDF: grubości linii wg skali, zakres „szafa + każda maskownica”, poprawne wypełnienie liter z otworami

## 5.0 (2026-09-04)
- Zlecenia i rozdzielnice w IndexedDB, synchronizacja Google Drive, kopia bazy
- Podpisy grup górne i dolne z ustawieniami linii/tekstu, osobne warstwy DXF
- Cokoły, wizualizacja szafy, tryb Montaż (modele aparatów), Drzwi
- PDF A4/A3, zestawienie aparatów, biblioteka obudów, otwory, QR, kontrola projektu, PWA

## Planowane
- Mapowanie importu z programów do schematów (EPLAN/SEE) po otrzymaniu próbki pliku
