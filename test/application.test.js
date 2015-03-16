var assert = require('assert');
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
                }
            }
        };
        app._carrier_ = carrier;
    });

    describe('#identify()', function () {
        it('should request for the login url', function () {
            app.identify('2012019050031', '12345678');
            assert.equal('POST', carrier.log.method);
            assert.equal('https://uis.uestc.edu.cn/amserver/UI/Login', carrier.log.url);
            assert.equal('2012019050031', carrier.log.data['IDToken1']);
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