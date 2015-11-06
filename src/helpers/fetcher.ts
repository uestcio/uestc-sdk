///<reference path="../../typings/request/request"/>
///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>


import * as Request from 'request';
import { Observable } from 'rx';

import { Course, TakenCourse } from '../models/course';
import { Exam } from '../models/exam';
import { Person } from '../models/person';

import { IGetUserCoursesOption, ISearchCoursesOption, ISearchPeopleOption, IUserDetail } from '../utils/interfaces';

/**
 * @description The helper to deal with online request.
 */
export class Fetcher {
    confirmUser (id: string, password: string, jar: Request.CookieJar): Observable<boolean> {
        return null;
    }
    
    getUserCourses (option: IGetUserCoursesOption, forever: boolean, jar: Request.CookieJar) : Observable<TakenCourse[]> {
        return null;
    }
    
    getUserDetail (jar: Request.CookieJar): Observable<IUserDetail> {
        return null;
    }
    
    getUserExams (option: IGetUserCoursesOption, forever: boolean, jar: Request.CookieJar) : Observable<Exam[]> {
        return null;
    }
    
    searchForCourses (option: ISearchCoursesOption, jar: Request.CookieJar): Observable<Course[]> {
        return null;
    }
    
    searchForPeople (option: ISearchPeopleOption, jar: Request.CookieJar): Observable<Person[]> {
        return null;
    }
}

export const fetcher: Fetcher = new Fetcher();
