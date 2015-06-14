var linkfs = require('./index');
var fs = require('fs');
var unionfs = require('../unionfs/index');



var mylinkfs = linkfs(fs, '/mylib.com', __dirname);
unionfs
    .use(fs)
    .use(mylinkfs)
    .replace(fs);


//console.log(unionfs.readFileSync('/test/example.js').toString());
//console.log(unionfs.readFileSync(__dirname + '/hello-world.js').toString());
//require(__dirname + '/hello-world.js');
require('/mylib.com/hello-world.js');

//myfs.readFile('/test/example.js', function(err, buff) {
//    console.log(buff.toString());
//});
