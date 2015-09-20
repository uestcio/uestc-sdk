///<reference path="../../typings/request/request"/>
///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>


import * as Request from 'request';
import { Observable } from 'rx';

import { Course, TakenCourse } from '../models/course';
import { Exam } from '../models/exam';
import { Person } from '../models/person';

import { IGetUserCoursesOption, ISearchCoursesOption, ISearchPeopleOption, IUserDetail, IUserLogin } from 'utils/interfaces';

/**
 * @description The helper to deal with online request.
 */
export class Fetcher {
    /**
     * @description The 
     */
    confirmUser (user: IUserLogin): Observable<boolean> {
        return null;
    }
    
    getUserCourses (option: IGetUserCoursesOption, forever: boolean, user: IUserLogin) : Observable<TakenCourse[]> {
        return null;
    }
    
    getUserDetail (user: IUserLogin): Observable<IUserDetail> {
        return null;
    }
    
    getUserExams (option: IGetUserCoursesOption, forever: boolean, user: IUserLogin) : Observable<Exam[]> {
        return null;
    }
    
    searchForCourses (option: ISearchCoursesOption, user: IUserLogin): Observable<Course[]> {
        return null;
    }
    
    searchForPeople (option: ISearchPeopleOption, user: IUserLogin): Observable<Person[]> {
        return null;
    }
}

export const fetcher: Fetcher = new Fetcher();
