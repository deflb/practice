const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')
const api = require('./route/api')
const static = require('./route/static')
const PORT = 8888

http.createServer((req, res) => {
    let pathname = url.parse(req.url, true).pathname, staticReg = /\.(html|css|js|jpg|jpeg|png|svg|woff|ttf|eot)/;
    if (staticReg.test(pathname)) {
        // 交给 静态资源 中间件处理
        static.staticMiddleWare(path.resolve()+pathname, res)
    } else {
        switch (req.method) {
            case 'OPTIONS':
                api.options(req, res)
                break;
            case 'POST':
                api.post(req, res)
                break;
            case 'GET':
                api.get(req, res)
                break;
            default:
                break;
        }
    }
}).listen(PORT, () => {
    console.log('server is start in http://localhost:8888')
})
