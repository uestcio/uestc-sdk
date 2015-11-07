var assert = require('assert');
var expect = require('expect.js');
var fs = require('fs');
var rx = require('rx');

var parserModule = require('../../dist/helpers/parser');

var noCallFun = function (err) {
    throw err;
}

describe('Parser module: ', function () {
    var tmp;

    after(function () {

    });

    it('should have an `parser` property.', function () {
        var Parser = parserModule.Parser;
        expect(parserModule).to.have.property('parser');
        expect(parserModule.parser).to.be.a(Parser);
    });

    it('should have a `Parser` class.', function () {
        expect(parserModule).to.have.property('Parser');
        expect(parserModule.Parser).to.be.a('function');
    });

    describe('instance of Parser: ', function () {
        var parser;

        beforeEach(function () {
            parser = parserModule.parser;
        });

        describe('should have proper properties and methods: ', function () {
            it('should have exact properties.', function () {

            });

            it('should have exact methods.', function () {
                expect(parser).to.have.property('getAppCourses');
                expect(parser.getAppCourses).to.be.a('function');

                expect(parser).to.have.property('getJq');
                expect(parser.getJq).to.be.a('function');

                expect(parser).to.have.property('getDurationsFromLine');
                expect(parser.getDurationsFromLine).to.be.a('function');

                expect(parser).to.have.property('parseDayofWeek');
                expect(parser.parseDayofWeek).to.be.a('function');

                expect(parser).to.have.property('parseIndexes');
                expect(parser.parseIndexes).to.be.a('function');

                expect(parser).to.have.property('parseWeeks');
                expect(parser.parseWeeks).to.be.a('function');
            });
        });
        
        describe('should be able to parse durations: ', function () {
            it('should get empty array with no duration.', function () {
                var res = parser.getDurationsFromLine('');
                expect(res).to.be.an('array');
            });
            
            it('should get an array of a duration with one duration.', function () {
                var res = parser.getDurationsFromLine('星期四 9-11 [5-17]\n\r');
                expect(res).to.be.an('array');
                expect(res.length).to.be(1);
            });
            
            it('should get an array of multi durations with multi durations.', function () {
                var res = parser.getDurationsFromLine('星期一 7-8 [3-18]\n\r星期四 5-6 [3-18]\n\r星期五 3-4 [3-17单]\n\r');
                expect(res).to.be.an('array');
                expect(res.length).to.be(3);
            });
        });
        
        describe('should be able to parse indexes: ', function () {
            it('should get result with long string.', function () {
                var res = parser.parseDayofWeek('星期一');
                expect(res).to.be(1);
            });
            
            it('should get result with short string.', function () {
                var res = parser.parseDayofWeek('周一');
                expect(res).to.be(1);
            });
            
            it('should get result with ultra short string.', function () {
                var res = parser.parseDayofWeek('一');
                expect(res).to.be(1);
            });
        });
          
        describe('should be able to parse day of week: ', function () {
            it('should get result with 9-11.', function () {
                var res = parser.parseIndexes('9-11');
                expect(res).to.be('000000001110');
            });
            
            it('should get result with 5-8.', function () {
                var res = parser.parseIndexes('5-8');
                expect(res).to.be('000011110000');
            });
            
            it('should get result with 3-4.', function () {
                var res = parser.parseIndexes('3-4');
                expect(res).to.be('001100000000');
            });
        });
        
        describe('should be able to parse weeks: ', function () {
            it('should get result with [1-17].', function () {
                var res = parser.parseWeeks('[1-17]');
                expect(res).to.be('111111111111111110000000');
            });
            
            it('should get result with [3-18].', function () {
                var res = parser.parseWeeks('[3-18]');
                expect(res).to.be('001111111111111111000000');
            });
            
            it('should get result with [2-18].', function () {
                var res = parser.parseWeeks('[2-18]');
                expect(res).to.be('011111111111111111000000');
            });
        });

        describe('should be able to parse courses: ', function () {
            var mockHtml = fs.readFileSync('./test/htmls/appSearchCoursesResult.html', 'utf-8');
            
            it('should be able to get the courses.', function (done) { 
                parser.getAppCourses(mockHtml).subscribe(function (courses) {
                    expect(courses.length).to.be(20);
                    done();
                }, noCallFun);
            });

            it('should be able to get the course without duration.', function (done) {
                parser.getAppCourses(mockHtml).subscribe(function (courses) {
                    expect(courses[0]).not.to.be(null);
                    expect(courses[0].id).to.be('0490360.01');
                    expect(courses[0].title).to.be('高等微积分I');
                    expect(courses[0].genre).to.be('学科基础课(必修)');
                    expect(courses[0].instructors.length).to.be(0);
                    expect(courses[0].department).to.be('物理电子学院');
                    done();
                }, noCallFun);
            });
            
            it('should be able to get the course with one duration.', function (done) {
                parser.getAppCourses(mockHtml).subscribe(function (courses) {
                    expect(courses[2]).not.to.be(null);
                    expect(courses[2].id).to.be('1003350.01');
                    expect(courses[2].title).to.be('微积分Ⅱ');
                    expect(courses[2].genre).to.be('学科基础课(必修)');
                    expect(courses[2].instructors.length).to.be(0);
                    expect(courses[2].department).to.be('数学科学学院');
                    expect(courses[2].durations).not.to.be(null);
                    expect(courses[2].durations.length).to.be(1);
                    expect(courses[2].durations[0]).not.to.be(null);
                    expect(courses[2].durations[0].day).to.be(4);
                    expect(courses[2].durations[0].indexes).to.be('000000001110');
                    expect(courses[2].durations[0].place).to.be('沙河第二教学樓208');
                    done();
                }, noCallFun);
            });
            
            it('should be able to get the course with multi duration.', function (done) {
                parser.getAppCourses(mockHtml).subscribe(function (courses) {
                    expect(courses[4]).not.to.be(null);
                    expect(courses[4].id).to.be('1006040.01');
                    expect(courses[4].title).to.be('微积分(文)Ⅰ');
                    expect(courses[4].genre).to.be('学科基础课(必修)');
                    expect(courses[4].instructors.length).to.be(1);
                    expect(courses[4].instructors[0]).to.be('刘艳');
                    expect(courses[4].department).to.be('数学科学学院');
                    expect(courses[4].durations).not.to.be(null);
                    expect(courses[4].durations.length).to.be(3);
                    expect(courses[4].durations[0]).not.to.be(null);
                    expect(courses[4].durations[0].day).to.be(1);
                    expect(courses[4].durations[0].indexes).to.be('000000110000');
                    expect(courses[4].durations[0].place).to.be('立人楼B203');
                    done();
                }, noCallFun);
            });
        });
    });
});
