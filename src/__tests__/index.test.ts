import {link} from '../index';
import {Volume} from 'memfs';


describe('rewrite(fs, rewrites)', () => {
    it('Simple rewrite', () => {
        const vol = Volume.fromJSON({'/foo': 'bar'});
        const lfs = link(vol, ['/lol', '/foo']);
        expect(lfs.readFileSync('/lol', 'utf8')).toBe('bar');
    });

    it('Each path step should be rewritten completely', () => {
        const vol = Volume.fromJSON({'/foo/bar': 'hello'});
        const lfs = link(vol, ['/lol', '/fo']);
        let hello;
        try {
            hello = lfs.readFileSync('/lolo/bar', 'utf8');
            throw Error('This should not throw');
        } catch(err) {
            expect(err.code).toBe('ENOENT');
        }
    });

    it('Invalid rewrite routes argument throws', () => {
        const vol = Volume.fromJSON({'/foo/bar': 'hello'});
        try {
            const lfs = link(vol, 123 as any);
            throw Error('not_this');
        } catch(err) {
            expect(err.message === 'not_this').toBe(false);
        }
    });

    it('Invalid path argument gets proxied', () => {
        const vol = Volume.fromJSON({'/foo/bar': 'hello'});
        try {
            const lfs = link(vol, ['/lol', '/foo']);
            lfs.readFileSync(123, 'utf8');
            throw Error('This should not throw');
        } catch(err) {
            expect(err.code).toBe('EBADF');
        }
    });

    it('rewrites multi-step paths', () => {
        const vol = Volume.fromJSON({
            '/1/2/3/4': 'foo'
        });
        const lfs = link(vol, ['/lol', '/1/2/3']);

        expect(lfs.readFileSync('/lol/4', 'utf8')).toBe('foo');
    });

    it('rewrites root path', () => {
        const vol = Volume.fromJSON({
            '/1/2/3/4': 'foo'
        });
        const lfs = link(vol, ['/', '/1/2/3']);

        expect(lfs.readFileSync('/4', 'utf8')).toBe('foo');
    });

    it('handles file rename', () => {
        const vol = Volume.fromJSON({
            '/1/2/3/4': 'foo'
        });

        const lfs = link(vol, ['/', '/1/2/3']);

        lfs.renameSync('/4', '/5');

        expect(lfs.readFileSync('/5', 'utf8')).toBe('foo');
    })
});
