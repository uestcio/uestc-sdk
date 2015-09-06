var assert = require('assert');
var expect = require('expect.js');
var rx = require('rx');

var appModule = require('../dist/application');

var Cacher = require('../dist/helpers/cacher').Cacher;
var Caller = require('../dist/helpers/caller').Caller;
var Course = require('../dist/models/course').Course;
var ExceptionFactory = require('../dist/models/exception').ExceptionFactory;
var Fetcher = require('../dist/helpers/fetcher').Fetcher;
var Injector = require('../dist/helpers/injector').Injector;
var Person = require('../dist/models/person').Person;
var Seeker = require('../dist/helpers/seeker').Seeker;
var User = require('../dist/models/user').User;
var UserFactory = require('../dist/models/user').UserFactory;

describe('Application: ', function () {
    var injector = new Injector();
    
    it('should have an `app` property.', function () {
        var Application = appModule.Application;
        expect(appModule).to.have.property('app');
        expect(appModule.app).to.be.a(Application);
    });
    
    it('should have an `Application` class.', function () {
        expect(appModule).to.have.property('Application');
        expect(appModule.Application).to.be.a('function');
    });
    
    describe('property app: ', function () {
        var app;
        
        beforeEach(function () {
            app = new appModule.Application(injector);
        });
        
        describe('should have proper properties: ', function () {
            it('should have a currentUser of type User.', function () {
                expect(app).to.have.property('currentUser');
                expect(app.currentUser).to.be(null);
            });
            
            it('should have a cacher of type Cacher.', function () {
                expect(app).to.have.property('cacher');
                expect(app.cacher).to.be.a(Cacher);
            });
            
            it('should have a caller of type Caller.', function () {
                expect(app).to.have.property('caller');
                expect(app.caller).to.be.a(Caller);
            });
            
            it('should have a fetcher of type Fetcher.', function () {
                expect(app).to.have.property('fetcher');
                expect(app.fetcher).to.be.a(Fetcher);
            });
            
            it('should have a injector of type Injector.', function () {
                expect(app).to.have.property('injector');
                expect(app.injector).to.be.a(Injector);
            });
            
            it('should have a seeker of type Seeker.', function () {
                expect(app).to.have.property('seeker');
                expect(app.seeker).to.be.a(Seeker);
            });
            
            it('should have a userFactory of type UserFactory.', function () {
                expect(app).to.have.property('userFactory');
                expect(app.userFactory).to.be.a(UserFactory);
            });
            
            it('should have a exceptionFactory of type ExceptionFactory.', function () {
                expect(app).to.have.property('exceptionFactory');
                expect(app.exceptionFactory).to.be.a(ExceptionFactory);
            });
        });
        
        describe('should be able to register and get user:', function () {
            var confirmCount = 0;
            var originalConfirm = User.prototype.confirm;
            
            before(function () {
                User.prototype.confirm = function () {
                    confirmCount += 1;
                    return {
                        subscribe: function (callback) {
                            callback();
                        }
                    };
                };
            });  
            
            after(function () {
                User.prototype.confirm = originalConfirm;
            });       
            
            it('should init with a currentUser of null.', function () {
                expect(app).to.have.property('currentUser');
                expect(app.currentUser).to.be(null);
            });
            
            it('should be able to get the null if the user is not register.', function () {
                expect(app).to.have.property('one');
                expect(app.one).to.be.a('function');
                expect(app.one('2012019050031')).to.be(null);
            });
            
            it('should be able to register a user.', function () {
                expect(app).to.have.property('register');
                expect(app.register).to.be.a('function');
                expect(confirmCount).to.be(0);
                app.register('2012019050031', '******');
                expect(app.one('2012019050031')).to.be.a(User);
                expect(app.one('2012019050031').id).to.be('2012019050031');
                expect(app.one('2012019050031').password).to.be('******');              
                expect(confirmCount).to.be(1);
                expect(app.currentUser).to.be(app.one('2012019050031'));
                app.register('2012019050032', '******');
                expect(confirmCount).to.be(1);
                expect(app.one('2012019050032')).to.be.a(User);
                expect(app.one('2012019050032').id).to.be('2012019050032');
            });
        });
        
        describe('should be able to search courses: ', function () {
            var onlineCourses = [new Course('0'), new Course('1')];
            var offlineCourses = [new Course('0')];
            var originalSeekerSearchForCourses = Seeker.prototype.searchForCourses;
            var originalFetcherSearchForCourses = Fetcher.prototype.searchForCourses;
            
            before(function () {
                Seeker.prototype.searchForCourses = function () {
                    return rx.Observable.return(offlineCourses);
                };
                Fetcher.prototype.searchForCourses = function () {
                    return rx.Observable.return(onlineCourses);
                };
            });
            
            after(function () {
                Seeker.prototype.searchForCourses = originalSeekerSearchForCourses;
                Fetcher.prototype.searchForCourses = originalFetcherSearchForCourses;
            });
            
            it('should have proper functions for courses searching.', function () {
                expect(app).to.have.property('searchForCourses');
                expect(app.searchForCourses).to.be.a('function');
                expect(app).to.have.property('searchForCoursesInCache');
                expect(app.searchForCoursesInCache).to.be.a('function');
                expect(app).to.have.property('searchForCoursesWithCache');
                expect(app.searchForCoursesWithCache).to.be.a('function');
            })
            
            it('should not be able to search if no user is registered.', function () {
                expect(app.currentUser).to.be(null);

                app.searchForCourses().subscribeOnError(function (error) {
                    expect(error).not.to.be(null);
                    expect(error.code).to.be(401);
                });
            });
            
            it('should be able to call Fetcher#searchForCourses from searchForCourses if user exists.', function () {
                app.currentUser = new User('2012019050031', '******');
                expect(app.currentUser).not.to.be(null);
               
                app.searchForCourses().subscribeOnNext(function (courses) {
                    expect(courses).to.be.an(Array);
                    expect(courses.length).to.be(2);
                    expect(courses[0].id).to.be('0');
                });
            });
            
            it('should be able to call Seeker#searchForCourses from searchForCoursesInCache without a user.', function () {
                expect(app.currentUser).to.be(null);
               
                app.searchForCoursesInCache().subscribeOnNext(function (courses) {
                    expect(courses).to.be.an(Array);
                    expect(courses.length).to.be(1);
                    expect(courses[0].id).to.be('0');
                });
            });
            
            it('should be able to call Seeker#searchForCourses from searchForCoursesInCache with a user.', function () {
                app.currentUser = new User('2012019050031', '******');
                expect(app.currentUser).not.to.be(null);
               
                app.searchForCoursesInCache().subscribeOnNext(function (courses) {
                    expect(courses).to.be.an(Array);
                    expect(courses.length).to.be(1);
                    expect(courses[0].id).to.be('0');
                });
            });
            
            it('should be able to call Seeker#searchForCourses from searchForCoursesWithCache without a user.', function () {
                expect(app.currentUser).to.be(null);
               
                app.searchForCoursesWithCache().subscribeOnNext(function (courses) {
                    expect(courses).to.be.an(Array);
                    expect(courses.length).to.be(1);
                    expect(courses[0].id).to.be('0');
                });
            });
            
            it('should be able to call Fetcher#searchForCourses from searchForCoursesInCache with a user.', function () {
                app.currentUser = new User('2012019050031', '******');
                expect(app.currentUser).not.to.be(null);
               
                app.searchForCoursesWithCache().subscribeOnNext(function (courses) {
                    expect(courses).to.be.an(Array);
                    expect(courses.length).to.be(2);
                    expect(courses[0].id).to.be('0');
                });
            });
        });
        
        describe('should be able to search people: ', function () {
            var onlinePeople = [new Person('0'), new Person('1')];
            var offlinePeople = [new Person('0')];
            var originalSeekerSearchForPeople = Seeker.prototype.searchForPeople;
            var originalFetcherSearchForPeople = Fetcher.prototype.searchForPeople;
            
            before(function () {
                Seeker.prototype.searchForPeople = function () {
                    return rx.Observable.return(offlinePeople);
                };
                Fetcher.prototype.searchForPeople = function () {
                    return rx.Observable.return(onlinePeople);
                };
            });
            
            after(function () {
                Seeker.prototype.searchForPeople = originalSeekerSearchForPeople;
                Fetcher.prototype.searchForPeople = originalFetcherSearchForPeople;
            });
            
            it('should have proper functions for people searching.', function () {
                expect(app).to.have.property('searchForPeople');
                expect(app.searchForPeople).to.be.a('function');
                expect(app).to.have.property('searchForPeopleInCache');
                expect(app.searchForPeopleInCache).to.be.a('function');
                expect(app).to.have.property('searchForPeopleWithCache');
                expect(app.searchForPeopleWithCache).to.be.a('function');
            })
            
            it('should not be able to search if no user is registered.', function () {
                expect(app.currentUser).to.be(null);

                app.searchForPeople().subscribeOnError(function (error) {
                    expect(error).not.to.be(null);
                    expect(error.code).to.be(401);
                });
            });
            
            it('should be able to call Fetcher#searchForPeople from searchForPeople if user exists.', function () {
                app.currentUser = new User('2012019050031', '******');
                expect(app.currentUser).not.to.be(null);
               
                app.searchForPeople().subscribeOnNext(function (people) {
                    expect(people).to.be.an(Array);
                    expect(people.length).to.be(2);
                    expect(people[0].id).to.be('0');
                });
            });
            
            it('should be able to call Seeker#searchForPeople from searchForPeopleInCache without a user.', function () {
                expect(app.currentUser).to.be(null);
               
                app.searchForPeopleInCache().subscribeOnNext(function (people) {
                    expect(people).to.be.an(Array);
                    expect(people.length).to.be(1);
                    expect(people[0].id).to.be('0');
                });
            });
            
            it('should be able to call Seeker#searchForPeople from searchForPeopleInCache with a user.', function () {
                app.currentUser = new User('2012019050031', '******');
                expect(app.currentUser).not.to.be(null);
               
                app.searchForPeopleInCache().subscribeOnNext(function (people) {
                    expect(people).to.be.an(Array);
                    expect(people.length).to.be(1);
                    expect(people[0].id).to.be('0');
                });
            });
            
            it('should be able to call Seeker#searchForPeople from searchForPeopleWithCache without a user.', function () {
                expect(app.currentUser).to.be(null);
               
                app.searchForPeopleWithCache().subscribeOnNext(function (people) {
                    expect(people).to.be.an(Array);
                    expect(people.length).to.be(1);
                    expect(people[0].id).to.be('0');
                });
            });
            
            it('should be able to call Fetcher#searchForPeople from searchForPeopleInCache with a user.', function () {
                app.currentUser = new User('2012019050031', '******');
                expect(app.currentUser).not.to.be(null);
               
                app.searchForPeopleWithCache().subscribeOnNext(function (people) {
                    expect(people).to.be.an(Array);
                    expect(people.length).to.be(2);
                    expect(people[0].id).to.be('0');
                });
            });
        });
        
        describe('should be able to deal with injector.', function () {
            it('should have getInjector method.', function () {
                expect(app).to.have.property('getInjector');
                expect(app.getInjector).to.be.a('function');
            });
            
            it('should be able to get the injector.', function () {
                expect(app.getInjector()).to.be(injector);
            });
        });
    });
});