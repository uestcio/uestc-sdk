var assert = require('assert');
var Promise = require('promise');
var _ = require('lodash');

var Course = require('../src/models/course');
var Person = require('../src/models/person');
var User = require('../src/user');
var Application = require('../src/application');


describe('Application ', function () {
    var app;

    beforeEach(function () {
        app = new Application();
    });

    describe('#.ctor()', function () {
        it('should create the right object', function () {
            assert.equal(0, _.keys(app._users_).length);
            assert.equal(0, _.keys(app._courses_).length);
            assert.equal(0, _.keys(app._notices_).length);
            assert.equal(null, app._current_);
        });
    });

    describe('#__broke__()', function () {
        it('should be able to login', function (done) {
            app.__broke__('2012019050020', '811073').nodeify(function (err, user) {
                assert.equal('2012019050020', user._id_);
                done();
            });
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

        it('should be able to cache', function (done) {
            courses = app.__cacheCourses__(courses);
            assert.equal(2, _.keys(app._courses_).length);
            done();
        });

        it('should return the new courses', function (done) {
            courses = app.__cacheCourses__(courses);
            assert.equal(2, courses.length);
            done();
        });

        it('should merge if get the same id', function (done) {
            app.__cacheCourses__(courses);
            app.__cacheCourses__([{id: '1'}]);
            assert.equal(true, app._courses_['1'].merged);
            done();
        });
    });

    describe('#__searchForCoursesOffline__()', function () {
        var course0, course1, course2;

        beforeEach(function () {
            course0 = new Course('A');
            course0.title = 'AA';
            course0.instructor = 'AAA';
            course1 = new Course('B');
            course1.title = 'BB';
            course1.instructor = 'BBB';
            course2 = new Course('C');
            course2.title = 'CC';
            course2.instructor = 'CCC';
            app._courses_ = {'A': course0, 'B': course1, 'C': course2};
        });

        it('should be able to get local meets options', function (done) {
            app.__searchForCoursesOffline__({title: 'B', instructor: 'B'}).nodeify(function (err, courses) {
                assert.equal(1, courses.length);
                assert.equal(course1, courses[0]);
                done();
            });
        });
    });

    describe('#__searchForCoursesOnline__()', function () {

        beforeEach(function () {
            app.__cacheCourses__ = function (courses) {
                return courses;
            }
        });

        it('should get the courses', function (done) {
            var options = {
                instructor: '徐世中'
            };
            app.__broke__('2012019050020', '811073').nodeify(function () {
                app.__searchForCoursesOnline__(options).nodeify(function (err, courses) {
                    err && console.log(err);
                    assert.equal('徐世中', courses[0].instructor);
                    done();
                });
            });
        });
    });

    describe('#__searchForPeopleOffline__()', function () {
        var person0, person1, person2, person3;

        beforeEach(function () {
            person0 = new Person('A');
            person0.name = 'AA';
            person0.deptName = 'AAA';
            person1 = new Person('B');
            person1.title = 'BA';
            person1.deptName = 'BBB';
            person2 = new Person('C');
            person2.title = 'CC';
            person2.deptName = 'CCA';
            person3 = new Person('D');
            person3.title = 'DD';
            person3.deptName = 'DDD';
            app._people_ = {'A': person0, 'B': person1, 'C': person2, 'D': person3};
        });

        it('should be able to get local meets options', function (done) {
            app.__searchForPeopleOffline__('A', 10).nodeify(function (err, people) {
                assert.equal(3, people.length);
                assert.equal(null, _.findWhere(people, {id: 'D'}));
                done();
            });
        });
    });

    describe('#__searchForPeopleOnline__()', function () {
        it('should get the people', function (done) {
            var term = '徐世中';
            app.__broke__('2012019050020', '811073').nodeify(function () {
                app.__searchForPeopleOnline__(term, 10).nodeify(function (err, people) {
                    assert.equal('徐世中', people[0].name);
                    done();
                });
            });
        });
    });

    describe('#identify()', function () {
        it('should generate the right user', function () {
            var user = app.identify('2012019050031', '12345678');
            assert.equal('2012019050031', user._id_);
            assert.equal(user, app._users_[user._id_]);
        });

        it('should generate the right user when wait', function (done) {
            app.identify('2012019050020', '811073', function (err, backUser) {
                assert.equal('2012019050020', backUser._id_);
                assert.equal(User.status.loginSuccess, backUser.status);
                assert.equal(true, !!backUser._jar_._jar);
                done();
            });
        });

        it('should keep the same user', function () {
            var user1 = app.identify('2012019050031', '12345678');
            var user2 = app.identify('2012019050031', '12345678');
            assert.equal(user1, user2);
        })
    });

    describe('#searchForCourses()', function () {
        beforeEach(function () {
            app._testRes_ = {
                online: false,
                local: false
            };
        });

        it('should get the courses online when could connect', function (done) {
            app.__searchForCoursesOnline__ = function () {
                app._testRes_.online = true;
                return Promise.resolve([]);
            };

            app.__searchForCoursesOffline__ = function () {
                app._testRes_.local = true;
                return Promise.resolve([]);
            };

            var options = {
                instructor: '徐世中'
            };

            app.searchForCourses(options ,function (err, courses) {
                assert.equal(true, app._testRes_.online);
                assert.equal(false, app._testRes_.local);
                done();
            });
        });

        it('should get the courses local when could not connect', function (done) {
            app.__searchForCoursesOnline__ = function () {
                app._testRes_.online = true;
                return Promise.reject(new Error(''));
            };

            app.__searchForCoursesOffline__ = function () {
                app._testRes_.local = true;
                return Promise.resolve([]);
            };

            var options = {
                instructor: '徐世中'
            };

            app.searchForCourses(options ,function (err, courses) {
                assert.equal(true, app._testRes_.online);
                assert.equal(true, app._testRes_.local);
                done();
            });
        });
    });

    describe('#searchForPeople()', function () {
        beforeEach(function () {
            app._testRes_ = {
                online: false,
                local: false
            };
        });

        it('should get the people online when could connect', function (done) {
            app.__searchForPeopleOnline__ = function () {
                app._testRes_.online = true;
                return Promise.resolve([]);
            };

            app.__searchForPeopleOffline__ = function () {
                app._testRes_.local = true;
                return Promise.resolve([]);
            };

            var term = '徐世中';

            app.searchForPeople(term, 10 ,function (err, people) {
                assert.equal(true, app._testRes_.online);
                assert.equal(false, app._testRes_.local);
                done();
            });
        });

        it('should get the people local when could not connect', function (done) {
            app.__searchForPeopleOnline__ = function () {
                app._testRes_.online = true;
                return Promise.reject(new Error(''));
            };

            app.__searchForPeopleOffline__ = function () {
                app._testRes_.local = true;
                return Promise.resolve([]);
            };

            var term = '徐世中';

            app.searchForPeople(term, 10 ,function (err, people) {
                assert.equal(true, app._testRes_.online);
                assert.equal(true, app._testRes_.local);
                done();
            });
        });
    });

    describe('#reset()', function () {
        it('should reset all the properties', function () {
            app.reset();
            assert.equal(null, app._users_._current_);
        });
    });
});