# eitLab FrontPanel

Konfigurator frontów rozdzielnic: szafy, maskownice, aparaty modułowe, ramki opisów, eksport DXF (zamknięte kontury pod laser / EZCAD3), PDF, CSV, baza zleceń, synchronizacja z Dyskiem Google.

## Struktura
- `src/shell.html` – HTML + CSS aplikacji (z miejscami `__...__` na wstawki)
- `src/body.js` – logika: model, geometria, rysowanie, DXF, PDF, zlecenia, Drive, CSV
- `src/engine_text.js` – czcionki (Hershey + TTF przez opentype.js), dopasowanie tekstu
- `src/engine_dxf.js` – zapis DXF
- `src/icons.js` – biblioteka symboli graficznych, parser SVG
- `src/hershey.json`, `src/fonts.json` – dane czcionek (kreskowe; wbudowane TTF w base64)
- `vendor/` – opentype.js (MIT), qrcode-generator (MIT)
- `docs/` – zbudowana aplikacja (PWA): `index.html`, `manifest.webmanifest`, `sw.js`, `icons/` – ten folder publikuje GitHub Pages
- `build.py` – składa `docs/index.html` ze źródeł

## Budowanie
```
python3 build.py
```
Wynik trafia do `docs/index.html`. Po każdej zmianie w `src/` uruchom build i wyślij commit – GitHub Pages opublikuje nową wersję.

## Hosting (GitHub Pages)
Settings → Pages → Source: *Deploy from a branch* → Branch: `main`, folder `/docs`. Adres: `https://<login>.github.io/<repo>/`.

## Licencje czcionek wbudowanych
Liberation Sans/Serif (SIL OFL), Carlito (SIL OFL), DejaVu (Bitstream Vera / public domain), Roboto (Apache 2.0), Open Sans (SIL OFL), Hershey (public domain). Własne czcionki (np. Arial) użytkownik wgrywa sam w Bibliotece.
