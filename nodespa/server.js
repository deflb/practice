const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')
const static = require('./serverStatic')
const PORT = 9999

let server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname, staticReg = /\.(html|css|js|jpg|jpeg|png|svg|woff|ttf|eot|ico)/;
    if (staticReg.test(pathname)) {
        // 静态资源 中间件处理
        static.staticMiddleWare(path.resolve() + pathname, res)
    } else {
        fs.readFile(path.resolve(__dirname, 'test', 'index.html'), 'utf-8', (err, data) => {
            if (!err) {
                res.writeHead(200, {
                    'Content-Type': 'text/html;charset=utf-8',
                })
                res.end(data)
            } else {
                res.writeHead(404, {
                    'Content-type': 'text/plain'
                })
                res.end('is 404 page')
            }
        })
    };

})
server.listen(PORT, () => {
    console.log('server is start http://localhost:9999')
})
