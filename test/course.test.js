var assert = require('assert');
var Promise = require('promise');
var Course = require('../src/course');

describe('Course ', function () {
    var course;

    beforeEach(function () {
        course = new Course();
    });

    describe('#.ctor()', function () {
        it('should be able to instantiate', function () {
            assert.equal(true, !!course);
        });
    });

});