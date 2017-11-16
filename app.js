const http = require('http');
const httpProxy = require('http-proxy');
const tls = require('tls');
const fs = require('fs');

// read all certs from certbot into an object
let certs = readCerts();
console.log(certs);

// Create a new reverse proxy
const proxy = httpProxy.createProxyServer();

// Handle proxy errors - thus not breaking the whole
// reverse-proxy app if an app doesn't answer
proxy.on('error', function(e) {
    console.log('Proxy error: ', e);
});

// Create a new webserver
http.createServer((req,res) => {
    // replace setResponseHeaders
    setResponseHeaders(req,res);

    const host = req.headers.host;
    const hostParts = host.split('.');
    const topDomain = hostParts.pop();
    const domain = hostParts.pop();
    const urlParts = req.url.split('/');

    let port;
    let subDomain = hostParts.join('.');
    if (urlParts[1] === '.well-known') {
        port = 5000; // app: cert-bot-helper
    } else if (subDomain == '' || subDomain == 'www') {
        port = 4000; // app: testapp
    } else if (subDomain == 'me') {
        port = 3000; // app: small-node
    } else {
        res.statusCode = 404;
        res.end('This is not the page you are looking for.');
    }

    if (port) {
        proxy.web(req, res, {target: 'http://127.0.0.1:' + port});
    }
}).listen(80);

function setResponseHeaders(req,res) {
    res.oldWriteHead = res.writeHead;
    res.writeHead = function (statusCode, headers) {
        res.setHeader('x-powered-by','vgl server');
        res.oldWriteHead(statusCode,headers);
    }
}

function readCerts() {
    let certs = {},
    domains = fs.readdirSync(pathToCerts);

    // Read all ssl certs into memory from file
    for(let domain of domains) {
        let domainName = domain.split('-0')[0];
        certs[domainName] = {
            key: fs.readFileSync(path.join(pathToCerts, domain, 'privkey.pem')),
            cert: fs.readFileSync(path.join(pathToCerts, domain, 'fullchain.pem'))
        };
        certs[domainName].secureContext = tls.createSecureContext(certs[domainName]);
    }
    return certs;
}
