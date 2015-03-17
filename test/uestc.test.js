var assert = require('assert');
var uestc = require('../src/uestc');
var Application = require('../src/application');

describe('Uestc ', function () {
    var app;

    beforeEach(function () {
        app = uestc();
    });

    describe('#self()', function () {
        it('should return a instance of Application', function () {
            assert.equal(true, app instanceof Application);
        });
    });
});