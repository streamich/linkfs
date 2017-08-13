import {link} from '../src';
import {Volume} from '../../memfs/src';


const vol = Volume.fromJSON({'/foo/bar': 'hello'});
const lfs = link(vol, [
    ['/a', '/lol/bar'],
    ['/lol', '/abc'],
    ['/abc', '/foo'],
    ['/hello', '/foo/bar'],
]);


console.log(lfs.readFileSync('/abc/bar', 'utf8'));


console.log(lfs.readFileSync('/lol/bar', 'utf8'));


console.log(lfs.readFileSync('/hello', 'utf8'));


console.log(lfs.readFileSync('/a', 'utf8'));

