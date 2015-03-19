var assert = require('assert');
var uestc = require('../src/uestc');
var Application = require('../src/application');

describe('Uestc ', function () {
    var app;

    beforeEach(function () {
    });

    describe('#create()', function () {
        it('should return a new Application', function () {
            var app0 = uestc.create();
            var app1 = uestc.create();
            assert.notEqual(app0, app1);
        });
    });

    describe('#single()', function () {
        it('should return the same Application', function () {
            var app0 = uestc.single();
            var app1 = uestc.single();
            assert.equal(app0, app1);
        });
    });
});