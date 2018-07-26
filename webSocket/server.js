const http = require('http')
const ws = require('ws')
const fs = require('fs')
const url = require('url')
const path = require('path')
const PORT = 80

http.createServer((req, res) => {
    let pathname = url.parse(req.url, true).pathname;
    switch (pathname) {
        case '/':
            res.writeHead(302, {
                'Location': '/webSocket.html'
            })
            res.end()
            break;
        case '/webSocket.html':
            const wss = new ws.Server({ port: PORT });
            wss.on('connection', () => {
                wss.on('message', (msg) => {
                    console.log(msg)
                    wss.clients.forEach(client => client.send(msg))
                })
            })
            fs.readFile(path.resolve('public') + pathname, (err, content) => {
                if (err) {
                    res.writeHead(200, {
                        'content-type': 'text/plain'
                    })
                    res.end('file is no find')
                } else {
                    res.writeHead(200, {
                        'content-type': 'text/html'
                    })
                    res.end(content)
                }
            })
        default:
            break;
    }
}).listen(PORT, () => {
    console.log('server is start in http://localhost')
})
