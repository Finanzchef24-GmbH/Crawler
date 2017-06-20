const urler = require('url');

module.exports = function(crw, $, visited_pages, hostname, protocol) {
    $('a').each(function(index, node) {
        const $node = $(node);
        const preHref = $node.attr('href');

        if (typeof preHref !== 'undefined') {
            const href = preHref.split('#')[0];
            const url = urler.parse(href);

            if (url.hostname === hostname && !visited_pages.has(url.path) && url.protocol === protocol) {
                visited_pages.add(url.path);
                crw.queue([ href ]);
            }
        }
    });
};
