import {link} from '../src';
import {Volume} from '../../memfs/src';


const vol = Volume.fromJSON({'/foo': 'bar'});
const linkfs = link(vol, [['/foo2', '/foo']]);
console.log(linkfs.readFileSync('/foo2', 'utf8'));
