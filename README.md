# Marketing-Crawler-Tool

[![Linux & Mac Build Status][travis-image]][travis-url]
[![Dependency Status][david-image]][david-url]
[![Dev Dependency Status][david-dev-image]][david-dev-url]

Das Tool zieht pro Unterseite einer Homepage auf dem selben Domain folgende Quellcode-Inhalte und speichert sie in einer CSV-Datei:
```html
<title> </title>
<meta name="description" content=" " />
<h1>
<meta name="robots" content=" " />
```

## Benutzung

Installation

```
npm install --production --no-optional
npm rebuild
```

Standardablauf, schreibt Ergebnis in ausgabe.csv vier-spaltig

```
node src/index.js
```

Optionale Parameter

* `--help, -h`: Hilfe ausgeben
* `--extension, -e`: Dateiendung bestimmen [Möglichkeiten: '.csv', '.xlsx'][Standard: '.csv']('.xlsx' wird zur zeit nicht unterstützt)
* `--file, -f`: Dateiname bestimmen [Standard: 'ausgabe']
* `--pagelimit, -p`: Pagelimit bestimmen [Standard: 5000](ab 5000 Knoten wird die Suche abgebrochen)
* `--site, -s`: Ziel-Homepage bestimmen [Standard: 'https://www.finanzchef24.de']

Testen

```
npm test
```

[travis-url]: https://travis-ci.org/Finanzchef24-GmbH/Crawler
[travis-image]: https://travis-ci.org/Finanzchef24-GmbH/Crawler.svg?branch=master
[david-url]: https://david-dm.org/Finanzchef24-GmbH/Crawler
[david-image]: https://david-dm.org/Finanzchef24-GmbH/Crawler/status.svg
[david-dev-url]: https://david-dm.org/Finanzchef24-GmbH/Crawler?type=dev
[david-dev-image]: https://david-dm.org/Finanzchef24-GmbH/Crawler/dev-status.svg

