var assert = require('assert');
var Course = require('../../src/models/course');

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

    describe('#__dummy__()', function () {

        beforeEach(function () {
            course.title = 'Course Title';
            course.exam = {a:1, b:2};
            course.score = {c:1, d:2};
        });

        it('should be generate a dummy', function () {
            var dummy = course.__dummy__();
            assert.equal('1234', dummy.id);
            assert.equal('Course Title', dummy.title);
            assert.equal(undefined, dummy.exam);
            assert.equal(undefined, dummy.score);
        });
    });

    describe('#__setField__()', function () {
        beforeEach(function () {
            course = new Course('1234');
            course.title = 'AAA';
        });

        it('should be able to set valid field', function () {
            course.__setField__('title', 'BBB');
            assert.equal(course.title, 'BBB');
        });

        it('should not set the field null', function () {
            course.__setField__('title', null);
            assert.equal(course.title, null);
        });

        it('should not set the field undefined', function () {
            course.__setField__('title', undefined);
            assert.equal(course.title, 'AAA');
        });

        it('should not set the field NaN', function () {
            course.__setField__('title', NaN);
            assert.equal(course.title, 'AAA');
        });

        it('should not set the field empty', function () {
            course.__setField__('title', '');
            assert.equal(course.title, 'AAA');
        });

        it('should not be able to set id', function () {
            course.__setField__('id', '5678');
            assert.equal(course.id, '1234');
        });

        it('should be able to set code', function () {
            course.__setField__('code', '5678');
            assert.equal(course.code, '5678');
        });

        it('should be able to set instructor', function () {
            course.__setField__('instructor', '5678');
            assert.equal(course.instructor, '5678');
        });

        it('should be able to set campus', function () {
            course.__setField__('campus', '5678');
            assert.equal(course.campus, '5678');
        });

        it('should be able to set credit to number', function () {
            course.__setField__('credit', '5678');
            assert.equal(course.credit, 5678);
        });

        it('should be able to set credit', function () {
            course.__setField__('credit', 5678);
            assert.equal(course.credit, 5678);
        });

        it('should be able to set valid type', function () {
            course.__setField__('type', '公共基础课');
            assert.equal(course.type, '公共基础课');
        });

        it('should not be able to set valid type', function () {
            course.__setField__('type', '呵呵');
            assert.equal(course.type, undefined);
        });
    });

});