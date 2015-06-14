var path = require('path');


var methods = [
    'rename',
    'renameSync',
    'truncate',
    'truncateSync',
    'chown',
    'chownSync',
    'lchown',
    'lchownSync',
    'chmod',
    'chmodSync',
    'lchmod',
    'lchmodSync',
    'stat',
    'lstat',
    'statSync',
    'lstatSync',
    'link',
    'linkSync',
    'symlink',
    'symlinkSync',
    'readlink',
    'readlinkSync',
    'realpath',
    'realpathSync',
    'unlink',
    'unlinkSync',
    'rmdir',
    'rmdirSync',
    'mkdir',
    'mkdirSync',
    'readdir',
    'readdirSync',
    'open',
    'openSync',
    'utimes',
    'utimesSync',
    'readFile',
    'readFileSync',
    'writeFile',
    'writeFileSync',
    'appendFile',
    'appendFileSync',
    'watchFile',
    'unwatchFile',
    'watch',
    'exists',
    'existsSync',
    'access',
    'accessSync',
    'createReadStream',
    'createWriteStream'
];


function linkfs(fs, from, to, mymethods) {
    from = path.resolve(from);
    to = path.resolve(to);
    mymethods = mymethods || methods;

    // Rewrite the path of the selected methods.
    var linkfs = {};
    for(var i = 0; i < mymethods.length; i++) {
        (function(method) {
            var func = fs[method];
            linkfs[method] = function() {
                var filepath = arguments[0];
                filepath = path.resolve(filepath);
                filepath = filepath.replace(from, to);
                arguments[0] = filepath;
                return func.apply(fs, arguments);
            };
        })(mymethods[i]);
    }

    // Just proxy the rest of the methods
    for(var method in fs) {
        (function(method) {
            var func = fs[method];
            if((typeof func == 'function') && (!linkfs[method])) {
                linkfs[method] = fs[method].bind(fs);
            }
        })(method);
    }

    return linkfs;
}


module.exports = linkfs;
