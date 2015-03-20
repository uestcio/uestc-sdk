var assert = require('assert');
var Score = require('../../src/structure/score');

describe('Score ', function () {
    var score;

    beforeEach(function () {
        score = new Score('1234');
    });

    describe('#.ctor()', function () {
        it('should be able to instantiate', function () {
            assert.equal(true, !!score);
        });
    });

    describe('#__init__()', function () {

        beforeEach(function () {
            score.__init__();
        });

        it('should be able to instantiate', function () {
            assert.equal(-1, score.overall);
            assert.equal(-1, score.resit);
            assert.equal(-1, score.final);
            assert.equal(-1, score.gpa);
        });
    });

    describe('#__setField__()', function () {
        beforeEach(function () {
            score = new Score('1234');
            score.overall = -1;
        });

        it('should be able to set valid field', function () {
            score.__setField__('overall', 2);
            assert.equal(score.overall, 2);
        });

        it('should not set the field null', function () {
            score.__setField__('overall', null);
            assert.equal(score.overall, -1);
        });

        it('should not set the field undefined', function () {
            score.__setField__('overall', undefined);
            assert.equal(score.overall, -1);
        });

        it('should not set the field NaN', function () {
            score.__setField__('overall', NaN);
            assert.equal(score.overall, -1);
        });

        it('should not set the field empty', function () {
            score.__setField__('overall', '');
            assert.equal(score.overall, -1);
        });

        it('should not set the field minus', function () {
            score.__setField__('overall', -2);
            assert.equal(score.overall, -1);
        });

        it('should be able to set resit', function () {
            score.__setField__('resit', 80);
            assert.equal(score.resit, 80);
        });

        it('should be able to set resit', function () {
            score.__setField__('resit', '80');
            assert.equal(score.resit, 80);
        });

        it('should be able to set final', function () {
            score.__setField__('final', 90);
            assert.equal(score.final, 90);
        });

        it('should be able to set gpa', function () {
            score.__setField__('gpa', 3);
            assert.equal(score.gpa, 3);
        });

    });

});