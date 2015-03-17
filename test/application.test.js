var assert = require('assert');
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
            assert.equal(0, _.keys(app.courses).length);
            assert.equal(0, _.keys(app.notices).length);
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

    describe('#identify()', function () {
        it('should generate the right user', function () {
            var user = app.identify('2012019050031', '12345678');
            assert.equal('2012019050031', user.number);
            assert.equal(user, app.users[user.number]);
        });

        it('should keep the same user', function () {
            var user1 = app.identify('2012019050031', '12345678');
            var user2 = app.identify('2012019050031', '12345678');
            assert.equal(user1, user2);
        })
    });

    describe('#searchForCourses()', function () {
        it('should get the courses', function (done) {
            var options = {
                instructor: '徐世中'
            };
            app.__broke__('2012019050020', '811073').nodeify(function () {
                app.searchForCourses(options).nodeify(function (err, courses) {
                    assert.equal('徐世中', courses[0].instructor);
                    done();
                });
            });
        });
    });

    describe('#reset()', function () {
        it('should reset all the properties', function () {
            app.reset();
            assert.equal(null, app.users.current);
        });
    });
});