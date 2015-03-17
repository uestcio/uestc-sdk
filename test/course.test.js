var assert = require('assert');
var Course = require('../src/course');

describe('Course ', function () {
    var course;

    beforeEach(function () {
        course = new Course('1234');
    });

    describe('#.ctor()', function () {
        it('should be able to instantiate', function () {
            assert.equal(true, !!course);
        });
    });

    describe('#__setField__()', function () {
        beforeEach(function () {
            course.title = 'AAA';
        });

        it('should be able to set valid field', function () {
            course.__setField__('title', 'BBB');
            assert.equal(course.title, 'BBB');
        });

        it('should not set the field null', function () {
            course.__setField__('title', null);
            assert.equal(course.title, 'AAA');
        });

        it('should not set the field undefined', function () {
            course.__setField__('title', undefined);
            assert.equal(course.title, 'AAA');
        });

        it('should not set the field empty', function () {
            course.__setField__('title', '');
            assert.equal(course.title, 'AAA');
        });
    });

});