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
import { Person } from '../models/person';

import { IGetUserCoursesOption, ISearchCoursesOption, ISearchPeopleOption, IUserDetail } from 'utils/interfaces';


export class Parser {
    constructor() {

    }

    getAppCourses (html: string): Observable<Course[]> {
        return this.getWindow(html).flatMap(($: any) => {
            var lines = $('table.gridtable > tbody > tr');
            return Observable.return<Course[]>(_.map(lines, (line: any) => {
                var id = $(line.children[1]).text();
                var course = courseFactory.create(id);
                course.title = $(line.children[2]).text();
                course.genre = $(line.children[3]).text();
                course.department = $(line.children[4]).text();
                var tmp = _.trim($(line.children[5]).text());
                course.instructors = tmp.length > 0? tmp.split(' '): [];
                course.durations = this.getDurationsFromLine(_.trim($(line.children[8]).text()), $(line.children[9]).html());
                course.campus = $(line.children[11]).text();
                return course;
            }));
        });
    }

    private getWindow(html: string): Observable<JQuery> {
        return Observable.create<JQuery>((observer) => {
            var window = jsdom(html, {}).defaultView;
            observer.onNext($(window));
            observer.onCompleted();
        });
    }

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

    private parseIndexes(indexesStr: string): string {
        var raws: string[] = _.words(indexesStr, /\d+/g);
        var res: string = '';
        _.times(12, function(n) {
            res += (n + 1 >= +raws[0] && n + 1 <= +raws[1] ? '1' : '0');
        });
        return res;
    }

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
