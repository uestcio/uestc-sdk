var assert = require('assert');
var _ = require('lodash');
var Promise = require('promise');
var User = require('../src/user');
var UrlUtil = require('../src/helpers/urlutil');
var StdDetail = require('../src/structure/stddetail');

describe('User ', function () {
    var user;

    beforeEach(function () {
        user = new User('2012019050020', '811073');
    });

    describe('#.ctor()', function () {
        it('should create the right object', function () {
            assert.equal('2012019050020', user._number_);
            assert.equal('811073', user._password_);
            assert.equal(User.status.idle, user._status_);
            assert.equal(1, _.keys(user._jar_).length);
        });
    });

    describe('#__cacheCourses__()', function () {
        var courses;

        beforeEach(function () {
            courses = [];
            courses[0] = {id: '1', merged: false};
            courses[1] = {id: '2', merged: false};
            courses[0].__merge__ = courses[1].__merge__ = function (course) {
                this.merged = true;
            }
        });

        it('should be able to cache', function () {
            courses = user.__cacheCourses__(courses);
            assert.equal(2, _.keys(user._courses_).length);
        });

        it('should return the new courses', function () {
            var newCourses = user.__cacheCourses__(courses);
            assert.equal(2, newCourses.length);
        });

        it('should merge if get the same id', function () {
            user.__cacheCourses__(courses);
            user.__cacheCourses__([{id: '1'}]);
            assert.equal(true, user._courses_['1'].merged);
        });
    });

    describe('#__ensureLogin__()', function () {

        beforeEach(function () {
            user.__reset__();
        });

        it('should send ensure login when idle', function (done) {
            user.__ensureLogin__().nodeify(function () {
                assert.equal(User.status.loginSuccess, user._status_);
                done();
            })
        });

        it('should send ensure login when login success', function (done) {
            user.__login__(UrlUtil.getUserLoginMeta('2012019050020', '811073')).nodeify(function () {
                user.__ensureLogin__().nodeify(function () {
                    assert.equal(User.status.loginSuccess, user._status_);
                    done();
                })
            })
        });
    });

    describe('#__getAllCourses__()', function () {

        beforeEach(function () {
            user.__getSemesterCourses__ = function () {
                var id = 0;
                return Promise.resolve([{id: (id++).toString()}]);
            };
        });

        it('should get the all courses when online', function (done) {
            user.__getAllCourses__().nodeify(function (err, courses) {
                err && console.log(err);
                assert.equal(8, courses.length);
                done();
            });
        });
    });

    describe('#__getAllCoursesOffline__()', function () {

        beforeEach(function () {
            user._courses_ = {
                '1': {id: '1'},
                '2': {id: '2'}
            }
        });

        it('should be able to get local courses', function (done) {
            user.__getAllCoursesOffline__().nodeify(function (err, courses) {
                assert.equal(2, courses.length);
                done();
            });
        });
    });

    describe('#__getAllScores__()', function () {

        it('should get the all scores', function (done) {
            user.__getAllScores__().nodeify(function (err, courses) {
                err && console.log(err);
                assert.equal(52, courses.length);
                done();
            });
        });
    });

    describe('#__getDetailOffline__()', function () {
        var detail;

        beforeEach(function () {
            detail = new StdDetail('2012019050020');
            user._detail_ = detail;
        });

        it('should be able to get local meets options', function (done) {
            user.__getDetailOffline__().nodeify(function (err, detail) {
                assert.equal('2012019050020', detail.id);
                done();
            });
        });
    });

    describe('#__getDetailOnline__()', function () {
        it('should get the detail', function (done) {
            user.__getDetailOnline__().nodeify(function (err, detail) {
                assert.equal('刘建翔', detail.name);
                done();
            });
        });
    });

    describe('#__getSemesterCourses__()', function () {

        beforeEach(function () {
            user._testRes_ = {
                online: false,
                offline: false
            };

            user.__getSemesterCoursesOnline__ = function () {
                user._testRes_.online = true;
                return Promise.resolve([]);
            };

            user.__getSemesterCoursesOffline__ = function () {
                user._testRes_.offline = true;
                return Promise.resolve([]);
            };
        });

        it('should get the semester courses if online', function (done) {
            user.__getSemesterCourses__(43).nodeify(function (err, courses) {
                assert.equal(true, user._testRes_.online);
                assert.equal(false, user._testRes_.offline);
                done();
            });
        });

        it('should get the semester courses if offline', function (done) {
            user.__getSemesterCoursesOnline__ = function () {
                user._testRes_.online = true;
                return Promise.reject(new Error(''));
            };

            user.__getSemesterCourses__(43).nodeify(function (err, courses) {
                assert.equal(true, user._testRes_.online);
                assert.equal(true, user._testRes_.offline);
                done();
            });
        });
    });

    describe('#__getSemesterCoursesOffline__()', function () {

        beforeEach(function () {
            user._courses_ = {
                '1': {id: '1', _semester_: 43},
                '2': {id: '2', _semester_: 84}
            };
        });

        it('should be able to get local courses', function (done) {
            user.__getSemesterCoursesOffline__(43).nodeify(function (err, courses) {
                assert.equal(1, courses.length);
                done();
            });
        });
    });

    describe('#__getSemesterCoursesOnline__()', function () {
        it('should get the semester courses online', function (done) {
            user.__getSemesterCoursesOnline__(43).nodeify(function (err, courses) {
                err && console.log(err);
                assert.equal(12, courses.length);
                assert.equal(3, _.findWhere(courses, {id: 'E0100650.17'}).durations.length);
                done();
            });
        });
    });

    describe('#__getSemesterScores__()', function () {

        it('should get the semester scores', function (done) {
            user.__getSemesterScores__(43).nodeify(function (err, courses) {
                err && console.log(err);
                assert.equal(12, courses.length);
                done();
            });
        });
    });

    describe('#__login__()', function () {
        var url, form;

        beforeEach(function () {
            url = 'https://uis.uestc.edu.cn/amserver/UI/Login';
            form = {
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
            form['IDToken2'] = '811073';
            var meta = {
                url: url,
                jar: user._jar_,
                form: form
            };
            user.__login__(meta).nodeify(function (err, res) {
                assert.equal(false, !!err);
                done();
            });
        });

        it('should send the post request and login fail', function (done) {
            form['IDToken2'] = '811074';
            var meta = {
                url: url,
                jar: user._jar_,
                form: form
            };
            user.__login__(meta).nodeify(function (err, res) {
                assert.equal(true, !!err);
                done();
            });
        });
    });

    describe('#__reset__()', function () {
        it('should be idle after reset', function () {
            user.__reset__();
            assert.equal(User.status.idle, user._status_);
        });

        it('should not change number and password', function () {
            user.__reset__();
            assert.equal('2012019050020', user._number_);
        });
    });

    describe('#getCourses()', function () {
        beforeEach(function () {
            user._testRes_ = {
                allCourses: false,
                semCourses: false
            };

            user.__getAllCourses__ = function () {
                user._testRes_.allCourses = true;
                return Promise.resolve([]);
            };

            user.__getSemesterCourses__ = function () {
                user._testRes_.semCourses = true;
                return Promise.resolve([]);
            };
        });

        it('should get the all courses and scores if semester is 0', function (done) {
            user.getCourses(0).nodeify(function (err, courses) {
                assert.equal(true, user._testRes_.allCourses);
                assert.equal(false, user._testRes_.semCourses);
                done();
            });
        });

        it('should get the semester courses if semester is not 0', function (done) {
            user.getCourses(2012, 1).nodeify(function (err, courses) {
                assert.equal(false, user._testRes_.allCourses);
                assert.equal(true, user._testRes_.semCourses);
                done();
            });
        });
    });

    describe('#getDetail()', function () {
        beforeEach(function () {
            user._testRes_ = {
                online: false,
                local: false
            };
        });

        it('should get the detail online when could connect', function (done) {
            user.__getDetailOnline__ = function () {
                user._testRes_.online = true;
                return Promise.resolve([]);
            };

            user.__getDetailOffline__ = function () {
                user._testRes_.local = true;
                return Promise.resolve([]);
            };

            user.getDetail().nodeify(function (err, detail) {
                assert.equal(true, user._testRes_.online);
                assert.equal(false, user._testRes_.local);
                done();
            });
        });

        it('should get the detail local when could not connect', function (done) {
            user.__getDetailOnline__ = function () {
                user._testRes_.online = true;
                return Promise.reject(new Error(''));
            };

            user.__getDetailOffline__ = function () {
                user._testRes_.local = true;
                return Promise.resolve([]);
            };

            user.getDetail().nodeify(function (err, detail) {
                assert.equal(true, user._testRes_.online);
                assert.equal(true, user._testRes_.local);
                done();
            });
        });
    });

    describe('#getGrade()', function () {

        it('should get the right grade', function () {
            var grade = user.getGrade();
            assert.equal(2012, grade);
        });
    });

    describe('#getScores()', function () {
        beforeEach(function () {
            user._testRes_ = {
                allScores: false,
                semScores: false
            };

            user.__getAllScores__ = function () {
                user._testRes_.allScores = true;
                return Promise.resolve([]);
            };

            user.__getSemesterScores__ = function () {
                user._testRes_.semScores = true;
                return Promise.resolve([]);
            };
        });

        it('should get the all scores and scores if semester is 0', function (done) {
            user.getScores(0).nodeify(function (err, scores) {
                assert.equal(true, user._testRes_.allScores);
                assert.equal(false, user._testRes_.semScores);
                done();
            });
        });

        it('should get the semester scores if semester is not 0', function (done) {
            user.getScores(2012, 1).nodeify(function (err, scores) {
                assert.equal(false, user._testRes_.allScores);
                assert.equal(true, user._testRes_.semScores);
                done();
            });
        });
    });

});