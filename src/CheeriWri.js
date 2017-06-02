// imports
const cheerio = require('cheerio');

module.exports = function (content, writer) {
    const response = content[0];
    const body = content[1];
    const $ = cheerio.load(body);

    const href = response.request.href;
    const title = $('title').text();
    const desc = $('meta[name="description"]').attr('content');
    const robots = $('meta[name="robots"]').attr('content');

    // Wenn mehr als 1 h1 Tag gibt, je eine h1 Tag neue Zeile mit gleichen Datensätze pro Seite
    // (es gibt bei uns aber nur 1 Tag pro Seite bis jetzt)
    $('h1').each(function () {
        writer.write([
            href, title, desc, $(this).text(), robots
        ]);
    });
};
