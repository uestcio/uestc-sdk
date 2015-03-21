var assert = require('assert');
var _ = require('lodash');
var Promise = require('promise');
var Course = require('../src/structure/course');
var Exam = require('../src/structure/exam');
var Score = require('../src/structure/score');
var User = require('../src/user');
var UrlUtil = require('../src/helpers/urlutil');
var StdDetail = require('../src/structure/stddetail');

describe('User ', function () {
    var user;

    beforeEach(function () {
        user = new User('2012019050020', '811073');
        user._owner_ = {};
        user._owner_.__cacheCourses__ = function () {};
    });

    describe('#.ctor()', function () {
        it('should create the right object', function () {
            assert.equal('2012019050020', user._id_);
            assert.equal('811073', user._password_);
            assert.equal(User.status.idle, user.status);
            assert.equal(1, _.keys(user._jar_).length);
        });
    });

    describe('#__cacheCourses__()', function () {
        var courses;

        beforeEach(function () {
            courses = [];
            courses[0] = {id: '1', merged: false, __dummy__: function () {}};
            courses[1] = {id: '2', merged: false, __dummy__: function () {}};
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

        it('should call the owner', function () {
            user._owner_.__cacheCourses__ = function (courses) {
                this.len = courses.length;
            };
            user.__cacheCourses__(courses);
            user.__cacheCourses__([{id: '1'}]);
            assert.equal(1, user._owner_.len);
        });

        it('should be able to check update', function () {
            var count = 0;
            user._inNotify_ = true;
            user._courses_ = {
                '1': new Course('1')
            };
            user._owner_.__cacheCourses__ = function () {};
            user.__checkUpdates__ = function (courses) {
                count = 1;
            };
            user.__cacheCourses__([new Course('1')]);
            assert.equal(1, count);
        });

        it('should be able to not check update when no need', function () {
            var count = 0;
            user._inNotify_ = false;
            user._courses_ = {
                '1': new Course('1')
            };
            user._owner_.__cacheCourses__ = function () {};
            user.__checkUpdates__ = function (courses) {
                count = 1;
            };
            user.__cacheCourses__([new Course('1')]);
            assert.equal(0, count);
        });

        it('should be able to not check update when no old', function () {
            var count = 0;
            user._inNotify_ = true;
            user._courses_ = {};
            user._owner_.__cacheCourses__ = function () {};
            user.__checkUpdates__ = function (courses) {
                count += courses.length;
            };
            user.__cacheCourses__([new Course('1')]);
            assert.equal(0, count);
        });
    });

    describe('#__checkUpdates__()', function () {
        var record;

        beforeEach(function () {
            record = {
                exam: false,
                score: false
            };

            user.__notify__ = function (event, res) {
                record[event] = true;
            }
        });

        it('should do nothing when old one is null', function () {
            var oldOne = null;
            var newOne = new Course('123');
            user.__checkUpdates__(oldOne, newOne);
            assert.equal(false, record.exam);
            assert.equal(false, record.score);
        });

        it('should do nothing when new one is null', function () {
            var oldOne = new Course('123');
            var newOne = null;
            user.__checkUpdates__(oldOne, newOne);
            assert.equal(false, record.exam);
            assert.equal(false, record.score);
        });

        it('should call exam when old one have no exam', function () {
            var oldOne = new Course('123');
            var newOne = new Course('123');
            newOne.exam = new Exam(newOne);
            newOne.exam.date = new Date();
            user.__checkUpdates__(oldOne, newOne);
            assert.equal(true, record.exam);
            assert.equal(false, record.score);
        });

        it('should call exam when old one have no exam date', function () {
            var oldOne = new Course('123');
            oldOne.exam = new Exam(oldOne);
            var newOne = new Course('123');
            newOne.exam = new Exam(newOne);
            newOne.exam.date = new Date();
            user.__checkUpdates__(oldOne, newOne);
            assert.equal(true, record.exam);
            assert.equal(false, record.score);
        });

        it('should call exam when exam of courses are different', function () {
            var oldOne = new Course('123');
            oldOne.exam = new Exam(oldOne);
            oldOne.exam.date = new Date('2001-01-01');
            var newOne = new Course('123');
            newOne.exam = new Exam(newOne);
            newOne.exam.date = new Date('2010-10-10');
            user.__checkUpdates__(oldOne, newOne);
            assert.equal(true, record.exam);
            assert.equal(false, record.score);
        });

        it('should not call exam when new one has no exam', function () {
            var oldOne = new Course('123');
            oldOne.exam = new Exam(oldOne);
            oldOne.exam.date = new Date('2001-01-01');
            var newOne = new Course('123');
            user.__checkUpdates__(oldOne, newOne);
            assert.equal(false, record.exam);
            assert.equal(false, record.score);
        });

        it('should not call exam when new one has no exam date', function () {
            var oldOne = new Course('123');
            oldOne.exam = new Exam(oldOne);
            oldOne.exam.date = new Date('2001-01-01');
            var newOne = new Course('123');
            newOne.exam = new Exam(newOne);
            user.__checkUpdates__(oldOne, newOne);
            assert.equal(false, record.exam);
            assert.equal(false, record.score);
        });

        it('should not call exam when exam of courses are same', function () {
            var oldOne = new Course('123');
            oldOne.exam = new Exam(oldOne);
            oldOne.exam.date = new Date('2001-01-01');
            var newOne = new Course('123');
            newOne.exam = new Exam(newOne);
            newOne.exam.date = new Date('2001-01-01');
            user.__checkUpdates__(oldOne, newOne);
            assert.equal(false, record.exam);
            assert.equal(false, record.score);
        });

        it('should call score when old one have no score', function () {
            var oldOne = new Course('123');
            var newOne = new Course('123');
            newOne.score = new Score(newOne);
            newOne.score.final = 100;
            user.__checkUpdates__(oldOne, newOne);
            assert.equal(false, record.exam);
            assert.equal(true, record.score);
        });

        it('should call score when old one have no score final', function () {
            var oldOne = new Course('123');
            oldOne.score = new Score(oldOne);
            var newOne = new Course('123');
            newOne.score = new Score(newOne);
            newOne.score.final = 100;
            user.__checkUpdates__(oldOne, newOne);
            assert.equal(false, record.exam);
            assert.equal(true, record.score);
        });

        it('should call score when score of courses are different', function () {
            var oldOne = new Course('123');
            oldOne.score = new Score(oldOne);
            oldOne.score.final = 90;
            var newOne = new Course('123');
            newOne.score = new Score(newOne);
            newOne.score.final = 100;
            user.__checkUpdates__(oldOne, newOne);
            assert.equal(false, record.exam);
            assert.equal(true, record.score);
        });

        it('should not call score when new one has no score', function () {
            var oldOne = new Course('123');
            oldOne.score = new Score(oldOne);
            oldOne.score.final = 100;
            var newOne = new Course('123');
            user.__checkUpdates__(oldOne, newOne);
            assert.equal(false, record.exam);
            assert.equal(false, record.score);
        });

        it('should not call score when new one has no score final', function () {
            var oldOne = new Course('123');
            oldOne.score = new Score(oldOne);
            oldOne.score.final = 100;
            var newOne = new Course('123');
            newOne.score = new Score(newOne);
            user.__checkUpdates__(oldOne, newOne);
            assert.equal(false, record.exam);
            assert.equal(false, record.score);
        });

        it('should not call score when scores of courses are same', function () {
            var oldOne = new Course('123');
            oldOne.score = new Score(oldOne);
            oldOne.score.final = 100;
            var newOne = new Course('123');
            newOne.score = new Score(newOne);
            newOne.score.final = 100;
            user.__checkUpdates__(oldOne, newOne);
            assert.equal(false, record.exam);
            assert.equal(false, record.score);
        });
    });

    describe('#__ensureLogin__()', function () {

        beforeEach(function () {
            user.__reset__();
        });

        it('should send ensure login when idle', function (done) {
            user.__ensureLogin__().nodeify(function () {
                assert.equal(User.status.loginSuccess, user.status);
                done();
            })
        });

        it('should send ensure login when login success', function (done) {
            user.__login__().nodeify(function () {
                user.__ensureLogin__().nodeify(function () {
                    assert.equal(User.status.loginSuccess, user.status);
                    done();
                })
            })
        });
    });

    describe('#__getAllCourses__()', function () {

        beforeEach(function () {
            user = new User('2012019050020', '811073');
            user._owner_ = {};
            user._owner_.__cacheCourses__ = function () {};
        });

        it('should get the all courses when real online', function (done) {

            user.__getAllCourses__().nodeify(function (err, courses) {
                err && console.log(err);
                assert.equal(40, courses.length);
                done();
            });
        });

        it('should call the all semester courses when online', function (done) {
            var id = 0;

            user.__getSemesterCourses__ = function () {
                return Promise.resolve([{id: (id++).toString()}]);
            };

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

    describe('#__getAllExams__()', function () {

        beforeEach(function () {
            user = new User('2012019050020', '811073');
            user._owner_ = {};
            user._owner_.__cacheCourses__ = function () {};
        });

        it('should get the all exams when real online', function (done) {
            user.__getAllExams__().nodeify(function (err, courses) {
                err && console.log(err);
                assert.equal(40, courses.length);
                done();
            });
        });

        it('should call the all semester exams when online', function (done) {
            var id = 0;

            user.__getSemesterExams__ = function () {
                return Promise.resolve([{course: {id: (id++).toString()}}]);
            };

            user.__getAllExams__().nodeify(function (err, courses) {
                err && console.log(err);
                assert.equal(8, courses.length);
                done();
            });
        });
    });

    describe('#__getAllExamsOffline__()', function () {

        beforeEach(function () {
            user._courses_ = {
                '1': {id: '1', exam: {}},
                '2': {id: '2', exam: {}}
            }
        });

        it('should be able to get local courses', function (done) {
            user.__getAllExamsOffline__().nodeify(function (err, exams) {
                assert.equal(2, exams.length);
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

    describe('#__getSemesterExams__()', function () {

        it('should get the semester exams', function (done) {
            user.__getSemesterExams__(43).nodeify(function (err, exams) {
                err && console.log(err);
                assert.equal(12, exams.length);
                assert.equal('A302', exams[0].place);
                done();
            });
        });
    });

    describe('#__getSemesterScores__()', function () {

        it('should get the semester scores', function (done) {
            user.__getSemesterScores__(43).nodeify(function (err, scores) {
                err && console.log(err);
                assert.equal(12, scores.length);
                assert.equal(60, scores[0].final);
                done();
            });
        });
    });

    describe('#__login__()', function () {

        it('should send the post request and login success', function (done) {
            user.__login__().nodeify(function (err, res) {
                assert.equal(false, !!err);
                done();
            });
        });

        it('should send the post request and login fail', function (done) {
            user._password_ = '811074';
            user.__login__().nodeify(function (err, res) {
                assert.equal(true, !!err);
                done();
            });
        });
    });

    describe('#__notify__()', function () {

        it('should able to notify then exam event', function (done) {
            user._callbacks_.exam = function (err, res) {
                assert.equal(1, res);
                done();
            };

            user.__notify__('exam', 1);
        });

        it('should able to notify then exam event', function (done) {
            user._callbacks_.score = function (err, res) {
                assert.equal(1, res);
                done();
            };

            user.__notify__('score', 1);
        });
    });

    describe('#__reset__()', function () {
        it('should be idle after reset', function () {
            user.__reset__();
            assert.equal(User.status.idle, user.status);
        });

        it('should not change number and password', function () {
            user.__reset__();
            assert.equal('2012019050020', user._id_);
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
            user.getCourses(0, 0, function (err, courses) {
                assert.equal(true, user._testRes_.allCourses);
                assert.equal(false, user._testRes_.semCourses);
                done();
            });
        });

        it('should get the semester courses if semester is not 0', function (done) {
            user.getCourses(2012, 1 ,function (err, courses) {
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

            user.getDetail(function (err, detail) {
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

            user.getDetail(function (err, detail) {
                assert.equal(true, user._testRes_.online);
                assert.equal(true, user._testRes_.local);
                done();
            });
        });
    });

    describe('#getExams()', function () {
        beforeEach(function () {
            user._testRes_ = {
                allExams: false,
                semExams: false
            };

            user.__getAllExams__ = function () {
                user._testRes_.allExams = true;
                return Promise.resolve([]);
            };

            user.__getSemesterExams__ = function () {
                user._testRes_.semExams = true;
                return Promise.resolve([]);
            };
        });

        it('should get the all exams if semester is 0', function (done) {
            user.getExams(0, 0, function (err, exams) {
                assert.equal(true, user._testRes_.allExams);
                assert.equal(false, user._testRes_.semExams);
                done();
            });
        });

        it('should get the semester exams if semester is not 0', function (done) {
            user.getExams(2012, 1, function (err, exams) {
                assert.equal(false, user._testRes_.allExams);
                assert.equal(true, user._testRes_.semExams);
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
            user.getScores(0, 0, function (err, scores) {
                assert.equal(true, user._testRes_.allScores);
                assert.equal(false, user._testRes_.semScores);
                done();
            });
        });

        it('should get the semester scores if semester is not 0', function (done) {
            user.getScores(2012, 1, function (err, scores) {
                assert.equal(false, user._testRes_.allScores);
                assert.equal(true, user._testRes_.semScores);
                done();
            });
        });
    });

    describe('#on()', function () {
        it('should set the _callbacks_[event] to callback', function (done) {
            var callback = function (err, res) {
                assert.equal(1, res);
                done();
            };

            user.on('exam', callback);
            user.__notify__('exam', 1);
        })
    })
});