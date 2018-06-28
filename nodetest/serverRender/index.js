const utlis = require('../route/utils')
const renderMatch = {
    '/chrome': (pathname, query, res) => {
        res.writeHead(200, {
            'Content-type': 'text/html;charset=utf-8'
        })
        res.end(`
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <title>render</title>
                        </head>
                        <body>${pathname}${JSON.stringify(query)}</body>
                    </html>
                `)
    },
    '/firefox': (pathname, query, res) => {
        res.writeHead(200, {
            'Content-type': 'text/html;charset=utf-8'
        })
        res.end(`
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <title>render</title>
                            <link href='/static/index.css' rel='stylesheet' />
                        </head>
                        <body></body>
                        <script src='/static/index.js'></script>
                        <script>
                            window.onload=() => {
                                let button = document.createElement('button')
                                button.textContent = 'click me'
                                button.onclick=() => {
                                    let time = new Date().getTime()
                                    location.href='http://localhost:8888/serverRender/chrome?form=firefox&time='+time
                                }
                                document.body.innerHTML = '<div id="root">${pathname}${JSON.stringify(query)}</div>'
                                document.getElementById('root').appendChild(button)
                            }
                        </script>
                    </html>
                `)
    },
}

const render = (pathname, query, res) => {
    if (utlis.toString.call(renderMatch[pathname]) === '[object Function]') {
        renderMatch[pathname](pathname, query, res)
    } else {
        res.writeHead(404, { 'Content-type': 'text/html' })
        res.end('not find')
    }
}


module.exports = {
    render
}