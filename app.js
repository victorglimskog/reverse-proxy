const http = require('http');
const httpProxy = require('http-proxy');

// Create a new reverse proxy
const proxy = httpProxy.createProxyServer();

// proxy.on('error', (e) => {
//     console.log('I AM ERROR')
// });

// Create a new webserver
http.createServer((req,res) => {
    const host = req.headers.host;
    res.end(host + req.url);
}).listen(80);
