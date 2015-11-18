/// <reference path="../../typings/expect.js/expect.js.d.ts"/>
/// <reference path="../../typings/mocha/mocha"/>

import expect = require('expect.js');
import fs = require('fs');

import { Observable } from 'rx';

import { Parser, defaultParser } from '../../src/helpers/parser';
import { Course } from '../../src/models/course';
import { Person } from '../../src/models/person';

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

        describe('getAppPeople: ', () => {
            var mockJson = fs.readFileSync('./test/htmls/appSearchPeopleResult.json', 'utf-8');

            it('should be able to get people from json.', () => {
                parser.getAppPeople(mockJson).subscribe((people) => {
                    expect(people).to.be.an(Array);
                    expect(people.length).to.be(10);
                    expect(people[0]).to.be.a(Person);
                    expect(people[0].id).to.be('2012019010024');
                    expect(people[0].name).to.be('丁晓宇');
                    expect(people[0].metier).to.be('本专科生');
                    expect(people[0].deptName).to.be('通信与信息工程学院');
                });
            });
        });

        describe('getJq: ', () => {
            var template = `
            <html>
                <head></head>
                <body>
                    <p id="byid">This is a paragraph.</p>
                    <ul>
                        <li class="byclass">Line 1.</li>
                        <li class="byclass">Line 2.</li>
                        <li class="byclass">Line 3.</li>
                    </ul>
                </body>
            </html>`;

            it('should be able to get jQuery instance with jsdom.', (done) => {
                parser.getJq(template).subscribe(($: any) => {
                    var idRes: any = $('#byid');
                    expect(idRes.text()).to.be('This is a paragraph.');

                    var classRes: any = $('.byclass');
                    expect(classRes).to.have.property('length');
                    expect(classRes.length).to.be(3);
                    expect(classRes[0].innerHTML).to.be('Line 1.');

                    var elementRes: any = $('p');
                    expect(elementRes).to.have.property('length');
                    expect(elementRes.length).to.be(1);
                    expect(elementRes[0].innerHTML).to.be('This is a paragraph.');
                    done();
                });
            });
        });

        describe('getUserCourses: ', () => {

        });

        describe('getUserIds: ', () => {
            var mockHtml = fs.readFileSync('./test/htmls/userGetCoursesPreResult.html', 'utf-8');

            it('should be able to get ids.', (done) => {
                parser.getUserIds(mockHtml).subscribe((ids) => {
                    expect(ids).to.be('97837');
                    done();
                });
            });
        });

        xdescribe('getDurationsFromLine', () => {
            var time1 = `星期二 3-4 [3-18]<br>星期四 5-6 [3-18]<br>星期五 7-8 [3-18]<br>`;
            var place1 = `  品学楼C-104 <br>  品学楼C-104 <br>  品学楼C-104 <br>`;

            var time2 = `星期日 5-7 [5-16]`;
            var place2 = `   <br>`;

            var time3 = `星期一 5-6 [1-17]<br>星期三 3-4 [1-17单]<br>`;
            var place3 = `  品学楼C-225 <br>  品学楼C-225 <br>`;

            it('should be able to get durations from line of 1 duration.', () => {
                var res = parser.getDurationsFromLine(time2, place2);
                expect(res).to.be.an(Array);
                expect(res.length).to.be(1);

                expect(res[0].weeks).to.be('000011111111111100000000');
                expect(res[0].indexes).to.be('000011100000');
                expect(res[0].day).to.be(7);
                expect(res[0].place).to.be('');
            });

            it('should be able to get durations from line of 2 durations.', () => {
                var res = parser.getDurationsFromLine(time3, place3);
                expect(res).to.be.an(Array);
                expect(res.length).to.be(2);

                expect(res[0].weeks).to.be('111111111111111110000000');
                expect(res[0].indexes).to.be('000011000000');
                expect(res[0].day).to.be(1);
                expect(res[0].place).to.be('品学楼C-225');

                expect(res[1].weeks).to.be('111111111111111110000000');
                expect(res[1].indexes).to.be('000011000000');
                expect(res[1].day).to.be(1);
                expect(res[1].place).to.be('品学楼C-225');
            });
        });

        describe('getTable: ', () => {

        });

        describe('parserDayOfWeek: ', () => {
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

        describe('parseIndexes: ', () => {
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

        describe('parseWeeks: ', () => {
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
    });
});
