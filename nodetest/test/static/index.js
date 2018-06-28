let work = new Worker('/static/worker.js')
work.postMessage(1)

work.onmessage = (event) => {
    alert('web worker is done' + event.data)
}

function ajax({
    method = 'POST',
    responseType,
    url, data = {},
    header = { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain, */*' },
    success, fail }) {
    let xhr = new XMLHttpRequest()
    xhr.onerror = (err) => {
        console.log(err)
    }
    xhr.onprogress = (d) => {
        console.log(d)
    }
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            !responseType || responseType === 'text' ? success(xhr.responseText) : success(responseType === 'json' ? JSON.parse(xhr.response) : xhr.response)
        }
    }
    xhr.open(method.toUpperCase(), 'http://localhost:8888' + url, true)

    Object.keys(header).forEach(item => {
        if (typeof data === 'undefined' && item.toLowerCase() === 'content-type') {
            delete header[item]
        }
        xhr.setRequestHeader(item, header[item])
    })

    xhr.send(JSON.stringify(data))
}
