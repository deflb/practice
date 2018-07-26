const fs = require('fs')
const path = require('path')
const mime = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.json': 'application/json',
    '.js': 'text/javascript',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.woff': 'application/x-font-woff',
    '.eot': 'application/vnd.ms-fontobject',
    '.ttf': 'application/octet-stream',
    '.ico': 'application/octet-stream',
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
            let contentType = mime[path.extname(pathname)];
            if (!mime[path.extname(pathname)]) {
                contentType = mime[path.extname(pathname.split(path.extname(pathname))[0])]
            }
            res.writeHead(200, {
                'content-type': contentType
            })
            res.write(content)
            res.end()
        }
    })
}

module.exports.staticMiddleWare = staticMiddleWare