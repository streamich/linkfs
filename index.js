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


function linkfs(fs, rewrites, mymethods) {
    var myrewrites = {};
    for(var from in rewrites) {
        myrewrites[path.resolve(from)] = path.resolve(rewrites[from]);
    }

    mymethods = mymethods || methods;

    // Rewrite the path of the selected methods.
    var linkfs = {};
    for(var i = 0; i < mymethods.length; i++) {
        (function(method) {
            var func = fs[method];
            linkfs[method] = function() {
                var filepath = arguments[0];
                filepath = path.resolve(filepath);

                for(var from in myrewrites) {
                    if(filepath.indexOf(from) === 0) {
                        filepath = filepath.replace(from, myrewrites[from]);
                        break;
                    }
                }

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
