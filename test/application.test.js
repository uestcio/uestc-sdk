var assert = require('assert');
var Promise = require('promise');
var uestc = require('../src/uestc');

describe('Application ', function () {
    var app, carrier;

    beforeEach(function () {
        app = uestc();
        carrier = {
            'log': {},
            'post': function (url, data) {
                carrier.log = {
                    'method': 'POST',
                    'url': url,
                    'data': data
                };
                return Promise.resolve(null);
            }
        };
        app._carrier_ = carrier;
    });

    describe('#identify()', function () {
        it('should request for the login url', function (done) {
            app.identify('2012019050031', '12345678').then(function () {
                assert.equal('POST', carrier.log.method);
                assert.equal('https://uis.uestc.edu.cn/amserver/UI/Login', carrier.log.url);
                assert.equal('2012019050031', carrier.log.data['IDToken1']);
                done();
            });
        });
    });

    describe('#reset()', function () {
        it('should reset all the properties', function () {
            app.reset();
            assert.equal(0, app.users.length);
            assert.equal(null, app.users.current);
        });
    });
});