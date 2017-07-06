const urler = require('url');

module.exports = function(crw, $, visited_pages, hostname, protocol, calledHref) {
    $('a').each(function(index, node) {
        const $node = $(node);
        const preHref = $node.attr('href');
        // Matcht URL auf diese Endungen => .jpg, .gif, .png, .pdf. Bei Bedarf erweitern
        const exp = /(http(s?):)?([/|.|\w|\s])*\.(?:jpg|gif|png|pdf)/g;
        const htmlRegex = new RegExp(exp);

        if (typeof preHref !== 'undefined') {
            const href = preHref.split('#')[0];
            const url = urler.parse(href);

            if (url.hostname === hostname && !visited_pages.has(url.path) && url.protocol === protocol) {
                visited_pages.add(url.path);
                if (htmlRegex.test(href)) {
                    crw.queue(
                        {
                            uri: href,
                            jQuery: false,
                            calledHref
                        }
                    );
                } else {
                    crw.queue([
                        {
                            uri: href,
                            calledHref
                        }
                    ]);
                }
            }
        }
    });
};
