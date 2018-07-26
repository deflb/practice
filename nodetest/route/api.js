
const path = require('path')
const url = require('url')
const querystring = require('querystring')
const fs = require('fs')
const request = require('request')
const utils = require('./utils')
const serverRender = require('../serverRender')
const responseHeaders = {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'Authorization,Content-Type,X-Requested-With, X_Requested_Key',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
    'Access-Control-Allow-Origin': '*'
}
const responseSuccessData = {
    msgcode: 0,
    msg: 'success',
    data: null,
}
const responseErrorData = {
    data: null,
    msgcode: -1,
    msg: 'fail'
}
const getParsePostData = (req, res, callback) => {
    let reqData = '';
    req.on('data', data => {
        reqData += data
    })
    req.on('end', () => {
        reqData = reqData && JSON.parse(reqData.toString())
        if (reqData) {
            callback(reqData)
        }
    })
}
const handleGet = {
    '/': (req, res) => {
        res.writeHead(302, {
            'Location': '/test/index.html'
        })
        res.end()
    },
    '/script': (req, res) => {
        let query = url.parse(req.url, true).query
        res.writeHead(200, {
            'content-type': 'text/plain'
        })
        res.end(`${query.callback}(${JSON.stringify({ callback: query.callback })})`)
    },
    '/iframe': (req, res) => {
        res.writeHead(200, {
            'content-type': 'text/html;charset=UTF-8'
        })

        res.end(`
        <!DOCTYPE html>
                    <html>
                        <head>
                            <title>render</title>
                        </head>
                        <body>
                            ${new Date()}
                        </body>
                        <script>
                        window.top.iframeToLoop(${JSON.stringify({ name: new Date() })})
                        </script>
                    </html>
        `)

    },
    '/serverRender': (req, res) => {
        let pathname = url.parse(req.url).pathname, query = url.parse(req.url, true).query;
        serverRender.render(pathname.split('/serverRender')[1], query, res)
    },
    '/product': (req, res) => {
        let query = url.parse(req.url, true).query
        fs.readFile(path.resolve('data', 'index.json'), (err, content) => {
            if (err || !query.id)
                handleError['/404'](req, res)
            else {
                let output = JSON.parse(content).product[query.id]
                res.writeHead(200, responseHeaders)
                res.end(JSON.stringify(output))
            }
        })
    },
}

const handleOptions = {
    '/login': (req, res) => {
        res.writeHead(200, responseHeaders)
        res.end()
    },
    '/logout': (req, res) => {
        res.writeHead(200, responseHeaders)
        res.end()
    },
}

const handlePost = {
    '/login': (req, res) => {
        getParsePostData(req, res, (data) => {
            let uuid = data.username + data.password
            res.setHeader('Set-Cookie', utils.setCookie('uuid', uuid, 10 * 60 * 1000))
            // request.post('http://192.168.5.105:9999/auth/sso/login', {
            //     form: {
            //         captcha: '',
            //         captchaKey: 'RA8XR7WVF937',
            //         merchantCode: 'cds',
            //         password: 'xxxxxxxxx',
            //         userName: 'admin',
            //         loginType: 1
            //     },
            //     json: true
            // }, (err, login_response, data) => {
            //     res.writeHead(200, responseHeaders)
            //     responseSuccessData.msgcode = 0
            //     responseSuccessData.data = data.data
            //     res.end(JSON.stringify(responseSuccessData))
            // })
            res.writeHead(200, responseHeaders)
            responseSuccessData.msgcode = 0
            responseSuccessData.data = data.username
            res.end(JSON.stringify(responseSuccessData))
        })
    },
    '/logout': (req, res) => {
        getParsePostData(req, res, (data) => {
            if (data.username && data.password) {
                res.setHeader('Set-Cookie', utils.setCookie('uuid', null, -1))
                res.writeHead(200, responseHeaders)
                responseSuccessData.msgcode = 0
                responseSuccessData.data = 'logout success'
                res.end(JSON.stringify(responseSuccessData))
            } else
                handleError['/404'](req, res)
        })
    },
    '/product': (req, res) => {
        getParsePostData(req, res, (data) => {
            let cookie = req.headers.cookie;
            if (cookie && utils.parseCookie('uuid', cookie)) {
                fs.readFile(path.resolve('data', 'index.json'), (err, content) => {
                    if (!err && data.id) {
                        let output = JSON.parse(content).product[data.id]
                        res.writeHead(200, responseHeaders)
                        res.end(JSON.stringify(output))
                    } else
                        handleError['/404'](req, res)
                })
            } else {
                res.writeHead(200, responseHeaders)
                responseSuccessData.msgcode = 400
                responseSuccessData.data = 'your not access'
                res.end(JSON.stringify(responseSuccessData))
            }
        })
    }
}

const handleError = {
    '/404': (req, res) => {
        res.writeHead(404, {
            'content-type': 'text/plain'
        })
        res.write('source is no find')
        res.end()
    },
}

const get = (req, res) => {
    let pathname = url.parse(req.url).pathname
    pathname = pathname === '/' ? '/' : pathname.match(/^\/\w+/)[0]
    if (utils.toString.call(handleGet[pathname.split('?')[0]]) === '[object Function]') {
        console.log(pathname.split('?')[0])
        handleGet[pathname.split('?')[0]](req, res)
    } else
        handleError['/404'](req, res)
}

const options = (req, res) => {
    let pathname = url.parse(req.url).pathname
    if (utils.toString.call(handlePost[pathname]) === '[object Function]') {
        handlePost[pathname](req, res)
    } else
        handleError['/404'](req, res)
}

const post = (req, res) => {
    let pathname = url.parse(req.url).pathname
    if (utils.toString.call(handlePost[pathname]) === '[object Function]') {
        handlePost[pathname](req, res)
    } else
        handleError['/404'](req, res)
}

module.exports = {
    options,
    post,
    get
}