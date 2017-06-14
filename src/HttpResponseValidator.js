module.exports = function(response) {
    const href = response.request.uri.href;

    if (response.statusCode !== 200 && response.statusCode < 400) {
        console.log('Warning: HTTP Status Code', response.statusCode, 'wurde nicht akzeptiert für href', href);
        return false;
    } else if (response.statusCode >= 400) {
        console.log('Warning: HTTP Status Code Fehler', response.statusCode, 'für href', href);
        return false;
    } else if (response.headers['content-type'].indexOf('html') === -1) {
        console.log('Warning: Content Type ist nicht HTML für href', href);
        return false;
    } 
    return true;
};
