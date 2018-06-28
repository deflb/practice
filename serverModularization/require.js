'use strict';
let ex = require('./exports.js')
console.log(ex)

ex.a()
console.log(ex.b.__b)
ex.b.__b = 666
console.log(ex.b._b)
console.log(ex.b.__b)