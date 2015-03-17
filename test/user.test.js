var assert = require('assert');
var _ = require('lodash');
var User = require('../src/user');

describe('User ', function () {
    var user, util;

    beforeEach(function () {
        user = new User('_number_', '_password_');
        util = {
            url: 'someUrl',
            data: {0: 1},
            wait: false
        };
    });

    describe('#.ctor()', function () {
        it('should create the right object', function () {
            assert.equal('_number_', user._number_);
            assert.equal('_password_', user._password_);
            assert.equal(User._status_.idle, user._status_);
            assert.equal(1, _.keys(user._jar_).length);
        });
    });

    describe('#__login__()', function () {
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

        it('should send the post request and login success', function (done) {
            data['IDToken2'] = '811073';
            var meta = {
                url: url,
                jar: user._jar_,
                data: data
            };
            user.__login__(meta).nodeify(function (err, httpResponse) {
                assert.equal(302, httpResponse.statusCode);
                done();
            });
       });

        it('should send the post request and login fail', function (done) {
            data['IDToken2'] = '811074';
            var meta = {
                url: url,
                jar: user._jar_,
                data: data
            };
            user.__login__(meta).nodeify(function (err, httpResponse) {
                assert.equal(true, !!err);
                done();
            });
        });
    });

});