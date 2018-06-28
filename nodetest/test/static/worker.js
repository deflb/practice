let data;
onmessage = (event) => {
    data = event.data
}
function loop() {
    let timer = setTimeout('loop()', 500)
    if (data > 10) {
        clearTimeout(timer)
        timer = null
        postMessage(data)
    }
    data += 1;
}
loop()