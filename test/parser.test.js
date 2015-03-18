var assert = require('assert');
var Parser = require('../src/parser');

describe('Parser ', function () {

    beforeEach(function () {
    });

    describe('#get$()', function () {
        it('should be able to get $', function (done) {
            Parser.get$('<html>0</html>').nodeify(function (err, $) {
                assert.equal('0', $('html').text());
                done();
            })
        });
    });

    describe('#getSemester()', function () {
        it('should be able to get semesterId', function () {
            var id0 = Parser.getSemester(2012, 1, {
                getGrade: function () {
                    return 2012;
                }
            });
            var id1 = Parser.getSemester(1, 1, {
                getGrade: function () {
                    return 2012;
                }
            });
            assert.equal(13, id0);
            assert.equal(13, id1);
        });
    });

});