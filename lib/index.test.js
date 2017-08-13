"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var memfs_1 = require("memfs");
var chai_1 = require("chai");
describe('rewrite(fs, rewrites)', function () {
    it('Simple rewrite', function () {
        var vol = memfs_1.Volume.fromJSON({ '/foo': 'bar' });
        var lfs = index_1.link(vol, ['/lol', '/foo']);
        chai_1.expect(lfs.readFileSync('/lol', 'utf8')).to.equal('bar');
    });
    it('Each path step should be rewritten completely', function () {
        var vol = memfs_1.Volume.fromJSON({ '/foo/bar': 'hello' });
        var lfs = index_1.link(vol, ['/lol', '/fo']);
        var hello;
        try {
            hello = lfs.readFileSync('/lolo/bar', 'utf8');
            throw Error('This should not throw');
        }
        catch (err) {
            chai_1.expect(err.code).to.equal('ENOENT');
        }
    });
    it('Invalid rewrite routes argument throws', function () {
        var vol = memfs_1.Volume.fromJSON({ '/foo/bar': 'hello' });
        try {
            var lfs = index_1.link(vol, 123);
            throw Error('not_this');
        }
        catch (err) {
            chai_1.expect(err.message === 'not_this').to.be.false;
        }
    });
    it('Invalid path argument gets proxied', function () {
        var vol = memfs_1.Volume.fromJSON({ '/foo/bar': 'hello' });
        try {
            var lfs = index_1.link(vol, ['/lol', '/foo']);
            lfs.readFileSync(123, 'utf8');
            throw Error('This should not throw');
        }
        catch (err) {
            chai_1.expect(err.code).to.equal('EBADF');
        }
    });
});
