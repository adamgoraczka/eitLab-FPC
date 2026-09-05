eitLab FrontPanel – wersja PWA (instalowana aplikacja webowa)
==============================================================

ZAWARTOŚĆ
  index.html            – cała aplikacja (jeden plik, działa też otwarta lokalnie w Chrome/Edge)
  manifest.webmanifest  – opis aplikacji dla instalatora PWA
  sw.js                 – service worker: praca offline
  icons/                – ikony

INSTALACJA (Windows, Android – tablet 10")
  1. Wgraj cały folder na dowolny hosting HTTPS. Najprościej: GitHub Pages
     (nowe repozytorium → wgraj pliki → Settings → Pages → Branch: main / root → adres https://<login>.github.io/<repo>/).
     Może być też własny serwer, NAS z HTTPS albo Netlify/Cloudflare Pages (przeciągnij folder).
  2. Otwórz adres w Chrome lub Edge.
  3. Windows: w pasku adresu ikona „Zainstaluj” (lub menu ⋮ → Zainstaluj aplikację). Android: menu ⋮ → „Dodaj do ekranu głównego” / „Zainstaluj aplikację”.
  4. Po pierwszym otwarciu aplikacja działa bez internetu. Pliki DXF/PDF/CSV zapisują się normalnie do Pobranych.

  Bez hostingu: index.html można otworzyć bezpośrednio z dysku (podwójne kliknięcie) – działa wszystko
  poza instalacją PWA i synchronizacją Google Drive.

DANE
  Zlecenia, rozdzielnice i biblioteka zapisują się w IndexedDB przeglądarki (Ustawienia → „Pamięć programu”).
  Kopia całej bazy: Ustawienia → „Kopia całej bazy (JSON)”. Odtworzenie: „Odtwórz z kopii”.

GOOGLE DRIVE (synchronizacja między urządzeniami)
  1. https://console.cloud.google.com → nowy projekt → „APIs & Services” → „Enable APIs” → włącz „Google Drive API”.
  2. „OAuth consent screen” → External → wpisz nazwę aplikacji, e-mail; w „Scopes” dodaj
     https://www.googleapis.com/auth/drive.appdata ; w „Test users” dodaj swoje konto Google.
  3. „Credentials” → „Create credentials” → „OAuth client ID” → typ „Web application”;
     w „Authorized JavaScript origins” dodaj adres hostingu (np. https://login.github.io) – bez ścieżki.
  4. Skopiuj „Client ID” (…apps.googleusercontent.com) do aplikacji: ⚙ Ustawienia → Google Drive → Client ID → „Zaloguj i synchronizuj”.
  Dane trafiają do ukrytego folderu aplikacji na Twoim Dysku (appDataFolder). Każde urządzenie z tym samym kontem
  Google i tym samym Client ID widzi te same zlecenia. Zasada: nowsza wersja zlecenia wygrywa.

AKTUALIZACJA
  Podmień index.html (i sw.js, jeśli był zmieniony) na hostingu. Zainstalowana aplikacja pobierze nową wersję
  przy następnym uruchomieniu z dostępem do internetu. Zmień numer CACHE w sw.js przy każdej nowej wersji.
