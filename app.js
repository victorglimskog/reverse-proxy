const http = require('http');
const httpProxy = require('http-proxy');

// Create a new reverse proxy
const proxy = httpProxy();

proxy.on('error', (e) => {
    console.log('I AM ERROR')
});

// Create a new webserver
http.createServer((req,res) => {
    res.write('url: ', req.url);
});

app.listen(80);
