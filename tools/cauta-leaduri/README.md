# Caută leaduri

Aplicație Windows internă twopixeldev: caută pe Google Maps (cu [google-maps-scraper](https://github.com/gosom/google-maps-scraper)) și arată firmele **fără site**. CSV-ul se salvează în `Documente\Leaduri` și se încarcă în twopixeldev.com/app → Site-uri → „importă leaduri”.

- Interfața (`ui/`) e o pagină locală servită doar pe `127.0.0.1:47823`, deschisă într-o fereastră Edge/Chrome în modul aplicație. Aplicația se închide când închizi fereastra.
- Scraper-ul rulează ascuns din `scraper\gmaps-scraper.exe`, lângă aplicație. Binarul oficial v1.18.x se închide pe Windows (flag-ul `--single-process`, issue #137), deci folosim unul compilat din sursă fără acel flag.
- Build: `powershell -ExecutionPolicy Bypass -File build.ps1 -Scraper <cale gmaps-scraper.exe reparat>` → `dist\CautaLeaduri-twopixeldev-Setup.exe`.
- Test pe Linux: `CAUTA_LEADURI_NO_WINDOW=1 CAUTA_LEADURI_SCRAPER=<scraper fals> CAUTA_LEADURI_OUT=<folder> go run .`
