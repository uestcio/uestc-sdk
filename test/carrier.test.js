var assert = require('assert');
var request = require('request');
var _ = require('lodash');
var Carrier = require('../src/carrier');

describe('Carrier ', function () {

    xdescribe('#get()', function () {
        it('should call the promise#get()', function () {
        });
    });

    describe('#jar()', function () {
        it('should equal to request.jar', function () {
            assert.equal(request.jar, Carrier.jar);
        });
    });

    xdescribe('#post()', function () {
        it('should call the promise#post()', function () {
        });
    });
});