var assert = require('assert');
var Promise = require('promise');
var User = require('../src/user');

describe('User ', function () {
    var user, util, carrier;

    beforeEach(function () {
        user = new User('number', 'password');
        util = {
            url: 'someUrl',
            data: {0: 1},
            wait: false
        };
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
    });

    describe('#login()', function (done) {
        it('should call the right method and pass params', function () {
            user.login(util, carrier.post).then(function () {
                    assert.equal('POST', carrier.log.method);
                    assert.equal(util.url, carrier.log.url);
                    assert.equal(util.data, carrier.log.data);
                }).then(done);
        });
    });

    describe('#setCookies()', function () {
        it('should set the cookie right', function () {
            user.setCookies([1, 2]);
            assert.equal(2, user.cookies.length);
            assert.equal(1, user.cookies[0]);
            assert.equal(2, user.cookies[1])
        });
    });

});