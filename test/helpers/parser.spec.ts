/// <reference path="../../typings/expect.js/expect.js.d.ts"/>
/// <reference path="../../typings/mocha/mocha"/>

import expect = require('expect.js');
import fs = require('fs');

import { Observable } from 'rx';

import { Parser, defaultParser } from '../../src/helpers/parser';
import { Course } from '../../src/models/course';

import { noCallNextFn, noCallErrorFn } from '../mocks/utils/function_util';

describe('Parser module: ', () => {

    it('should have an `defaultParser` property.', () => {
        expect(defaultParser).to.be.a(Parser);
    });

    it('should have a `Parser` class.', () => {
        expect(Parser).to.be.a(Function);
    });

    describe('instance of Parser: ', () => {
        var parser: Parser;
        
        before(() => {
            parser = new Parser();
        });

        describe('should have proper properties and methods: ', () => {
            
            it('should have exact methods.', () => {
                expect(parser).to.have.property('getAppCourses');
                expect(parser.getAppCourses).to.be.a(Function);
                
                expect(parser).to.have.property('getAppPeople');
                expect(parser.getAppPeople).to.be.a(Function);

                expect(parser).to.have.property('getUserCourses');
                expect(parser.getUserCourses).to.be.a(Function);

                expect(parser).to.have.property('getUserIds');
                expect(parser.getUserIds).to.be.a(Function);

                expect(parser).to.have.property('getJq');
                expect(parser.getJq).to.be.a(Function);

                expect(parser).to.have.property('getDurationsFromLine');
                expect(parser.getDurationsFromLine).to.be.a(Function);

                expect(parser).to.have.property('getTable');
                expect(parser.getTable).to.be.a(Function);

                expect(parser).to.have.property('parseDayofWeek');
                expect(parser.parseDayofWeek).to.be.a(Function);

                expect(parser).to.have.property('parseIndexes');
                expect(parser.parseIndexes).to.be.a(Function);

                expect(parser).to.have.property('parseWeeks');
                expect(parser.parseWeeks).to.be.a(Function);
            });
        });
        
        describe('getAppCourses', () => {
            var mockHtml = fs.readFileSync('./test/htmls/appSearchCoursesResult.html', 'utf-8');
            
            it('should be able to get the courses.', (done) => { 
                parser.getAppCourses(mockHtml).subscribe((courses: Course[]) => {
                    expect(courses.length).to.be(20);
                    done();
                }, noCallErrorFn);
            });

            it('should be able to get the course without duration.', (done) => {
                parser.getAppCourses(mockHtml).subscribe((courses: Course[]) => {
                    expect(courses[0]).not.to.be(null);
                    expect(courses[0].id).to.be('0490360.01');
                    expect(courses[0].title).to.be('高等微积分I');
                    expect(courses[0].genre).to.be('学科基础课(必修)');
                    expect(courses[0].instructors.length).to.be(0);
                    expect(courses[0].department).to.be('物理电子学院');
                    done();
                }, noCallErrorFn);
            });
            
            it('should be able to get the course with one duration.', (done) => {
                parser.getAppCourses(mockHtml).subscribe((courses: Course[]) => {
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
                }, noCallErrorFn);
            });
            
            it('should be able to get the course with multi duration.', (done) => {
                parser.getAppCourses(mockHtml).subscribe((courses: Course[]) => {
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
                }, noCallErrorFn);
            });
        });
        
        xdescribe('should be able to parse durations: ', () => {
            it('should get empty array with no duration.', () => {
                var res = parser.getDurationsFromLine('', '');
                expect(res).to.be.an('array');
            });
            
            it('should get an array of a duration with one duration.', () => {
                var res = parser.getDurationsFromLine('星期四 9-11 [5-17]\n\r', '');
                expect(res).to.be.an('array');
                expect(res.length).to.be(1);
            });
            
            it('should get an array of multi durations with multi durations.', () => {
                var res = parser.getDurationsFromLine('星期一 7-8 [3-18]\n\r星期四 5-6 [3-18]\n\r星期五 3-4 [3-17单]\n\r', '');
                expect(res).to.be.an('array');
                expect(res.length).to.be(3);
            });
        });
        
        xdescribe('should be able to parse indexes: ', () => {
            it('should get result with long string.', () => {
                var res = parser.parseDayofWeek('星期一');
                expect(res).to.be(1);
            });
            
            it('should get result with short string.', () => {
                var res = parser.parseDayofWeek('周一');
                expect(res).to.be(1);
            });
            
            it('should get result with ultra short string.', () => {
                var res = parser.parseDayofWeek('一');
                expect(res).to.be(1);
            });
        });
          
        xdescribe('should be able to parse day of week: ', () => {
            it('should get result with 9-11.', () => {
                var res = parser.parseIndexes('9-11');
                expect(res).to.be('000000001110');
            });
            
            it('should get result with 5-8.', () => {
                var res = parser.parseIndexes('5-8');
                expect(res).to.be('000011110000');
            });
            
            it('should get result with 3-4.', () => {
                var res = parser.parseIndexes('3-4');
                expect(res).to.be('001100000000');
            });
        });
        
        xdescribe('should be able to parse weeks: ', () => {
            it('should get result with [1-17].', () => {
                var res = parser.parseWeeks('[1-17]', 0);
                expect(res).to.be('111111111111111110000000');
            });
            
            it('should get result with [3-18].', () => {
                var res = parser.parseWeeks('[3-18]', 0);
                expect(res).to.be('001111111111111111000000');
            });
            
            it('should get result with [2-18].', () => {
                var res = parser.parseWeeks('[2-18]', 0);
                expect(res).to.be('011111111111111111000000');
            });
        });
    });
});
