var assert = require('assert');
var Carrier = require('../lib/carrier');

describe('Carrier ', function() {
    var carrier;

    beforeEach(function () {
        carrier = Carrier.singleton();
    });

    describe('#getMeta()', function() {
        it('should get the correct host and path', function() {
            var url = 'https://uis.uestc.edu.cn/amserver/UI/Login';
            var meta = Carrier.getMeta(url);
            assert.equal('https', meta.protocol);
            assert.equal('uis.uestc.edu.cn', meta.host);
            assert.equal('/amserver/UI/Login', meta.path)
        });
    });

    describe('#post()', function() {
        var url, data;

        beforeEach(function () {
            url = 'https://uis.uestc.edu.cn/amserver/UI/Login';
            data = {
                'IDToken0': '',
                'IDToken1': '2012019050020',
                'IDToken2': '',
                'IDButton': 'Submit',
                'goto': 'aHR0cDovL3BvcnRhbC51ZXN0Yy5lZHUuY24vbG9naW4ucG9ydGFs',
                'encoded': true,
                'gx_charset': 'UTF-8'
            };
        });

        it('should send the post request and login success', function(done) {
            data['IDToken2'] = '811073';
            carrier.post(url, data, false, function (err, meta) {
                assert.equal(302, meta.status);
                done();
            });
        });

        it('should send the post request and login fail', function(done) {
            data['IDToken2'] = '811074';
            carrier.post(url, data, false, function (err, meta) {
                assert.equal(200, meta.status);
                done();
            });
        });
    });
});