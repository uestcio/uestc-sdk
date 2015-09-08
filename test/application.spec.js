var assert = require('assert');
var expect = require('expect.js');
var rx = require('rx');

var appModule = require('../dist/application');

var Cacher = require('../dist/helpers/cacher').Cacher;
var Caller = require('../dist/helpers/caller').Caller;
var Course = require('../dist/models/course').Course;
var ExceptionFactory = require('../dist/models/exception').ExceptionFactory;
var Fetcher = require('../dist/helpers/fetcher').Fetcher;
var Person = require('../dist/models/person').Person;
var Seeker = require('../dist/helpers/seeker').Seeker;
var User = require('../dist/models/user').User;
var UserFactory = require('../dist/models/user').UserFactory;


describe('for Application: ', function () {
    var originalConfirm = User.prototype.confirm;
    var originalSeekerSearchForPeople = Seeker.prototype.searchForPeople;
    var originalFetcherSearchForPeople = Fetcher.prototype.searchForPeople;
  
    after(function () {
        User.prototype.confirm = originalConfirm;
        Seeker.prototype.searchForPeople = originalSeekerSearchForPeople;
        Fetcher.prototype.searchForPeople = originalFetcherSearchForPeople;
    });  
    
    it('should have an `app` property.', function () {
        var Application = appModule.Application;
        expect(appModule).to.have.property('app');
        expect(appModule.app).to.be.a(Application);
    });
    
    it('should have an `Application` class.', function () {
        expect(appModule).to.have.property('Application');
        expect(appModule.Application).to.be.a('function');
    });
    
    describe('for instance of Application: ', function () {
        var app;
        
        beforeEach(function () {
            app = new appModule.Application();
        });
        
        describe('should have proper properties and methods: ', function () {
            it('should have exact properties.', function () {
                expect(app).to.have.property('currentUser');
                expect(app.currentUser).to.be(null);
            });
            
            it('should have exact methods.', function () {
                expect(app).to.have.property('one');
                expect(app.one).to.be.a('function');
                
                expect(app).to.have.property('register');
                expect(app.register).to.be.a('function');
                
                expect(app).to.have.property('searchForCourses');
                expect(app.searchForCourses).to.be.a('function');
                
                expect(app).to.have.property('searchForCoursesInCache');
                expect(app.searchForCoursesInCache).to.be.a('function');
                
                expect(app).to.have.property('searchForCoursesWithCache');
                expect(app.searchForCoursesWithCache).to.be.a('function');
                
                expect(app).to.have.property('searchForPeople');
                expect(app.searchForPeople).to.be.a('function');
                
                expect(app).to.have.property('searchForPeopleInCache');
                expect(app.searchForPeopleInCache).to.be.a('function');
                
                expect(app).to.have.property('searchForPeopleWithCache');
                expect(app.searchForPeopleWithCache).to.be.a('function');
            });
        });
        
        describe('should be able to register and get user:', function () {
            var confirmCount, confirmResult;
            
            before(function () {
                User.prototype.confirm = function () {
                    confirmCount++;
                    return { subscribe: function (callback) { callback(confirmResult); }};
                };
            }); 
            
            beforeEach(function () {
                confirmCount = 0;
            });         
            
            it('should be able to get the null if the user is not register.', function () {
                expect(app.one('2012019050031')).to.be(null);
            });
            
            it('should be able to register a user.', function () {
                confirmResult = true;
                
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
            
            it('should not have currentUser if confirm failed.', function () {
                confirmResult = false;
                
                app.register('2012019050031', '******');
                expect(app.one('2012019050031')).to.be.a(User);
                expect(app.one('2012019050031').id).to.be('2012019050031');
                expect(app.one('2012019050031').password).to.be('******');
                expect(app.currentUser).to.be(null); 
            });
            
            it('should not have currentUser if confirm throws.', function () {
                User.prototype.confirm = function () {
                    return { subscribe: function (onNext, onError, onComplete) { onError && onError(new Error('000: Fake error.')); }};
                };
                app.register('2012019050031', '******');
                expect(app.one('2012019050031')).to.be.a(User);
                expect(app.one('2012019050031').id).to.be('2012019050031');
                expect(app.one('2012019050031').password).to.be('******');
                expect(app.currentUser).to.be(null); 
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
            
            describe('for app#searchForCourses: ', function () {               
                it('should call fetcher#searchForCourses if user exists.', function (done) {
                    app.currentUser = new User('2012019050031', '******');
                    expect(app.currentUser).not.to.be(null);
                
                    app.searchForCourses().subscribe(function (courses) {
                        expect(courses).to.be(onlineCourses);
                        done();
                    }, function (err) {
                        expect(true).to.be(false);
                    });
                });

                it('should not be able to search if no user is registered.', function (done) {
                    expect(app.currentUser).to.be(null);
    
                    app.searchForCourses().subscribe(function (x) {
                        expect(true).to.be(false);
                    },function (error) {
                        expect(error).not.to.be(null);
                        done();
                    });
                });
                
                it('should be able to use callback without user.', function (done) {
                    app.searchForCourses(null, function (err, res) {
                        expect(err).not.to.be(null);
                        expect(res).to.be(null);
                        done();
                    });
                });
                                
                it('should be able to use callback with user.', function (done) {
                    app.currentUser = new User('2012019050031', '******');
                    app.searchForCourses(null, function (err, res) {
                        expect(err).to.be(null);
                        expect(res).to.be(onlineCourses);
                        done();
                    });
                });
            });
            
            describe('for app#searchForCoursesInCache: ', function () {
                it('should call seeker#searchForCourses with a user.', function (done) {
                    app.currentUser = new User('2012019050031', '******');
                    expect(app.currentUser).not.to.be(null);
                
                    app.searchForCoursesInCache().subscribe(function (courses) {
                        expect(courses).to.be(offlineCourses);
                        done();
                    }, function (err) {
                        expect(true).to.be(false);
                    });
                });
                
                it('should call Seeker#searchForCourses without a user.', function (done) {
                    expect(app.currentUser).to.be(null);
                
                    app.searchForCoursesInCache().subscribe(function (courses) {
                        expect(courses).to.be(offlineCourses);
                        done();
                    }, function (err) {
                        expect(true).to.be(false);
                    });
                });
                
                it('should be able to use callback with user.', function (done) {  
                    app.currentUser = new User('2012019050031', '******');
                    app.searchForCoursesInCache(null, function (err, res) {
                        expect(err).to.be(null);
                        expect(res).to.be(offlineCourses);
                        done();
                    });
                });
                
                it('should be able to use callback without user.', function (done) {
                    app.searchForCoursesInCache(null, function (err, res) {
                        expect(err).to.be(null);
                        expect(res).to.be(offlineCourses);
                        done();
                    });
                });
            });
            
            describe('for app#searchForCoursesWithCache: ', function () {
                it('should call Fetcher#searchForCourses with a user.', function (done) {
                    app.currentUser = new User('2012019050031', '******');
                    expect(app.currentUser).not.to.be(null);
                
                    app.searchForCoursesWithCache().subscribe(function (courses) {
                        expect(courses).to.be(onlineCourses);
                        done();
                    }, function (err) {
                        expect(true).to.be(false);
                    });
                });
                
                it('should call Seeker#searchForCourses without a user.', function (done) {
                    expect(app.currentUser).to.be(null);
                
                    app.searchForCoursesWithCache().subscribe(function (courses) {
                        expect(courses).to.be(offlineCourses);
                        done();
                    }, function (err) {
                        expect(true).to.be(false);
                    });
                });
                
                it('should be able to use callback with user.', function (done) {  
                    app.currentUser = new User('2012019050031', '******');
                    app.searchForCoursesWithCache(null, function (err, res) {
                        expect(err).to.be(null);
                        expect(res).to.be(onlineCourses);
                        done();
                    });
                });
                
                it('should be able to use callback without user.', function (done) {
                    app.searchForCoursesWithCache(null, function (err, res) {
                        expect(err).to.be(null);
                        expect(res).to.be(offlineCourses);
                        done();
                    });
                });
            });
        });
        
        describe('should be able to search people: ', function () {
            var onlinePeople = [new Person('0'), new Person('1')];
            var offlinePeople = [new Person('0')];
           
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
            
            describe('for app#searchForPeople: ', function () {
                it('should call Fetcher#searchForPeople if user exists.', function (done) {
                    app.currentUser = new User('2012019050031', '******');
                    expect(app.currentUser).not.to.be(null);
                
                    app.searchForPeople().subscribe(function (people) {
                        expect(people).to.be.an(Array);
                        expect(people.length).to.be(2);
                        expect(people[0].id).to.be('0');
                        done();
                    }, function (err) {
                        expect(true).to.be(false);
                    });
                });
                
                it('should not be able to search if no user is registered.', function (done) {
                    expect(app.currentUser).to.be(null);
    
                    app.searchForPeople().subscribe(function (x) {
                        expect(true).to.be(false);
                    },function (error) {
                        expect(error).not.to.be(null);

                        done();
                    });
                });
                
                it('should be able to use callback with user.', function (done) {
                    app.currentUser = new User('2012019050031', '******');
                    app.searchForPeople(null, function (err, res) {
                        expect(err).to.be(null);
                        expect(res).to.be(onlinePeople);
                        done();
                    });
                });
                
                it('should be able to use callback without user.', function (done) {
                    app.searchForPeople(null, function (err, res) {
                        expect(err).not.to.be(null);
                        expect(res).to.be(null);
                        done();
                    });
                });
            });
            
            describe('for app#searchForPeopleInCache: ', function () {
                it('should call Seeker#searchForPeople with a user.', function (done) {
                    app.currentUser = new User('2012019050031', '******');
                    expect(app.currentUser).not.to.be(null);
                
                    app.searchForPeopleInCache().subscribe(function (people) {
                        expect(people).to.be.an(Array);
                        expect(people.length).to.be(1);
                        expect(people[0].id).to.be('0');
                        done();
                    }, function (err) {
                        expect(true).to.be(false);
                    });
                });
                
                it('should call Seeker#searchForPeople without a user.', function (done) {
                    expect(app.currentUser).to.be(null);
                
                    app.searchForPeopleInCache().subscribe(function (people) {
                        expect(people).to.be.an(Array);
                        expect(people.length).to.be(1);
                        expect(people[0].id).to.be('0');
                        done();
                    }, function (err) {
                        expect(true).to.be(false);
                    });
                });
                
                it('should be able to use callback with user.', function (done) {
                    app.currentUser = new User('2012019050031', '******');
                    app.searchForPeopleInCache(null, function (err, res) {
                        expect(err).to.be(null);
                        expect(res).to.be(offlinePeople);
                        done();
                    });
                });
                
                it('should be able to use callback without user.', function (done) {
                    app.searchForPeopleInCache(null, function (err, res) {
                        expect(err).to.be(null);
                        expect(res).to.be(offlinePeople);
                        done();
                    });
                });
            });
            
            describe('for app#searchForPeopleWithCache: ', function () {
                it('should call Fetcher#searchForPeople with a user.', function (done) {
                    app.currentUser = new User('2012019050031', '******');
                    expect(app.currentUser).not.to.be(null);
                
                    app.searchForPeopleWithCache().subscribe(function (people) {
                        expect(people).to.be.an(Array);
                        expect(people.length).to.be(2);
                        expect(people[0].id).to.be('0');
                        done();
                    }, function (err) {
                        expect(true).to.be(false);
                    });
                });
                
                it('should call Seeker#searchForPeople without a user.', function (done) {
                    expect(app.currentUser).to.be(null);
                
                    app.searchForPeopleWithCache().subscribe(function (people) {
                        expect(people).to.be.an(Array);
                        expect(people.length).to.be(1);
                        expect(people[0].id).to.be('0');
                        done();
                    }, function (err) {
                        expect(true).to.be(false);
                    });
                });
                
                it('should be able to use callback with user.', function (done) {
                    app.currentUser = new User('2012019050031', '******');
                    app.searchForPeopleWithCache(null, function (err, res) {
                        expect(err).to.be(null);
                        expect(res).to.be(onlinePeople);
                        done();
                    });
                });
                
                it('should be able to use callback without user.', function (done) {
                    app.searchForPeopleWithCache(null, function (err, res) {
                        expect(err).to.be(null);
                        expect(res).to.be(offlinePeople);
                        done();
                    });
                });
            }); 
        });
    });
});
