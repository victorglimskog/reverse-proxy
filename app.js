const http = require('http');
const httpProxy = require('http-proxy');

// Create a new reverse proxy
const proxy = httpProxy.createProxyServer();

// Create a new webserver
http.createServer((req,res) => {
    const host = req.headers.host;
    const hostParts = host.split('.');
    const topDomain = hostParts.pop();
    const domain = hostParts.pop();
    const urlParts = req.url.split('/');

    let port;
    let subDomain = hostParts.join('.');

    if (subDomain == '' || subDomain == 'www') {
        port = 4000;
    } else if (subDomain == 'me') {
        port = 3000;
    } else {
        res.statusCode = 500;
        res.end('Can not find your app!');
    }

    if (port) {
        proxy.web(req, res, {target: 'http://127.0.0.1:' + port});
    }
}).listen(80);
