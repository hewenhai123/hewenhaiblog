
var crypto = require('crypto');
console.log(crypto.getHashes());
var s  = crypto.createHash('md5')
    .update('hello')
    .update('world').digest('hex');
