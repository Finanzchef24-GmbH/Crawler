const urler = require('url');
const hostname = 'www.finanzchef24.de';

module.exports = function(crw, $, visited_pages) {
    $('a').each(function(index, node) {
        const $node = $(node);
        const preHref = $node.attr('href');

        if (typeof preHref !== 'undefined') {
            const href = preHref.split('#')[0];
            const url = urler.parse(href);

            if (url.hostname === hostname && !visited_pages.has(url.path)) {
                visited_pages.add(url.path);
                crw.queue([ href ]);
            }
        }
    });
};
