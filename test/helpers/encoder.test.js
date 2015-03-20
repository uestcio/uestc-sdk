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

        it('should be able to parse the durations when empty', function () {
            var durations0 = Encoder.parseDurations('', '');
            assert.equal(0, durations0.length);
        });

        it('should be able to parse the durations when only time', function () {
            var durations0 = Encoder.parseDurations('星期三 1-4 [6-13]', '');
            assert.equal(1, durations0.length);
            assert.equal('000001111111100000000000', durations0[0].weeks);
            assert.equal(3, durations0[0].day);
            assert.equal('111100000000', durations0[0].indexes);
            assert.equal('', durations0[0].place);
        });

        it('should be able to parse the durations when single and with parity', function () {
            var durations0 = Encoder.parseDurations('星期四 9-10 [1-17]', '单  科研2号楼437');
            assert.equal(1, durations0.length);
            assert.equal('101010101010101010000000', durations0[0].weeks);
            assert.equal(4, durations0[0].day);
            assert.equal('000000001100', durations0[0].indexes);
            assert.equal('科研2号楼437', durations0[0].place);

            var durations1 = Encoder.parseDurations('星期二 9-10 [2-18]', '双 科研2号楼425');
            assert.equal(1, durations1.length);
            assert.equal('010101010101010101000000', durations1[0].weeks);
            assert.equal(2, durations1[0].day);
            assert.equal('000000001100', durations1[0].indexes);
            assert.equal('科研2号楼425', durations1[0].place);
        });

        it('should be able to parse the durations when single and with <br>', function () {
            var durations0 = Encoder.parseDurations('星期三 9-11 [1-17]', '  A108 <br>');
            assert.equal(1, durations0.length);
            assert.equal('111111111111111110000000', durations0[0].weeks);
            assert.equal(3, durations0[0].day);
            assert.equal('000000001110', durations0[0].indexes);
            assert.equal('A108', durations0[0].place);
        });

        it('should be able to parse the durations when many', function () {
            var durations0 = Encoder.parseDurations('星期二 1-2 [3-18] 星期四 3-4 [3-18]', '  C237 <br>  C237 <br>');
            assert.equal(2, durations0.length);
            assert.equal('001111111111111111000000', durations0[0].weeks);
            assert.equal(2, durations0[0].day);
            assert.equal('110000000000', durations0[0].indexes);
            assert.equal('C237', durations0[0].place);

            assert.equal('001111111111111111000000', durations0[1].weeks);
            assert.equal(4, durations0[1].day);
            assert.equal('001100000000', durations0[1].indexes);
            assert.equal('C237', durations0[1].place);
        });

        it('should be able to parse the durations when many and with parity', function () {
            var durations0 = Encoder.parseDurations('星期一 5-6 [1-17] 星期三 3-4 [2-16] 星期五 5-6 [1-17]', '  主楼A2区506 <br>双  主楼A2区506 <br>  主楼A2区506 <br>');
            assert.equal(3, durations0.length);
            assert.equal('111111111111111110000000', durations0[0].weeks);
            assert.equal(1, durations0[0].day);
            assert.equal('000011000000', durations0[0].indexes);
            assert.equal('主楼A2区506', durations0[0].place);

            assert.equal('010101010101010100000000', durations0[1].weeks);
            assert.equal(3, durations0[1].day);
            assert.equal('001100000000', durations0[1].indexes);
            assert.equal('主楼A2区506', durations0[1].place);

            assert.equal('111111111111111110000000', durations0[2].weeks);
            assert.equal(5, durations0[2].day);
            assert.equal('000011000000', durations0[2].indexes);
            assert.equal('主楼A2区506', durations0[2].place);
        });
    });

    describe('#parseIndexes()', function () {

        it('should be able to parse indexes', function () {
            var res0 = Encoder.parseIndexes('1-2');
            var res1 = Encoder.parseIndexes('5-6');
            var res2 = Encoder.parseIndexes('9-11');
            assert.equal('110000000000', res0);
            assert.equal('000011000000', res1);
            assert.equal('000000001110', res2);
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

    describe('#parseWeeks()', function () {

        it('should be able to parse indexes when all week', function () {
            var res0 = Encoder.parseWeeks('1-17');
            var res1 = Encoder.parseWeeks('3-18');
            assert.equal('111111111111111110000000', res0);
            assert.equal('001111111111111111000000', res1);
        });

        it('should be able to parse indexes when all week with []', function () {
            var res0 = Encoder.parseWeeks('[1-17');
            var res1 = Encoder.parseWeeks('3-18]');
            var res2 = Encoder.parseWeeks('[1-13]');
            assert.equal('111111111111111110000000', res0);
            assert.equal('001111111111111111000000', res1);
            assert.equal('111111111111100000000000', res2);
        });

        it('should be able to parse indexes when half week', function () {
            var res0 = Encoder.parseWeeks('1-17', 1);
            var res1 = Encoder.parseWeeks('2-18', 2);
            assert.equal('101010101010101010000000', res0);
            assert.equal('010101010101010101000000', res1);
        });
    });

});