///<reference path="../../typings/request/request"/>
///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>
///<reference path="../../typings/jsdom/jsdom"/>
///<reference path="../../typings/jquery/jquery"/>
///<reference path="../../typings/lodash/lodash"/>


import { readFileSync } from 'fs';
import * as $ from 'jquery';
import { jsdom } from 'jsdom';
import * as _ from 'lodash';
import { Observable } from 'rx';

import { Course, TakenCourse, courseFactory } from '../models/course';
import { Duration, durationFactory } from '../models/duration';
import { Exam } from '../models/exam';
import { Person, personFactory } from '../models/person';

import { IGetUserCoursesOption, ISearchCoursesOption, ISearchPeopleOption, IUserDetail } from '../utils/interfaces';


interface ITimeTable {
    [id: string]: {
        day: number,
        index: number,
        span: number,
        place: string,
        weeks: string
    }[]
}

interface IRawPerson {
     metier: string, 
     authorized: any, 
     deptName: string, 
     workplace: string, 
     description: string, 
     workphone: string, 
     idName: string, 
     name: string, 
     id: string 
}


/**
 * @description The helper of parsing html or json files to data.
 */
export class Parser {
    constructor() {

    }

    /**
     * @description Get the courses of html result from app#searchForCourses.
     * @param html The html string contains the courses.
     * @returns The Observable instance of the parse result.
     */
    getAppCourses(html: string): Observable<Course[]> {
        return this.getJq(html).flatMap(($: any) => {
            var lines = $('table.gridtable > tbody > tr');
            return Observable.return<Course[]>(_.map(lines, (line: any) => {
                var id = $(line.children[1]).text();
                var course = courseFactory.create(id);
                course.title = $(line.children[2]).text();
                course.genre = $(line.children[3]).text();
                course.department = $(line.children[4]).text();
                var tmp = _.trim($(line.children[5]).text());
                course.instructors = tmp.length > 0 ? tmp.split(' ') : [];
                course.durations = this.getDurationsFromLine(_.trim($(line.children[8]).text()), $(line.children[9]).html());
                course.campus = $(line.children[11]).text();
                return course;
            }));
        });
    }

    getUserCourses(html: string): Observable<Course[]> {
        return this.getJq(html).flatMap(($: any) => {
            var table = $('table.gridtable')[1];
            var lines = $(table).find('tbody > tr');
            var raws = html.match(/var table0[\S\s]*?table0\.marshalTable/)[0];
            raws = raws.replace('table0.marshalTable', '');
            return Observable.return<Course[]>(_.map(lines, function(line: any) {
                var id = _.trim($(line.children[4]).text());
                var course = new Course(id);
                course.code = $(line.children[1]).text();
                course.title = $(line.children[2]).text();
                course.credit = +$(line.children[3]).text();
                var tmp = $(line.children[5]).text();
                course.instructors = tmp.length > 0 ? tmp.split(' ') : [];
                return course;
            }));
        });
    }

    getUserIds(html: string): Observable<string> {
        var tmp = html.match(/bg\.form\.addInput\(form,"ids","\d+"\);/)[0];
        var ids = tmp.match(/\d+/)[0];
        return Observable.return(ids);
    }

    /**
     * @warining This interface is not available in resent tests.
     * @description Get the people of json from app#searchForPeople.
     * @param json The json string contains the people.
     * @returns The Observable instance of the parse result.
     */
    getAppPeople(json: string) {
        var rawPeople: IRawPerson[] = null;
        try {
            rawPeople = JSON.parse(json).principals;
        } catch (error) {
            throw new Error('500: The input is not valid json.');
        }
        return Observable.return(_.map(rawPeople, (rawPerson: IRawPerson) => {
            var person = personFactory.create(rawPerson.id);
            person.name = rawPerson.name;
            person.metier = rawPerson.metier;
            person.authorized = rawPerson.authorized;
            person.deptName = rawPerson.name;
            person.workplace = rawPerson.workplace;
            person.description = rawPerson.description;
            person.workphone = rawPerson.workphone;
            return person;
        }));
    }
    
    /**
     * @description Get the jQuery instance of the given html page.
     * @param html The html string to generate a window with $.
     * @returns The Observable instance of the jQuery instance.
     */
    private getJq(html: string): Observable<JQuery> {
        return Observable.create<JQuery>((observer) => {
            var window = jsdom(html, {}).defaultView;
            observer.onNext($(window));
            observer.onCompleted();
        });
    }
        
    /**
     * @description Get duration instances from the inline string.
     * @param times The times representation string. eg. `星期一 7-8 [3-18]\n\r星期四 5-6 [3-18]\n\r星期五 3-4 [3-17单]`.
     * @param places The places representation string. eg. `沙河第二教学樓208`.
     * @returns The array represent durations. 
     */
    private getDurationsFromLine(times: string, places: string): Duration[] {
        var durationStrs = _.words(times, /[^\n\r\]]+/g);
        var placeStrs = _.words(places, /[^<br>]+/g);

        return durationStrs.map((dStr, n) => {
            var place = _.trim(placeStrs[n]) || '';
            var tmp = _.words(dStr, /[\S]+/g);
            var parity = _.startsWith(place, '单') ? 1 : (_.startsWith(place, '双') ? 2 : 4);
            if (parity !== 4) {
                place = _.words(place, /\S+/g)[1];
            }

            var duration = durationFactory.create();
            duration.day = this.parseDayofWeek(tmp[0]);
            duration.indexes = this.parseIndexes(tmp[1]);
            duration.weeks = this.parseWeeks(tmp[2], parity);
            duration.place = place;

            return duration;
        });
    }

    private getTable(table: any): ITimeTable {
        var timeTable: ITimeTable = {};
        for (var i in table.activities) {
            for (var j in table.activities[i]) {
                var course = table.activities[i][j];
                var id = _.words(course.uk2, /[\w\d\.]+/g)[1];
                var day = Math.floor(i / 12) + 1;
                var index = Math.floor(i % 12);
                var place = course.place;
                var weeks = course.weeks.substr(1, 24);
                if (!timeTable[id]) {
                    timeTable[id] = [];
                }
                var before = _.find(timeTable[id], function(time) {
                    return (time.day == day) && (time.place == place) &&
                        (time.weeks == weeks) && (time.index + time.span == index);
                });
                if (before) {
                    before.span += 1;
                }
                else {
                    timeTable[id].push({ day: day, index: index, span: 1, place: place, weeks: weeks });
                }
            }
        }
        return timeTable;
    };

    /**
     * @description Get day of week from the inline string.
     * @param dayStr The day representation string. eg. `星期一`.
     * @returns The number of day start from 1. 
     */
    private parseDayofWeek(dayStr: string): number {
        var res: number = -1;
        switch (dayStr) {
            case '星期一':
            case '周一':
            case '一':
                res = 1;
                break;
            case '星期二':
            case '周二':
            case '二':
                res = 2;
                break;
            case '星期三':
            case '周三':
            case '三':
                res = 3;
                break;
            case '星期四':
            case '周四':
            case '四':
                res = 4;
                break;
            case '星期五':
            case '周五':
            case '五':
                res = 5;
                break;
            case '星期六':
            case '周六':
            case '六':
                res = 6;
                break;
            case '星期日':
            case '星期天':
            case '周日':
            case '日':
                res = 7;
                break;
            default:
                res = 0;
                break;
        }
        return res;
    }

    /**
     * @description Get the indexes of some day from inline string.
     * @param indexesStr The indexes representation string. eg. `9-11`.
     * @returns The string representation of the indexes. eg. `00000000110`.
     */
    private parseIndexes(indexesStr: string): string {
        var raws: string[] = _.words(indexesStr, /\d+/g);
        var res: string = '';
        _.times(12, function(n) {
            res += (n + 1 >= +raws[0] && n + 1 <= +raws[1] ? '1' : '0');
        });
        return res;
    }

    /**
     * @description Get the weeks from the inline string.
     * @param weeksStr The weeks representation string. eg. `[1-17]`.
     * @param parity The parity representation number. 1 for odd weeks, 2 for even weeks, 4 for all weeks.
     * @returns The string representation of weeks. eg. `111111111111111110000000`.
     */
    private parseWeeks(weeksStr: string, parity: number): string {
        var raws: string[] = _.words(weeksStr, /\d+/g);
        var res: string = '';
        _.times(24, function(n) {
            var tmp: string;
            if ((parity === 1 && n % 2 === 1) || (parity === 2 && n % 2 === 0)) {
                tmp = '0';
            }
            else {
                tmp = (n + 1 >= +raws[0] && n + 1 <= +raws[1] ? '1' : '0');
            }
            res += tmp;
        });
        return res;
    }

}

export const parser = new Parser();
