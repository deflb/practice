setTimeout(function () {
    console.log('is settimeout1')
}, 0)

for (let i = 0; i < 50000; i++) {
    console.log(i)
}
console.log('is a')

setTimeout(function () {
    console.log('is settimeout2')
}, 0)