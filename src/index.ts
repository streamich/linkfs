import {resolve} from 'path';


export const props = [
    'constants',
    'F_OK',
    'R_OK',
    'W_OK',
    'X_OK',
    'Stats',
];

export const rewritableMethods = [
    'accessSync',
    'access',
    'appendFileSync',
    'appendFile',
    'chmodSync',
    'chmod',
    'chownSync',
    'chown',
    'createReadStream',
    'createWriteStream',
    'existsSync',
    'exists',
    'lchmodSync',
    'lchmod',
    'lchownSync',
    'lchown',
    'linkSync',
    'link',
    'lstatSync',
    'lstat',
    'mkdirSync',
    'mkdir',
    'mkdtempSync',
    'mkdtemp',
    'openSync',
    'open',
    'readdirSync',
    'readdir',
    'readFileSync',
    'readFile',
    'readlinkSync',
    'readlink',
    'realpathSync',
    'realpath',
    'renameSync',
    'rename',
    'rmdirSync',
    'rmdir',
    'statSync',
    'stat',
    'symlinkSync',
    'symlink',
    'truncateSync',
    'truncate',
    'unlinkSync',
    'unlink',
    'unwatchFile',
    'utimesSync',
    'utimes',
    'watch',
    'watchFile',
    'writeFileSync',
    'writeFile',
];

export const proxyableMethods = [
    'ftruncateSync',
    'fchownSync',
    'fchmodSync',
    'fstatSync',
    'closeSync',
    'futimesSync',
    'fsyncSync',
    'writeSync',
    'readSync',
    'fdatasyncSync',
    'ftruncate',
    'fchown',
    'fchmod',
    'fstat',
    'close',
    'futimes',
    'fsync',
    'write',
    'read',
    'fdatasync',
    '_toUnixTimestamp',
];


export function rewrite(fs, rewrites: [string, string][]) {

    if(!(rewrites instanceof Array))
        throw TypeError('rewrites must be a list of 2-tuples');

    // All for only one tuple to be provided.
    if(typeof rewrites[0] === 'string')
        rewrites = [rewrites] as any as [string, string][];

    const rews: [string, string][] = [];
    for(const [from, to] of rewrites) {
        rews.push([resolve(from), resolve(to)]);
    }

    let linkfs = {};

    // Attach some props.
    for(const prop of props) linkfs[prop] = fs[prop];

    // Rewrite the path of the selected methods.
    for(const method of rewritableMethods) {
        const func = fs[method];
        if(typeof func !== 'function') continue;

        linkfs[method] = (...args) => {
            const path = args[0];

            // If first argument is not a path, just proxy the function.
            if((typeof path !== 'string') && !Buffer.isBuffer(path)) {
                if(!require('url') || !(path instanceof require('url').URL))
                    return func.apply(fs, args);
            }

            // Rewrite the path argument.
            let filename = resolve(String(path));
            for(const [from, to] of rews) {
                if(filename.indexOf(from) === 0) {
                    filename = filename.replace(from, to);
                }
            }

            args[0] = filename;
            return func.apply(fs, args);
        };
    }

    // Just proxy the rest of the methods.
    for(const method of proxyableMethods) {
        const func = fs[method];
        if(typeof func !== 'function') continue;

        linkfs[method] = func.bind(fs);
    }

    return linkfs;
}
