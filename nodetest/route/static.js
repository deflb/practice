const fs = require('fs')
const path = require('path')
const mime = {
    '.css': 'text/css',
    '.html': 'text/html;charset=utf-8',
    '.json': 'application/json',
    '.js': 'text/javascript;charset=utf-8',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.woff': 'application/x-font-woff',
    '.eot': 'application/vnd.ms-fontobject',
    '.ttf': 'application/actet-stream',
}

const staticMiddleWare = (pathname, res) => {
    fs.readFile(pathname, (err, content) => {
        if (err) {
            res.writeHead(404, {
                'content-type': 'text/plain'
            })
            res.write('file is no find')
            res.end()
        } else {
            res.writeHead(200, {
                'content-type': mime[path.extname(pathname)],
                // 设置此响应头字段 文件会被浏览器直接下载 不设置则浏览器打开文件
                // 'Content-Disposition': 'attachment;filename=' + path.basename(pathname),
            })
            res.write(content)
            res.end()
        }
    })
}

module.exports.staticMiddleWare = staticMiddleWare