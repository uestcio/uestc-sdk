var assert = require('assert');
var expect = require('expect.js');

var appModule = require('../dist/application');

var Cacher = require('../dist/helpers/cacher').Cacher;
var Caller = require('../dist/helpers/caller').Caller;
var ExceptionFactory = require('../dist/models/exception').ExceptionFactory;
var Fetcher = require('../dist/helpers/fetcher').Fetcher;
var Injector = require('../dist/helpers/injector').Injector;
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
            before(function () {
                
            });
        });
        
        
    });
});
