var assert = require('assert');
var expect = require('expect.js');

var userModule = require('../../dist/models/user');


describe('User: ' , function () {
    it('should have an `User` class.', function () {
        expect(userModule).to.have.property('User');
        expect(userModule.User).to.be.a('function');
    })
});
