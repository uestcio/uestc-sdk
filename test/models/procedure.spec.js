var assert = require('assert');
var expect = require('expect.js');
var request = require('request');
var rx = require('rx');

var procedureModule = require('../../dist/models/procedure');

describe('Procedure module: ', function () {
    
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
    
    describe('instance of UserEnsureLoginProcedure: ', function () {
        var jar;
        
        beforeEach(function () {
            jar = request.jar();
        });
        
        it('should return true with user still in active.', function (done) {
            var userLoginProcedure = new procedureModule.UserLoginProcedure('2012019050020', '811073', jar);
            userLoginProcedure.run().subscribe(function (res) {
                expect(res.result).to.be(true);
                var userEnsureLoginProcedure = new procedureModule.UserEnsureLoginProcedure('2012019050020', '811073', jar);
                userEnsureLoginProcedure.run().subscribe(function (res) {
                    expect(res.result).to.be(true);
                    done();
                }, function (err) {
                    throw err;
                });
            }, function (err) {
                throw err;
            });
        });
        
        it('should return true with user not in active and auto login succeed.', function (done) {
            var userEnsureLoginProcedure = new procedureModule.UserEnsureLoginProcedure('2012019050020', '811073', jar);
            userEnsureLoginProcedure.run().subscribe(function (outRes) {
                expect(outRes.result).to.be(true);
                done();
            }, function (err) {
                throw err;
            });
        });
    });
    
    describe('instance of UserLoginProcedure: ', function () {
        var jar;
        
        beforeEach(function () {
            jar = request.jar();
        });
        
        it('should return true with correct id and password.', function (done) {
            var userLoginProcedure = new procedureModule.UserLoginProcedure('2012019050020', '811073', jar);
            userLoginProcedure.run().subscribe(function (res) {
                expect(res.result).to.be(true);
                done();
            }, function (err) {
                expect(true).to.be(false);
            });
        });
        
        it('should return false with incorrect id and password.', function (done) {
            var userLoginProcedure = new procedureModule.UserLoginProcedure('2012019050021', '811073', jar);
            userLoginProcedure.run().subscribe(function (res) {
                expect(res.result).to.be(false);
                done();
            }, function (err) {
                expect(true).to.be(false);
            });
        });
    });
});
