# linkfs

Redirects filesystem paths.

[![][npm-img]][npm-url]

    npm install --save linkfs

```js
import {link} from 'linkfs';
import {fs} from 'memfs';

fs.writeFileSync('/foo', 'bar');
const lfs = link(fs, ['/foo2', '/foo']);
console.log(lfs.readFileSync('/foo2', 'utf8')); // bar
```

# Reference

### `link(fs, rewrites)`

Returns a new *fs-like* object with redirected file paths.

`fs` is the source *fs-like* object.

`rewrites` is a 2-tuple or an array of 2-tuples, where each 2-tuple
has a form of `[from, to]`. `from` is the new, *virtual* path; and `to`
is an existing path in the `fs` filesystem.

```js
const lfs = link(fs, ['/foo', '/bar']);
```

or

```js
const lfs = link(fs, [
    ['/foo1', '/bar1'],
    ['/foo2', '/bar2'],
    ['/foo3', '/bar3'],
]);
```

[npm-url]: https://www.npmjs.com/package/linkfs
[npm-img]: https://img.shields.io/npm/v/linkfs.svg
[memfs]: https://github.com/streamich/memfs
[unionfs]: https://github.com/streamich/unionfs
[linkfs]: https://github.com/streamich/linkfs
[fs-monkey]: https://github.com/streamich/fs-monkey





# License

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>