# Marketing-Crawler-Tool

[![NPM Version][npm-image]][npm-url]
[![Linux & Mac Build Status][travis-image]][travis-url]
[![Code Coverage][codecov-image]][codecov-url]
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

Standardablauf, schreibt Ergebnis in ausgabe.csv vier-spaltig

```
node src/index.js 
```

Optionale Parameter:

* `--help, -h`: Hilfe ausgeben
* `--extension, -e`: Dateiendung bestimmen [Möglichkeiten: '.csv', '.xlsx'][Standard: '.csv']('.xlsx' wird zur zeit nicht unterstützt)
* `--file, -f`: Dateiname bestimmen [Standard: 'ausgabe']

[npm-url]: https://npmjs.org/package/node-version-check
[npm-image]: https://img.shields.io/npm/v/node-version-check.svg
[travis-url]: https://travis-ci.org/SimenB/node-version-check
[travis-image]: https://img.shields.io/travis/SimenB/node-version-check/master.svg?maxAge=2592000
[appveyor-url]: https://ci.appveyor.com/project/SimenB/node-version-check
[appveyor-image]: https://ci.appveyor.com/api/projects/status/leljtwqeg3x55v22/branch/master?svg=true
[codecov-url]: https://codecov.io/gh/SimenB/node-version-check
[codecov-image]: https://img.shields.io/codecov/c/github/SimenB/node-version-check/master.svg
[david-url]: https://david-dm.org/SimenB/node-version-check
[david-image]: https://img.shields.io/david/SimenB/node-version-check.svg
[david-dev-url]: https://david-dm.org/SimenB/node-version-check?type=dev
[david-dev-image]: https://img.shields.io/david/dev/SimenB/node-version-check.svg
[greenkeeper-url]: https://greenkeeper.io/
[greenkeeper-image]: https://badges.greenkeeper.io/SimenB/node-version-check.svg
