const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')
const static = require('./serverStatic')
const PORT = 8888

let server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname, staticReg = /\.(html|css|js|jpg|jpeg|png|svg|woff|ttf|eot)/;
    pathname = pathname.match(/\/(static|font)\/.+/) ? pathname.match(/\/(static|font)\/.+/)[0] : pathname
    if (staticReg.test(pathname)) {
        // 交给 静态资源 中间件处理
        static.staticMiddleWare(path.resolve() + pathname, res)
    } else {
        fs.readFile(path.resolve() + '/index.html', (err, data) => {
            if (!err) {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                })
                res.end(data)
            }
        })
    };

})
server.listen(PORT, () => {
    console.log('server is start http://localhost:8888')
})
