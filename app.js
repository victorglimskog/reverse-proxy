const http = require('http');
const httpProxy = require('http-proxy');

// Create a new reverse proxy
const proxy = httpProxy();

// Create a new webserver
http.createServer((req,res) => {
    res.write('url: ', req.url);
});

app.listen(80);
