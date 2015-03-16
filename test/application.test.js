var assert = require('assert');
var Promise = require('promise');
var uestc = require('../src/uestc');

describe('Application ', function () {
    var app;

    beforeEach(function () {
        app = uestc();
    });

    describe('#identify()', function () {
        it('should request for the login url', function () {
            var user = app.identify('2012019050031', '12345678');
            assert.equal('2012019050031', user.number);
        });
    });

    describe('#reset()', function () {
        it('should reset all the properties', function () {
            app.reset();
            assert.equal(null, app.users.current);
        });
    });
});