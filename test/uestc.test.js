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

    describe('#getFixture()', function () {
        it('should get the fixture', function () {
            var fixture = uestc.getFixture();
            assert.equal('通信与信息工程学院', fixture.departments.scie);
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