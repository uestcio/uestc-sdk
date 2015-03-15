var assert = require('assert');
var uestc = require('../lib/uestc');

describe('Application ', function() {
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

    describe('#login()', function() {
        it('should request for the login url', function() {
            app.login('2012019050031', '12345678');
            assert.equal('POST', carrier.log.method);
            assert.equal('https://uis.uestc.edu.cn/amserver/UI/Login', carrier.log.url);
            assert.equal('2012019050031', carrier.log.data['IDToken1']);
        });
    });
});