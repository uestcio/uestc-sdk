var assert = require('assert');
var expect = require('expect.js');

var appModule = require('../dist/application');

describe('Application: ', function () {
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
            app = appModule.app;
            app.reset();
        });
        
        it('should init with a currentUser of null.', function () {
            expect(app).to.have.property('currentUser');
            expect(app.currentUser).to.be(null);
        });
        
        it('should be able to get the right user.', function () {
            expect(app).to.have.property('one');
            expect(app.one).to.be.a('function');
            expect(app.one('2012019050031')).to.be(null);
        })
    });
});
