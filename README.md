# linkfs

Rewrite file system `fs` paths.

```javascript
var linkfs = require('linkfs');
var fs = require('fs');

var mylinkfs = linkfs(fs, '/mylib.com', __dirname);
// Now you can do:
console.log(mylinkfs.readFileSync('/mylib.com/index.js').toString());
```

Use it together with [`unionfs`](http://www.npmjs.com/package/unionfs) to overwrite the original `fs` module.

This way you can create custom `require` paths:

```javascript
var unionfs = require('unionfs');

unionfs
    .use(fs)
    .use(mylinkfs)
    .replace(fs);
    
require('/mylib.com/index.js);
```
