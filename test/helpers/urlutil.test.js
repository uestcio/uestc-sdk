var assert = require('assert');
var Urls = require('../../src/utils/urls');

describe('Urls ', function () {

    beforeEach(function () {
    });

    describe('#userLogin()', function () {
        it('should generate the meta', function () {
            var meta = Urls.userLogin('1', '2');
            assert.equal(true, !!meta);
        });
    });

    describe('#appSearchPeople()', function () {
        it('should generate the meta', function () {
            var meta = Urls.appSearchPeople({jar: 1}, '2', 3);
            assert.equal(true, !!meta);
        });
    });

});