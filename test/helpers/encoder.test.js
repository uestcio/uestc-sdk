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

        it('should be able to get semester array', function () {
            var semesters = Encoder.getAllSemesters(user);
            assert.equal(8, semesters.length);
            assert.equal(13, semesters[0]);
        });
    });

    describe('#parseDayofWeek()', function () {

        it('should be able to parse day of week', function () {
            assert.equal(1, Encoder.parseDayofWeek('星期一'));
            assert.equal(2, Encoder.parseDayofWeek('星期二'));
            assert.equal(3, Encoder.parseDayofWeek('星期三'));
            assert.equal(4, Encoder.parseDayofWeek('星期四'));
            assert.equal(5, Encoder.parseDayofWeek('星期五'));
            assert.equal(6, Encoder.parseDayofWeek('星期六'));
            assert.equal(7, Encoder.parseDayofWeek('星期日'));
        });
    });

    describe('#parseDurations()', function () {

        it('should be able to parse the durations when single', function () {
            var durations0 = Encoder.parseDurations('星期二 7-8 [6-16]', 'B305');
            assert.equal(1, durations0.length);
            assert.equal('000001111111111100000000', durations0[0].weeks);
            assert.equal(2, durations0[0].day);
            assert.equal('000000110000', durations0[0].indexes);
            assert.equal('B305', durations0[0].place);

            var durations1 = Encoder.parseDurations('星期四 7-8 [6-17]', '2楼教师休息室');
            assert.equal(1, durations1.length);
            assert.equal('000001111111111110000000', durations1[0].weeks);
            assert.equal(4, durations1[0].day);
            assert.equal('000000110000', durations1[0].indexes);
            assert.equal('2楼教师休息室', durations1[0].place);
        });
    });

    describe('#parseSemester()', function () {

        it('should be able to parse grade and semester', function () {
            var res = Encoder.parseSemester('2013-2014 2');
            assert.equal(2013, res[0]);
            assert.equal(2014, res[1]);
            assert.equal(2, res[2]);
        });
    });

});