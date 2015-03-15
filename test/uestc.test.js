var assert = require('assert');
var uestc = require('../src/uestc');
var application = require('../src/application');

describe('Uestc ', function () {
    var app, carrier;

    beforeEach(function () {
        app = uestc();
    });

    describe('#self()', function () {
        it('should return a instance of Application', function () {
            assert.equal(true, app instanceof application);
        });
    });
});