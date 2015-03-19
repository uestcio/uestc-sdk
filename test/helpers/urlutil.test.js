var assert = require('assert');
var UrlUtil = require('../../src/helpers/urlutil');

describe('UrlUtil ', function () {

    beforeEach(function () {
    });

    describe('#getUserLoginMeta()', function () {
        it('should generate the meta', function () {
            var meta = UrlUtil.getUserLoginMeta('1', '2');
            assert.equal(true, !!meta);
        });
    });

    describe('#getAppSearchPeopleMeta()', function () {
        it('should generate the meta', function () {
            var meta = UrlUtil.getAppSearchPeopleMeta({jar: 1}, '2', 3);
            assert.equal(true, !!meta);
        });
    });

});