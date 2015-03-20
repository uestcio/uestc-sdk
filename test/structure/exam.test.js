var assert = require('assert');
var Exam = require('../../src/structure/exam');

describe('Exam ', function () {
    var exam;

    beforeEach(function () {
        exam = new Exam('1234');
    });

    describe('#.ctor()', function () {
        it('should be able to instantiate', function () {
            assert.equal(true, !!exam);
        });
    });

    describe('#__init__()', function () {

        beforeEach(function () {
            exam.__init__();
        });

        it('should be able to instantiate', function () {
            assert.equal('', exam.place);
            assert.equal('', exam.seat);
            assert.equal('', exam.status);
        });
    });

    describe('#__setField__()', function () {
        beforeEach(function () {
            exam = new Exam('1234');
            exam.place = 'AAA';
        });

        it('should be able to set valid field', function () {
            exam.__setField__('place', 'BBB');
            assert.equal(exam.place, 'BBB');
        });

        it('should not set the field null', function () {
            exam.__setField__('place', null);
            assert.equal(exam.place, 'AAA');
        });

        it('should not set the field undefined', function () {
            exam.__setField__('place', undefined);
            assert.equal(exam.place, 'AAA');
        });

        it('should not set the field NaN', function () {
            exam.__setField__('place', NaN);
            assert.equal(exam.place, 'AAA');
        });

        it('should not set the field empty', function () {
            exam.__setField__('place', '');
            assert.equal(exam.place, 'AAA');
        });

        it('should be able to set seat', function () {
            exam.__setField__('seat', 80);
            assert.equal(exam.seat, 80);
        });

        it('should be able to set seat', function () {
            exam.__setField__('seat', '80');
            assert.equal(exam.seat, 80);
        });

        it('should be able to set status', function () {
            exam.__setField__('status', 'AAA');
            assert.equal(exam.status, 'AAA');
        });

        it('should be able to set from', function () {
            exam.__setField__('from', 3);
            assert.equal(exam.from, 3);
        });

        it('should be able to set to', function () {
            exam.__setField__('to', 3);
            assert.equal(exam.to, 3);
        });

        it('should be able to set description', function () {
            exam.__setField__('description', '123');
            assert.equal(exam.description, '123');
        });
    });
});