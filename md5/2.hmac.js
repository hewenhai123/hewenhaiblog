

var crypto = require('crypto');

var s = crypto.createHmac('md5','333')
    .update('hello').digest('hex');

console.log(s);