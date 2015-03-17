var assert = require('assert');
var Promise = require('promise');
var _ = require('lodash');
var uestc = require('../src/uestc');


describe('Application ', function () {
    var app;

    beforeEach(function () {
        app = uestc();
    });

    describe('#.ctor()', function () {
        it('should create the right object', function () {
            assert.equal(0, _.keys(app.users).length);
            assert.equal(null, app.current);
            assert.equal(false, !app._request_);
        });
    });

    describe('#__broke__()', function () {
        it('should request for the login url', function (done) {
            var user = app.__broke__('2012019050020', '811073')
                .then(function () {
                    done();
            });
        });
    });

    describe('#searchForCourse()', function () {
        it('should get the courses', function (done) {
            var options = {
                instructor: '徐世中'
            };
            app.__broke__('2012019050020', '811073').nodeify(function () {
                app.searchForCourse(options).nodeify(function (err, courses) {
                    assert.equal('徐世中', courses[0].instructor);
                    done();
                });
            });
        });
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