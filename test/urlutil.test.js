var assert = require('assert');
var Promise = require('promise');
var UrlUtil = require('../src/urlutil');

describe('UrlUtil ', function () {

    beforeEach(function () {
    });

    describe('#getUserLoginMeta()', function (done) {
        it('should generate the right meta', function () {
            var meta = UrlUtil.getUserLoginMeta('1', '2');
            assert.equal('https://uis.uestc.edu.cn/amserver/UI/Login', meta.url);
            assert.equal('', meta.data['IDToken0']);
            assert.equal('1', meta.data['IDToken1']);
            assert.equal('2', meta.data['IDToken2']);
            assert.equal('Submit', meta.data['IDButton']);
            assert.equal('aHR0cDovL3BvcnRhbC51ZXN0Yy5lZHUuY24vbG9naW4ucG9ydGFs', meta.data['goto']);
            assert.equal('true', meta.data['encoded']);
            assert.equal('UTF-8', meta.data['gx_charset']);
        });
    });

    xdescribe('#getApplicationSearchPersonMeta()', function () {
        it('should generate the right meta', function () {
            var meta = UrlUtil.getApplicationSearchPersonMeta({cookies: 1}, '2', 3);
            assert.equal('http://portal.uestc.edu.cn/pnull.portal?action=fetchUsers&.ia=false&.f=f20889&.pmn=view&.pen=personnelGroupmanager', meta.url);
            assert.equal(0, meta.data['start']);
            assert.equal(3, meta.data['limit']);
            assert.equal('normal_user', meta.data['oper_type']);
            assert.equal(1, meta.cookies);
        });
    });

});