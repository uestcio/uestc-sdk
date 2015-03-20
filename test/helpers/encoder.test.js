var assert = require('assert');
var Encoder = require('../../src/helpers/encoder');
var User = require('../../src/user');


describe('Encoder ', function () {

    beforeEach(function () {
    });

    describe('#getSemester()', function () {
        it('should be able to get semesterId', function () {
            var id0 = Encoder.getSemester(2012, 1, {
                getGrade: function () {
                    return 2012;
                }
            });
            var id1 = Encoder.getSemester(1, 1, {
                getGrade: function () {
                    return 2012;
                }
            });
            assert.equal(13, id0);
            assert.equal(13, id1);
        });
    });

    describe('#getAllSemesters()', function () {
        var user;

        beforeEach(function () {
            user = new User('2012019050020', '811073');
        });

        it('should be able to get semesterId', function () {
            var semesters = Encoder.getAllSemesters(user);
            assert.equal(8, semesters.length);
            assert.equal(13, semesters[0]);
        });
    });

});