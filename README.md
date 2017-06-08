# Marketing-Crawler-Tool [FC-5451]

[![Linux & Mac Build Status][travis-image]][travis-url]
[![Dependency Status][david-image]][david-url]
[![Dev Dependency Status][david-dev-image]][david-dev-url]

Das Tool zieht pro Sitemap Seite folgende Quellcode-Inhalte und speichert es in einer CSV-Datei:
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

