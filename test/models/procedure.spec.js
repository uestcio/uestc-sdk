var assert = require('assert');
var expect = require('expect.js');
var request = require('request');
var rx = require('rx');

var parserModule = require('../../dist/helpers/parser');
var procedureModule = require('../../dist/models/procedure');

var noCallFun = function (err) {
    throw err || new Error('This function should not be called!');
}

describe('Procedure module: ', function () {
    var correctUser = { id: '2012019050020', password: '811073', jar: request.jar() };
    var incorrectUser = { id: '2012019050020', password: '123456', jar: request.jar() };
    
    it('should have a `Procedure` class.', function () {
        expect(procedureModule).to.have.property('Procedure');
        expect(procedureModule.Procedure).to.be.a('function');
    });
    
    it('should have a `UserLoginProcedure` class.', function () {
        expect(procedureModule).to.have.property('UserLoginProcedure');
        expect(procedureModule.UserLoginProcedure).to.be.a('function');
    });
    
    it('should have a `UserEnsureLoginProcedure` class.', function () {
        expect(procedureModule).to.have.property('UserEnsureLoginProcedure');
        expect(procedureModule.UserEnsureLoginProcedure).to.be.a('function');
    });
    
    describe('instance of UserLoginProcedure: ', function () {
        var UserLoginProcedure = procedureModule.UserLoginProcedure;
                
        beforeEach(function () {
            correctUser.jar = incorrectUser.jar = request.jar();
        });
        
        it('should return true with correct id and password.', function (done) {
            var userLoginProcedure = new UserLoginProcedure(correctUser);
            userLoginProcedure.run().subscribe(function (res) {
                expect(res.result).to.be(true);
                done();
            }, noCallFun);
        });
        
        it('should return false with incorrect id and password.', function (done) {
            var userLoginProcedure = new UserLoginProcedure(incorrectUser);
            userLoginProcedure.run().catch(function (err) {
                console.log(err);
                throw err;
            }).subscribe(function (res) {
                expect(res.result).to.be(false);
                done();
            }, noCallFun);
        });
    });
    
    describe('instance of UserEnsureLoginProcedure: ', function () {
        var UserEnsureLoginProcedure = procedureModule.UserEnsureLoginProcedure;
        var UserLoginProcedure = procedureModule.UserLoginProcedure;
        
        beforeEach(function () {
            correctUser.jar = incorrectUser.jar = request.jar();
        });
        
        it('should return true with user still in active.', function (done) {
            var userLoginProcedure = new UserLoginProcedure(correctUser);
            userLoginProcedure.run().subscribe(function (res) {
                expect(res.result).to.be(true);
                var userEnsureLoginProcedure = new UserEnsureLoginProcedure(correctUser);
                userEnsureLoginProcedure.run().subscribe(function (res) {
                    expect(res.result).to.be(true);
                    done();
                }, noCallFun);
            }, noCallFun);
        });
        
        it('should return true with user not in active and auto login succeed.', function (done) {
            var userEnsureLoginProcedure = new UserEnsureLoginProcedure(correctUser);
            userEnsureLoginProcedure.run().catch(function (err) {
                console.log(err);
                throw err;
            }).subscribe(function (outRes) {
                expect(outRes.result).to.be(true);
                done();
            }, noCallFun);
        });
    });
    
    describe('instance of AppSearchCoursesProcedure: ', function () {
        var courses = [];
        var AppSearchCoursesPreProcudure = procedureModule.AppSearchCoursesPreProcedure;
        var AppSearchCoursesProcedure = procedureModule.AppSearchCoursesProcedure;
        var originalParserGetAppCourses = parserModule.Parser.prototype.getAppCourses;
        
        beforeEach(function () {
            correctUser.jar = incorrectUser.jar = request.jar();
            parserModule.Parser.prototype.getAppCourses = function () {
                return rx.Observable.return(courses);
            };
        });
        
        after(function () {
            parserModule.Parser.prototype.getAppCourses = originalParserGetAppCourses;
        });
        
        it('should be able to call parser#getAppCourses with pre procedure.', function (done) {
            var preProcedure = new AppSearchCoursesPreProcudure(correctUser);
            var procedure = new AppSearchCoursesProcedure('test', correctUser);
            preProcedure.run().subscribe(function (res) {
                expect(res.result).to.be(true);
                procedure.run().subscribe(function (res) {
                    expect(res.result).to.be(courses);
                    done();
                }, noCallFun);
            }, noCallFun);
        });
        
        it('should not be able to call parser#getAppCourses without pre procedure.', function (done) {
            var procedure = new AppSearchCoursesProcedure('test', correctUser);
            
            procedure.run().subscribe(function (res) {
                console.log(res.body);
                expect(res.response.statusCode).to.be(302);
                done();
            }, noCallFun);
        });
    });
});
